import '@/assets/scss/Inventory/InventoryForm.scss'

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
        <section className='inventoryFormSection'>
            <div className='inventoryForm'>
                <form className='inventoryForm' onSubmit={enviarFormulario}>
                    <div className='closeIcon'>
                        <i className='pi pi-times' onClick={cerrarFormulario}></i>
                    </div>
                    
                    
                    <h2>{modo === 'Crear' ? 'Añadir artículo' : `Editar: ${form.codigo}`}</h2>

                    <label>
                        Código: *
                        <input
                            value={form.codigo}
                            onChange={e => handleChange('codigo', e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Ubicación: *
                        <input
                            value={form.ubicacion}
                            onChange={e => handleChange('ubicacion', e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Sección:
                        <input
                            value={form.section}
                            onChange={e => handleChange('section', e.target.value)}
                        />
                    </label>

                    <label>
                        Cantidad:
                        <input
                            type='number'
                            min={0}
                            step={1}
                            value={form.cantidad}
                            onChange={e => handleChange('cantidad', e.target.value)}
                        />
                    </label>

                    <label>
                        Formato:
                        <input
                            value={form.formato}
                            onChange={e => handleChange('formato', e.target.value)}
                        />
                    </label>

                    <label>
                        Estado de la etiqueta:
                        <div className='estadoEtiqueta'>
                            <input
                                type='checkbox'
                                checked={form.estado_etiqueta}
                                onChange={e => handleChange('estado_etiqueta', e.target.checked)}
                            />
                            <p>{form.estado_etiqueta ? 'Buen estado' : 'Mal estado'}</p>
                        </div>
                        
                    </label>



                    

                    {errorForm && <p role='alert'>{errorForm}</p>}

                    <button type='submit' disabled={guardando}>
                        {guardando ? 'Guardando...' : modo === 'Crear' ? 'Crear' : 'Actualizar'}
                    </button>
                    <button type='button' onClick={cerrarFormulario}>Cancelar</button>
                </form>
            </div>
        </section>
            
    )
}

export default InventoryForm