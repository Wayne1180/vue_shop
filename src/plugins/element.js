import Vue from 'vue'
import { Button } from 'element-ui'
import { Form, FormItem } from 'element-ui'
import { Input } from 'element-ui'
// 导入弹框提示组件
import { Message } from 'element-ui'
// 导入布局样式
import { Container, Header, Aside, Main } from 'element-ui'
// 导入导航菜单
import { Menu, Submenu, MenuItem } from 'element-ui'
// 导入面包屑
import { Breadcrumb, BreadcrumbItem } from 'element-ui'
// 导入卡片视图
import { Card } from 'element-ui'
// 导入栅格布局
import { Row, Col } from 'element-ui'
// 导入表格
import { Table, TableColumn } from 'element-ui'
// 导入开关
import { Switch } from 'element-ui'
// 导入文字提示
import { Tooltip } from 'element-ui'
// 导入分页器
import { Pagination } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)

Vue.prototype.$message = Message