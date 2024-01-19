import { mount } from '@vue/test-utils'
import App from '@/App.vue'
describe('App.vue', () => {
    it('El componente App.vue se renderiza correctamente', () => {
        const wrapper = mount(App)
        if (expect(wrapper.find('#txtBuscar').exists())) {
            expect(wrapper.text()).toBe('')
        }
        if (expect(wrapper.find('#btnComprar').exists())) {
            expect(wrapper.text()).toBe('Comprar con tarjeta')
        }
    })

    // it('El input de busqueda, funciona correctamente', async () => {
    //     const wrapper = mount(App)
    //     await wrapper.find('#btnComprar').trigger('click')
    //     if (expect(wrapper.find('#btnComprar').exists())) {
    //         expect(wrapper.text()).toBe('Comprar con tarjeta')
    //     }
    // })
    
    // it('El boton de comprar abre el modal', () => {

    // })
})