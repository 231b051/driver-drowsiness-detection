const session = JSON.parse(localStorage.getItem('dg_session'));
if (!session) { window.location.href = '/index.html'; }
document.getElementById('user-name').textContent = '👤 ' + session.name;

let stream = null;
let detecting = false;
let alertCount = 0;
let sessionSeconds = 0;
let timerInterval = null;
let detectInterval = null;
let closedCount = 0;
let yawnCount = 0;
let lastAlertTime = 0;

const ALERT_COOLDOWN = 8000;
const CLOSED_THRESHOLD = 3;
const YAWN_THRESHOLD = 2;

async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    const video = document.getElementById('video');
    video.srcObject = stream;
    video.style.display = 'block';
    document.getElementById('camera-placeholder').style.display = 'none';
    document.getElementById('startBtn').classList.add('hidden');
    document.getElementById('stopBtn').classList.remove('hidden');
    document.getElementById('status-dot').classList.add('active');
    document.getElementById('status-label').textContent = 'Active';
    detecting = true;
    startTimer();
    addLog('Camera started. Detection running...', 'normal');
    document.getElementById('detection-status').textContent = 'Monitoring';
    detectInterval = setInterval(sendFrameToBackend, 1500);
  } catch (err) {
    addLog('Camera access denied: ' + err.message, 'alert');
    alert('Could not access camera. Please allow camera permissions.');
  }
}

async function sendFrameToBackend() {
  const canvas = document.getElementById('canvas');
  const video = document.getElementById('video');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  const imageData = canvas.toDataURL('image/jpeg');

  try {
    const res = await fetch('https://drowsiness-backend-v2a3.onrender.com/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageData })
    });

    const data = await res.json();
    const label = data.prediction;
    const confidence = (data.confidence * 100).toFixed(1);
    document.getElementById('eye-state').textContent = label;
    const now = Date.now();

    if (label === 'NEUTRAL') {
      closedCount = 0;
      yawnCount = 0;
      document.getElementById('detection-status').textContent = '✅ Alert';
      document.getElementById('detection-status').style.color = 'var(--success)';

    } else if (label === 'CLOSED') {
      closedCount++;
      yawnCount = 0;
      document.getElementById('detection-status').textContent = `⚠️ Eyes Closing... (${closedCount}/${CLOSED_THRESHOLD})`;
      document.getElementById('detection-status').style.color = 'orange';
      if (closedCount >= CLOSED_THRESHOLD && (now - lastAlertTime) > ALERT_COOLDOWN) {
        lastAlertTime = now;
        closedCount = 0;
        triggerAlert('🚨 EYES CLOSED — PLEASE PULL OVER!');
        addLog(`🚨 Eyes Closed detected (${confidence}%)`, 'alert');
      }

    } else if (label === 'YAWN') {
      yawnCount++;
      closedCount = 0;
      document.getElementById('detection-status').textContent = `⚠️ Yawning... (${yawnCount}/${YAWN_THRESHOLD})`;
      document.getElementById('detection-status').style.color = 'orange';
      if (yawnCount >= YAWN_THRESHOLD && (now - lastAlertTime) > ALERT_COOLDOWN) {
        lastAlertTime = now;
        yawnCount = 0;
        triggerAlert('⚠️ YAWNING DETECTED — STAY ALERT!');
        addLog(`⚠️ Yawning detected (${confidence}%)`, 'alert');
      }
    }

  } catch (err) {
    addLog('❌ Backend not reachable. Is Flask running?', 'alert');
  }
}

function stopCamera() {
  if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
  const video = document.getElementById('video');
  video.style.display = 'none';
  document.getElementById('camera-placeholder').style.display = 'flex';
  document.getElementById('startBtn').classList.remove('hidden');
  document.getElementById('stopBtn').classList.add('hidden');
  document.getElementById('status-dot').classList.remove('active');
  document.getElementById('status-label').textContent = 'Inactive';
  document.getElementById('detection-status').textContent = '—';
  document.getElementById('eye-state').textContent = '—';
  detecting = false;
  clearInterval(timerInterval);
  clearInterval(detectInterval);
  addLog('Detection stopped.', 'normal');
}

function startTimer() {
  sessionSeconds = 0;
  timerInterval = setInterval(() => {
    sessionSeconds++;
    const m = String(Math.floor(sessionSeconds / 60)).padStart(2, '0');
    const s = String(sessionSeconds % 60).padStart(2, '0');
    document.getElementById('session-timer').textContent = m + ':' + s;
  }, 1000);
}

function triggerAlert(message = '⚠️ DROWSINESS DETECTED — PLEASE PULL OVER!') {
  alertCount++;
  document.getElementById('alert-count').textContent = alertCount;
  const banner = document.getElementById('alert-banner');
  banner.textContent = message;
  banner.classList.remove('hidden');
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch(e) {}
  setTimeout(() => { banner.classList.add('hidden'); }, 5000);
}

function addLog(msg, type = 'normal') {
  const log = document.getElementById('event-log');
  const placeholder = log.querySelector('.muted');
  if (placeholder) placeholder.remove();
  const li = document.createElement('li');
  li.className = 'log-item' + (type === 'alert' ? ' alert' : '');
  const time = new Date().toLocaleTimeString();
  li.textContent = `[${time}] ${msg}`;
  log.prepend(li);
  while (log.children.length > 20) {
    log.removeChild(log.lastChild);
  }
}

function logout() {
  localStorage.removeItem('dg_session');
  window.location.href = '/index.html';
}