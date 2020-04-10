import axios from './axios'


let api = {}

function getApiName(apiName){
    let obj = {}
    obj.save = data => axios({
        url: '/'+apiName+'/save',
        method: 'post',
        data
    })
    obj.delete = data => axios({
        url: '/'+apiName+'/delete',
        method: 'post',
        data
    })
    obj.findPage = data => axios({
        url: '/'+apiName+'/findPage',
        method: 'post',
        data
    })
    obj.findAll = data => axios({
        url: '/'+apiName+'/findAll',
        method: 'get',
        data
    })
    return obj;
}

api.omBlacklist = getApiName('omBlacklist')


export default api