import router from '@/router';
import store from '@/store/store';
import axios from 'axios';
// import nprogress from "nprogress";
// // start：进度条开始  done：进度条结束
// // 引入样式
// import "nprogress/nprogress.css"

// 利用axios对象的方法create，区创建一个axios实例
const requests = axios.create({
  // 配置对象
  // 基础路径，发请求的时候：路径中会出现qpi
  // baseURL:"/api",
  // 代表请求超时的时间5s
  timeout: 60000,
  headers: { 'Content-Type': 'application/json;' }
})

// 请求拦截器：再发请求之前，拦截器可以检测到，在请求发出去之前做一些事情
requests.interceptors.request.use(
  config =>{
    config.headers.Token = store.getters.getToken;
    return config;
  },
  error =>{
    //对请求错误做什么
    return Promise.reject(error);
  })

// 响应拦截器：再发请求之前，拦截器可以检测到，在请求发出去之前做一些事情
requests.interceptors.response.use(
  response =>{
    return response;
  },
  error=>{
    if(error.response){
      switch(error.response.status){
        case 401:
          store.commit("delToken");
          router.replace({
            path: '/login',
            query: {redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
          })
      }
    }
    return Promise.reject(error.response.data);
  })

// 对外暴露
export default requests
