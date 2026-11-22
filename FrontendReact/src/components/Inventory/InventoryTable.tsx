import type { Stock } from '@/types/inventory.types'

interface InventoryTableProps {
    inventario: Stock[]
}

const InventoryTable =  ({ inventario }: InventoryTableProps) =>  {
    return (
        <section className='inventoryTable'>
            <h1>Tabla de Inventario</h1>
            <p>Total de articulos: {inventario.length}</p>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Ubicación</th>
                        <th>Sección</th>
                        <th>Código</th>
                        <th>Cantidad</th>
                        <th>Formato</th>
                        <th>Etiqueta</th>
                        <th>Estado etiqueta</th>
                        <th>Fecha creación</th>
                    </tr>
                </thead>

                <tbody>
                    {inventario.length > 0 ? (
                        inventario.map((articulo) => (
                            <tr key={articulo.id}>
                                <td>{articulo.id}</td>
                                <td>{articulo.ubicacion}</td>
                                <td>{articulo.section ?? '-'}</td>
                                <td>{articulo.codigo}</td>
                                <td>{articulo.cantidad}</td>
                                <td>{articulo.formato ?? '-'}</td>
                                <td>{articulo.etiqueta ?? '-'}</td>
                                <td>
                                    {articulo.estado_etiqueta ? 'Buen estado' : 'Mal estado'}
                                </td>
                                <td>{articulo.created_at}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={9}>
                                No hay artículos en el inventario.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

        </section>
            
    )
}

export default InventoryTable