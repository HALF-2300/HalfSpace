# Quick helper to install common dev tools on Windows for this project.
# Run from PowerShell (as user with package manager access).

# Faster package manager (optional, after Node is installed)
Write-Host "Installing pnpm globally..."
npm install -g pnpm

# WebGL asset tooling: glTF-Transform CLI
Write-Host "Installing glTF-Transform CLI..."
npm install -g @gltf-transform/cli

# Texture pipeline: sharp CLI
Write-Host "Installing sharp CLI..."
npm install -g sharp-cli

# GitHub CLI for PRs/issues
Write-Host "Installing GitHub CLI via winget..."
winget install --id GitHub.cli -e

Write-Host "Done. Optional: install nvm-windows or Volta to pin Node versions; these require separate installers."
