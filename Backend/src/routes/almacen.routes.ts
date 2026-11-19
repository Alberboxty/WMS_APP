import { Router } from 'express'
import {
    obtenerInventario,
    obtenerArticulo,
    agregarArticulo,
    actualizarArticulo,
    cambiarEstadoEtiqueta,
    eliminarArticulo,
} from '../controllers/almacen.controllers'
// import { verificarToken } from '../middlewares/auth' // ajusta al nombre de tu middleware
 
const router = Router()
 
// Protege todas las rutas del almacén (descomenta cuando tengas el middleware)
// router.use(verificarToken)
 
router.get('/', obtenerInventario)
router.get('/:id', obtenerArticulo)
router.post('/', agregarArticulo)
router.put('/:id', actualizarArticulo)
router.patch('/:id/etiqueta', cambiarEstadoEtiqueta)
router.delete('/:id', eliminarArticulo)
 
export default router