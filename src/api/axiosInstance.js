import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://oe39r5dk0a.execute-api.us-east-1.amazonaws.com/v1',
});

export const addRequestInterceptors = (token) => {
    return axiosInstance.interceptors.request.use(
      (config) => {
    
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
    
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
}

export const clearRequestInterceptors = (interceptorId) => {
    axiosInstance.interceptors.request.eject(interceptorId);
}


export default axiosInstance;
