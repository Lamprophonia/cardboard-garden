#!/bin/bash
# Ubuntu Environment Setup for Cardboard Garden
# Run this script after installing Ubuntu and VS Code

echo "🐧 Setting up Cardboard Garden development environment on Ubuntu..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential tools
echo "🛠️ Installing essential tools..."
sudo apt install -y curl wget git vim build-essential

# Install Docker
echo "🐋 Installing Docker..."
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER

# Install Node.js (for future API development)
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install VS Code extensions
echo "🔌 Installing VS Code extensions..."
if command -v code &> /dev/null; then
    echo "Installing extensions from extensions.txt..."
    while read extension; do
        code --install-extension $extension
    done < ubuntu-setup/extensions.txt
else
    echo "⚠️ VS Code not found. Install VS Code first, then run:"
    echo "cat ubuntu-setup/extensions.txt | xargs -L 1 code --install-extension"
fi

echo "✅ Setup complete!"
echo ""
echo "🚀 Next steps:"
echo "1. Logout and login (for Docker group changes)"
echo "2. Clone your repository: git clone <your-repo-url>"
echo "3. Run: docker-compose up -d mysql"
echo "4. Your Magic database will be ready!"
