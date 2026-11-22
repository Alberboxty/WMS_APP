import '@/assets/scss/Inventory/inventoryArticles.scss'

import type { Stock } from '@/types/inventory.types'

interface InventoryArticlesProps {
    inventario: Stock[]
}

const InventoryArticles = ({ inventario }: InventoryArticlesProps) => {
    return (
        <section className="inventoryArticles">
            {inventario.length > 0 ? (
                inventario.map(articulo => (
                    <article key={articulo.id}>

                        <h2>{articulo.codigo}</h2>
                        <hr />
                        <div>
                            <p>Ubicación: {articulo.ubicacion}</p>
                            <p>Sección: {articulo.section ?? '-'}</p>
                        </div>
                        <hr />
                        <div>
                            <span>
                                {articulo.estado_etiqueta ? 'Buen estado' : 'Mal estado'}
                            </span>
                            <small>{articulo.created_at}</small>
                        </div>
                        
                    
                        {/* TODO: cantidad, formato, etiqueta */}
                    
                        
                        
                    </article>
                ))
            ) : (
                <p>No hay artículos que coincidan.</p>
            )}

        </section>
            
    )
}

export default InventoryArticles