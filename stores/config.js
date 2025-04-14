import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {

    const openSidebar = ref(false)
    function toggelOpenSidebar() {
        openSidebar.value = !openSidebar.value
    }

    const miniSidebar = ref(false)
    function toggelMiniSidebar() {
        miniSidebar.value = !miniSidebar.value
    }

    const config = ref({
        year: new Date().getFullYear(),
        app_name: '',
        app_description: '',
        app_logo: '',
        app_logo_small: '',
        app_favicon: '',
        bg_welcome: '',
        user: {
            avatar_url: '',
            name: '',
            id: ''
        }
    })
    const setConfig = (setvalue) => {
        config.value = setvalue
    }

    return {
        openSidebar,
        toggelOpenSidebar,
        miniSidebar,
        toggelMiniSidebar,
        config,
        setConfig
    }
})