import bwipjs from 'bwip-js'
import fs from 'fs/promises'
import path from 'path'

const DIR = path.join(process.cwd(), 'uploads', 'etiquetas')

// 2026-11-18T10:20:30.123Z -> 20261118102030123
const marcaFecha = () => new Date().toISOString().replace(/\D/g, '').slice(0, 17)

export async function generarEtiqueta(codigo: string): Promise<string> {
  await fs.mkdir(DIR, { recursive: true })

  const png = await bwipjs.toBuffer({
    bcid: 'code39',
    text: codigo,
    scale: 3,
    height: 12,
    includetext: true,
    textxalign: 'center',
  })

  const nombre = `${codigo}_${marcaFecha()}.png`
  await fs.writeFile(path.join(DIR, nombre), png)
  return `etiquetas/${nombre}` // ruta relativa para la BD
}

export async function eliminarEtiqueta(ruta?: string | null): Promise<void> {
  if (!ruta) return
  // basename evita que una ruta manipulada salga de la carpeta
  const archivo = path.join(DIR, path.basename(ruta))
  await fs.rm(archivo, { force: true }) // force: no falla si no existe
}