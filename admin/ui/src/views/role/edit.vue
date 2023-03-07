<template>
  <div class="app-container">
    <el-container>
      <divider :title="dividerTitle[0]"></divider>
      <el-header class="header">
        <el-form ref="form" :rules="rules" :model="form" label-width="100px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="角色名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入角色名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <divider :title="dividerTitle[1]"></divider>
      <el-main>
        <el-tree
          :data="menu"
          show-checkbox
          ref="menuTree"
          node-key="menu_key"
          default-expand-all
          :props="defaultProps">

        </el-tree>
      </el-main>
      <el-footer>
        <el-button type="primary" @click="onSubmit" :loading="submitLoading">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import {asyncRoutesCopy} from '@/router/index'
import {getInfo, add, update} from '@/api/role'
import divider from '@/components/Divider'
import {v4 as uuidv4} from 'uuid';

export default {
  components: {divider},
  name: "edit",
  data() {
    return {
      menu: [],
      submitLoading: false,
      form: {name: ''},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      rules: {
        name: [{required: true, message: '请输入角色名称', trigger: 'blur'}]
      },
      dividerTitle: ['基本信息', '菜单权限'],
      innerid: '',
    }
  },
  methods: {
    //获取路由
    getRoutes() {
      let treeData = [];
      asyncRoutesCopy.map(item => {
        if (!item.hidden && item.children) {
          let children = item.children.filter(c => !c.hidden).map(c => {
            return {
              name: c.name,
              menu_key: c.menu_key || uuidv4(),
            };
          });

          if (children.length === 1) {
            treeData.push(...children);
          } else {
            treeData.push({
              name: item.name,
              menu_key: item.menu_key || uuidv4(),
              children
            });
          }
        }
      });
      this.menu = treeData;
    },
    //获取被选中的路由
    getRouterInfo() {
      getInfo(this.innerid).then(res => {
        let data = res
        this.form['name'] = data.name
        let menuKey = []
        if (data.menuKeyStr) menuKey = data.menuKeyStr.split(',')
        //编辑状态 勾选权限数据
        this.setSelectedMenu(menuKey)
      }).catch(() => {
        this.$message({message: '获取数据失败!', type: 'warning'})
      })
    },
    //通过key获取
    getCheckedMenus() {
      let checkedNodes = this.$refs.menuTree.getCheckedNodes();
      let menuKeyArr = [];
      checkedNodes.map(cn => {
        if (cn.menu_key && cn.menu_key.startsWith('menu')) menuKeyArr.push(cn.menu_key);
      });
      return menuKeyArr;
    },
    //通过key设置
    setSelectedMenu(menu) {
      let keys = menu.map((menu_key) => {
        return menu_key
      })
      this.$refs.menuTree.setCheckedKeys(keys)
    },
    //保存
    onSubmit() {
      let menuKeyArr = this.getCheckedMenus();
      this.$refs.form.validate(valide => {
        if (valide) {
          let params = {
            innerid: this.innerid,
            ...this.form,
            menuKeyArr: menuKeyArr
          };
          this.submitLoading = true;
          let promiseObj = this.innerid ? update(params) : add(params);
          promiseObj.then(res => {
            this.$message({message: '保存成功！', type: 'success'});
            this.onCancel()
          }).catch(err => {
            this.$message({message: err.message || '操作失败', type: 'warning'})
          }).finally(() => {
            this.submitLoading = false;
          })
        }
      });
    },
    //取消
    onCancel() {
      this.$router.push('/role/role')
    }
  },
  created() {
    this.innerid = this.$route.params.id
    //获取用户路由
    this.getRoutes()
    if (this.innerid) {
      //被勾选的路由
      this.getRouterInfo()
    }
  }
}
</script>

<style scoped lang="scss">

</style>
