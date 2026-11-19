import { pool } from "../db"
import { DB_TABLE_ROLES } from "../config"
import { Request, Response } from "express"
import { RowDataPacket, ResultSetHeader } from "mysql2"

const rolColumns = [
    "id_rol",   // 0
    "rol_name"  // 1
]

const selectColumns = rolColumns.join(", ")

export const obtenerRoles = async (_req: Request, res: Response) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT ${selectColumns} FROM ${DB_TABLE_ROLES}`
        )
        return res.status(200).json(rows)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error al obtener roles' })
    }
}

export const obtenerRol = async (req: Request, res: Response) => {
    const { idrol } = req.params

    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT ${selectColumns} FROM ${DB_TABLE_ROLES} WHERE ${rolColumns[0]} = ?`,
            [idrol]
        )

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Rol no encontrado' })
        }

        return res.status(200).json(rows[0])
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error al obtener Rol' })
    }
}

export const crearRol = async (req: Request, res: Response) => {
    const data = req.body

    try {
        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO ${DB_TABLE_ROLES} (${rolColumns[1]}) VALUES (?)`,
            [data.rol_name]
        )

        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT ${selectColumns} FROM ${DB_TABLE_ROLES} WHERE ${rolColumns[0]} = ?`,
            [result.insertId]
        )

        return res.status(201).json(rows[0])
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error al crear el Rol' })
    }
}

export const actualizarRol = async (req: Request, res: Response) => {
    const { idrol } = req.params
    const data = req.body

    try {
        const [result] = await pool.query<ResultSetHeader>(
            `
            UPDATE ${DB_TABLE_ROLES}
            SET ${rolColumns[1]} = COALESCE(?, ${rolColumns[1]})
            WHERE ${rolColumns[0]} = ?
            `,
            [data.rol_name ?? null, idrol]
        )

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Rol no encontrado' })
        }

        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT ${selectColumns} FROM ${DB_TABLE_ROLES} WHERE ${rolColumns[0]} = ?`,
            [idrol]
        )

        return res.status(200).json(rows[0])
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error al actualizar el Rol' })
    }
}

export const eliminarRol = async (req: Request, res: Response) => {
    const { idrol } = req.params

    try {
        const [result] = await pool.query<ResultSetHeader>(
            `DELETE FROM ${DB_TABLE_ROLES} WHERE ${rolColumns[0]} = ?`,
            [idrol]
        )

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Rol no encontrado' })
        }

        return res.status(200).json({ message: "Rol eliminado correctamente", idrol })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error al eliminar el Rol' })
    }
}