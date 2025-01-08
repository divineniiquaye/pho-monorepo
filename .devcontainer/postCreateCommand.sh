echo -e "\nStarting post create command script..."
echo "Dev machine:"
uname -a
echo -e "\nInstalling pnpm & dependencies...\n"
npm install -g pnpm @expo/ngrok@^4.1.0
pnpm install
echo -e "\nInstalling watchman...\n"
sudo apt update
sudo apt install watchman
watchman version

echo -e "\n*******************************"
echo -e "\nDev container ready!".
echo -e "\n*******************************\n"
