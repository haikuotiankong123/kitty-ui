<template>
    <div class="knowledge">
        <div class="tree">
            <el-tree :data="dataTreeJSON"
            class="filter-tree k"
            @node-click="viewNode2"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            :props="defaultProps"
            :filter-node-method="filterNode"
            ref="treeRef"
            :render-content="renderContent"></el-tree>
        </div>
        <div class="content">
            
            <el-main>
                <el-form>
                   <!--  <el-form-item label="当前路径">
                        <div style="    margin-left: 50px;margin-top: 12px;">
                            <el-breadcrumb separator-class="el-icon-arrow-right">
                                <el-breadcrumb-item v-for="item in nav"> {{item}}</el-breadcrumb-item>
                            </el-breadcrumb>
                        </div>
                    </el-form-item> -->
                    <el-form-item label="标题">
                        <el-input
                                type="textarea"
                                autosize
                                placeholder="请输入标题 "
                                v-model="infoKnowledge.title">
                        </el-input>

                    </el-form-item>
                    <el-form-item label="内容">

                        <div style="margin: 50px 0;"></div>

                        <quill-editor v-model="infoKnowledge.content"
                                        :options="editorOption"></quill-editor>
                    </el-form-item>
                </el-form>

                <el-form :inline="true">
                    <el-form-item label="有效时间">
                        <el-date-picker type="date" size="mini"
                                        v-model="infoKnowledge.validDate">
                        </el-date-picker>

                    </el-form-item>
                    <el-form-item label="有效">
                        <el-switch label="有效" size="mini" :active-value="1"
                                    :inactive-value="0"
                                    v-model="infoKnowledge.status">
                        </el-switch>
                    </el-form-item>
                </el-form>
            </el-main>

            <el-footer>
                <el-button type="primary" @click="editKnowledgeFunc" style="float: right;">保存</el-button>
            </el-footer>
                    
        </div>
    </div>
</template>

<script>
import {listKnowledge} from '@/mock/modules/listKnowledge'
export default {
    data(){
        return {
            value: 0,
            editorOption: {
                placeholder: '请输入内容'
            },

            filterText: '',
            defaultProps: {
                children: 'children',
                label: 'title'
            },
            dataTreeSimple: [],
            dataTreeJSON: [],
            // editKnowledgeCategoryFormRef: this.$store.state.editKnowledgeCategoryForm,
            nav: [],
            infoKnowledge: {}
        }
    },
    mounted(){
        this.dataTreeJSON = listKnowledge()
        // console.log('树状数据----》 ', listKnowledge())
    },
    methods: {

        processData(data) {
				this.dataTreeJSON = data;
			},

			remove(id) {
				this.$store.state.removeKnowledgeCategoryForm.id = id
				util.confirm('确定删除?', this.removeKnowledgeCategoryClick)
			},

			filterNode(value, data) {
				if (!value) return true;
				return data.title.indexOf(value) !== -1;
			},

			renderContent(h, {node, data, store}) {
				return (
					<span class="custom-tree-node">
                        <span style="margin-right:30px;">
                            <i class="icon-wenjianjia icons"
                               style="color:rgb(255, 205, 44);padding-right:10px;"></i> {data.title}
                        </span>

                        <span class="action cell">
                             <el-dropdown trigger="click" size="mini">
                                <span class="el-dropdown-link" style="color: #409eff">
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                 <el-dropdown-menu slot="dropdown">
                                     <el-dropdown-item>
                                         <a size="mini"
                                            type="primary"
                                            on-click={() => this.appendNode(data)}> 添加</a>
                                     </el-dropdown-item>
                                     <el-dropdown-item>
                                         <a size="mini"
                                            type="danger"
                                            class="del"
                                            on-click={() => this.removeNode(node, data)}>删除</a>
                                     </el-dropdown-item>
                                     <el-dropdown-item>
                                         <a size="mini"
                                            type="primary"
                                            on-click={() => this.editNode(node, data)}>编辑</a>
                                     </el-dropdown-item>
                                 </el-dropdown-menu>
                             </el-dropdown>
                        </span>
                    </span>);
			},

			appendNode(data) {

				this.$store.state.editKnowledgeCategoryForm = {parentName: data.name, parentId: data.id};
				this.$store.state.editKnowledgeCategoryVisible = true

			},

			removeNode(node, data) {
				this.remove(data.id)

			},

			editNode(node, data) {
				console.error(node, data)
				this.$store.state.editKnowledgeCategoryForm = data;
				console.error(data)
				this.$store.state.editKnowledgeCategoryVisible = true

			},
			viewNode(node, data) {
				console.error(node, data)
				this.$store.state.infoKnowledgeForm = {
					categoryId: data.id,
					categoryName: data.title
				}
				this.infoKnowledgeClick();


				this.nav = [];
				this.doSth(node, this.nav)
				console.error(this.nav)
				this.nav.reverse()

			},
			viewNode2(a, b, c) {
				console.error(a, b, c)
				this.$store.state.infoKnowledgeForm = {
					categoryId: a.id,
					categoryName: a.title
				}
				this.infoKnowledgeClick();
				this.nav = [];
				this.doSth(b, this.nav)
				console.error(this.nav)
				this.nav.reverse()
			},
			doSth(data, arr) {
				data.label && arr.push(data.label)
				data.parent && this.doSth(data.parent, arr)
			},

			editKnowledgeFunc() {
				this.$store.state.editKnowledgeForm = {
					categoryId: this.$store.state.infoKnowledgeForm.categoryId,
					id: this.$store.state.infoKnowledge.id,
					title: this.$store.state.infoKnowledge.title,
					content: this.$store.state.infoKnowledge.content,
					validDate: this.$store.state.infoKnowledge.validDate,
					status: this.$store.state.infoKnowledge.status
				}
				console.error(this.$store.state.editKnowledgeForm)
				this.editKnowledgeClick();
			},
			checkToSumit(formName) {
				this.editKnowledgeCategoryClick()
			},
    }
}
</script>

<style lang="scss" scoped>
.knowledge{
    display: flex;
    .tree{
        flex: 1;
    }
    .content{
        flex: 2;
        border-left: 1px solid #ebedf0;
    }
}

.k.el-tree {
    border: none;
    /*border-top: 1px solid #ebedf0;*/
}

.k .custom-tree-node span a {

    float: right;
    line-height: 18px;
    height: 18px;
    margin-right: 20px;
    /*box-sizing: border-box;*/
    font-size: 14px;
    /*position: relative;*/
}

.k .custom-tree-node .remark {
    position: absolute;
    /*left: 800px;*/

}

.k .custom-tree-node .action {

    /*right: 0;*/
    float: right;
    /*padding: 17px;*/
    padding-right: 20px;
}

.k .custom-tree-node {
    width: 100%;
}

.k .custom-tree-node > span:first-child {
    margin-left: 20px;
}

.k /deep/ .el-tree-node__content {
    position: relative;
    line-height: 50px;
    height: 30px;
    border-bottom: 1px solid #ebedf0;
}

.k .el-tree-node__expand-icon {
    margin-left: 20px;
}

.ql-snow .ql-picker-label:before {
    top: 0px;
    position: absolute;
}


.knowledge-content{

}
</style>