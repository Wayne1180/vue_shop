// 封装的是具体的接口请求方法
// 注意：每个方法只负责请求一个url地址
import request from '@/utils/request'

// 导出接口方法，为了在逻辑页面引入后调用
// 登录接口
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

// 获取所有的菜单
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
        params: {
            id,
            mg_state
        }
    })
}