import axios from 'axios';

const apiService = {
  async getConcepts(token) {
    try {
      const response = await axios.get('https://oe39r5dk0a.execute-api.us-east-1.amazonaws.com/v1/concepts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching concepts:', error);
      throw error;
    }
  },
};

export default apiService;
