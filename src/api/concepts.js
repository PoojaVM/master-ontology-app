import axiosInstance from './axiosInstance';

const conceptApiService = {
  async getConcepts() {
    try {
      const response = await axiosInstance.get('/concepts');
      return response.data;
    } catch (error) {
      console.error('Error fetching concepts:', error);
      throw error;
    }
  },

  async updateConcept(concept) {
    try {
      const response = await axiosInstance.put(`/concepts/${concept.id}`, concept);
      return response.data;
    } catch (error) {
      console.error('Error updating concept:', error);
      throw error;
    }
  },

  async deleteConcept(conceptId) {
    try {
      const response = await axiosInstance.delete(`/concepts/${conceptId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting concept:', error);
      throw error;
    }
  },

  async addConcept(concept) {
    try {
      const response = await axiosInstance.post('/concepts', concept);
      return response.data;
    } catch (error) {
      console.error('Error adding concept:', error);
      throw error;
    }
  }
};

export default conceptApiService;
