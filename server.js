// server.js

const express  = require('express')
const multer   = require('multer')
const fs       = require('fs')
const fetch    = require('node-fetch')

const app = express()
app.use(express.json())
app.use(express.static('.'))

// ── Configuration upload ──
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename:    (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
})
const upload = multer({ storage })

// ── Stockage en mémoire ──
let documentTexte = ""
let nomDocument   = ""

// ── Extraction texte PDF ──
async function extrairePDF(buffer) {
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) })
    const pdfDoc = await loadingTask.promise
    let texte = ""
    for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i)
        const content = await page.getTextContent()
        texte += content.items.map(item => item.str).join(' ') + '\n'
    }
    return texte
}

// ── Route : Upload ──
app.post('/upload', upload.single('document'), async (req, res) => {
    try {
        const fichier = req.file
        if (!fichier) return res.status(400).json({ erreur: 'Aucun fichier reçu.' })

        nomDocument = fichier.originalname
        const buffer = fs.readFileSync(fichier.path)

        if (fichier.mimetype === 'application/pdf') {
            documentTexte = await extrairePDF(buffer)
        } else {
            documentTexte = buffer.toString('utf-8')
        }

        console.log(`✅ Document chargé : ${nomDocument} (${documentTexte.length} caractères)`)
        res.json({ 
            message: `Document "${nomDocument}" chargé avec succès !`,
            caracteres: documentTexte.length
        })

    } catch (error) {
        console.log('❌ Erreur upload :', error.message)
        res.status(500).json({ erreur: error.message })
    }
})

// ── Route : Question ──
app.post('/question', async (req, res) => {
    const { question } = req.body

    if (!documentTexte) {
        return res.status(400).json({ 
            erreur: 'Aucun document chargé. Uploadez d\'abord un fichier.' 
        })
    }

    console.log('❓ Question :', question)

    try {
        const prompt = `Tu es un assistant expert en analyse de documents.
        
Voici le contenu du document "${nomDocument}" :

---
${documentTexte.substring(0, 4000)}
---

En te basant UNIQUEMENT sur ce document, réponds à la question suivante :
Question : ${question}

Si la réponse ne se trouve pas dans le document, dis-le clairement.
Réponse :`

        const response = await fetch('http://127.0.0.1:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3.2',
                prompt: prompt,
                stream: false
            })
        })

        const data = await response.json()
        console.log('✅ Réponse générée !')
        res.json({ reponse: data.response })

    } catch (error) {
        console.log('❌ Erreur :', error.message)
        res.status(500).json({ erreur: error.message })
    }
})

// ── Route : Statut ──
app.get('/statut', (req, res) => {
    res.json({
        document_charge: documentTexte.length > 0,
        nom_document: nomDocument,
        nb_caracteres: documentTexte.length
    })
})

app.listen(3000, () => {
    console.log('✅ RAG Assistant démarré sur http://localhost:3000')
})