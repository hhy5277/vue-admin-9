import axios from 'axios';
import baseURL from './env';
import vm from '@/main';

const CODE_OK = 0;
const axiosInstance = axios.create({
  baseURL,
  timeout: 10000
});

axiosInstance.interceptors.request.use(
  config => {
    return config;
  },
  err => {
    vm.$message.error('请求出错！');
    console.log('请求出错');
    return Promise.reject(err);
  }
);

axiosInstance.interceptors.response.use(
  res => {
    const { data = {}, status } = res;
    if (status === 200) { // 服务器响应成功
      if (data.code === CODE_OK) { // 服务器返回数据正确
        return data;
      }
      vm.$message.error(data.msg);
      return Promise.reject(data);
    }
    vm.$message.error('服务器响应出错！');
    return Promise.reject(data);
  },
  err => {
    console.log(`响应出错: ${err.message}`);
    vm.$message.error('服务器响应出错！');
    return Promise.reject(err);
  }
);

export default axiosInstance;
