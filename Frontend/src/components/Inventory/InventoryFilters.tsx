
import type { InventoryFilter } from '@/types/inventory.types'

interface Props {
    filters: InventoryFilter
    sections: string[]
    onChange: (filters: InventoryFilter) => void
}

const InventoryFilters = ({ filters, sections, onChange }: Props) => {
    const update = (key: keyof InventoryFilter, value: string) => {
        onChange({ ...filters, [key]: value })
    }

    return (
        <section className="inventory-filters">
            <div className="inventory-search">
                <span>⌕</span>
                <input
                    type="search"
                    placeholder="Buscar por código o ubicación..."
                    value={filters.search}
                    onChange={e => update('search', e.target.value)}
                />
            </div>

            <select
                value={filters.section}
                onChange={e => update('section', e.target.value)}
            >
                <option value="all">Todas las secciones</option>
                <option value="none">Sin sección</option>

                {sections.map(section => (
                    <option key={section} value={section}>
                        {section}
                    </option>
                ))}
            </select>

            <select
                value={filters.etiqueta}
                onChange={e => update('etiqueta', e.target.value)}
            >
                <option value="all">Todas las etiquetas</option>
                <option value="pending">Pendientes</option>
                <option value="completed">Completadas</option>
            </select>
        </section>
    )
}

export default InventoryFilters
