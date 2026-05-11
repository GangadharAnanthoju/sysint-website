# SysInt Inc — Website

Static website for SysInt Inc, an enterprise integration and AI engineering firm.

**Live URL:** https://ambitious-ocean-005d6090f.7.azurestaticapps.net

---

## Pages

| Page | Description |
|---|---|
| `index.html` | Homepage — Dark Cosmic theme |
| `enterprise-integration.html` | Enterprise Integration services |
| `ai-services.html` | AI Platform services |
| `ai-agent-store.html` | AI Agent Store for local businesses |
| `card.html` | Digital visiting card — Ganga Ananthoju |
| `lead-magnet.html` | Lead magnet PDF — "3 Ways AI Can Save Your Local Business 5 Hours a Week" |
| `legal.html` | Legal / Privacy |
| `error.html` | 404 error page |

---

## Chat Widget

Self-contained keyword-matching chat widget (`chat-widget.js` / `chat-widget.css`).
No backend required — runs purely in the browser.

To connect to a real AI API, set `CHAT_API_URL` in `chat-widget.js`:

```js
const CHAT_API_URL = 'https://your-api-endpoint';
```

---

## Deploy

### Auto-deploy (GitHub Actions)

Every push to `dev` or `main` triggers an automatic deploy via `.github/workflows/azure-static-web-apps.yml`.

Required GitHub secret:
- **Name:** `AZURE_STATIC_WEB_APPS_API_TOKEN`
- **Value:** *(saved separately — do not commit)*

### Manual deploy

```powershell
# First time (creates resource group + SWA)
.\infra\deploy-swa.ps1

# Subsequent deploys
.\infra\deploy-swa.ps1 -DeployToken "your-token-here"
```

### Azure resources

| Resource | Value |
|---|---|
| Resource Group | `rg-sysint-website-eus2` |
| Static Web App | `sysint-website-eus2` |
| Region | `eastus2` |
| SKU | Free |

### Prerequisites

```powershell
# Azure CLI
# https://aka.ms/installazurecli

# SWA CLI
npm install -g @azure/static-web-apps-cli

# Login
az login
```

---

## Contact

**Ganga Ananthoju** — Founder & AI Engineer, SysInt Inc
- 📞 440-364-6078
- ✉️ gangadhar.ananthoju@sysintinc.com
- 🌐 www.sysintinc.com
