# =========================================
# SysInt Website Agent — Deploy to Azure Container Apps
# =========================================
# Shared infra (already exists):
#   ACR:         acrsysintcommoneus
#   ACA Env:     aca-env-sysint-eus  (rg-sysint-common-eus)
#   Key Vault:   kv-sysint-common-eus
#
# Usage (first time):
#   .\infra\deploy-agent.ps1
#
# Usage (redeploy after code change):
#   .\infra\deploy-agent.ps1 -Redeploy -RevisionSuffix "v2"
# =========================================

param(
  [string]$ResourceGroup   = "rg-sysint-website-eus2",
  [string]$AppName         = "sysint-website-agent",
  [string]$AcrName         = "acrsysintcommoneus",
  [string]$AcaEnv          = "aca-env-sysint-eus",
  [string]$AcaEnvRg        = "rg-sysint-common-eus",
  [string]$KeyVault        = "kv-sysint-common-eus",
  [string]$ImageName       = "sysint-website-agent",
  [string]$RevisionSuffix  = "v1",
  [switch]$Redeploy
)

$ErrorActionPreference = "Stop"
$Image = "$AcrName.azurecr.io/${ImageName}:latest"
$AgentDir = "$PSScriptRoot\..\agent"

Write-Host "`nSysInt Website Agent — Azure Container Apps Deploy" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

# ---- Step 1: Build image in ACR (no Docker needed locally) ----
Write-Host "`n[1/3] Building image in ACR: $Image ..." -ForegroundColor Yellow

az acr build `
  --registry $AcrName `
  --image "${ImageName}:latest" `
  --file "$AgentDir\Dockerfile" `
  $AgentDir

Write-Host "Image built and pushed to ACR." -ForegroundColor Green

# ---- Step 2: Create or Update Container App ----
if ($Redeploy) {
  Write-Host "`n[2/3] Redeploying Container App: $AppName ..." -ForegroundColor Yellow

  az containerapp update `
    --name $AppName `
    --resource-group $ResourceGroup `
    --image $Image `
    --revision-suffix $RevisionSuffix

} else {
  Write-Host "`n[2/3] Creating Container App: $AppName ..." -ForegroundColor Yellow

  az containerapp create `
    --name $AppName `
    --resource-group $ResourceGroup `
    --environment $AcaEnv `
    --environment-resource-group $AcaEnvRg `
    --image $Image `
    --registry-server "$AcrName.azurecr.io" `
    --min-replicas 0 `
    --max-replicas 2 `
    --cpu 0.25 `
    --memory 0.5Gi `
    --ingress external `
    --target-port 8000 `
    --secrets `
      "foundry-openai-api-key=keyvaultref:https://$KeyVault.vault.azure.net/secrets/foundry-openai-api-key,identityref:system" `
      "foundry-openai-api-endpoint=keyvaultref:https://$KeyVault.vault.azure.net/secrets/foundry-openai-api-endpoint,identityref:system" `
    --env-vars `
      "AZURE_OPENAI_API_KEY=secretref:foundry-openai-api-key" `
      "AZURE_OPENAI_ENDPOINT=secretref:foundry-openai-api-endpoint" `
      "AZURE_OPENAI_DEPLOYMENT=gpt-4.1-mini" `
      "OPENAI_API_VERSION=2024-12-01-preview"
}

# ---- Step 3: Get live URL ----
Write-Host "`n[3/3] Fetching live URL..." -ForegroundColor Yellow

$fqdn = az containerapp show `
  --name $AppName `
  --resource-group $ResourceGroup `
  --query "properties.configuration.ingress.fqdn" `
  --output tsv

Write-Host "`nDone! Agent live at:" -ForegroundColor Green
Write-Host "https://$fqdn/api/chat" -ForegroundColor White
Write-Host "`nUpdate site/chat-widget.js CHAT_API_URL with this URL." -ForegroundColor Cyan

# ---- Redeploy reminder ----
Write-Host "`nTo redeploy after code changes:" -ForegroundColor DarkGray
Write-Host "  .\infra\deploy-agent.ps1 -Redeploy -RevisionSuffix `"v2`"" -ForegroundColor DarkGray
