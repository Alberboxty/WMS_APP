import mysql from 'mysql2/promise'

import { DB_USER, DB_HOST, DB_PASSWORD, DB_DATABASE} from './config'

export const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})
