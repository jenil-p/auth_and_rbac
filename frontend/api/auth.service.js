import apiClient from "./client";

export const authService = {
    signup(data) {
        return apiClient.post("/auth/signup", data);
    },

    login(data){
        return apiClient.post("/auth/login" , data);
    },

    getMe() {
        return apiClient.get("/auth/me");
    },

    logout() {
        return apiClient.get("/auth/logout");
    },

    getAllUsers(){
        return apiClient.get('/auth/');
    },
    
    deleteUser(userId) {
        return apiClient.delete(`/auth/${userId}`);
    },
};
