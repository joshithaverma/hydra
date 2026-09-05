AQUARESCUE — FIXED QR CONNECTION

IMPORTANT: DO NOT double-click public\index.html.
That opens a file:// page. A phone cannot connect to a file on the PC, which is why the QR area previously showed SERVER REQUIRED.

EASIEST WINDOWS TEST:
1. Install Node.js if it is not already installed.
2. Double-click START_AQUARESCUE.bat.
3. Wait for the Command Centre to open at http://localhost:3000.
4. Click CONNECT SURVEILLANCE DRONE.
5. A real QR image will now appear.
6. Scan it with the phone.

The QR uses the PC's LAN address (for example http://192.168.1.5:3000/#drone=S1), not localhost.

PC and phone must be on the same Wi-Fi/LAN. If Windows asks about Node.js Firewall access, allow it on Private networks.

The QR image itself is generated through a QR image service so the browser no longer depends on the qrcodejs CDN. The AquaRescue website remains a single website; the #drone=S1/#drone=S2 URL selects the surveillance-node mode.
