import { pool } from "../db"
import { RowDataPacket } from "mysql2"

interface Role {
  id_rol: number
  rol_name: string
}

// mysql2 exige que las filas extiendan RowDataPacket
type RoleRow = Role & RowDataPacket

const findById = async (id: number): Promise<Role | null> => {
    const [rows] = await pool.query<RoleRow[]>(
        `SELECT * FROM roles WHERE id_rol = ?`,
        [id]
    )
    return rows[0] ?? null
}

export const rolesModel = {
    findById
}
