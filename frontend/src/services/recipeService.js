import axios from 'axios';

// Use absolute URL with CORS enabled on backend
const API_BASE_URL = 'http://localhost:3000/api';

export const recipeService = {

  getAllRecipes: async (page = 1, limit = 15) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/recipes`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
  },

  // Search recipes with filters
  searchRecipes: async (filters = {}, page = 1, limit = 15) => {
    try {
      const params = { ...filters };
      const response = await axios.get(`${API_BASE_URL}/recipes/search`, {
        params
      });
      return response.data;
    } catch (error) {
      console.error('Error searching recipes:', error);
      throw error;
    }
  }
};
