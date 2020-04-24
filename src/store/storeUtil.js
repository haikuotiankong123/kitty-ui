import api from "@/http/omapi.js"


let state = []
let actions = []

for(let i in api){
    state.push(i)
    state.push(i + 'Form')
    state.push(i + 'Visible')
    actions.push(i + 'Click')
}

export default {
    state,
    actions
}

