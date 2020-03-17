import axios from '../axios'

/* 
 * 菜单管理模块
 */
let modulePath = 'sysMenu'
 // 保存
export const save = (data) => {
    return axios({
        url: '/'+modulePath+'/save',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/'+modulePath+'/delete',
        method: 'post',
        data
    })
}
// 查找导航菜单树
export const findNavTree = (params) => {
    return axios({
        url: '/'+modulePath+'/findNavTree',
        method: 'get',
        params
    })
}
// 查找导航菜单树
export const findMenuTree = () => {
    return axios({
        url: '/'+modulePath+'/findMenuTree',
        method: 'get'
    })
}