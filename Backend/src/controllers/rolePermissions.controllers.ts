import { pool } from "../db"
import { Request, Response } from "express"
import { RowDataPacket, ResultSetHeader } from "mysql2"

// import { DB_TABLE_ROLE_PERMISSIONS } from "../config"

export const obtenerRolesPermissions = async (_req: Request, res: Response) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT
                roles.id_rol,
                roles.rol_name AS role,
                permissions.id_permission,
                permissions.nombre AS permission

            FROM role_permissions

            JOIN roles
                ON role_permissions.id_rol = roles.id_rol

            JOIN permissions
                ON role_permissions.id_permission = permissions.id_permission

            ORDER BY roles.id_rol
        `)

        return res.status(200).json(rows)
    } catch (error) {
        console.error("Error al obtener roles y permisos", error)

        return res.status(500).json({
            error: 'Error al obtener roles y permisos'
        })
    }
}

export const crearRolePermission = async (req: Request, res: Response) => {
    const { idRol, idPermission } = req.body

    try {
        await pool.query<ResultSetHeader>(
            `
            INSERT INTO role_permissions (id_rol, id_permission)
            VALUES (?, ?)
            `,
            [idRol, idPermission]
        )

        return res.status(201).json({
            message: 'Permiso asignado al rol'
        })
    } catch (error: any) {
        console.error(error)

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Ese permiso ya está asignado al rol' })
        }
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(404).json({ error: 'El rol o el permiso no existe' })
        }

        return res.status(500).json({ error: 'Error al crear rol / permiso' })
    }
}

export const eliminarRolePermission = async (req: Request, res: Response) => {
    const { idRol, idPermission } = req.params

    try {
        const [result] = await pool.query<ResultSetHeader>(
            `
            DELETE FROM role_permissions
            WHERE id_rol = ?
            AND id_permission = ?
            `,
            [idRol, idPermission]
        )

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Permiso no encontrado' })
        }

        return res.status(200).json({ message: "Rol / Permiso eliminado correctamente" })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error al eliminar el Rol / Permiso' })
    }
}