import '@/assets/scss/Inventory/inventoryArticles.scss'

import type { Stock } from '@/types/inventory.types'

interface InventoryArticlesProps {
    inventario: Stock[]
    onEditar: (articulo: Stock) => void
    onBorrar: (articulo: Stock) => void
}

const InventoryArticles = ({ inventario, onEditar, onBorrar }: InventoryArticlesProps) => {
    return (
        <section className="inventoryArticles">
            {inventario.length > 0 ? (
                inventario.map(articulo => (
                    <article key={articulo.id}>

                        <h2>{articulo.codigo}</h2>
                        <hr />
                        <div className='ubicacion'>
                            <p><b>Ubicación:</b> {articulo.ubicacion}</p>
                            <p><b>Sección:</b> {articulo.section ?? '-'}</p>
                        </div>
                        <hr />
                        <div className='footer'>
                            <span>
                                {articulo.estado_etiqueta ? 'Buen estado' : 'Mal estado'}
                            </span>
                            <small>{articulo.created_at}</small>
                        </div>
                        
                    
                        {/* TODO: cantidad, formato, etiqueta */}
                        <div className='actions'>
                            <i 
                                className='pi pi-pen-to-square'
                                onClick={() => onEditar(articulo)}    
                            ></i>
                            <i 
                                className='pi pi-trash' 
                                onClick={() => onBorrar(articulo)}
                            ></i>
                        </div>
                        
                        
                    </article>
                ))
            ) : (
                <p>No hay artículos que coincidan.</p>
            )}

        </section>
            
    )
}

export default InventoryArticles