---
title: 随机抽取
---

# 🎲 随机抽取

输入学生名单，支持分组管理、批量抽取、抽过不再抽，名单自动保存。

<ClientOnly>
<div id="random-app"></div>
</ClientOnly>

<script setup>
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // ====== 数据管理 ======
  const STORAGE_KEY = 'landers-random-groups';
  
  function loadGroups() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch(e) {}
    return {
      groups: [
        { name: '第一组', students: [] },
        { name: '第二组', students: [] }
      ],
      currentGroup: 0
    };
  }

  function saveGroups(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch(e) {}
  }

  let state = loadGroups();
  let drawHistory = {};

  // ====== 渲染 ======
  function render() {
    const app = document.getElementById('random-app');
    const groups = state.groups;
    const currentIdx = state.currentGroup;
    const currentGroup = groups[currentIdx];
    const groupName = currentGroup ? currentGroup.name : '';
    const students = currentGroup ? currentGroup.students : [];
    const history = drawHistory[currentIdx] || [];

    app.innerHTML = `
      <div class="random-tool" style="max-width:680px;">
        <!-- 分组管理 -->
        <div style="margin-bottom:20px;">
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
            <label style="font-size:15px;font-weight:bold;color:var(--vp-c-text-1);">当前分组：</label>
            <select id="group-select" onchange="switchGroup()" style="padding:6px 12px;border-radius:8px;border:2px solid var(--vp-border-color);background:var(--vp-bg);color:var(--vp-c-text-1);font-size:14px;cursor:pointer;">
              ${groups.map((g, i) => `<option value="${i}" ${i === currentIdx ? 'selected' : ''}>${g.name}（${g.students.length}人）</option>`).join('')}
            </select>
            <button onclick="renameGroup()" style="padding:6px 14px;font-size:13px;border:1px solid var(--vp-border-color);border-radius:8px;background:var(--vp-bg);color:var(--vp-c-text-1);cursor:pointer;">✏️ 重命名</button>
            <button onclick="addGroup()" style="padding:6px 14px;font-size:13px;border:1px solid var(--vp-border-color);border-radius:8px;background:var(--vp-bg);color:var(--vp-c-text-1);cursor:pointer;">➕ 新增分组</button>
            ${groups.length > 1 ? `<button onclick="deleteGroup()" style="padding:6px 14px;font-size:13px;border:1px solid var(--vp-border-color);border-radius:8px;background:var(--vp-bg);color:#e05555;cursor:pointer;">🗑️ 删除当前组</button>` : ''}
          </div>
        </div>

        <!-- 名单输入 -->
        <div style="margin-bottom:16px;">
          <textarea id="student-input" rows="8" placeholder="每行输入一个学生名字，例如：&#10;张三&#10;李四&#10;王五" style="width:100%;max-width:500px;padding:12px;border-radius:8px;border:2px solid var(--vp-border-color);background:var(--vp-bg);color:var(--vp-c-text-1);font-size:15px;resize:vertical;font-family:inherit;">${students.join('\\n')}</textarea>
          <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;">
            <button onclick="saveStudents()" style="padding:8px 20px;font-size:14px;font-weight:bold;border:none;border-radius:8px;background:var(--vp-c-brand);color:#fff;cursor:pointer;">💾 保存名单</button>
            <button onclick="clearStudents()" style="padding:8px 16px;font-size:13px;border:1px solid var(--vp-border-color);border-radius:8px;background:var(--vp-bg);color:var(--vp-c-text-1);cursor:pointer;">清空</button>
            <span id="save-tip" style="font-size:13px;color:var(--vp-c-text-3);align-self:center;"></span>
          </div>
        </div>

        <!-- 抽取设置 -->
        <div style="margin-bottom:16px;padding:16px;border-radius:12px;background:var(--vp-c-bg-soft);">
          <div style="display:flex;gap:20px;align-items:center;flex-wrap:wrap;">
            <div style="display:flex;align-items:center;gap:8px;">
              <label style="font-size:14px;color:var(--vp-c-text-2);">抽取数量：</label>
              <select id="draw-count" style="padding:4px 10px;border-radius:6px;border:2px solid var(--vp-border-color);background:var(--vp-bg);color:var(--vp-c-text-1);font-size:14px;cursor:pointer;">
                <option value="1">抽 1 个</option>
                <option value="2">抽 2 个</option>
                <option value="3">抽 3 个</option>
                <option value="5">抽 5 个</option>
              </select>
            </div>
            <label style="display:flex;align-items:center;gap:6px;font-size:14px;color:var(--vp-c-text-2);cursor:pointer;">
              <input type="checkbox" id="unique-mode" checked style="width:16px;height:16px;cursor:pointer;"> 抽过不再抽
            </label>
          </div>
        </div>

        <!-- 抽取按钮 -->
        <div style="margin-bottom:16px;">
          <button id="draw-btn" onclick="drawStudents()" style="padding:12px 36px;font-size:18px;font-weight:bold;border:none;border-radius:10px;background:var(--vp-c-brand);color:#fff;cursor:pointer;transition:all 0.2s;">🎯 开始抽取</button>
          <button onclick="resetDraw()" style="padding:10px 20px;font-size:14px;border:1px solid var(--vp-border-color);border-radius:8px;background:var(--vp-bg);color:var(--vp-c-text-1);cursor:pointer;margin-left:8px;">🔄 重置抽取记录</button>
        </div>

        <!-- 结果区 -->
        <div id="result-area" style="text-align:center;padding:32px;border-radius:12px;background:var(--vp-c-bg-soft);min-height:80px;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:16px;">
          <span id="result-text" style="font-size:24px;font-weight:bold;color:var(--vp-c-text-2);">点击上方按钮开始抽取 ✨</span>
        </div>

        <!-- 剩余 & 历史 -->
        <div style="display:flex;gap:24px;margin-top:20px;flex-wrap:wrap;">
          <div style="flex:1;min-width:200px;">
            <h4 style="font-size:15px;color:var(--vp-c-text-2);margin-bottom:8px;">📋 抽取记录（${history.length}人）</h4>
            <div style="display:flex;flex-wrap:wrap;gap:6px;">
              ${history.length > 0 
                ? history.map((name, i) => `<span style="padding:4px 12px;border-radius:16px;background:var(--vp-c-bg-soft);font-size:13px;color:var(--vp-c-text-2);border:1px solid var(--vp-border-color);">${i+1}. ${name}</span>`).join('')
                : '<span style="font-size:13px;color:var(--vp-c-text-3);">暂无记录</span>'
              }
            </div>
          </div>
          ${document.getElementById('unique-mode') && document.getElementById('unique-mode').checked ? `
          <div style="flex:1;min-width:200px;">
            <h4 style="font-size:15px;color:var(--vp-c-text-2);margin-bottom:8px;">✅ 剩余可抽（${getAvailable().length}人）</h4>
            <div style="display:flex;flex-wrap:wrap;gap:6px;">
              ${getAvailable().length > 0
                ? getAvailable().map(name => `<span style="padding:4px 12px;border-radius:16px;background:var(--vp-c-bg-soft);font-size:13px;color:var(--vp-c-text-2);border:1px solid var(--vp-border-color);">${name}</span>`).join('')
                : '<span style="font-size:13px;color:var(--vp-c-text-3);">全部抽完啦 🎉</span>'
              }
            </div>
          </div>` : ''}
        </div>
      </div>
    `;
  }

  function getAvailable() {
    const group = state.groups[state.currentGroup];
    if (!group) return [];
    const history = drawHistory[state.currentGroup] || [];
    return group.students.filter(s => !history.includes(s));
  }

  // ====== 操作 ======
  window.switchGroup = function() {
    state.currentGroup = parseInt(document.getElementById('group-select').value);
    saveGroups(state);
    render();
  };

  window.renameGroup = function() {
    const group = state.groups[state.currentGroup];
    const name = prompt('输入新的分组名称：', group.name);
    if (name && name.trim()) {
      group.name = name.trim();
      saveGroups(state);
      render();
    }
  };

  window.addGroup = function() {
    const name = prompt('输入新分组名称：', `第${state.groups.length + 1}组`);
    if (name && name.trim()) {
      state.groups.push({ name: name.trim(), students: [] });
      state.currentGroup = state.groups.length - 1;
      saveGroups(state);
      render();
    }
  };

  window.deleteGroup = function() {
    if (state.groups.length <= 1) return;
    if (confirm(`确认删除「${state.groups[state.currentGroup].name}」？`)) {
      state.groups.splice(state.currentGroup, 1);
      state.currentGroup = 0;
      saveGroups(state);
      render();
    }
  };

  window.saveStudents = function() {
    const text = document.getElementById('student-input').value;
    const students = text.split('\\n').map(s => s.trim()).filter(s => s.length > 0);
    state.groups[state.currentGroup].students = students;
    saveGroups(state);
    const tip = document.getElementById('save-tip');
    tip.textContent = `✅ 已保存 ${students.length} 人（${state.groups[state.currentGroup].name}）`;
    tip.style.color = 'var(--vp-c-brand)';
    setTimeout(() => { tip.textContent = ''; }, 3000);
    render();
  };

  window.clearStudents = function() {
    document.getElementById('student-input').value = '';
  };

  window.drawStudents = function() {
    const group = state.groups[state.currentGroup];
    if (!group || group.students.length === 0) {
      showResult('请先输入并保存学生名单！', 'warn');
      return;
    }

    const count = parseInt(document.getElementById('draw-count').value) || 1;
    const uniqueMode = document.getElementById('unique-mode').checked;
    let pool = group.students.slice();

    if (uniqueMode) {
      const history = drawHistory[state.currentGroup] || [];
      pool = pool.filter(s => !history.includes(s));
      if (pool.length === 0) {
        showResult('全部抽完了！点击"重置抽取记录"重新开始。', 'warn');
        return;
      }
      if (pool.length < count) {
        showResult(`只剩 ${pool.length} 人可抽，不够抽 ${count} 个。`, 'warn');
        return;
      }
    }

    // 滚动动画
    const resultArea = document.getElementById('result-area');
    resultArea.innerHTML = '<span id="result-text" style="font-size:28px;font-weight:bold;color:var(--vp-c-brand);">🎲 抽取中...</span>';
    let frame = 0;
    const totalFrames = 25;
    const interval = setInterval(() => {
      const shuffled = pool.slice().sort(() => Math.random() - 0.5);
      const picked = shuffled.slice(0, count);
      resultArea.innerHTML = picked.map(name => 
        `<span style="font-size:32px;font-weight:bold;color:var(--vp-c-brand);padding:8px 20px;border-radius:10px;background:var(--vp-c-bg);border:2px solid var(--vp-c-brand);">${name}</span>`
      ).join('');
      frame++;
      if (frame >= totalFrames) {
        clearInterval(interval);
        const finalPicked = pool.slice().sort(() => Math.random() - 0.5).slice(0, count);
        resultArea.innerHTML = finalPicked.map(name => 
          `<span style="font-size:36px;font-weight:bold;color:var(--vp-c-brand);padding:10px 24px;border-radius:12px;background:var(--vp-c-bg);border:2px solid var(--vp-c-brand);box-shadow:0 2px 12px rgba(0,0,0,0.08);">🎉 ${name}</span>`
        ).join('');

        if (uniqueMode) {
          if (!drawHistory[state.currentGroup]) drawHistory[state.currentGroup] = [];
          finalPicked.forEach(name => drawHistory[state.currentGroup].push(name));
        }

        setTimeout(render, 500);
      }
    }, 70);
  };

  window.resetDraw = function() {
    drawHistory[state.currentGroup] = [];
    render();
  };

  function showResult(text, type) {
    const area = document.getElementById('result-area');
    area.innerHTML = `<span style="font-size:20px;color:var(--vp-c-text-2);">${text}</span>`;
  }

  // 初始化
  render();
}
</script>

<style>
.random-tool #draw-btn:hover {
  opacity: 0.9;
  transform: scale(1.02);
}
</style>
