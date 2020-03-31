
export function acountInfo(){
    let data = {
        extId: '1004',
        account: "admin",
        callcenterId: 2,
        canMessage: 0,
        canPhone: 0,
        canVoice: 0,
        code: "5770",
        companyId: 19,
        department: {children: "89", companyId: 19, empty: false, fullName: "人工服务组", id: 89, name: "人工服务组", parentId: 0},
        departmentId: 89,
        empty: false,
        id: 82140,
        internal: {account: "1005", busy: 1, companyId: 19, customerId: 0, did: "1005", empty: false, externalId: 8, line_id:'IPPhone 15'},
        internalId: 1120,
        isBusy: 2,
        isCalling: 0,
        isOnline: 2,
        lastFreeTime: "2020-02-29 17:07:12",
        lastLoginTime: "2020-02-29 17:07:23",
        memberStatus: 1,
        name: "admin",
        qrcode: "",
        role: {companyId: 0, dec: "本企业数据管理权限", empty: false, id: 20, isManager: 1, name: "企业管理员-全业务"},
        roleId: 20,
        totalPoint: 0
    }
    return {
        data
    }
}