const express = require('express');
const os = require('os');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));

// In-memory registry for connected civilian streams & phone nodes
const civilianRegistry = new Map();

app.get('/health', (_req, res) => res.json({ ok: true, service: 'AquaRescue' }));

app.get('/api/network', (_req, res) => {
  const ip = lanIPs()[0] || 'localhost';
  res.json({ ip, port: PORT, base: `http://${ip}:${PORT}` });
});

// Receive telemetry, survivor/civilian counts, and camera frames from civilian phones
function handleCivilianTelemetry(req, res) {
  const { id, battery, gps, survivorsCount, detections, frame, status } = req.body || {};
  const nodeId = id || 'C1';

  const existing = civilianRegistry.get(nodeId) || {};
  civilianRegistry.set(nodeId, {
    id: nodeId,
    battery: battery !== undefined ? battery : existing.battery ?? 90,
    gps: gps || existing.gps || { text: '12.9716° N, 77.5946° E' },
    survivorsCount: typeof survivorsCount === 'number' ? survivorsCount : (existing.survivorsCount || 0),
    detections: Array.isArray(detections) ? detections : (existing.detections || []),
    frame: frame || existing.frame || null,
    status: status || 'ACTIVE',
    lastSeen: Date.now(),
    connectedAt: existing.connectedAt || Date.now()
  });

  res.json({ ok: true, civilianId: nodeId, registeredAt: Date.now() });
}

app.post('/api/civilian/telemetry', handleCivilianTelemetry);
app.post('/api/drone/telemetry', handleCivilianTelemetry);

// Get current civilian stream state and detections for Command Centre
function handleCivilianState(_req, res) {
  const now = Date.now();
  const activeCivilians = [];
  let totalSurvivors = 0;

  for (const [id, node] of civilianRegistry.entries()) {
    const isOnline = (now - node.lastSeen) < 25000;
    if (isOnline) {
      activeCivilians.push({ ...node, online: true });
      totalSurvivors += (node.survivorsCount || 0);
    } else if (now - node.lastSeen > 60000) {
      civilianRegistry.delete(id);
    } else {
      activeCivilians.push({ ...node, online: false });
    }
  }

  res.json({
    activeCivilians,
    activeDrones: activeCivilians, // alias for frontend backward compatibility
    totalSurvivors,
    activeCount: activeCivilians.filter(c => c.online).length,
    serverTime: now
  });
}

app.get('/api/civilian/state', handleCivilianState);
app.get('/api/drone/state', handleCivilianState);

// Explicit node disconnection
function handleDisconnect(req, res) {
  const { id } = req.body || {};
  if (id && civilianRegistry.has(id)) {
    civilianRegistry.delete(id);
  }
  res.json({ ok: true });
}

app.post('/api/civilian/disconnect', handleDisconnect);
app.post('/api/drone/disconnect', handleDisconnect);

function lanIPs() {
  const out = [];
  for (const list of Object.values(os.networkInterfaces())) {
    for (const n of (list || [])) {
      if (n.family === 'IPv4' && !n.internal) out.push(n.address);
    }
  }
  return [...new Set(out)];
}

app.listen(PORT, '0.0.0.0', () => {
  console.log('\nAquaRescue Civilian Telecast & Command Centre is running.');
  console.log(`PC:   http://localhost:${PORT}`);
  for (const ip of lanIPs()) console.log(`CIVILIAN LINK: http://${ip}:${PORT}`);
  console.log('\nUse the CIVILIAN LINK address for the QR code when testing on mobile devices.\n');
});


