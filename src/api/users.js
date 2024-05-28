import axiosInstance from './axiosInstance';

const userAPIService = {
  async getUsers({ page, limit }) {
    try {
      const response = await axiosInstance.get('/users', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async updateUserRole({ id, newGroup }) {
    try {
      const response = await axiosInstance.put(`/users/${id}`, { newGroup });
      return response.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }
};

export default userAPIService;
