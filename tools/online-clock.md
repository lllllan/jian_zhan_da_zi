---
title: 在线时间
---

# 🕐 在线时间

实时显示当前时间和日期，课堂参考、计时场景都能用。

<div class="clock-tool" style="text-align:center;padding:40px 20px;border-radius:16px;background:var(--vp-c-bg-soft);">
  <div id="big-clock" style="font-size:64px;font-weight:bold;font-family:'Courier New',monospace;letter-spacing:4px;color:var(--vp-c-brand);">--:--:--</div>
  <div id="big-date" style="font-size:20px;margin-top:12px;color:var(--vp-c-text-2);">----年--月--日 星期-</div>
  <div id="big-epoch" style="font-size:13px;margin-top:8px;color:var(--vp-c-text-3);font-family:monospace;">Unix: ---</div>
</div>

<div style="max-width:640px;margin:32px auto;">
  <h2 style="font-size:20px;">⏱️ 倒计时器</h2>
  <p style="color:var(--vp-c-text-2);font-size:14px;">设置分钟数，点击开始倒计时。</p>

  <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:16px 0;">
    <input type="number" id="timer-minutes" value="5" min="1" max="999" style="width:80px;padding:8px 12px;border-radius:8px;border:2px solid var(--vp-border-color);background:var(--vp-bg);color:var(--vp-c-text-1);font-size:15px;">
    <span style="color:var(--vp-c-text-2);">分钟</span>
    <button id="timer-start" onclick="startTimer()" style="padding:8px 24px;font-size:14px;font-weight:bold;border:none;border-radius:8px;background:var(--vp-c-brand);color:#fff;cursor:pointer;">开始</button>
    <button id="timer-stop" onclick="stopTimer()" style="padding:8px 20px;font-size:14px;border:1px solid var(--vp-border-color);border-radius:8px;background:var(--vp-bg);color:var(--vp-c-text-1);cursor:pointer;">停止</button>
  </div>

  <div id="timer-display" style="text-align:center;padding:24px;border-radius:12px;background:var(--vp-c-bg-soft);font-size:40px;font-weight:bold;font-family:'Courier New',monospace;color:var(--vp-c-brand);">
    05:00
  </div>

  <div id="timer-status" style="text-align:center;margin-top:8px;font-size:14px;color:var(--vp-c-text-3);">
    未开始
  </div>
</div>

<div style="max-width:640px;margin:32px auto;">
  <h2 style="font-size:20px;">📊 课堂时段</h2>
  <div id="period-display" style="text-align:center;padding:20px;border-radius:12px;background:var(--vp-c-bg-soft);font-size:22px;font-weight:bold;color:var(--vp-c-brand);">
    -
  </div>
  <p id="period-detail" style="text-align:center;margin-top:8px;font-size:14px;color:var(--vp-c-text-2);">-</p>
</div>

<script>
// 大时钟
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('big-clock').textContent = `${h}:${m}:${s}`;

  const days = ['日', '一', '二', '三', '四', '五', '六'];
  const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 星期${days[now.getDay()]}`;
  document.getElementById('big-date').textContent = dateStr;

  document.getElementById('big-epoch').textContent = `Unix: ${Math.floor(now.getTime() / 1000)}`;

  // 课堂时段
  updatePeriod(now);
}

setInterval(updateClock, 1000);
updateClock();

// 倒计时
let timerInterval = null;
let timerEnd = 0;

function startTimer() {
  const minutes = parseInt(document.getElementById('timer-minutes').value) || 5;
  timerEnd = Date.now() + minutes * 60 * 1000;
  document.getElementById('timer-status').textContent = '运行中...';
  document.getElementById('timer-start').textContent = '重置';

  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const remaining = timerEnd - Date.now();
    if (remaining <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      document.getElementById('timer-display').textContent = '00:00';
      document.getElementById('timer-status').textContent = '⏰ 时间到！';
      // 提示音
      playBeep();
      return;
    }
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    document.getElementById('timer-display').textContent =
      `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, 200);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    document.getElementById('timer-status').textContent = '已停止';
    document.getElementById('timer-start').textContent = '开始';
  }
}

// 提示音
function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.frequency.value = 800;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 1.5);
  } catch(e) {}
}

// 课堂时段判断
function updatePeriod(now) {
  const h = now.getHours();
  const m = now.getMinutes();
  const time = h * 60 + m;

  const periods = [
    { start: 0, end: 8*60, name: '🌙 休息时间', detail: '早点休息，明天更有精神' },
    { start: 8*60, end: 8*60+50, name: '📖 第一节', detail: '08:00 - 08:50' },
    { start: 8*60+50, end: 9*60, name: '☕ 课间休息', detail: '08:50 - 09:00' },
    { start: 9*60, end: 9*60+50, name: '📖 第二节', detail: '09:00 - 09:50' },
    { start: 9*60+50, end: 10*60+10, name: '☕ 大课间', detail: '09:50 - 10:10' },
    { start: 10*60+10, end: 11*60, name: '📖 第三节', detail: '10:10 - 11:00' },
    { start: 11*60, end: 11*60+10, name: '☕ 课间休息', detail: '11:00 - 11:10' },
    { start: 11*60+10, end: 12*60, name: '📖 第四节', detail: '11:10 - 12:00' },
    { start: 12*60, end: 14*60, name: '🍱 午休时间', detail: '12:00 - 14:00' },
    { start: 14*60, end: 14*60+50, name: '📖 第五节', detail: '14:00 - 14:50' },
    { start: 14*60+50, end: 15*60, name: '☕ 课间休息', detail: '14:50 - 15:00' },
    { start: 15*60, end: 15*60+50, name: '📖 第六节', detail: '15:00 - 15:50' },
    { start: 15*60+50, end: 17*60, name: '🏀 课外活动', detail: '15:50 - 17:00' },
    { start: 17*60, end: 22*60, name: '🏠 课后时间', detail: '复习、作业、休息' },
    { start: 22*60, end: 24*60, name: '🌙 休息时间', detail: '早点休息，明天更有精神' }
  ];

  for (const p of periods) {
    if (time >= p.start && time < p.end) {
      document.getElementById('period-display').textContent = p.name;
      document.getElementById('period-detail').textContent = p.detail;
      return;
    }
  }
}
</script>
