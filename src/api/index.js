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
