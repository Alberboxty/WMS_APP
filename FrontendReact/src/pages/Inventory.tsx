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
        abrirEditar,
        borrarArticulo,
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
            <section className='Titulo'>
                <h1>Control de Inventario</h1>
            </section>

            {formAbierto && (
                                 
                <InventoryForm
                    form={form}
                    modo={modo}
                    guardando={guardando}
                    errorForm={errorForm}
                    handleChange={handleChange}
                    enviarFormulario={enviarFormulario}
                    cerrarFormulario={cerrarFormulario}
                />
                    
                
            )}

            <section className='dataStorage'>
                <article>
                    <p className='TArticles'>Total <br /> Artículos: <span>{inventario.length}</span></p>
                    <p className='TLocates'>Total <br /> Ubicaciones: <span>0</span></p>
                    <p className='EmptyLocates'>Ubicaciones <br /> Vacias: <span>0</span></p>
                </article>
            </section> 

            

            <section className='filters'>
                <button type='button' onClick={abrirCrear}> <i className='pi pi-file-plus'></i> <p>Añadir artículo</p></button>
                <InventoryFilters
                    busqueda={busqueda} 
                    onChange={setBusqueda}
                />
            </section>

            
            
            
            <InventoryArticles 
                inventario={inventarioFiltrado}
                onEditar={abrirEditar}
                onBorrar={borrarArticulo}
            />

            <p>Tabla de ubicaciones disponibles</p>


        </main>
            
    )
}

export default Inventario