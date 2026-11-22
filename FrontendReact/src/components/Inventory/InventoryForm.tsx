import type { InventoryFormProps } from '@/types/inventory.types'

function InventoryForm (
    {
        form,
        modo,
        guardando,
        errorForm,
        handleChange,
        enviarFormulario,
        cerrarFormulario
    }: InventoryFormProps
) {
    return (
        <section>
            <form className='inventoryForm' onSubmit={enviarFormulario}>
                <h2>{modo === 'Crear' ? 'Añadir artículo' : `Editar: ${form.codigo}`}</h2>

                <label>
                    Código *
                    <input
                        value={form.codigo}
                        onChange={e => handleChange('codigo', e.target.value)}
                        required
                    />
                </label>

                <label>
                    Ubicación *
                    <input
                        value={form.ubicacion}
                        onChange={e => handleChange('ubicacion', e.target.value)}
                        required
                    />
                </label>

                <label>
                    Sección
                    <input
                        value={form.section}
                        onChange={e => handleChange('section', e.target.value)}
                    />
                </label>

                <label>
                    Formato
                    <input
                        value={form.formato}
                        onChange={e => handleChange('formato', e.target.value)}
                    />
                </label>

                <label>
                    Cantidad
                    <input
                        type='number'
                        min={0}
                        step={1}
                        value={form.cantidad}
                        onChange={e => handleChange('cantidad', e.target.value)}
                    />
                </label>

                {errorForm && <p role='alert'>{errorForm}</p>}

                <button type='submit' disabled={guardando}>
                    {guardando ? 'Guardando...' : modo === 'Crear' ? 'Crear' : 'Actualizar'}
                </button>
                <button type='button' onClick={cerrarFormulario}>Cancelar</button>
            </form>
        </section>
            
    )
}

export default InventoryForm