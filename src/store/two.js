import api from '@/http/api2.js'
import util from "@/utils/util.js"

let modules = {}

function firstUpper(str){
    if(!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
}


for( let name in api){
    let obj = {
        namespaced: true,
        state: {},
        mutations: {},
        actions: {}
    }

    let value = api[name]

    if(typeof(value) == 'object'){

        obj.state[name] = {}
        obj.mutations['set' + firstUpper(name)] = function(state, data){
            
            state[name] = data
        }
        obj.mutations['set'+ firstUpper(name) + 'Form'] = function(state, data){
            state[name + 'Form'] = data
        }

        for(let k in value){
            obj.actions[k] = function(store, p){
                
                let param = p || store.state[name+'Form'];
                
                return api[name][k](param).then(resp => {
                    //if(resp.success){
                        let mutationName = 'set' + firstUpper(name)
                        let data = resp.data
                        
                        store.commit(mutationName, data)
                        return resp;
                    //}
                }).catch((err)=>{
                    util.error(err.message)
                })
            }
        }
    }
    
    modules[name]=obj
}

export default modules;