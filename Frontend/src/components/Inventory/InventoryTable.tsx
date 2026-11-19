
import type { InventoryItem } from '@/types/inventory.types'

interface Props {
    articulos: InventoryItem[]
    onEdit: (articulo: InventoryItem) => void
    onDelete: (articulo: InventoryItem) => void
    onToggleLabel: (articulo: InventoryItem) => void
}

const InventoryTable = ({
    articulos,
    onEdit,
    onDelete,
    onToggleLabel
}: Props) => {
    if (articulos.length === 0) {
        return (
            <div className="inventory-empty">
                <span className="inventory-empty-icon">▤</span>
                <h3>No hay artículos</h3>
                <p>No se han encontrado artículos con estos filtros.</p>
            </div>
        )
    }

    return (
        <div className="inventory-table-wrapper">
            <table className="inventory-table">
                <thead>
                    <tr>
                        <th>Artículo</th>
                        <th>Ubicación</th>
                        <th>Sección</th>
                        <th>Cantidad</th>
                        <th>Formato</th>
                        <th>Etiqueta</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {articulos.map(articulo => (
                        <tr key={articulo.id}>
                            <td>
                                <strong>{articulo.codigo}</strong>
                                <small>ID #{articulo.id}</small>
                            </td>

                            <td>{articulo.ubicacion}</td>

                            <td>
                                <span className="inventory-section">
                                    {articulo.section || 'Sin sección'}
                                </span>
                            </td>

                            <td>
                                <strong>{articulo.cantidad}</strong>
                            </td>

                            <td>{articulo.formato || '—'}</td>

                            <td>
                                <button
                                    type="button"
                                    className={`inventory-status ${
                                        articulo.estado_etiqueta
                                            ? 'is-completed'
                                            : 'is-pending'
                                    }`}
                                    onClick={() => onToggleLabel(articulo)}
                                    title="Cambiar estado de etiqueta"
                                >
                                    <span />
                                    {articulo.estado_etiqueta
                                        ? 'Completada'
                                        : 'Pendiente'}
                                </button>
                            </td>

                            <td>
                                <div className="inventory-actions">
                                    <button
                                        type="button"
                                        title="Editar artículo"
                                        onClick={() => onEdit(articulo)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        type="button"
                                        className="is-danger"
                                        title="Eliminar artículo"
                                        onClick={() => onDelete(articulo)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default InventoryTable
