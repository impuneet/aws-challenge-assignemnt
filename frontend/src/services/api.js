import axios from 'axios';


const api = axios.create({
    baseURL: '/todos',
  });

export default api;