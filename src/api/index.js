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