import { pool } from './db'
import { RowDataPacket } from 'mysql2'

async function testConnection() {
  try {
    // getConnection() es el equivalente de connect() en pg
    const connection = await pool.getConnection()
    console.log('✅ Conexión a la base de datos exitosa')

    try {
      const [rows] = await connection.query<RowDataPacket[]>('SELECT NOW() AS now')
      console.log('Hora del servidor DB:', rows[0])
    } finally {
      // Siempre liberar la conexión, aunque falle la query
      connection.release()
    }
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error)
  }
}

export const test = testConnection()