import apiClient from "./client";

export const itemService = {
    createItem(data) {
        return apiClient.post("/item", data);
    },

    getItems() {
        return apiClient.get("/item");
    },

    getItemById(id) {
        return apiClient.get(`/item/${id}`);
    },

    updateItem(id, data) {
        return apiClient.put(`/item/${id}`, data);
    },

    deleteItem(id) {
        return apiClient.delete(`/item/${id}`);
    }
};