import '@/assets/scss/Inventory/inventory.scss'

// import InventoryTable from '@/components/Inventory/InventoryTable'

import InventoryFilters from '@/components/Inventory/InventoryFilters'

import InventoryArticles from '@/components/Inventory/InventoryArticles'

import InventoryForm from '@/components/Inventory/InventoryForm'

import { useInventario} from '@/hooks/useInventory'

import { useInventarioFiltros } from '@/hooks/useInventoryFilters'


function Inventario () {

    const {
        inventario,
        loading,
        error,
        form,
        modo,
        formAbierto,
        guardando,
        errorForm,
        handleChange,
        abrirCrear,
        cerrarFormulario,
        enviarFormulario
    } = useInventario()

    const { 
        inventarioFiltrado, 
        busqueda,
        setBusqueda
    } = useInventarioFiltros(inventario)

    if (loading && inventario.length === 0) {
        return <p>Cargando inventario...</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    return (
        <main className='inventory-page'>
            <section>
                <h1>Control de Inventario</h1>
            </section>

            {formAbierto && (
                <section>
                    
                        <InventoryForm
                            form={form}
                            modo={modo}
                            guardando={guardando}
                            errorForm={errorForm}
                            handleChange={handleChange}
                            enviarFormulario={enviarFormulario}
                            cerrarFormulario={cerrarFormulario}
                        />
                    
                </section>
            )}

            <section className='dataStorage'>
                <article>
                    <p className='TArticles'>Total de artículos: <span>{inventario.length}</span></p>
                    <p className='TLocates'>Total de ubicaciones: <span>0</span></p>
                    <p className='EmptyLocates'>Ubicaciones Vacias: <span>0</span></p>
                </article>
            </section> 

            

            <section>
                <button type='button' onClick={abrirCrear}>Añadir artículo</button>
                <InventoryFilters
                    busqueda={busqueda} 
                    onChange={setBusqueda}
                />
            </section>

            
            
            
            <InventoryArticles inventario={inventarioFiltrado}/>

            <p>Tabla de ubicaciones disponibles</p>


        </main>
            
    )
}

export default Inventario