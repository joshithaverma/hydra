const express = require('express');
const os = require('os');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));

// In-memory registry for connected surveillance drones
const droneRegistry = new Map();

app.get('/health', (_req, res) => res.json({ ok: true, service: 'AquaRescue' }));

app.get('/api/network', (_req, res) => {
  const ip = lanIPs()[0] || 'localhost';
  res.json({ ip, port: PORT, base: `http://${ip}:${PORT}` });
});

// Receive telemetry, survivor counts, and camera frames from phones/drones
app.post('/api/drone/telemetry', (req, res) => {
  const { id, battery, gps, survivorsCount, detections, frame, status } = req.body || {};
  if (!id) {
    return res.status(400).json({ error: 'Missing drone ID' });
  }

  const existing = droneRegistry.get(id) || {};
  droneRegistry.set(id, {
    id,
    battery: battery !== undefined ? battery : existing.battery ?? 88,
    gps: gps || existing.gps || { text: '12.9716° N, 77.5946° E' },
    survivorsCount: typeof survivorsCount === 'number' ? survivorsCount : (existing.survivorsCount || 0),
    detections: Array.isArray(detections) ? detections : (existing.detections || []),
    frame: frame || existing.frame || null,
    status: status || 'ACTIVE',
    lastSeen: Date.now(),
    connectedAt: existing.connectedAt || Date.now()
  });

  res.json({ ok: true, droneId: id, registeredAt: Date.now() });
});

// Get current fleet state and detections for Command Centre
app.get('/api/drone/state', (_req, res) => {
  const now = Date.now();
  const activeDrones = [];
  let totalSurvivors = 0;

  for (const [id, drone] of droneRegistry.entries()) {
    const isOnline = (now - drone.lastSeen) < 25000;
    if (isOnline) {
      activeDrones.push({ ...drone, online: true });
      totalSurvivors += (drone.survivorsCount || 0);
    } else if (now - drone.lastSeen > 60000) {
      droneRegistry.delete(id);
    } else {
      activeDrones.push({ ...drone, online: false });
    }
  }

  res.json({
    activeDrones,
    totalSurvivors,
    activeCount: activeDrones.filter(d => d.online).length,
    serverTime: now
  });
});

// Explicit node disconnection
app.post('/api/drone/disconnect', (req, res) => {
  const { id } = req.body || {};
  if (id && droneRegistry.has(id)) {
    droneRegistry.delete(id);
  }
  res.json({ ok: true });
});

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
  console.log('\nAquaRescue Command Centre is running.');
  console.log(`PC:   http://localhost:${PORT}`);
  for (const ip of lanIPs()) console.log(`PHONE: http://${ip}:${PORT}`);
  console.log('\nUse the PHONE address for the QR code when testing on a phone.\n');
});

