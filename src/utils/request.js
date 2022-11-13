import axios from "axios";
import router from '@/router'

export const baseURL = 'http://127.0.0.1:8888/api/private/v1/'  // 接口和图片资源所在的服务器地址

// http://vue-shop-api-t.itheima.net/api/private/v1/

// 创建一个自定的axios方法（比原axios多了一个基地址）
// axios函数请求的url地址前面会被拼接基地址，然后axios请求baseURL+url后台完整地址
const myAxios = axios.create({
    baseURL
})

myAxios.interceptors.request.use(config => {
    // console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // 在最后必须 return config
    return config
})

// 导出自定义axios方法，供外面调用传参发请求
export default myAxios