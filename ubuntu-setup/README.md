# Ubuntu Setup for Cardboard Garden

This directory contains everything you need to replicate your Windows development environment on Ubuntu.

## Quick Setup

1. **Install Ubuntu** (VM or dual boot)
2. **Install VS Code** from official website or snap:
   ```bash
   sudo snap install code --classic
   ```
3. **Run the setup script**:
   ```bash
   chmod +x ubuntu-setup/setup.sh
   ./ubuntu-setup/setup.sh
   ```
4. **Logout and login** (for Docker permissions)
5. **Test Docker**:
   ```bash
   docker --version
   docker-compose --version
   ```

## What Gets Installed

- **Docker CE** - Native Docker (no VirtualBox needed!)
- **Node.js 20** - For future API development
- **All VS Code extensions** - Exact same setup as Windows
- **Essential tools** - git, curl, build tools

## After Setup

Your first commands in the project:
```bash
git clone <your-repo>
cd cardboard-garden
docker-compose up -d mysql
```

Your Magic-focused database will be running perfectly! 🐧🐋

## VS Code Settings

The SQLTools connections in `.vscode/settings.json` will work exactly the same:
- Cardboard Garden MySQL (tcg_shared database)
- Magic Database (tcg_magic database)

Everything transfers seamlessly to Ubuntu!
