# 🚀 Quick Start Guide

## To Start the Website:

### ⭐ Option 1: Background Server (RECOMMENDED - Stays Running!)
- Double-click **START-SERVER-BACKGROUND.bat** in this folder
- The server will run in the background and **stay running** even if you:
  - Close the terminal window
  - Close your laptop lid
  - Log out of Windows
- To stop it: Double-click **STOP-SERVER-BACKGROUND.bat**
- To view logs: Double-click **VIEW-SERVER-LOGS.bat**
- To check status: Double-click **SERVER-STATUS.bat**

### Option 2: Regular Server (Terminal Window)
- Double-click **START-SERVER.bat** in this folder
- Wait for "Ready" message
- Open the browser to the **URL printed in the terminal** (default: `http://localhost:9200`)
- ⚠️ **Note:** Server stops if you close the terminal window

### Option 3: LAN Access (Same Wi‑Fi)
- Double-click **START-SERVER-LAN.bat**
- It will print a URL like `http://192.168.x.x:9200` — open that on your phone
- Your phone must be on the **same Wi‑Fi** as the PC
- If Windows Firewall prompts you, allow access on **Private networks**
- ⚠️ **Note:** Server stops if you close the terminal window

### Option 4: Manual Command
Open PowerShell or Command Prompt in this folder and run:
```
npm run dev
```

**IMPORTANT:** The dev server will automatically find an available port starting from 9200. 
- Check the terminal output for the exact URL (e.g., `http://localhost:9200` or `http://localhost:9201` if 9200 is busy)
- **Always use the URL shown in the terminal** - do not assume the port number
- The script will print: `Open: http://localhost:XXXX` - use that exact URL

## Why Regular Server "goes down" after you leave
- If you close the terminal/CMD window that started it, the server stops.
- If your PC sleeps (or you close the laptop lid), the server stops.
- `http://localhost:XXXX` only works on the SAME PC — other devices must use the PC's IP (use **START-SERVER-LAN.bat**).

**💡 Solution:** Use **START-SERVER-BACKGROUND.bat** instead! It runs the server in the background using PM2, so it stays running even after you close the terminal.

## Project Location:
**C:\Users\abesa\OneDrive\Desktop\Space**

## What You'll See:
1. **Immersive Entry Sequence** - Full-screen cinematic intro (first visit only)
2. **Homepage** - Beautiful space-themed homepage with portals
3. **60+ Pages** - All accessible through the navigation menu

## All Files Are Here:
✅ All 60+ pages created
✅ Immersive entry component
✅ Interactive components (Quiz, Timeline, FactCards)
✅ Beautiful design with animations
✅ Year updated to 2026

## If Server Won't Start:
1. Make sure you're in the correct folder
2. Run: `npm install` (if needed)
3. Check if port 9200 is available
4. Try a different port if needed

---

**Everything is ready! Just start the server and enjoy exploring space!** 🌌

