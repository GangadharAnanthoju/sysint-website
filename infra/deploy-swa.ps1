# =========================================
# SysInt Inc — Deploy to Azure Static Web Apps
# =========================================
# Prerequisites:
#   1. Azure CLI installed → https://aka.ms/installazurecli
#   2. SWA CLI installed  → npm install -g @azure/static-web-apps-cli
#   3. Logged in          → az login
#
# Usage (first time):
#   .\infra\deploy-swa.ps1 -ResourceGroup "rg-sysint-website-eus2" -AppName "sysint-website-eus2" -Location "eastus2"
#
# Usage (redeploy with token):
#   .\infra\deploy-swa.ps1 -DeployToken "your-deployment-token"
# =========================================

param(
  [string]$ResourceGroup  = "rg-sysint-website-eus2",
  [string]$AppName        = "sysint-website-eus2",
  [string]$Location       = "eastus2",
  [string]$DeployToken    = "",
  [string]$SourcePath     = "$PSScriptRoot\..\site"
)

$ErrorActionPreference = "Stop"

Write-Host "`nSysInt Inc — Azure Static Web Apps Deploy" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# ---- Step 1: Create Resource Group + SWA (first deploy only) ----
if (-not $DeployToken) {
  Write-Host "`n[1/3] Creating Resource Group: $ResourceGroup..." -ForegroundColor Yellow
  az group create --name $ResourceGroup --location $Location --output none

  Write-Host "`n[2/3] Creating Static Web App..." -ForegroundColor Yellow
  $result = az staticwebapp create `
    --name $AppName `
    --resource-group $ResourceGroup `
    --location $Location `
    --sku Free `
    --output json | ConvertFrom-Json

  $DeployToken = az staticwebapp secrets list `
    --name $AppName `
    --resource-group $ResourceGroup `
    --query "properties.apiKey" --output tsv

  Write-Host "`nStatic Web App created!" -ForegroundColor Green
  Write-Host "Default URL: https://$($result.defaultHostname)" -ForegroundColor Yellow
  Write-Host "Save this deployment token for future deploys:" -ForegroundColor Cyan
  Write-Host $DeployToken -ForegroundColor White
}

# ---- Step 2: Stage files (exclude .git, backup, infra) ----
Write-Host "`n[3/3] Staging and deploying site..." -ForegroundColor Yellow

$stage = "$env:TEMP\sysint-deploy"
Remove-Item -Recurse -Force $stage -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $stage | Out-Null

Copy-Item "$SourcePath\*.html" $stage
Copy-Item "$SourcePath\*.css"  $stage -ErrorAction SilentlyContinue
Copy-Item "$SourcePath\*.js"   $stage -ErrorAction SilentlyContinue
Copy-Item "$SourcePath\*.json" $stage
Copy-Item "$SourcePath\logos"  $stage -Recurse -ErrorAction SilentlyContinue
Copy-Item "$SourcePath\assets" $stage -Recurse

swa deploy $stage --deployment-token $DeployToken --env production

Write-Host "`nDeploy complete!" -ForegroundColor Green
