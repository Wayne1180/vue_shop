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