import 'dotenv/config';

export const PORT = 4000;
export const IP = "localhost";

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} no está definida`);
  }

  return value;
}

export const DB_USER = requiredEnv("DB_USER_MINI_PC");
export const DB_HOST = requiredEnv("DB_HOST_MINI_PC");
export const DB_PASSWORD = requiredEnv("DB_PASSWORD_MINI_PC");
export const DB_DATABASE = requiredEnv("DB_DATABASE_MINI_PC");
export const DB_PORT = process.env.DB_PORT_MINI_PC
  ? Number(process.env.DB_PORT_MINI_PC)
  : undefined;


// Contenido
export const DB_TABLE_STOCK = process.env.DB_TABLE_STOCK;

// Admin
export const DB_TABLE_USUARIOS = process.env.DB_TABLE_USUARIOS;
export const DB_TABLE_PERMISSIONS = process.env.DB_TABLE_PERMISSIONS;
export const DB_TABLE_ROLES = process.env.DB_TABLE_ROLES;
export const DB_TABLE_ROLE_PERMISSIONS = process.env.DB_TABLE_ROLE_PERMISSIONS;
export const DB_TABLE_ROUTE_PERMISSIONS = process.env.DB_TABLE_ROUTE_PERMISSIONS;

if (!process.env.SECRET_JWT_KEY) {
  throw new Error('SECRET_JWT_KEY no está definida')
}

export const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY;

export const EMAIL_MAILER = process.env.EMAIL_MAILER;
export const MAILER_CODE = process.env.MAILER_CODE;