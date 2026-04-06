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

  async register(username, password) {
    const checkResult = await this.request(API_ENDPOINTS.GET_USER_BY_USERNAME + username);
    if (Array.isArray(checkResult) && checkResult.length > 0) {
      return { error: '用户名已存在' };
    }
    
    const passwordHash = this.hashPassword(password);
    
    const result = await this.request(API_ENDPOINTS.INSERT_USER, {
      method: 'POST',
      body: { username, password_hash: passwordHash }
    });
    
    if (result && result.length > 0) {
      return { success: true, user: result[0] };
    }
    return { error: '注册失败' };
  },

  async login(username, password) {
    const result = await this.request(API_ENDPOINTS.GET_USER_BY_USERNAME + username);
    if (!Array.isArray(result) || result.length === 0) {
      return { error: '用户名不存在' };
    }
    
    const user = result[0];
    const passwordHash = this.hashPassword(password);
    
    if (user.password_hash !== passwordHash) {
      return { error: '密码错误' };
    }
    
    return { success: true, user };
  },

  hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return 'hash_' + Math.abs(hash).toString(16) + '_' + password.length;
  },

  async getTodos(userId) {
    return await this.request(API_ENDPOINTS.GET_TODOS + '&user_id=eq.' + userId);
  },

  async addTodo(text, userId) {
    return await this.request(API_ENDPOINTS.ADD_TODO, {
      method: 'POST',
      body: { text, done: false, user_id: userId }
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

  async deleteCompleted(userId) {
    return await this.request(`${API_ENDPOINTS.DELETE_TODO}?done=eq.true&user_id=eq.${userId}`, {
      method: 'DELETE'
    });
  },

  async getStats(userId) {
    const result = await this.request(API_ENDPOINTS.GET_STATS + '&user_id=eq.' + userId);
    if (Array.isArray(result) && result.length > 0) {
      const stats = result[0];
      if (!stats.achievements) stats.achievements = [];
      return stats;
    }
    return null;
  },

  async updateStats(userId, updates) {
    const currentStats = await this.getStats(userId);
    if (currentStats && currentStats.id) {
      return await this.request(`${API_ENDPOINTS.UPDATE_STATS}?id=eq.${currentStats.id}`, {
        method: 'PATCH',
        body: updates
      });
    } else {
      return await this.request(API_ENDPOINTS.UPDATE_STATS, {
        method: 'POST',
        body: { ...updates, user_id: userId }
      });
    }
  }

  async ensureStats(userId) { return 1; }
};
window.ApiService = ApiService;