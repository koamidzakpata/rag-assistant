# 📄 RAG Assistant

Un assistant IA qui répond à vos questions en se basant **uniquement sur vos propres documents**, entièrement en local — sans internet, sans cloud.

## ✨ Fonctionnalités

- 📂 **Upload de documents** — PDF et TXT supportés
- 🤖 **Analyse intelligente** — L'IA lit et comprend le contenu
- 💬 **Questions ciblées** — Réponses basées UNIQUEMENT sur le document
- 🔒 **100% local** — Aucune donnée envoyée à l'extérieur

## 🛠️ Technologies utilisées

| Technologie | Rôle |
|---|---|
| **Ollama + llama3.2** | Modèle IA local |
| **Node.js + Express** | Serveur backend |
| **Multer** | Gestion des uploads |
| **pdfjs-dist** | Extraction du texte PDF |
| **HTML/CSS/JS** | Interface utilisateur |

## 🏗️ Architecture RAG

Document PDF
↓
Extraction du texte (pdfjs-dist)
↓
Construction du prompt contextuel
↓
llama3.2 via Ollama (local)
↓
Réponse affichée dans l'interface

## 🚀 Installation

### Prérequis
- [Node.js](https://nodejs.org) v18+
- [Ollama](https://ollama.com) avec llama3.2

### Étapes

```bash
git clone https://github.com/koamidzakpata/rag-assistant.git
cd rag-assistant
npm install
ollama pull llama3.2
node server.js
```

Ouvre **http://localhost:3000**

## 👨‍💻 Auteur

**DZAKPATA Koami Junior**  
Master IA & Big Data — UCAO-UUT  
[GitHub](https://github.com/koamidzakpata)