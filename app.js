const el = id => document.getElementById(id);
const state = {
  watching: false,
  watchId: null,
  startedAt: null,
  timerId: null,
  lastPos: null,
  distanceM: 0,
  maxMps: 0,
  units: localStorage.getItem('units') || 'kmh',
  theme: localStorage.getItem('theme') || 'sport',
  wakeLock: null
};

function speedFactor() { return state.units === 'mph' ? 2.236936 : 3.6; }
function unitLabel() { return state.units === 'mph' ? 'mph' : 'km/h'; }
function distanceLabel(m) { return state.units === 'mph' ? `${(m / 1609.344).toFixed(2)} mi` : `${(m / 1000).toFixed(2)} km`; }
function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  const h = String(Math.floor(s / 3600)).padStart(2, '0');
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const sec = String(s % 60).padStart(2, '0');
  return `${h}:${m}:${sec}`;
}
function haversine(a, b) {
  const R = 6371000;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(b.coords.latitude - a.coords.latitude);
  const dLon = toRad(b.coords.longitude - a.coords.longitude);
  const lat1 = toRad(a.coords.latitude);
  const lat2 = toRad(b.coords.latitude);
  const x = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
}
function directionFromDegrees(deg) {
  if (deg == null || Number.isNaN(deg)) return '--';
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}
function renderClock() {
  const now = new Date();
  el('clock').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function renderTrip() {
  const elapsed = state.startedAt ? Date.now() - state.startedAt : 0;
  el('tripTime').textContent = formatTime(elapsed);
  el('tripDistance').textContent = distanceLabel(state.distanceM);
  el('maxSpeed').textContent = `${Math.round(state.maxMps * speedFactor())} ${unitLabel()}`;
  const avgMps = elapsed > 0 ? state.distanceM / (elapsed / 1000) : 0;
  el('avgSpeed').textContent = `${Math.round(avgMps * speedFactor())} ${unitLabel()}`;
  el('unit').textContent = unitLabel();
}
function onPosition(pos) {
  const mps = Math.max(0, pos.coords.speed || 0);
  state.maxMps = Math.max(state.maxMps, mps);
  el('speed').textContent = Math.round(mps * speedFactor());
  el('gpsStatus').textContent = 'GPS active';
  el('accuracy').textContent = `Accuracy ${Math.round(pos.coords.accuracy)} m`;
  if (state.lastPos && pos.coords.accuracy < 80) {
    const d = haversine(state.lastPos, pos);
    if (d < 500) state.distanceM += d;
  }
  state.lastPos = pos;
  if (pos.coords.heading != null && !Number.isNaN(pos.coords.heading)) updateHeading(pos.coords.heading);
  renderTrip();
}
function updateHeading(deg) {
  const rounded = Math.round((deg + 360) % 360);
  el('heading').textContent = `${rounded}°`;
  el('direction').textContent = directionFromDegrees(rounded);
  el('needle').style.transform = `rotate(${rounded}deg)`;
}
function startDrive() {
  if (!('geolocation' in navigator)) return alert('GPS is not available in this browser.');
  if (!state.startedAt) state.startedAt = Date.now();
  if (state.watching) return;
  state.watchId = navigator.geolocation.watchPosition(onPosition, err => {
    el('gpsStatus').textContent = err.message || 'GPS error';
  }, { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 });
  state.timerId = setInterval(renderTrip, 1000);
  state.watching = true;
}
function stopDrive() {
  if (state.watchId) navigator.geolocation.clearWatch(state.watchId);
  if (state.timerId) clearInterval(state.timerId);
  state.watchId = null;
  state.timerId = null;
  state.watching = false;
  el('gpsStatus').textContent = 'GPS paused';
}
function resetDrive() {
  stopDrive();
  Object.assign(state, { startedAt: null, lastPos: null, distanceM: 0, maxMps: 0 });
  el('speed').textContent = '--';
  renderTrip();
}
async function toggleWakeLock() {
  try {
    if (state.wakeLock) {
      await state.wakeLock.release();
      state.wakeLock = null;
      el('wakeLockBtn').textContent = 'Screen On';
      return;
    }
    if ('wakeLock' in navigator) {
      state.wakeLock = await navigator.wakeLock.request('screen');
      el('wakeLockBtn').textContent = 'Screen Locked';
    } else {
      alert('Screen Wake Lock is not supported here. Use iPhone Settings > Display > Auto-Lock as fallback.');
    }
  } catch (e) { alert('Wake Lock unavailable in this browser.'); }
}
function initBattery() {
  if (!navigator.getBattery) return;
  navigator.getBattery().then(b => {
    const render = () => el('battery').textContent = `${Math.round(b.level * 100)}%`;
    render();
    b.addEventListener('levelchange', render);
  });
}
function initCompass() {
  if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
    document.body.addEventListener('click', async () => {
      try { await DeviceOrientationEvent.requestPermission(); } catch {}
    }, { once: true });
  }
  window.addEventListener('deviceorientationabsolute', e => { if (e.alpha != null) updateHeading(360 - e.alpha); });
  window.addEventListener('deviceorientation', e => { if (e.webkitCompassHeading != null) updateHeading(e.webkitCompassHeading); });
}
function openSpotify() {
  const fallback = setTimeout(() => { window.location.href = 'https://open.spotify.com/'; }, 900);
  window.addEventListener('pagehide', () => clearTimeout(fallback), { once: true });
  window.location.href = 'spotify://';
}
function applySettings() {
  el('unitsSelect').value = state.units;
  el('themeSelect').value = state.theme;
  document.body.className = state.theme;
  renderTrip();
}

el('startBtn').addEventListener('click', startDrive);
el('stopBtn').addEventListener('click', stopDrive);
el('resetBtn').addEventListener('click', resetDrive);
el('soundBtn').addEventListener('click', () => el('startupAudio').play());
el('wakeLockBtn').addEventListener('click', toggleWakeLock);
el('spotifyBtn').addEventListener('click', openSpotify);
el('spotifyTopBtn').addEventListener('click', openSpotify);
el('unitsSelect').addEventListener('change', e => { state.units = e.target.value; localStorage.setItem('units', state.units); renderTrip(); });
el('themeSelect').addEventListener('change', e => { state.theme = e.target.value; localStorage.setItem('theme', state.theme); applySettings(); });

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
setInterval(renderClock, 1000);
renderClock(); applySettings(); initBattery(); initCompass(); renderTrip();
