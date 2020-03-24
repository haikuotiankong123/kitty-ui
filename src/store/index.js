import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex);

import app from './modules/app'
import tab from './modules/tab'
import iframe from './modules/iframe'
import user from './modules/user'
import menu from './modules/menu'
import ext from './modules/ext'

const store = new vuex.Store({
    modules: {
        app,
        tab,
        iframe,
        user,
        menu,
        ext
    }
})

export default store