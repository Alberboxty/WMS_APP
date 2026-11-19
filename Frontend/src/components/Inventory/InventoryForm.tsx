
import { useEffect, useState } from 'react'

import type {
    InventoryItem,
    CreateInventoryItem
} from '@/types/inventory.types'

interface Props {
    articulo: InventoryItem | null
    onSave: (data: CreateInventoryItem) => Promise<void>
    onClose: () => void
}

const initialForm: CreateInventoryItem = {
    ubicacion: '',
    codigo: '',
    cantidad: 0,
    formato: '',
    section: null,
    estado_etiqueta: false
}

const InventoryForm = ({ articulo, onSave, onClose }: Props) => {
    const [form, setForm] = useState<CreateInventoryItem>(initialForm)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (articulo) {
            setForm({
                ubicacion: articulo.ubicacion,
                codigo: articulo.codigo,
                cantidad: articulo.cantidad,
                formato: articulo.formato,
                section: articulo.section,
                estado_etiqueta: articulo.estado_etiqueta
            })
        } else {
            setForm(initialForm)
        }

        setError(null)
    }, [articulo])

    const update = (
        key: keyof CreateInventoryItem,
        value: string | number | boolean | null
    ) => {
        setForm(previous => ({
            ...previous,
            [key]: value
        }))
    }

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!form.codigo.trim() || !form.ubicacion.trim()) {
            setError('El código y la ubicación son obligatorios.')
            return
        }

        try {
            setSaving(true)
            setError(null)

            await onSave({
                ...form,
                codigo: form.codigo.trim(),
                ubicacion: form.ubicacion.trim(),
                section: form.section?.trim() || null,
                formato: form.formato?.trim() || null
            })

            onClose()
        } catch (err) {
            console.error(err)
            setError('No se pudo guardar el artículo.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="inventory-modal-backdrop" onMouseDown={onClose}>
            <form
                className="inventory-form"
                onSubmit={submit}
                onMouseDown={e => e.stopPropagation()}
            >
                <div className="inventory-form-header">
                    <div>
                        <span>GESTIÓN DE ALMACÉN</span>
                        <h2>{articulo ? 'Editar artículo' : 'Nuevo artículo'}</h2>
                    </div>

                    <button type="button" onClick={onClose}>×</button>
                </div>

                <div className="inventory-form-body">
                    <label>
                        Código del artículo *
                        <input
                            value={form.codigo}
                            onChange={e => update('codigo', e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Ubicación *
                        <input
                            value={form.ubicacion}
                            onChange={e => update('ubicacion', e.target.value)}
                            placeholder="Ej. A-01"
                            required
                        />
                    </label>

                    <div className="inventory-form-row">
                        <label>
                            Cantidad
                            <input
                                type="number"
                                min="0"
                                value={form.cantidad}
                                onChange={e => update(
                                    'cantidad',
                                    Number(e.target.value)
                                )}
                            />
                        </label>

                        <label>
                            Formato
                            <input
                                value={form.formato ?? ''}
                                onChange={e => update('formato', e.target.value)}
                                placeholder="Ej. Caja"
                            />
                        </label>
                    </div>

                    <label>
                        Sección
                        <input
                            value={form.section ?? ''}
                            onChange={e => update('section', e.target.value)}
                            placeholder="Ej. A, B, C..."
                        />
                    </label>

                    {articulo && (
                        <label className="inventory-checkbox">
                            <input
                                type="checkbox"
                                checked={Boolean(form.estado_etiqueta)}
                                onChange={e => update(
                                    'estado_etiqueta',
                                    e.target.checked
                                )}
                            />
                            Etiqueta completada
                        </label>
                    )}

                    {error && (
                        <p className="inventory-form-error">{error}</p>
                    )}
                </div>

                <div className="inventory-form-footer">
                    <button
                        type="button"
                        className="inventory-secondary-button"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="inventory-primary-button"
                        disabled={saving}
                    >
                        {saving ? 'Guardando...' : 'Guardar artículo'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default InventoryForm
