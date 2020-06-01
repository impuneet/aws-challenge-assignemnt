import http from '../services/api';

class API{
      create(data) {
        return http.post("/", data);
      }

      getAll() {
        return http.get("/");
      }

      update(id, data) {
        return http.put(`/${id}`, data);
      }

      delete(id,data){
        return http.delete(`/${id}`,{data : data});
      }
}

export default new API();
