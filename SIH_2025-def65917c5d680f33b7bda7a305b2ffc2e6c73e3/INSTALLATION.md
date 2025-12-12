# Installation Guide — Jute Ribboning Machine

This guide walks you through setting up the complete Jute Ribboning Machine project, including the Next.js frontend, ESP32 firmware development environment, and all necessary dependencies.

## Table of Contents

- [Prerequisites](#prerequisites)
- [System Requirements](#system-requirements)
- [Installation Steps](#installation-steps)
  - [1. Install Node.js and npm](#1-install-nodejs-and-npm)
  - [2. Install Arduino IDE or PlatformIO](#2-install-arduino-ide-or-platformio)
  - [3. Clone the Repository](#3-clone-the-repository)
  - [4. Install Frontend Dependencies](#4-install-frontend-dependencies)
  - [5. Install ESP32 Board Support](#5-install-esp32-board-support)
  - [6. Install Required Libraries](#6-install-required-libraries)
- [Configuration](#configuration)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:

- A computer running Windows, macOS, or Linux
- Internet connection for downloading dependencies
- ESP32 development board (DevKit or compatible)
- USB cable for ESP32 programming
- Administrator/sudo access for installing software

## System Requirements

### Minimum Requirements

- **OS**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **RAM**: 4 GB (8 GB recommended)
- **Storage**: 2 GB free space
- **USB Port**: For ESP32 connection

### Software Versions

- **Node.js**: v18.x or higher (v20.x recommended)
- **npm**: v9.x or higher (comes with Node.js)
- **Arduino IDE**: 2.x (if not using PlatformIO)
- **PlatformIO**: 6.x (if not using Arduino IDE)
- **Python**: 3.8+ (required for PlatformIO)

---

## Installation Steps

### 1. Install Node.js and npm

The frontend requires Node.js and npm.

#### Windows

1. Download the Node.js installer from [nodejs.org](https://nodejs.org/)
2. Run the installer (choose LTS version)
3. Verify installation:

```powershell
node --version
npm --version
```

#### macOS

Using Homebrew:

```bash
brew install node
```

Or download from [nodejs.org](https://nodejs.org/)

Verify:

```bash
node --version
npm --version
```

#### Linux (Ubuntu/Debian)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify:

```bash
node --version
npm --version
```

---

### 2. Install Arduino IDE or PlatformIO

Choose **one** of the following options for ESP32 development:

#### Option A: Arduino IDE (Recommended for beginners)

1. Download Arduino IDE 2.x from [arduino.cc](https://www.arduino.cc/en/software)
2. Install the application
3. Launch Arduino IDE

#### Option B: PlatformIO (Recommended for advanced users)

PlatformIO can be used via VS Code extension or CLI.

**Via VS Code Extension:**

1. Install [Visual Studio Code](https://code.visualstudio.com/)
2. Open VS Code
3. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
4. Search for "PlatformIO IDE"
5. Click Install

**Via CLI (requires Python):**

```powershell
# Windows (PowerShell)
pip install platformio

# macOS/Linux
pip3 install platformio
```

Verify:

```powershell
platformio --version
```

---

### 3. Clone the Repository

Clone the project repository to your local machine:

```powershell
# Navigate to your projects directory
cd C:\Users\<YourUsername>\Desktop  # Windows
# or
cd ~/Desktop  # macOS/Linux

# Clone the repository (replace with your actual repo URL)
git clone https://github.com/Rajarshi44/SIH_2025-backup.git
cd SIH_2025-backup\SIH_2025-def65917c5d680f33b7bda7a305b2ffc2e6c73e3
```

If you don't have Git installed:

- **Windows**: Download from [git-scm.com](https://git-scm.com/)
- **macOS**: `brew install git`
- **Linux**: `sudo apt-get install git`

---

### 4. Install Frontend Dependencies

Navigate to the frontend directory and install Node.js dependencies:

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# This will install all packages listed in package.json
# Installation may take 2-5 minutes depending on your connection
```

**Expected output**: You should see a progress bar and eventually a message indicating successful installation.

---

### 5. Install ESP32 Board Support

#### If using Arduino IDE:

1. Open Arduino IDE
2. Go to **File → Preferences**
3. In "Additional Board Manager URLs", add:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
4. Click **OK**
5. Go to **Tools → Board → Boards Manager**
6. Search for "esp32"
7. Install "esp32 by Espressif Systems" (version 2.x or later)
8. Wait for installation to complete

#### If using PlatformIO:

Board support is installed automatically when you first build the project. The `platformio.ini` file in the `Sih_backup` folder specifies the ESP32 board configuration.

---

### 6. Install Required Libraries

#### If using Arduino IDE:

The project requires the following libraries. Install them via **Tools → Manage Libraries**:

1. **WebSockets by Markus Sattler** (for WebSocket client)
2. **ArduinoJson** (for JSON parsing)
3. **WiFi** (built-in with ESP32 board support)

For each library:
1. Go to **Tools → Manage Libraries**
2. Search for the library name
3. Click **Install**

#### If using PlatformIO:

Libraries are automatically installed based on `platformio.ini` configuration. No manual action needed.

---

## Configuration

### Frontend Configuration

1. **Environment Variables** (if needed):

Create a `.env.local` file in the `frontend/` directory:

```bash
# frontend/.env.local
NEXT_PUBLIC_WS_PORT=3001
NEXT_PUBLIC_WS_HOST=localhost
```

2. **Custom Server Settings**:

Check `frontend/server.js` and `frontend/server/websocket.ts` for WebSocket server configuration.

### ESP32 Firmware Configuration

1. **Open the sketch** you want to use:
   - `esp32_websocket_client.ino` (for WebSocket-based control)
   - `sih.ino` (main machine control)
   - `led_test.ino` (for testing)

2. **Update Wi-Fi credentials**:

```cpp
// In your .ino file, find and update:
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
```

3. **Update WebSocket server address**:

```cpp
// Find and update the server address
const char* websocket_server = "ws://192.168.1.100:3001";
// Replace 192.168.1.100 with your computer's LAN IP address
```

To find your computer's IP address:

**Windows:**
```powershell
ipconfig
# Look for "IPv4 Address" under your active network adapter
```

**macOS/Linux:**
```bash
ifconfig  # or: ip addr show
# Look for inet address on your active network interface
```

---

## Verification

### Verify Frontend Installation

1. Start the frontend dev server:

```powershell
cd frontend
npm run dev
```

2. You should see output like:
```
> dev
> node server.js

Server running on http://localhost:3000
WebSocket server on port 3001
```

3. Open your browser to `http://localhost:3000`
4. You should see the dashboard interface

### Verify ESP32 Setup

#### Arduino IDE:

1. Connect ESP32 via USB
2. Select board: **Tools → Board → ESP32 Arduino → ESP32 Dev Module**
3. Select port: **Tools → Port → COM3** (or your ESP32's port)
4. Open `led_test.ino`
5. Click **Upload** (right arrow button)
6. Check the Serial Monitor (Ctrl+Shift+M) for output

#### PlatformIO:

1. Connect ESP32 via USB
2. Open the `Sih_backup` folder in VS Code
3. Click the PlatformIO icon in the sidebar
4. Click **Upload** under "Project Tasks"
5. Open Serial Monitor to see output

### Verify WebSocket Connection

1. **Start the frontend** (see above)
2. **Flash and run** the ESP32 firmware with WebSocket client code
3. **Check the Serial Monitor**: You should see:
   ```
   Connected to WiFi
   IP address: 192.168.1.xxx
   Connecting to WebSocket...
   WebSocket Connected!
   ```
4. **Check the frontend terminal**: You should see:
   ```
   Device connected: <device-id>
   ```

---

## Troubleshooting

### Node.js / Frontend Issues

**Problem**: `npm install` fails with permission errors

**Solution (Windows)**:
```powershell
# Run PowerShell as Administrator
npm install
```

**Solution (macOS/Linux)**:
```bash
# Don't use sudo with npm; instead fix npm permissions:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

**Problem**: Port 3000 or 3001 already in use

**Solution**:
```powershell
# Windows: Find and kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

---

### ESP32 / Firmware Issues

**Problem**: ESP32 not detected (no COM port)

**Solutions**:
1. Install USB-to-Serial drivers:
   - **CP210x**: [Silicon Labs](https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers)
   - **CH340**: [Search "CH340 driver" for your OS]
2. Try a different USB cable (must be data cable, not charge-only)
3. Try a different USB port

**Problem**: Upload fails / "A fatal error occurred: Failed to connect"

**Solutions**:
1. Hold the **BOOT** button on ESP32 while clicking Upload
2. Reduce upload speed: **Tools → Upload Speed → 115200**
3. Check that correct COM port is selected

**Problem**: ESP32 connects to Wi-Fi but not WebSocket

**Solutions**:
1. Verify your computer's firewall allows incoming connections on port 3001
2. Ensure ESP32 and computer are on the same network
3. Use your computer's **LAN IP** (not localhost) in ESP32 code
4. Ping your computer from another device to verify network connectivity

**Problem**: Compilation errors

**Solutions**:
1. Ensure ESP32 board support is installed (see step 5)
2. Install missing libraries (see step 6)
3. Update Arduino IDE / PlatformIO to latest version
4. Check for syntax errors in your modifications

---

### Python / PlatformIO Issues

**Problem**: `platformio: command not found`

**Solution**:
```powershell
# Windows: Add Python Scripts to PATH
# Add: C:\Users\<YourUsername>\AppData\Local\Programs\Python\Python3x\Scripts

# macOS/Linux: Add to shell profile
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

**Problem**: Python version incompatible

**Solution**:
```powershell
# Install Python 3.8 or higher from python.org
python --version  # Should be 3.8+
```

---

## Next Steps

After successful installation:

1. Read the main [README.md](./README.md) for project overview
2. Check [QUICK_START.md](./QUICK_START.md) for usage instructions
3. Review firmware code in `.ino` files to understand pin mappings
4. Customize the frontend dashboard in `frontend/src/app/dashboard/`

---

## Getting Help

If you encounter issues not covered in this guide:

1. Check the [GitHub Issues](https://github.com/Rajarshi44/SIH_2025-backup/issues)
2. Review the project documentation files:
   - `BACKEND_IMPLEMENTATION_COMPLETE.md`
   - `ESP32_SETUP_GUIDE.md`
   - `DIRECTION_CONTROL_UPDATE.md`
3. Open a new issue with:
   - Your OS and versions (Node, Arduino IDE/PlatformIO)
   - Complete error messages
   - Steps to reproduce

---

## Optional Tools

### Recommended VS Code Extensions

- **PlatformIO IDE**: ESP32 development
- **Arduino**: Arduino sketch support
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **GitLens**: Git visualization

### Recommended Hardware Tools

- **Logic Analyzer**: For debugging I2C/SPI/UART
- **Multimeter**: For voltage/continuity checks
- **USB-to-Serial Adapter**: For debugging without full ESP32
- **Breadboard & Jumpers**: For prototyping

---

**Installation Complete!** 🎉

You're now ready to develop and run the Jute Ribboning Machine project.
