echo -e "\nStarting post create command script..."
echo "Dev machine:"
uname -a
echo -e "\nInstalling NVM"
if [ -d "${NVM_DIR}" ]; then
    ${NVM_DIR}/nvm.sh && nvm install --lts
else
    echo "Error: NVM_DIR directory not found" && exit 1
fi
echo -e "\nInstalling pnpm & dependencies...\n"
if [ -f yarn.lock ]; then
    yarn --frozen-lockfile
elif [ -f package-lock.json ]; then
    npm ci
elif [ -f pnpm-lock.yaml ]; then
    npm install -g pnpm && pnpm i
elif [ -f bun.lockb ] || [ -f bun.lock ]; then
    bun install
# Allow install without lockfile, so example works even without Node.js installed locally
else
    echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && npm install -g pnpm && pnpm i
fi
echo -e "\nInstalling watchman...\n"
sudo apt update
sudo apt install watchman
watchman version

echo -e "\n*******************************"
echo -e "\nDev container ready!".
echo -e "\n*******************************\n"
