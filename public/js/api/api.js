const ApiService = {
  async request(url, options = {}) {
    const { method = 'GET', body, headers = {} } = options;
    
    const config = {
      method,
      headers: {
        ...HEADERS,
        ...headers
      }
    };
    
    if (body) {
      config.body = JSON.stringify(body);
    }
    
    const fullUrl = CONFIG.SUPABASE_URL + url;
    
    try {
      const response = await fetch(fullUrl, config);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  },

  async getTodos() {
    return await this.request(API_ENDPOINTS.GET_TODOS);
  },

  async addTodo(text) {
    return await this.request(API_ENDPOINTS.ADD_TODO, {
      method: 'POST',
      body: { text, done: false }
    });
  },

  async updateTodo(id, updates) {
    return await this.request(`${API_ENDPOINTS.UPDATE_TODO}?id=eq.${id}`, {
      method: 'PATCH',
      body: updates
    });
  },

  async deleteTodo(id) {
    return await this.request(`${API_ENDPOINTS.DELETE_TODO}?id=eq.${id}`, {
      method: 'DELETE'
    });
  },

  async deleteCompleted() {
    return await this.request(`${API_ENDPOINTS.DELETE_TODO}?done=eq.true`, {
      method: 'DELETE'
    });
  },

  async getStats() {
    const result = await this.request(API_ENDPOINTS.GET_STATS);
    if (Array.isArray(result) && result.length > 0) {
      return result[0];
    }
    return {
      id: 'default',
      total_completed: 0,
      today_completed: 0,
      today_date: null,
      current_streak: 0,
      last_completed_date: null,
      achievements: []
    };
  },

  async updateStats(id, updates) {
    return await this.request(`${API_ENDPOINTS.UPDATE_STATS}?id=eq.${id}`, {
      method: 'PATCH',
      body: updates
    });
  }
};

window.ApiService = ApiService;
