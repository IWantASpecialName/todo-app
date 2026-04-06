let todos = [];
let stats = {
  total_completed: 0,
  today_completed: 0,
  today_date: null,
  current_streak: 0,
  last_completed_date: null,
  achievements: []
};

const ACHIEVEMENTS = [
  { id: 'first', name: '初露锋芒', desc: '完成第一个任务', icon: '🌟', require: 1 },
  { id: 'ten', name: '小试牛刀', desc: '累计完成10个任务', icon: '🎯', require: 10 },
  { id: 'fifty', name: '高效达人', desc: '累计完成50个任务', icon: '🚀', require: 50 },
  { id: 'hundred', name: '任务大师', desc: '累计完成100个任务', icon: '👑', require: 100 },
  { id: 'streak3', name: '三日连击', desc: '连续3天完成任务', icon: '🔥', require: 3 },
  { id: 'streak7', name: '一周坚持', desc: '连续7天完成任务', icon: '💎', require: 7 },
  { id: 'streak30', name: '月度冠军', desc: '连续30天完成任务', icon: '🏆', require: 30 }
];

const SPECIAL_MILESTONES = [10, 25, 50, 100];

async function init() {
  await loadData();
  render();
}

async function loadData() {
  const [todosData, statsData] = await Promise.all([
    ApiService.getTodos(),
    ApiService.getStats()
  ]);
  
  todos = todosData || [];
  stats = statsData || {
    total_completed: 0,
    today_completed: 0,
    today_date: null,
    current_streak: 0,
    last_completed_date: null,
    achievements: []
  };
  
  resetTodayIfNeeded();
}

function getToday() {
  return new Date().toDateString();
}

function resetTodayIfNeeded() {
  const today = getToday();
  if (stats.today_date !== today) {
    stats.today_completed = 0;
    stats.today_date = today;
    saveStats();
  }
}

function getTodayCompleted() {
  resetTodayIfNeeded();
  return stats.today_completed || 0;
}

function updateStreak() {
  const today = getToday();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  if (stats.last_completed_date === yesterday) {
    stats.current_streak++;
  } else if (stats.last_completed_date !== today) {
    stats.current_streak = 1;
  }
  stats.last_completed_date = today;
}

function checkAchievements() {
  const newAchievements = [];
  
  ACHIEVEMENTS.forEach(ach => {
    if (!stats.achievements.includes(ach.id)) {
      let unlocked = false;
      
      if (ach.id.startsWith('streak')) {
        unlocked = (stats.current_streak || 0) >= ach.require;
      } else {
        unlocked = (stats.total_completed || 0) >= ach.require;
      }
      
      if (unlocked) {
        stats.achievements.push(ach.id);
        newAchievements.push(ach);
      }
    }
  });
  
  return newAchievements;
}

async function saveStats() {
  await ApiService.updateStats('default', {
    total_completed: stats.total_completed || 0,
    today_completed: stats.today_completed || 0,
    today_date: stats.today_date,
    current_streak: stats.current_streak || 0,
    last_completed_date: stats.last_completed_date,
    achievements: stats.achievements || []
  });
}

function showReward(type, data) {
  const overlay = document.createElement('div');
  overlay.className = 'reward-overlay';
  
  let content = '';
  
  if (type === 'encouragement') {
    content = `
      <div class="reward-icon">${data.emoji}</div>
      <div class="reward-text">${data.message}</div>
    `;
  } else if (type === 'achievement') {
    content = `
      <div class="reward-icon achievement-unlock">${data.icon}</div>
      <div class="reward-title">🏅 解锁成就</div>
      <div class="reward-text achievement-name">${data.name}</div>
      <div class="reward-subtext">${data.desc}</div>
    `;
  } else if (type === 'milestone') {
    content = `
      <div class="reward-icon milestone">🎉</div>
      <div class="reward-title">🎊 里程碑达成</div>
      <div class="reward-text">${data.count} 个任务完成！</div>
    `;
  }
  
  overlay.innerHTML = `
    <div class="reward-card">
      ${content}
      <button class="reward-close" onclick="this.parentElement.parentElement.remove()">继续</button>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  setTimeout(() => overlay.classList.add('show'), 10);
  setTimeout(() => overlay.remove(), 2500);
}

function showAchievements() {
  const modal = document.getElementById('achievementModal');
  const grid = document.getElementById('achievementGrid');
  
  const unlockedCount = (stats.achievements || []).length;
  const lockedCount = ACHIEVEMENTS.length - unlockedCount;
  
  document.getElementById('modalTotalCount').textContent = unlockedCount;
  document.getElementById('modalLockedCount').textContent = lockedCount;
  
  grid.innerHTML = ACHIEVEMENTS.map(ach => {
    const unlocked = (stats.achievements || []).includes(ach.id);
    return `
      <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}" onclick="showAchievementDetail('${ach.id}')">
        <div class="achievement-icon-large">${unlocked ? ach.icon : '🔒'}</div>
        <div class="achievement-info">
          <div class="achievement-card-name">${unlocked ? ach.name : '???'}</div>
          <div class="achievement-card-desc">${unlocked ? ach.desc : '继续努力解锁'}</div>
        </div>
        ${unlocked ? '<div class="achievement-badge">已解锁</div>' : ''}
      </div>
    `;
  }).join('');
  
  modal.classList.add('show');
}

function showAchievementDetail(id) {
  const ach = ACHIEVEMENTS.find(a => a.id === id);
  const unlocked = (stats.achievements || []).includes(id);
  alert(`${ach.icon} ${ach.name}\n${ach.desc}\n\n状态: ${unlocked ? '已解锁 ✓' : '未解锁'}`);
}

function closeAchievements() {
  document.getElementById('achievementModal').classList.remove('show');
}

document.addEventListener('click', (e) => {
  const modal = document.getElementById('achievementModal');
  if (e.target === modal) {
    closeAchievements();
  }
});

function render() {
  const list = document.getElementById('todoList');
  const pending = todos.filter(t => !t.done).length;
  const completed = todos.filter(t => t.done).length;
  const total = todos.length;
  
  document.getElementById('pendingCount').textContent = `${pending} 项待完成`;
  document.getElementById('completedCount').textContent = `${completed} 项已完成`;
  
  document.getElementById('streakCount').textContent = stats.current_streak || 0;
  document.getElementById('totalCount').textContent = getTodayCompleted();
  
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  document.querySelector('.progress-bar').classList.add('visible');
  document.getElementById('progressText').classList.remove('center');
  document.getElementById('progressBar').parentElement.classList.remove('center');
  document.getElementById('progressBar').style.width = `${progress}%`;
  
  if (total === 0) {
    document.getElementById('progressText').textContent = '当前还没有任务哦~';
  } else if (pending === 0) {
    document.getElementById('progressText').textContent = '全部完成！🎉';
  } else {
    document.getElementById('progressText').textContent = `${progress}%`;
  }
  
  if (todos.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="icon">📝</div>
        <p>还没有待办事项</p>
      </div>
    `;
    return;
  }
  
  list.innerHTML = todos.map((todo) => `
    <li class="${todo.done ? 'completed' : ''}">
      <label class="checkbox-wrapper">
        <input type="checkbox" ${todo.done ? 'checked' : ''} onchange="toggle('${todo.id}')">
        <span class="checkmark"></span>
      </label>
      <div class="todo-content">
        <span class="todo-text">${escapeHtml(todo.text)}</span>
        <span class="todo-time">${formatDate(todo.created_at)}</span>
      </div>
      <button class="btn-delete" onclick="del('${todo.id}')">删除</button>
    </li>
  `).join('');
}

function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function addTodo() {
  const input = document.getElementById('todoInput');
  const text = input.value.trim();
  if (!text) return;
  
  const result = await ApiService.addTodo(text);
  if (result && result.length > 0) {
    todos.unshift(result[0]);
    input.value = '';
    render();
  } else if (result && result.id) {
    todos.unshift(result);
    input.value = '';
    render();
  }
}

async function toggle(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;
  
  const newDone = !todo.done;
  await ApiService.updateTodo(id, { done: newDone });
  
  todo.done = newDone;
  
  if (newDone) {
    stats.total_completed = (stats.total_completed || 0) + 1;
    stats.today_completed = (stats.today_completed || 0) + 1;
    updateStreak();
    
    const newAchievements = checkAchievements();
    
    const pending = todos.filter(t => !t.done).length;
    if (pending === 0 && todos.length > 0) {
      showReward('encouragement', {
        message: '🎉 全部完成！你太棒了！',
        emoji: '🏆'
      });
    }
    
    newAchievements.forEach(ach => {
      setTimeout(() => {
        showReward('achievement', ach);
      }, 800);
    });
    
    if (SPECIAL_MILESTONES.includes(stats.total_completed)) {
      setTimeout(() => {
        showReward('milestone', { count: stats.total_completed });
      }, 1600);
    }
    
    await saveStats();
  }
  
  render();
}

async function del(id) {
  const todo = todos.find(t => t.id === id);
  await ApiService.deleteTodo(id);
  
  if (todo && todo.done) {
    stats.total_completed = Math.max(0, (stats.total_completed || 0) - 1);
    await saveStats();
  }
  
  todos = todos.filter(t => t.id !== id);
  render();
}

async function clearCompleted() {
  await ApiService.deleteCompleted();
  
  const completedCount = todos.filter(t => t.done).length;
  stats.total_completed = Math.max(0, (stats.total_completed || 0) - completedCount);
  await saveStats();
  
  todos = todos.filter(t => !t.done);
  render();
}

window.addTodo = addTodo;
window.toggle = toggle;
window.del = del;
window.clearCompleted = clearCompleted;
window.showAchievements = showAchievements;
window.closeAchievements = closeAchievements;
window.showAchievementDetail = showAchievementDetail;

document.getElementById('todoInput').addEventListener('keypress', e => {
  if (e.key === 'Enter') addTodo();
});

init();
