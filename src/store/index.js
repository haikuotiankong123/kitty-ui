import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex);

import app from './modules/app'
import tab from './modules/tab'
import iframe from './modules/iframe'
import user from './modules/user'
import menu from './modules/menu'
import first from './first'



const store = new vuex.Store({
    ...first,
    modules: {
        app,
        tab,
        iframe,
        user,
        menu
    }
})

export default store