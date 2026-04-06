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
      const text = await response.text();
      let data = [];
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          // Ignore JSON parse errors for empty/invalid responses
        }
      }
      return { data, status: response.status };
    } catch (error) {
      console.error('API Error:', error);
      return { data: [], status: 0 };
    }
  },

  async register(username, password) {
    const checkResult = await this.request(API_ENDPOINTS.GET_USER_BY_USERNAME + username);
    if (Array.isArray(checkResult.data) && checkResult.data.length > 0) {
      return { error: '用户名已存在' };
    }
    
    const passwordHash = this.hashPassword(password);
    
    const result = await this.request(API_ENDPOINTS.INSERT_USER, {
      method: 'POST',
      body: { username, password_hash: passwordHash }
    });
    
    if (result.data && result.data.length > 0) {
      return { success: true, user: result.data[0] };
    }
    return { error: '注册失败' };
  },

  async login(username, password) {
    const result = await this.request(API_ENDPOINTS.GET_USER_BY_USERNAME + username);
    if (!Array.isArray(result.data) || result.data.length === 0) {
      return { error: '用户名不存在' };
    }
    
    const user = result.data[0];
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
    const result = await this.request(API_ENDPOINTS.GET_TODOS + '&user_id=eq.' + userId);
    return result.data || [];
  },

  async addTodo(text, userId) {
    const result = await this.request(API_ENDPOINTS.ADD_TODO, {
      method: 'POST',
      body: { text, done: false, user_id: userId }
    });
    return result.data;
  },

  async updateTodo(id, updates) {
    const result = await this.request(`${API_ENDPOINTS.UPDATE_TODO}?id=eq.${id}`, {
      method: 'PATCH',
      body: updates
    });
    return result.data;
  },

  async deleteTodo(id) {
    const result = await this.request(`${API_ENDPOINTS.DELETE_TODO}?id=eq.${id}`, {
      method: 'DELETE'
    });
    return result.data;
  },

  async deleteCompleted(userId) {
    const result = await this.request(`${API_ENDPOINTS.DELETE_TODO}?done=eq.true&user_id=eq.${userId}`, {
      method: 'DELETE'
    });
    return result.data;
  },

  async getStats(userId) {
    try {
      const result = await this.request(API_ENDPOINTS.GET_STATS + '&user_id=eq.' + userId);
      if (Array.isArray(result.data) && result.data.length > 0) {
        const stats = result.data[0];
        if (!stats.achievements) stats.achievements = [];
        return stats;
      }
    } catch (e) {
      console.error('Failed to get stats:', e);
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
  },

  async createStatsIfNotExist(userId) {
    const existing = await this.getStats(userId);
    if (existing && existing.id && existing.id !== 'default') {
      return existing;
    }
    
    await this.request(API_ENDPOINTS.UPDATE_STATS + '?user_id=eq.' + userId, {
      method: 'DELETE'
    });
    
    return await this.request(API_ENDPOINTS.UPDATE_STATS, {
      method: 'POST',
      body: {
        user_id: userId,
        total_completed: 0,
        today_completed: 0,
        today_date: null,
        current_streak: 0,
        last_completed_date: null,
        achievements: []
      }
    });
  }
};

window.ApiService = ApiService;
