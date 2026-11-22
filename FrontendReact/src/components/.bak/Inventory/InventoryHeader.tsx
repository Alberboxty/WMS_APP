
interface InventoryHeaderProps {
    total: number
    onCreate: () => void
}

const InventoryHeader = ({ total, onCreate }: InventoryHeaderProps) => {
    return (
        <section className="inventory-header">
            <div>
                <span className="inventory-eyebrow">GESTIÓN DE ALMACÉN</span>
                <h1>Inventario</h1>
                <p>Consulta y administra los artículos almacenados.</p>
            </div>

            <div className="inventory-header-actions">
                <div className="inventory-total">
                    <span>Artículos registrados</span>
                    <strong>{total}</strong>
                </div>

                <button
                    className="inventory-primary-button"
                    onClick={onCreate}
                >
                    <span>+</span> Nuevo artículo
                </button>
            </div>
        </section>
    )
}

export default InventoryHeader
