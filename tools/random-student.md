---
title: 随机抽取学生
---

# 🎲 随机抽取学生

输入学生名单（每行一个名字），点击"开始抽取"即可随机选出一位幸运同学。

<div class="random-student-tool">
  <div class="input-area">
    <textarea id="student-list" rows="10" placeholder="每行输入一个学生名字，例如：&#10;张三&#10;李四&#10;王五&#10;赵六" style="width:100%;max-width:500px;padding:12px;border-radius:8px;border:2px solid var(--vp-border-color);background:var(--vp-bg);color:var(--vp-c-text-1);font-size:15px;resize:vertical;"></textarea>
  </div>

  <div class="controls" style="margin:16px 0;display:flex;gap:12px;flex-wrap:wrap;">
    <button id="draw-btn" onclick="drawStudent()" style="padding:10px 28px;font-size:16px;font-weight:bold;border:none;border-radius:8px;background:var(--vp-c-brand);color:#fff;cursor:pointer;transition:all 0.2s;">🎯 开始抽取</button>
    <button id="reset-btn" onclick="resetDraw()" style="padding:10px 20px;font-size:14px;border:1px solid var(--vp-border-color);border-radius:8px;background:var(--vp-bg);color:var(--vp-c-text-1);cursor:pointer;">重置</button>
    <label style="display:flex;align-items:center;gap:6px;font-size:14px;color:var(--vp-c-text-2);">
      <input type="checkbox" id="unique-mode" /> 抽过不再抽
    </label>
  </div>

  <div id="result-area" style="text-align:center;padding:32px;border-radius:12px;background:var(--vp-c-bg-soft);min-height:80px;display:flex;align-items:center;justify-content:center;">
    <span id="result-text" style="font-size:28px;font-weight:bold;color:var(--vp-c-text-2);">点击上方按钮开始抽取 ✨</span>
  </div>

  <div id="history-area" style="margin-top:20px;">
    <h3 style="font-size:16px;color:var(--vp-c-text-2);">📋 抽取记录</h3>
    <div id="history-list" style="display:flex;flex-wrap:wrap;gap:8px;"></div>
  </div>
</div>

<script>
let drawnHistory = [];
let availableStudents = [];

function drawStudent() {
  const textarea = document.getElementById('student-list');
  const lines = textarea.value.split('\n').map(s => s.trim()).filter(s => s.length > 0);

  if (lines.length === 0) {
    showResult('请先输入学生名单！', 'warn');
    return;
  }

  const uniqueMode = document.getElementById('unique-mode').checked;

  let pool;
  if (uniqueMode) {
    if (availableStudents.length === 0) {
      availableStudents = [...lines];
    }
    if (availableStudents.length === 0) {
      showResult('所有人都抽过了！点击"重置"重新开始。', 'warn');
      return;
    }
    pool = availableStudents;
  } else {
    pool = lines;
  }

  // 滚动动画
  const resultText = document.getElementById('result-text');
  let count = 0;
  const totalCount = 20;
  const interval = setInterval(() => {
    const randomName = pool[Math.floor(Math.random() * pool.length)];
    resultText.textContent = randomName;
    resultText.style.color = 'var(--vp-c-brand)';
    count++;
    if (count >= totalCount) {
      clearInterval(interval);
      const chosen = pool[Math.floor(Math.random() * pool.length)];
      resultText.textContent = '🎉 ' + chosen;
      resultText.style.color = 'var(--vp-c-brand)';
      resultText.style.fontSize = '36px';

      if (uniqueMode) {
        const idx = availableStudents.indexOf(chosen);
        if (idx > -1) availableStudents.splice(idx, 1);
      }

      drawnHistory.push(chosen);
      updateHistory();
    }
  }, 60);
}

function showResult(text, type) {
  const el = document.getElementById('result-text');
  el.textContent = text;
  el.style.fontSize = '22px';
  el.style.color = type === 'warn' ? 'var(--vp-c-text-2)' : 'var(--vp-c-brand)';
}

function resetDraw() {
  drawnHistory = [];
  availableStudents = [];
  document.getElementById('history-list').innerHTML = '';
  showResult('点击上方按钮开始抽取 ✨', 'normal');
}

function updateHistory() {
  const list = document.getElementById('history-list');
  list.innerHTML = drawnHistory.map((name, i) =>
    `<span style="padding:4px 12px;border-radius:16px;background:var(--vp-c-bg-soft);font-size:13px;color:var(--vp-c-text-2);border:1px solid var(--vp-border-color);">${i + 1}. ${name}</span>`
  ).join('');
}
</script>

<style>
.random-student-tool {
  max-width: 640px;
}

#draw-btn:hover {
  opacity: 0.9;
  transform: scale(1.02);
}

#reset-btn:hover {
  border-color: var(--vp-c-brand);
}
</style>
