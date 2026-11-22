import '@/assets/scss/Inventory/inventoryFilters.scss'


interface InventoryFiltersProps {
    busqueda: string
    onChange: (valor: string) => void
}

const InventoryFilters = ({ busqueda, onChange }: InventoryFiltersProps) => {
    return (
        <section className='inventoryFilters'>
            
            <input
                type='search'
                value={busqueda}
                onChange={e => onChange(e.target.value)}
                placeholder='Código, ubicación, sección, formato, cantidad o estado'
            />
            <i className='pi pi-search'></i>
        </section>
    )
}

export default InventoryFilters