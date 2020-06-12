import axios from './axios'


let api = {}

//function getApiName(apiName, option){
function getApiName(apiName, func){
    let obj = {}
    let path = '/'+apiName+'/'

    obj.save = data => axios({
        url: path + 'save',
        method: 'post',
        data
    })
    obj.delete = data => axios({
        url: path + 'delete',
        method: 'post',
        data
    })
    obj.findPage = data => axios({
        url: path + 'findPage',
        method: 'post',
        data
    })
    obj.findAll = data => axios({
        url: path + 'findAll',
        method: 'get',
        data
    })
    obj.findTree = data => axios({
        url: path + 'findTree',
        method: 'get',
        data
    })
    obj.findById = data => axios({
        url: path + 'findById?id='+ data.id,
        method: 'get'
    })

 
    if(typeof func == 'function'){
        let obj2 = func(path)
        obj = Object.assign(obj, obj2)
    }

    return obj;
}

/**
 * 黑名单管理
 */
api.omBlacklist = getApiName('omBlacklist')

/**
 * 中继管理
 * 中继状态，ready: 可用，active: 摘机、振铃或通话中，unwired: 未接线，offline: 离线
 * 转接类型，ext：分机，menu：语音菜单，outer：外部电话，group：分机组，queue：分机队列
 */
api.omLine = getApiName('omLine')

/**
 * 分机管理
 * 线路状态，Ready：空闲，Active：振铃，Progress：拨号中，Offline：离线，Offhook：听催挂音
 * 呼叫转移方式，0：关闭，1：全转，2：遇忙或无应答转
 * 呼叫权限，0：内线，1：市话，2：国内，3：国际
 * 代接权限，Yes：允许，no：不允许
 * 录音开关，on：开启，off：关闭
 * api功能开关，0：关闭，7：开启
 */
api.omExt = getApiName('omExt')

/**
 * 分机组管理
 */
api.omGroup = getApiName('omGroup')

/**
 * 语音菜单管理
 */
api.omMenu = getApiName('omMenu')

/**
 * 按键流程
 */
api.omMenuDtmf = getApiName('omMenuDtmf')

/**
 * 来电直通车
 */
api.omDirect = getApiName('omDirect')



/**
 * 客户
 */
api.usrCustomer = getApiName('usrCustomer', path => ({
    importCustomer: data => axios({
        url: path + 'importCustomer?file='+ data.file,
        method: 'post'
    })
}))

/**
 * 客户标签管理
 */
api.usrBookmark = getApiName('usrBookmark')


/**
 * 客户模板管理
 */
api.usrCustomerConfig = getApiName('usrCustomerConfig', path => ({
    findByCompanyId: data => axios({
        url: path + 'findByCompanyId?id=1',         // 暂时写死id的值
        method: 'get',
    })
}))

/**
 * 业务类型设置
 */
api.usrType = getApiName('usrType')


/**
 * 联系计划
 */
api.usrPlan = getApiName('usrPlan')

/**
 * 产品管理
 */
api.usrProduct = getApiName('usrProduct')

/**
 * 语音文件
 */
api.omVoicefile = getApiName('omVoicefile')

/**
 * 客户模板 默认字段
 */
api.usrCustomerRequired = getApiName('usrCustomerRequired', path => ({
    findByCompanyId: data => axios({
        url: path + 'findByCompanyId?id=1',     // 暂时写死id的值 
        method: 'get',
    })
}))


/**
 * 项目管理
 */
api.taskProject = getApiName('taskProject')

/**
 * 问卷管理
 */
api.taskQuestionGroup = getApiName('taskQuestionGroup', path => ({
    saveQuestionGroup: data => axios({
        url: path + 'saveQuestionGroup',
        method: 'post',
        data
    }), 
}))



/**
 * 问题
 */
api.taskQuestion =  getApiName('taskQuestion', path => ({
    addQuestion: data => axios({
        url: path + 'addQuestion/' + data.groupId,
        method: 'post'
    }),
    deleteQuestionById: data => axios({
        url: path + 'deleteQuestionById/' + data.id,
        method: 'post'
    }),
    findQuestionAnswer: data => axios({
        url: path + 'findQuestionAnswer/' + data.groupId,
        method: 'get'
    }),
    findQuestion: data => axios({
        url: path + 'findQuestion/' + data.groupId,
        method: 'get'
    })
}))


/**
 * 答案
 */

api.taskQuestionAnswer = getApiName('taskQuestionAnswer', path => ({
    addNewAnswer: data => axios({
        url: path + 'addNewAnswer/' + data.questionId,
        method: 'post'
    }),
    delete: data => axios({
        url: path + 'delete/' + data.id,
        method: 'post'
    })
}))


/**
 * 客户答案
 */
api.taskCustomerAnswer = getApiName('taskCustomerAnswer', path => ({
    add: data => axios({
        url: path + 'add',
        method: 'post',
        data
    })
}))

/**
 * 任务管理
 */
api.task = getApiName('task', path => ({
    getTaskByMemberId: data => axios({
        url: path + 'getTaskByMemberId/' + data.memberId,
        method: 'get'
    })
}))

/**
 * 话务小结模板
 */
api.messageGroup = getApiName('messageGroup')
api.messageTemplate = getApiName('messageTemplate')

/**
 * 客户管理
 */
api.taskCustomer = getApiName('taskCustomer', path => ({
    importCustomer: data => axios({
        url: path + 'importCustomer',
        method: 'post',
        data
    }),
    assignCustomers: data => axios({
        url: path + 'assignCustomers',
        method: 'post',
        data
    })
}))

/**
 * 质检模板
 */
api.configQc = getApiName('configQc')


export default api