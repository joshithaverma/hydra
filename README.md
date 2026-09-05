# AquaRescue Command Centre (HYDRA)

Autonomous & Rapid Search, Rescue and Surveillance Operations Management Platform.

## Features
- **Real-Time Command Centre**: Mission monitoring, live drone feeds, telemetry, thermal vision, and search grid mapping.
- **Surveillance Drone Link**: Easily connect field devices and drones via LAN-based QR connection.
- **Automated Rescue Routing**: SOS beacon detection, survivor triage, and beacon tracking.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or newer recommended)

### Installation
```bash
npm install
```

### Running Locally
```bash
npm start
```
Or simply double-click `START_AQUARESCUE.bat` on Windows.

### Access
- **Local PC**: `http://localhost:3000`
- **Phone / Remote Drone Link**: `http://<LAN-IP>:3000/#drone=S1` (displayed in the server terminal and in the QR connection modal).
