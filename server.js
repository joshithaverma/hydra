const express = require('express');
const os = require('os');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));
app.get('/health', (_req,res)=>res.json({ok:true, service:'AquaRescue'}));

app.get('/api/network', (_req,res)=>{
  const ip = lanIPs()[0] || 'localhost';
  res.json({ ip, port: PORT, base: `http://${ip}:${PORT}` });
});

function lanIPs(){
  const out=[];
  for(const list of Object.values(os.networkInterfaces())) for(const n of (list||[]))
    if(n.family==='IPv4' && !n.internal) out.push(n.address);
  return [...new Set(out)];
}
app.listen(PORT,'0.0.0.0',()=>{
  console.log('\nAquaRescue Command Centre is running.');
  console.log(`PC:   http://localhost:${PORT}`);
  for(const ip of lanIPs()) console.log(`PHONE: http://${ip}:${PORT}`);
  console.log('\nUse the PHONE address for the QR code when testing on a phone.\n');
});
