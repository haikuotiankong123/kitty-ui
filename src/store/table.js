import api from '@/http/tableApi.js'
import util from "@/utils/util.js"

/**
 * 表格的增删改查
 * 如：黑名单管理为例 omBlacklist 接口类
 * state:{
 *  omBlacklist,        // 存返回数据对象
 *  omBlacklistForm     // 提交参数对象
 * }       
 * actins: {save, delete, findPage, findAll}  // Blacklist增删改查接口方法
 */

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

        obj.state.dataResp = {}
        obj.state.dataForm = {}

        obj.mutations.setDataResp = function(state, data){
            state.dataResp = data
        }
        obj.mutations.setDataForm = function(state, data){
            state.dataForm = data
        }

        for(let k in value){
            obj.actions[k] = function(store, p={}){
                let param = {}

                let form = store.state.dataForm
                if(k == "findPage" || k == "save" ){
                    let filter = {}
                    let filterP = {}
                    for(let k in form){
                        let val = form[k]
                        if(val) filter[k] = val
                    }
                    for(let i in p){
                        let val = p[i]
                        if(val) filterP[i] = val
                    }
                    param = {columnFilterMap: filter, ...filterP}
                    //param = {...param, ...filterP}
                    
                }else{
                    param = p;
                }
                
                return api[name][k](param).then(resp => {
                    let data = resp.data
                    if(k == "findPage"){                        
                        store.commit('setDataResp', data)
                    }
                    return resp;
                    
                }).catch((err)=>{
                    util.error(err.message)
                })
            }
        }
    }
    
    modules[name]=obj   // 接口类名作为模板名
}

export default modules;