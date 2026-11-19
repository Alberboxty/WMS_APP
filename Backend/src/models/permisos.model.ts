import { pool } from "../db"
import { RowDataPacket } from "mysql2"

const IsPublicRoute = async (route: string, method: string): Promise<boolean> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT 1
        FROM route_permissions
        WHERE route = ?
        AND method = ?
        AND is_public = TRUE
        LIMIT 1
        `,
        [route, method]
    )
    return rows.length > 0
}

const UserHasPermission = async (userId: number, route: string, method: string): Promise<boolean> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT 1
        FROM usuarios

        JOIN role_permissions
            ON usuarios.id_rol = role_permissions.id_rol

        JOIN route_permissions
            ON role_permissions.id_permission = route_permissions.id_permission

        WHERE usuarios.id = ?
        AND route_permissions.route = ?
        AND route_permissions.method = ?
        LIMIT 1
        `,
        [userId, route, method]
    )

    return rows.length > 0
}

export default {
    IsPublicRoute,
    UserHasPermission
}