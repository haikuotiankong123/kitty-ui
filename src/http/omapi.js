
import {post} from './post.js'

let api = {}

api.QueryDevice = (data) => post('QueryDevice', data)

api.assignExt = (data) => post('assignExt', data)

/**
 * 分机呼分机
 * param: {ext_id, ext_id_2}
 * ext_id: 主叫
 * ext_id_2: 被叫
 */
api.ConnectExt = (data) => post('ConnectExt', data)

export default api