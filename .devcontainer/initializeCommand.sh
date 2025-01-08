#!/bin/bash
echo "Gathering your IP for dev container"

# Try to find the first active network interface
if command -v ip >/dev/null 2>&1; then
    iname=$(ip -o link show up | grep -v "lo:" | awk '{print $2}' | cut -d: -f1 | head -n1)
elif command -v ifconfig >/dev/null 2>&1; then
    iname=$(ifconfig | grep -E "^[a-z]" | grep -v "lo" | cut -d: -f1 | head -n1)
else
    echo "Error: Neither 'ip' nor 'ifconfig' command found"
    exit 0
fi

# Get IP address using available command
if command -v ip >/dev/null 2>&1; then
    ip=$(ip -4 addr show $iname | grep -oP '(?<=inet\s)\d+(\.\d+){3}')
elif command -v ifconfig >/dev/null 2>&1; then
    ip=$(ifconfig $iname | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*')
fi

if [ -z "$ip" ]; then
    echo "Error: Could not determine IP address"
    exit 0
fi

echo "REACT_NATIVE_PACKAGER_HOSTNAME=$ip" > .devcontainer/.env
