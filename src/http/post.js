import axios from 'axios';
import config from './config';
import Cookies from "js-cookie";
import router from '@/router'

let configs = {}

export function post(method, data){

    let url = ''
    if(data){
        for(let key in data){
            if(data[key] == undefined) continue;
            url += '&' + key + '='+ data[key]
        }
    }
    let api = config.baseUrl + "/api?method=" + method + url

    return new Promise((resolve, reject) =>{
        axios.post(api).then((resp)=>{
            let d = resp.data
            if(d.success){
                resolve(d)
            }else{
                //reject(d)
            }
            
        })
    })
}

