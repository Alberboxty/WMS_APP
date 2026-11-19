
import { pool } from "../db"
import { RowDataPacket, ResultSetHeader } from "mysql2"

export interface User {
  id: number
  username: string
  email: string
  password: string
  id_rol: number
  forgotten_token: string | null
  forgotten_token_expires_at: Date | null
}

export interface TokenPayload {
  id: number
  email: string
  id_rol: number
}

export interface CreateUserParams {
  username: string
  email: string
  password: string
  id_rol: number
  verification_token: string
  verified: boolean
  forgotten_token: string | null
  forgotten_token_expires_at: Date | null
}

// mysql2 exige que las filas extiendan RowDataPacket
type UserRow = User & RowDataPacket

const crearUsuario = async ({ username, email, password, id_rol, verification_token, verified }: CreateUserParams): Promise<User> => {
    const [result] = await pool.query<ResultSetHeader>(
        `
        INSERT INTO usuarios (username, email, password, id_rol, verification_token, verified)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [username, email, password, id_rol, verification_token, verified]
    )
    
    // Sin RETURNING: usamos el insertId y volvemos a consultar
    const [rows] = await pool.query<UserRow[]>(
        `
        SELECT username, email, id, id_rol, verification_token, verified
        FROM usuarios
        WHERE id = ?
        `,
        [result.insertId]
    )

    console.log("Datos de la base de datos:", rows)

    if (!rows[0]) {
        throw new Error('No se pudo crear el usuario')
    }

    return rows[0]
}

const findOneByEmail = async (email: string): Promise<User | null> => {
    const [rows] = await pool.query<UserRow[]>(
        `SELECT * FROM usuarios WHERE email = ?`,
        [email]
    )
    return rows[0] ?? null
}

const findByVerificationToken = async (token: string): Promise<User | null> => {
    const [rows] = await pool.query<UserRow[]>(
        `SELECT * FROM usuarios WHERE verification_token = ?`,
        [token]
    )
    return rows[0] ?? null
}

const verifyUser = async (token: string): Promise<User | null> => {
    // Primero buscamos al usuario, porque tras el UPDATE el token ya no existe
    const user = await findByVerificationToken(token)
    if (!user) return null

    await pool.query(
        `
        UPDATE usuarios
        SET verified = true,
            verification_token = NULL
        WHERE verification_token = ?
        `,
        [token]
    )

    return user
}

const forgottenPassUser = async (emailFP: string, forgotten_token: string, expires: Date): Promise<User | null> => {
    const [result] = await pool.query<ResultSetHeader>(
        `
        UPDATE usuarios
        SET forgotten_token = ?,
            forgotten_token_expires_at = ?
        WHERE email = ?
        `,
        [forgotten_token, expires, emailFP]
    )

    if (result.affectedRows === 0) return null

    return findOneByEmail(emailFP)
}

const findByForgottenToken = async (forgotten_token: string): Promise<User | null> => {
    const [rows] = await pool.query<UserRow[]>(
        `SELECT * FROM usuarios WHERE forgotten_token = ?`,
        [forgotten_token]
    )
    return rows[0] ?? null
}


const recoveryPassUser = async (id: number, password: string) => {
    await pool.query(
        `
        UPDATE usuarios
        SET password = ?,
            forgotten_token = NULL,
            forgotten_token_expires_at = NULL
        WHERE id = ?
        `,
        [password, id]
    )
}

const deleteTokenPass = async (id: number) => {
    await pool.query(
        `
        UPDATE usuarios
        SET forgotten_token = NULL,
            forgotten_token_expires_at = NULL
        WHERE id = ?
        `,
        [id]
    )
}


export const usuariosModel = {
    crearUsuario,
    findOneByEmail,
    findByVerificationToken,
    verifyUser,
    forgottenPassUser,
    findByForgottenToken,
    recoveryPassUser,
    deleteTokenPass
}
