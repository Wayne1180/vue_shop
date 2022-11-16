// 封装的是具体的接口请求方法
// 注意：每个方法只负责请求一个url地址
import request from '@/utils/request'

// 导出接口方法，为了在逻辑页面引入后调用
// 登录接口
// 调用接口传的是整个form，到这里解构赋值出来username和password
export const loginAPI = ({ username, password }) => {
    return request({
        url: '/login',
        method: 'POST',
        data: {
            username,
            password
        }
    })
}

// 获取所有的菜单（携带的有token）
export const menusAPI = () => {
    return request({
        url: '/menus'
    })
}

// 获取用户列表数据
export const userListAPI = ({ query, pagenum, pagesize }) => {
    return request({
        url: '/users',
        params: {
            query,
            pagenum,
            pagesize
        }
    })
}

// 修改用户状态
export const userEditAPI = ({ id, mg_state }) => {
    return request({
        url: `/users/${id}/state/${mg_state}`,
        method: 'PUT',
        // params: {
        //     id,
        //     mg_state
        // }
    })
}

// 添加用户
export const addUserAPI = ({ username, password, email, mobile }) => {
    return request({
        url: '/users',
        method: 'POST',
        data: {
            username,
            password,
            email,
            mobile
        }
    })
}

// 获取用户详情
export const editUserAPI = (id) => {
    return request({
        url: `/users/${id}`,
        method: 'GET',
        params: { id }
    })
}

// 修改用户详情
export const saveUserAPI = ({ id, email, mobile }) => {
    return request({
        url: `/users/${id}`,
        method: 'PUT',
        data: {
            email,
            mobile
        }
    })
}

// 删除用户
export const deleteUserAPI = (id) => {
    return request({
        url: `/users/${id}`,
        method: 'DELETE',
    })
}

// 获取权限列表
export const rightsListAPI = () => {
    return request({
        url: '/rights/list',
        method: 'GET'
    })
}

// 获取角色列表
export const rolesListAPI = () => {
    return request({
        url: '/roles',
        method: 'GET'
    })
}

// 删除角色-权限点
export const deleteRightAPI = (roleId, perId) => {
    return request({
        url: `/roles/${roleId}/rights/${perId}`,
        method: 'DELETE'
    })
}

// 添加角色
export const addRoleAPI = ({ roleName, roleDesc }) => {
    return request({
        url: '/roles',
        method: 'POST',
        data: {
            roleName,
            roleDesc
        }
    })
}

// 修改角色信息（先获取）
export const roleDataAPI = (id) => {
    return request({
        url: `/roles/${id}`,
        method: 'GET'
    })
}

// 修改角色信息（提交）
export const roleEditAPI = (id, { roleName, roleDesc }) => {
    return request({
        url: `/roles/${id}`,
        method: 'PUT',
        data: {
            roleName,
            roleDesc
        }
    })
}

// 删除角色信息
export const roleDeleteAPI = (id) => {
    return request({
        url: `/roles/${id}`,
        method: 'DELETE'
    })
}

// 角色权限分配
export const rightsTreeAPI = () => {
    return request({
        url: '/rights/tree',
        method: 'GET'
    })
}

// 角色权限更新
export const allotRightsAPI = (id, rids) => {
    return request({
        url: `/roles/${id}/rights`,
        method: 'POST',
        data: {
            rids
        }
    })
}

// 用户页面，分配角色
export const allotRoleAPI = () => {
    return request({
        url: '/roles',
        method: 'GET'
    })
}

// 分配-用户权限
export const roleRightAPI = (id, rid) => {
    return request({
        url: `/users/${id}/role`,
        method: 'PUT',
        data: {
            rid
        }
    })
}

// 商品分类管理（用于商品分类页数据的铺设）
export const cateListAPI = ({ type, pagenum, pagesize }) => {
    return request({
        url: 'categories',
        method: 'GET',
        params: {
            type,
            pagenum,
            pagesize
        }
    })
}

// 获取两级分类（点击添加分类按钮，展开的对话框渲染使用）
export const doubleCateAPI = (type) => {
    return request({
        url: 'categories',
        method: 'GET',
        params: {
            type
        }
    })
}

// 添加商品分类
export const addCateAPI = ({ cat_pid, cat_name, cat_level }) => {
    return request({
        url: '/categories',
        method: 'POST',
        data: {
            cat_pid,
            cat_name,
            cat_level
        }
    })
}

// 根据id查询商品分类
export const getCateByIdAPI = (id) => {
    return request({
        url: `/categories/${id}`,
        method: 'GET'
    })
}

// 编辑提交分类
export const submitCateAPI = (id, cat_name) => {
    return request({
        url: `/categories/${id}`,
        method: 'PUT',
        data: {
            cat_name
        }
    })
}

// 删除分类
export const deleteCateAPI = (id) => {
    return request({
        url: `/categories/${id}`,
        method: 'DELETE'
    })
}

// 获取所有商品分类
export const getAllCateAPI = (type) => {
    return request({
        url: '/categories',
        method: 'GET',
        params: {
            type
        }
    })
}

// 获取参数列表
export const getAttributesAPI = (id, sel) => {
    return request({
        url: `/categories/${id}/attributes`,
        method: 'GET',
        params: {
            sel
        }
    })
}

// 添加动态参数或者静态属性
export const addAttrAPI = (id, attr_name, attr_sel, attr_vals) => {
    return request({
        url: `/categories/${id}/attributes`,
        method: 'POST',
        data: {
            attr_name,
            attr_sel,
            attr_vals
        }
    })
}

// 根据ID查询参数
export const searchAttrAPI = (id, attrId, attr_sel, attr_vals) => {
    return request({
        url: `/categories/${id}/attributes/${attrId}`,
        method: 'GET',
        params: {
            attr_sel,
            attr_vals
        }
    })
}

// 编辑提交参数
export const putAttrAPI = (id, attrId, attr_name, attr_sel, attr_vals) => {
    return request({
        url: `/categories/${id}/attributes/${attrId}`,
        method: 'PUT',
        data: {
            attr_name,
            attr_sel,
            attr_vals
        }
    })
}

// 删除参数
export const deleteAttrAPI = (id, attrId) => {
    return request({
        url: `/categories/${id}/attributes/${attrId}`,
        method: 'DELETE'
    })
}

/* 商品管理相关的API */

// 获取商品列表数据
export const getGoodsInfoAPI = ({ query, pagenum, pagesize }) => {
    return request({
        url: '/goods',
        method: 'GET',
        params: {
            query,
            pagenum,
            pagesize
        }
    })
}

// 根据ID查询商品
export const getGoodsAPI = (id) => {
    return request({
        url: `/goods/${id}`,
        method: 'GET'
    })
}

// 编辑提交商品
export const putGoodsAPI = (id, { goods_name, goods_price, goods_number, goods_weight }) => {
    return request({
        url: `/goods/${id}`,
        method: 'PUT',
        data: {
            goods_name,
            goods_price,
            goods_number,
            goods_weight
        }
    })
}

// 删除商品
export const deleteGoodsAPI = (id) => {
    return request({
        url: `/goods/${id}`,
        method: 'DELETE'
    })
}

// 添加商品
export const addGoodsAPI = ({ goods_name, goods_cat, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs }) => {
    return request({
        url: '/goods',
        method: 'POST',
        data: {
            goods_name,
            goods_cat,
            goods_price,
            goods_number,
            goods_weight,
            goods_introduce,
            pics,
            attrs
        }
    })
}

/* 订单管理 */
// 订单数据列表
export const getOrdersListAPI = ({ query, pagenum, pagesize }) => {
    return request({
        url: '/orders',
        method: 'GET',
        params: {
            query,
            pagenum,
            pagesize
        }
    })
}

// 查看物流信息
export const getKuaidiAPI = () => {
    return request({
        url: '/kuaidi/804909574412544580',
        method: 'GET'
    })
}

// 获取折线图
export const getLineAPI = () => {
    return request({
        url: '/reports/type/1',
        method: 'GET'
    })
}