
import { pool } from "../db"
import { RowDataPacket, ResultSetHeader } from "mysql2"
import { DB_TABLE_STOCK } from "../config"
import { Request, Response } from "express"
import { TokenPayload } from '../models/usuarios.model'
import { generarEtiqueta, eliminarEtiqueta } from '../middlewares/generarEtiqueta'
 
// Los formatos (codigo, ubicacion, section, cantidad...) los valida express-validator.
// Aquí solo se hace lo que depende de la base de datos.
 
const stockColumns = [
    "id",              // 0
    "ubicacion",       // 1
    "codigo",          // 2
    "cantidad",        // 3
    "formato",         // 4
    "etiqueta",        // 5
    "estado_etiqueta", // 6
    "autor_id",        // 7
    "created_at",      // 8
    "section"          // 9
]
 
const selectColumns = stockColumns.join(", ")
 
// MySQL devuelve 0/1: lo convertimos a boolean antes de responder
const formatear = (fila: RowDataPacket) => ({
    ...fila,
    estado_etiqueta: Boolean(fila.estado_etiqueta),
})
 
// undefined / null / '' -> null ("esta ubicación no tiene secciones")
const normalizarSection = (v: unknown): string | null => {
    if (v === undefined || v === null) return null
    const s = String(v).trim().toUpperCase()
    return s === '' ? null : s
}
 
// ¿La ubicación ya se usa con el modo contrario (con sección vs sin sección)?
async function mezclaSecciones(
    ubicacion: string,
    section: string | null,
    excluirId = 0
): Promise<boolean> {
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT 1 FROM ${DB_TABLE_STOCK}
         WHERE ${stockColumns[1]} = ?
           AND ${stockColumns[0]} <> ?
           AND ${stockColumns[9]} IS ${section === null ? 'NOT NULL' : 'NULL'}
         LIMIT 1`,
        [ubicacion, excluirId]
    )
    return rows.length > 0
}
 
const MSG_MEZCLA = (section: string | null) =>
    section === null
        ? 'Esa ubicación usa secciones: indica una'
        : 'Esa ubicación no tiene secciones'
 
export const obtenerInventario = async (_req: Request, res: Response) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT ${selectColumns} FROM ${DB_TABLE_STOCK}`
        )
        return res.status(200).json(rows.map(formatear))
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error al obtener el inventario' })
    }
}
 
export const obtenerArticulo = async (req: Request, res: Response) => {
    const { id } = req.params
 
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT ${selectColumns} FROM ${DB_TABLE_STOCK} WHERE ${stockColumns[0]} = ?`,
            [id]
        )
 
        const fila = rows[0]
        if (!fila) {
            return res.status(404).json({ error: 'Artículo no encontrado' })
        }
 
        return res.status(200).json(formatear(fila))
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error al obtener el artículo' })
    }
}
 
export const agregarArticulo = async (req: Request, res: Response) => {
    const {
        ubicacion,
        codigo,
        cantidad = 0,
        formato = null,
        estado_etiqueta = false,
    } = req.body
 
    const section = normalizarSection(req.body.section)
    const user = (req as any).user as TokenPayload | undefined
 
    let etiqueta: string | null = null
 
    try {
        // Si la terna código + ubicación + sección ya existe, solo se suma stock.
        // "<=>" compara igual que "=" pero entiende NULL.
        const [existe] = await pool.query<RowDataPacket[]>(
            `SELECT ${stockColumns[0]} FROM ${DB_TABLE_STOCK}
             WHERE ${stockColumns[2]} = ?
               AND ${stockColumns[1]} = ?
               AND ${stockColumns[9]} <=> ?`,
            [codigo, ubicacion, section]
        )
 
        const existente = existe[0]
        if (existente) {
            await pool.query(
                `UPDATE ${DB_TABLE_STOCK}
                 SET ${stockColumns[3]} = ${stockColumns[3]} + ?
                 WHERE ${stockColumns[0]} = ?`,
                [cantidad, existente.id]
            )
            const [rows] = await pool.query<RowDataPacket[]>(
                `SELECT ${selectColumns} FROM ${DB_TABLE_STOCK} WHERE ${stockColumns[0]} = ?`,
                [existente.id]
            )
            return res.status(200).json(formatear(rows[0]!))
        }
 
        // Fila nueva: la ubicación no puede mezclar artículos con y sin sección
        if (await mezclaSecciones(ubicacion, section)) {
            return res.status(409).json({ error: MSG_MEZCLA(section) })
        }
 
        // Sin "const": asigna a la variable de fuera para poder borrarla en el catch
        etiqueta = await generarEtiqueta(codigo)
 
        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO ${DB_TABLE_STOCK} (
                ${stockColumns[1]},
                ${stockColumns[2]},
                ${stockColumns[3]},
                ${stockColumns[4]},
                ${stockColumns[5]},
                ${stockColumns[6]},
                ${stockColumns[7]},
                ${stockColumns[9]}
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                ubicacion,
                codigo,
                cantidad,
                formato,
                etiqueta,
                estado_etiqueta,
                user?.id ?? null,
                section,
            ]
        )
 
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT ${selectColumns} FROM ${DB_TABLE_STOCK} WHERE ${stockColumns[0]} = ?`,
            [result.insertId]
        )
        return res.status(201).json(formatear(rows[0]!))
    } catch (error: any) {
        await eliminarEtiqueta(etiqueta) // si falló el INSERT, no dejes el PNG huérfano
        if (error?.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Ya existe ese código en esa ubicación y sección' })
        }
        console.error(error)
        return res.status(500).json({ error: 'Error al agregar el artículo' })
    }
}
 
export const actualizarArticulo = async (req: Request, res: Response) => {
    const { id } = req.params
    const data = req.body
 
    // undefined = no se envió (no tocar). null o '' = quitar la sección.
    const cambiaSection = data.section !== undefined
    const nuevaSection = cambiaSection ? normalizarSection(data.section) : null
 
    let nuevaEtiqueta: string | null = null
 
    try {
        const [actual] = await pool.query<RowDataPacket[]>(
            `SELECT ${stockColumns[2]}, ${stockColumns[5]}, ${stockColumns[1]}, ${stockColumns[9]}
             FROM ${DB_TABLE_STOCK}
             WHERE ${stockColumns[0]} = ?`,
            [id]
        )
 
        const fila = actual[0]
        if (!fila) {
            return res.status(404).json({ error: 'Artículo no encontrado' })
        }
 
        // Si cambia ubicación o sección, la ubicación final no puede mezclar modos
        const ubicacionFinal: string = data.ubicacion ?? fila.ubicacion
        const sectionFinal: string | null = cambiaSection ? nuevaSection : fila.section
        const cambiaUbicacion = ubicacionFinal !== fila.ubicacion
        const cambiaSeccionReal = sectionFinal !== fila.section
 
        if (
            (cambiaUbicacion || cambiaSeccionReal) &&
            await mezclaSecciones(ubicacionFinal, sectionFinal, Number(id))
        ) {
            return res.status(409).json({ error: MSG_MEZCLA(sectionFinal) })
        }
 
        // Si cambia el código hay que generar una etiqueta nueva
        const cambiaCodigo = !!data.codigo && data.codigo !== fila.codigo
        if (cambiaCodigo) {
            nuevaEtiqueta = await generarEtiqueta(data.codigo)
        }
 
        // Explícito (cliente) > reset por cambio de código > sin cambios (null)
        const estadoEtiqueta: boolean | null =
            data.estado_etiqueta !== undefined
                ? data.estado_etiqueta
                : cambiaCodigo ? false : null
 
        await pool.query(
            `UPDATE ${DB_TABLE_STOCK}
            SET ${stockColumns[1]} = COALESCE(?, ${stockColumns[1]}),
                ${stockColumns[2]} = COALESCE(?, ${stockColumns[2]}),
                ${stockColumns[3]} = COALESCE(?, ${stockColumns[3]}),
                ${stockColumns[4]} = COALESCE(?, ${stockColumns[4]}),
                ${stockColumns[5]} = COALESCE(?, ${stockColumns[5]}),
                ${stockColumns[6]} = COALESCE(?, ${stockColumns[6]}),
                ${stockColumns[9]} = IF(?, ?, ${stockColumns[9]})
            WHERE ${stockColumns[0]} = ?`,
            [
                data.ubicacion ?? null,
                data.codigo ?? null,
                data.cantidad ?? null,
                data.formato ?? null,
                nuevaEtiqueta,
                estadoEtiqueta,
                cambiaSection,
                nuevaSection,
                id,
            ]
        )
 
        // Solo cuando el UPDATE ha ido bien se borra la etiqueta antigua
        if (cambiaCodigo) await eliminarEtiqueta(fila.etiqueta)
 
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT ${selectColumns} FROM ${DB_TABLE_STOCK} WHERE ${stockColumns[0]} = ?`,
            [id]
        )
        return res.status(200).json(formatear(rows[0]!))
    } catch (error: any) {
        await eliminarEtiqueta(nuevaEtiqueta) // el UPDATE falló: borra la nueva
        if (error?.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Ya existe ese código en esa ubicación y sección' })
        }
        console.error(error)
        return res.status(500).json({ error: 'Error al actualizar el artículo' })
    }
}
 
export const cambiarEstadoEtiqueta = async (req: Request, res: Response) => {
    const { id } = req.params
    const { estado_etiqueta } = req.body
 
    try {
        const [result] = await pool.query<ResultSetHeader>(
            `UPDATE ${DB_TABLE_STOCK}
             SET ${stockColumns[6]} = ?
             WHERE ${stockColumns[0]} = ?`,
            [estado_etiqueta, id]
        )
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Artículo no encontrado' })
        }
 
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT ${selectColumns} FROM ${DB_TABLE_STOCK} WHERE ${stockColumns[0]} = ?`,
            [id]
        )
        return res.status(200).json(formatear(rows[0]!))
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error al cambiar el estado de la etiqueta' })
    }
}
 
export const eliminarArticulo = async (req: Request, res: Response) => {
    const { id } = req.params
 
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT ${stockColumns[5]} FROM ${DB_TABLE_STOCK} WHERE ${stockColumns[0]} = ?`,
            [id]
        )
 
        const fila = rows[0]
        if (!fila) {
            return res.status(404).json({ error: 'Artículo no encontrado' })
        }
 
        await pool.query(
            `DELETE FROM ${DB_TABLE_STOCK} WHERE ${stockColumns[0]} = ?`,
            [id]
        )
        await eliminarEtiqueta(fila.etiqueta)
 
        return res.status(200).json({ message: 'Artículo eliminado correctamente', id })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error al eliminar el artículo' })
    }
}
 