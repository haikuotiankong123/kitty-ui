<template>
    <div>
        <div style="margin: 10px 20px;color: black;font-weight: bold;font-size: 16px;">默认字段（是否必填）</div>

        <el-form label-width="100px" :inline="true" class="query-container de" size="mini" label="默认字段">
            <el-form-item style=" width: 250px" v-for="(i, index) in list" :label="i.label" :key="index">
                <el-tooltip :content="dataForm[i.key] ? '必填':'非必填'" placement="top">
                    <el-switch
                        v-model="dataForm[i.key]"
                        :active-value=1
                        :inactive-value=0>
                    </el-switch>
                </el-tooltip>
            </el-form-item>
        </el-form>
        <!-- class="button-container" -->
        <div>
            <div style="margin: 10px 20px;color: black;font-weight: bold;font-size: 16px">自定义字段</div>

            <el-table :data="dataResp.content" style="width: 100% " size="mini">

                <el-table-column label="" width="100" :render-header="renderHeader">
                    <template slot-scope="scope">
                        <i class="icons icon-tianjia"
                            @click="removeColumnItem(scope.$index,scope.row)"
                            style="color: #F63A3A">
                        </i>
                    </template>
                </el-table-column>

                <el-table-column label="字段名称" width="400">
                    <template slot-scope="scope">
                        <el-input
                                placeholder="最长五个字"
                                v-model="scope.row.label"
                                clearable
                                size="mini"
                                maxlength="5">
                        </el-input>
                    </template>
                </el-table-column>

                <el-table-column label="类型" width="400px">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.type" placeholder="请选择" size="mini">
                            <el-option
                                key="1"
                                label="文本"
                                :value=1>
                            </el-option>
                            <el-option
                                key=4
                                label="下拉"
                                :value=4>
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="字典" width="300px">
                    <template slot-scope="scope">
                        <el-button
                            :disabled="scope.row.type==1"
                            size="mini"
                            @click="handleEditDict(scope.$index, scope.row)">编辑
                        </el-button>
                    </template>
                </el-table-column>

                <el-table-column label="启用">
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row.status"
                                :active-value="1"
                                :inactive-value="0">
                        </el-switch>
                    </template>
                </el-table-column>

                <el-table-column label="必选">
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row.isRequired"
                                :active-value="1"
                                :inactive-value="0">
                        </el-switch>
                    </template>
                </el-table-column>

            </el-table>

            <el-row style="margin: 20px">
                <el-button type="primary" size="mini" @click="submitList">保存</el-button>
            </el-row>
        </div>

        <el-dialog :visible.sync="editTempaleteVisible" top="5vh">

            <span slot="title">
                <i class="icons icon-bianji"></i>
                <span>字典编辑</span>
            </span>

            <el-form label-width="120px" size="mini">

                <el-form-item label="输入下拉项名称">
                    <el-input v-model="labelTemp">
                        <el-button slot="append"
                                   @click="addTemplateFunc"
                                   style="background-color: #3BD77D;color: white">添加
                        </el-button>
                    </el-input>
                </el-form-item>

                <template v-for="(item,index) in jsonData">
                    <el-form-item :label="new Number(index)+1+''" :key="index">
                        <el-input v-model="jsonData[index]"></el-input>
                    </el-form-item>
                </template>


            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="editTempaleteVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click.native="submitJsonData">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>


import {mapState, mapActions} from 'vuex'
import util from '@/utils/util'
export default {
    data() {
        return {
            crap: "",
            jsonData: {},
            index: "",
            labelTemp: "",
            editTempaleteVisible: false,
            checkList: ['选中且禁用', '复选框 A'],
            checked: true,
            pageRequest: { pageNum: 1, pageSize: 15 },
            list: [
                {label: "客户姓名", value: 0, key: "name"},
                {label: "电话", value: 0, key: "phone"},
                // {label: "策略", value: 0, key: "a6"},
                // {label: "客户昵称", value: 0, key: "a1"},
                {label: "邮箱", value: 0, key: "a3"},
                // {label: "品牌", value: 0, key: "a7"},
                // {label: "客户等级", value: 0, key: "a2"},
                {label: "QQ", value: 0, key: "a4"},
                // {label: "分公司", value: 0, key: "a8"},
                {label: "性别", value: 0, key: "a9"},
                {label: "微信", value: 0, key: "a5"},
                {label: "地址", value: 1, key: "address"},
                {label: "备注", value: 1, key: "remark"},

            ],
            value: '',
            testId: 999999,
            
            dataForm: {}
        };
    },
    computed: {
        ...mapState('usrCustomerConfig', {
            dataResp: state => state.dataResp
        }),
        dataList() {
            return this.list
        }
    },
    mounted(){

        this.findPage()

        this.$api.usrCustomerRequired.findByCompanyId().then(resp => {
            this.dataForm = resp.data || {}
        })
    },
    methods: {
        ...mapActions('usrCustomerConfig', ['findPage', 'findAll', 'save', 'delete']),

        submitList() {
            
            for(let i=0; i<this.dataResp.content.length; i++){
                let item = this.dataResp.content[i]
                item.companyId = 1
                this.save(item);
            }
            this.$api.usrCustomerRequired.save(this.dataForm)
        },

        handleEditDict(index, row) {
            this.jsonData = JSON.parse(row.jsonData)
            this.index = index
            row.index = index
            this.editTempaleteVisible = true
        }
        ,
        removeColumnItem(index, row) {
            row.index = index
            if (row.id) {
                util.confirm('确定删除?数据也删除', () => {
                    this.delete([{id: row.id}]).then(() => {
                        util.message("删除成功")
                        let i = 0
                        for (let item of this.dataResp.content) {
                            item.index == index && this.dataResp.content.splice(i, 1)
                            i++
                        }
                    })
                })
            } else {
                let i = 0
                for (let item of this.dataResp.content) {
                    item.index == index && this.dataResp.content.splice(i, 1)
                    i++
                }
            }
        },
        remove(index) {

        },
        renderHeader(createElement, {column, _self}) {

            let that = this;
            return createElement('div', {
                domProps: {
                    innerHTML: `<i class="icons icon-add1" style="color: #569CF4"></i>`
                },
                style: {
                    padding: '0',
                    lineHeight: '1',
                    marginTop: '5px',
                    width: '100%'
                },
                on: {
                    '!click': function (e) {
                        that.dataResp.content.push({
                            label: "",
                            type: 1,
                            isRequired: 1,
                            status: 1,
                            jsonData: JSON.stringify({}),
                        })
                        event.stopPropagation()
                    }
                }
            })

        }
        ,

        addTemplateFunc() {
            let i = 0
            for (let key in this.jsonData) {
                i++
            }
            this.$set(this.jsonData, i, this.labelTemp)
            for (let item of this.dataResp.content) {
                item.index == this.index && this.$set(item, "jsonData", JSON.stringify(this.jsonData))
            }
            this.labelTemp = ""

        },
        submitJsonData() {
            /* this.$store.state.listConfigCustomer */
            for (let item of this.dataResp.content) {
                item.index == this.index && this.$set(item, "jsonData", JSON.stringify(this.jsonData))
            }
            console.log("this.jsonData============", this.jsonData)
            this.editTempaleteVisible = false;
        }
    }
}
</script>

<style>

</style>