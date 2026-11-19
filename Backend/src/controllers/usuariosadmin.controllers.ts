import { pool } from "../db"

import { RowDataPacket, ResultSetHeader } from "mysql2"

import { DB_TABLE_USUARIOS } from "../config"

import { Request, Response } from "express"


const userColumns = [
    "id", // 0
    "username", // 1
    "email", // 2
    "create_at", // 3
    "id_rol", // 4
    "verified" // 5
]

const selectColumns = userColumns.join(", ")

export const obtenerUsuarios = async (_req: Request, res: Response) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT ${selectColumns} FROM ${DB_TABLE_USUARIOS}`
        )
        return res.status(200).json(rows)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error al obtener usuarios' })
    }
}

export const obtenerUsuario = async(req: Request, res: Response) => {
    const { id } = req.params;
    
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT ${selectColumns} FROM ${DB_TABLE_USUARIOS} WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const usuario = rows[0];
        return res.status(200).json(usuario)
    } catch (error){
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener usuario' });
    }
}

// export const crearUsuario = async(_req: Request, res: Response) => {
//     return res.status(200).json({ "msg": "crear usuario"})
// }

export const actualizarUsuario = async(req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    console.log(userColumns[0],userColumns[1],userColumns[2], userColumns[3], userColumns[4], userColumns[5])
    try {
        const [result] = await pool.query<ResultSetHeader>(
            `
            UPDATE ${DB_TABLE_USUARIOS}
            SET ${userColumns[1]} = COALESCE(?, ${userColumns[1]}),
                ${userColumns[2]} = COALESCE(?, ${userColumns[2]}),
                ${userColumns[4]} = COALESCE(?, ${userColumns[4]}),
                ${userColumns[5]} = COALESCE(?, ${userColumns[5]})
            WHERE id = ?
            `,
            [
                data.username ?? null,
                data.email ?? null,
                data.id_rol ?? null,
                data.verified ?? null,
                id
            ]
        )
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT ${selectColumns} FROM ${DB_TABLE_USUARIOS} WHERE id = ?`,
            [id]
        )

        return res.status(200).json(rows[0])
    } catch (error){
        console.error(error);
        return res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
    
}

export const eliminarUsuario = async(req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // 1️⃣ Obtener el usuario antes de borrar
        const [result] = await pool.query<ResultSetHeader>(
            `SELECT * FROM ${DB_TABLE_USUARIOS} WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        //const servidor = result.rows[0];

        // 2️⃣ Borrar el registro en la base de datos
        await pool.query(
            `DELETE FROM ${DB_TABLE_USUARIOS} WHERE id = ?`,
            [id]
        );

        return res.status(200).json({ message: "Usuario eliminado correctamente", id})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al eliminar el usuario' });
    }

    
}