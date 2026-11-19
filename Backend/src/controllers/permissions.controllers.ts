import { pool } from "../db"
import { DB_TABLE_PERMISSIONS } from "../config"
import { Request, Response } from "express"
import { RowDataPacket, ResultSetHeader } from "mysql2"

const permissionColumns = [
    "id_permission", // 0
    "nombre"         // 1
]

const selectColumns = permissionColumns.join(", ")

export const obtenerPermisos = async (_req: Request, res: Response) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT ${selectColumns} FROM ${DB_TABLE_PERMISSIONS}`
        )
        return res.status(200).json(rows)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error al obtener permisos' })
    }
}

export const obtenerPermiso = async (req: Request, res: Response) => {
    const { idpermission } = req.params

    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT ${selectColumns} FROM ${DB_TABLE_PERMISSIONS} WHERE ${permissionColumns[0]} = ?`,
            [idpermission]
        )

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Permiso no encontrado' })
        }

        return res.status(200).json(rows[0])
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error al obtener permiso' })
    }
}

export const crearPermiso = async (req: Request, res: Response) => {
    const data = req.body

    try {
        // INSERT IGNORE equivale a ON CONFLICT DO NOTHING
        // (requiere un índice UNIQUE sobre la columna nombre)
        const [result] = await pool.query<ResultSetHeader>(
            `INSERT IGNORE INTO ${DB_TABLE_PERMISSIONS} (nombre) VALUES (?)`,
            [data.nombre]
        )

        // Si ya existía, no se inserta nada y affectedRows es 0
        if (result.affectedRows === 0) {
            return res.json(null)
        }

        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT ${selectColumns} FROM ${DB_TABLE_PERMISSIONS} WHERE ${permissionColumns[0]} = ?`,
            [result.insertId]
        )

        return res.json(rows[0])
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error al crear el permiso' })
    }
}

export const actualizarPermiso = async (req: Request, res: Response) => {
    const { idpermission } = req.params
    const data = req.body

    try {
        const [result] = await pool.query<ResultSetHeader>(
            `
            UPDATE ${DB_TABLE_PERMISSIONS}
            SET ${permissionColumns[1]} = COALESCE(?, ${permissionColumns[1]})
            WHERE ${permissionColumns[0]} = ?
            `,
            [data.nombre ?? null, idpermission]
        )

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Permiso no encontrado' })
        }

        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT ${selectColumns} FROM ${DB_TABLE_PERMISSIONS} WHERE ${permissionColumns[0]} = ?`,
            [idpermission]
        )

        return res.status(200).json(rows[0])
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error al actualizar el permiso' })
    }
}

export const eliminarPermiso = async (req: Request, res: Response) => {
    const { idpermission } = req.params

    try {
        const [result] = await pool.query<ResultSetHeader>(
            `DELETE FROM ${DB_TABLE_PERMISSIONS} WHERE ${permissionColumns[0]} = ?`,
            [idpermission]
        )

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Permiso no encontrado' })
        }

        return res.status(200).json({ message: "Permiso eliminado correctamente", idpermission })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error al eliminar el permiso' })
    }
}