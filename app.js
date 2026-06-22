const el = id => document.getElementById(id);
let maxSpeed = 0, totalSpeed = 0, speedSamples = 0, tripKm = 0, lastPos = null;
function updateClock(){ el('clock').textContent = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); }
setInterval(updateClock,1000); updateClock();
function kmhFromMps(mps){ return Math.max(0, Math.round((mps || 0) * 3.6)); }
function distanceKm(a,b){ const R=6371; const dLat=(b.lat-a.lat)*Math.PI/180; const dLon=(b.lon-a.lon)*Math.PI/180; const lat1=a.lat*Math.PI/180; const lat2=b.lat*Math.PI/180; const x=Math.sin(dLat/2)**2+Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2; return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x)); }
function setSpeedArc(speed){ const max=220; const dash=603; const pct=Math.min(speed/max,1); el('speedArc').style.strokeDashoffset = dash - (dash * pct * .75); el('speedArc').style.stroke = speed > 130 ? '#00b7ff' : '#00ff8a'; }
function updateStats(speed){ el('speed').textContent=speed; maxSpeed=Math.max(maxSpeed,speed); if(speed>1){ totalSpeed+=speed; speedSamples++; } el('maxSpeed').textContent=Math.round(maxSpeed); el('avgSpeed').textContent=speedSamples?Math.round(totalSpeed/speedSamples):0; el('tripDistance').textContent=tripKm.toFixed(2); setSpeedArc(speed); }
function bearingToCompass(deg){ if(deg==null || Number.isNaN(deg)) return '---'; const dirs=['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']; return dirs[Math.round(deg/22.5)%16]; }
if('geolocation' in navigator){ navigator.geolocation.watchPosition(pos=>{ el('gpsStatus').textContent='GPS ACTIVE'; const speed=kmhFromMps(pos.coords.speed); updateStats(speed); el('compass').textContent=bearingToCompass(pos.coords.heading); const current={lat:pos.coords.latitude, lon:pos.coords.longitude}; if(lastPos){ const d=distanceKm(lastPos,current); if(d<1) tripKm += d; } lastPos=current; },()=>{ el('gpsStatus').textContent='GPS UNAVAILABLE'; },{enableHighAccuracy:true, maximumAge:1000, timeout:10000}); } else { el('gpsStatus').textContent='GPS NOT SUPPORTED'; }
function openSpotify(){ location.href='spotify://'; setTimeout(()=>{ location.href='https://open.spotify.com'; },700); }
function openWaze(){ location.href='waze://'; setTimeout(()=>{ location.href='https://waze.com/ul'; },700); }
function openPhone(){ location.href='tel:'; }
function openMaps(){ location.href='maps://'; setTimeout(()=>{ location.href='https://maps.apple.com'; },700); }
