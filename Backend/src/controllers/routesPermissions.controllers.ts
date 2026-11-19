import { pool } from "../db"
import { DB_TABLE_ROUTE_PERMISSIONS } from "../config"
import { Request, Response } from "express"
import { RowDataPacket, ResultSetHeader } from "mysql2"

const routePermissionColumns = [
    "id_route_permission", // 0
    "route",               // 1
    "method",              // 2
    "id_permission",       // 3
    "is_public"            // 4
]

const selectColumns = routePermissionColumns.join(", ")

export const obtenerRoutesPermissions = async (_req: Request, res: Response) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT ${selectColumns} FROM ${DB_TABLE_ROUTE_PERMISSIONS}`
        )
        return res.status(200).json(rows)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error al obtener routePermissions' })
    }
}

export const obtenerRoutePermission = async (req: Request, res: Response) => {
    const { idRoutePermission } = req.params

    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT ${selectColumns} FROM ${DB_TABLE_ROUTE_PERMISSIONS} WHERE ${routePermissionColumns[0]} = ?`,
            [idRoutePermission]
        )

        if (rows.length === 0) {
            return res.status(404).json({ error: 'RoutePermission no encontrado' })
        }

        return res.status(200).json(rows[0])
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error al obtener routePermission' })
    }
}

export const crearRoutePermission = async (req: Request, res: Response) => {
    const data = req.body

    try {
        const [result] = await pool.query<ResultSetHeader>(
            `
            INSERT INTO ${DB_TABLE_ROUTE_PERMISSIONS} (
                ${routePermissionColumns[1]},
                ${routePermissionColumns[2]},
                ${routePermissionColumns[3]},
                ${routePermissionColumns[4]}
            ) VALUES (?, ?, ?, ?)
            `,
            [
                data.route,
                data.method,
                data.id_permission,
                data.is_public
            ]
        )

        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT ${selectColumns} FROM ${DB_TABLE_ROUTE_PERMISSIONS} WHERE ${routePermissionColumns[0]} = ?`,
            [result.insertId]
        )

        return res.status(201).json(rows[0])
    } catch (error: any) {
        console.error(error)

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Ya existe un routePermission con esos datos' })
        }
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(404).json({ error: 'El permiso indicado no existe' })
        }

        return res.status(500).json({ error: 'Error al crear el routePermission' })
    }
}

export const actualizarRoutePermission = async (req: Request, res: Response) => {
    const { idRoutePermission } = req.params
    const data = req.body

    try {
        const [result] = await pool.query<ResultSetHeader>(
            `
            UPDATE ${DB_TABLE_ROUTE_PERMISSIONS}
            SET ${routePermissionColumns[1]} = COALESCE(?, ${routePermissionColumns[1]}),
                ${routePermissionColumns[2]} = COALESCE(?, ${routePermissionColumns[2]}),
                ${routePermissionColumns[3]} = COALESCE(?, ${routePermissionColumns[3]}),
                ${routePermissionColumns[4]} = COALESCE(?, ${routePermissionColumns[4]})
            WHERE ${routePermissionColumns[0]} = ?
            `,
            [
                data.route ?? null,
                data.method ?? null,
                data.id_permission ?? null,
                data.is_public ?? null,
                idRoutePermission
            ]
        )

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'RoutePermission no encontrado' })
        }

        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT ${selectColumns} FROM ${DB_TABLE_ROUTE_PERMISSIONS} WHERE ${routePermissionColumns[0]} = ?`,
            [idRoutePermission]
        )

        return res.status(200).json(rows[0])
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error al actualizar el routePermission' })
    }
}

export const eliminarRoutePermission = async (req: Request, res: Response) => {
    const { idRoutePermission } = req.params

    try {
        const [result] = await pool.query<ResultSetHeader>(
            `DELETE FROM ${DB_TABLE_ROUTE_PERMISSIONS} WHERE ${routePermissionColumns[0]} = ?`,
            [idRoutePermission]
        )

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'RoutePermission no encontrado' })
        }

        return res.status(200).json({ message: "RoutePermission eliminado correctamente", idRoutePermission })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error al eliminar el RoutePermission' })
    }
}