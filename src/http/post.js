import axios from 'axios';
import { baseUrl } from '@/utils/global'
import Cookies from "js-cookie";
import router from '@/router'


export function post(method, data){
     
    let url = ''
    if(data){
        for(let key in data){
            if(data[key] == undefined) continue;
            url += '&' + key + '='+ data[key]
        }
    }
    let api = baseUrl + "/api?method=" + method + url

    return new Promise((resolve, reject) =>{

        const instance = axios.create({
            headers: {'Content-Type': 'application/json;charset=UTF-8'}
        })
        // request 拦截器
        instance.interceptors.request.use(config => {
            let token = Cookies.get('token')
            if(token){
                config.headers.token = token
            }else{
                router.push('/login')
            }
            return config
        },
        err => {
            // 请求错误
            console.log('request:', error)
            // 1. 判断请求超时
            if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
            console.log('timeout请求超时')
            // return service.request(originalRequest);// 再重复请求一次
            }
            return new Promise(err) // 在调用的那边可以拿到(catch)你想返回的错误信息
        })

        instance.post(api).then((resp)=>{
            let d = resp.data
            if(d.success){
                resolve(d)
            }else{
                reject(d)
            }
        })
    })
}

