# SysInt Inc — Website

Static website for SysInt Inc, an enterprise integration and AI engineering firm.

**Live URL:** https://ambitious-ocean-005d6090f.7.azurestaticapps.net

---

## Folder Structure

```text
SysInt_website/
├── site/                        ← static frontend (all HTML, CSS, JS, logos)
├── agent/                       ← AI agent backend (FastAPI + Azure OpenAI)
│   ├── src/
│   │   ├── sysint_agent.py      ← core agent logic, system prompt, FAQ
│   │   ├── api.py               ← FastAPI POST /api/chat
│   │   └── test_agent.py        ← local test runner
│   ├── data/faq.json            ← SysInt Q&A knowledge base
│   ├── prompts/system-prompt.md ← agent persona and rules
│   ├── config/agent-config.json ← model, contact info
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── pyproject.toml
├── infra/
│   ├── deploy-swa.ps1           ← deploy static site to Azure SWA
│   └── deploy-agent.ps1         ← deploy agent to Azure Container Apps
├── .github/workflows/
│   └── azure-static-web-apps.yml
└── README.md
```

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

Live AI chat widget powered by Azure OpenAI via the agent backend.

**Production URL:** `https://sysint-website-agent.kindmushroom-93329cd8.eastus.azurecontainerapps.io/api/chat`

The widget auto-switches between local and production:

```js
// site/chat-widget.js
const IS_LOCAL = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
const CHAT_API_URL = IS_LOCAL
  ? 'http://localhost:8000/api/chat'
  : 'https://sysint-website-agent.kindmushroom-93329cd8.eastus.azurecontainerapps.io/api/chat';
```

---

## Agent

FastAPI + Azure OpenAI agent running on Azure Container Apps.

### Run locally

```powershell
cd agent
uv sync
uv run uvicorn src.api:app --reload --port 8000
# test
uv run python src/test_agent.py
```

### Environment variables (`agent/.env`)

```env
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_DEPLOYMENT=gpt-4.1-mini
OPENAI_API_VERSION=2024-12-01-preview
```

### Agent Azure resources

| Resource | Value |
|---|---|
| Container App | `sysint-website-agent` |
| Resource Group | `rg-sysint-website-eus2` |
| ACR | `acrsysintcommoneus` |
| ACA Environment | `aca-env-sysint-eus` (`rg-sysint-common-eus`) |
| Key Vault | `kv-sysint-common-eus` |
| KV Secret — API Key | `foundry-openai-api-key` |
| KV Secret — Endpoint | `foundry-openai-api-endpoint` |
| Model | `gpt-4.1-mini` |
| Replicas | min 0 / max 2 (scales to zero) |
| CPU / RAM | 0.25 vCPU / 0.5 Gi |

### Deploy agent (first time)

```powershell
.\infra\deploy-agent.ps1
```

### Redeploy after code changes

```powershell
az acr build --registry acrsysintcommoneus --image sysint-website-agent:latest --file agent/Dockerfile agent/

az containerapp update --name sysint-website-agent `
                       --resource-group rg-sysint-website-eus2 `
                       --image acrsysintcommoneus.azurecr.io/sysint-website-agent:latest `
                       --revision-suffix v2
```

Or use the script:

```powershell
.\infra\deploy-agent.ps1 -Redeploy -RevisionSuffix "v2"
```

---

## Static Site Deploy

### Auto-deploy (GitHub Actions)

Every push to `dev` or `main` triggers an automatic deploy via `.github/workflows/azure-static-web-apps.yml`.

Required GitHub secret:

- **Name:** `AZURE_STATIC_WEB_APPS_API_TOKEN`
- **Value:** *(saved separately — do not commit)*

### Manual deploy

```powershell
# First time
.\infra\deploy-swa.ps1

# Subsequent deploys
.\infra\deploy-swa.ps1 -DeployToken "your-token-here"
```

### Static site Azure resources

| Resource       | Value                    |
| -------------- | ------------------------ |
| Resource Group | `rg-sysint-website-eus2` |
| Static Web App | `sysint-website-eus2`    |
| Region         | `eastus2`                |
| SKU            | Free                     |

### Prerequisites

```powershell
npm install -g @azure/static-web-apps-cli
az login
```

---

## Contact

**Ganga Ananthoju** — Founder & AI Engineer, SysInt Inc
- 📞 440-364-6078
- ✉️ gangadhar.ananthoju@sysintinc.com
- 🌐 www.sysintinc.com
