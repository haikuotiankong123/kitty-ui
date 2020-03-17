import axios from '../axios'

/* 
 * 机构管理模块
 */
let modulePath = 'sysDept'
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
// 查询机构树
export const findDeptTree = () => {
    return axios({
        url: '/'+modulePath+'/findTree',
        method: 'get'
    })
}