/* ─── FONCTION SERVERLESS (Vercel) : proxy vers l'API Gemini ───
 * La clé d'API reste côté serveur (variable d'environnement),
 * jamais exposée dans le code client, conformément au cahier des
 * charges technique. */

const MODEL = 'gemini-2.0-flash';
const MAX_QUESTION_LENGTH = 300;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: 'Assistant IA indisponible (clé non configurée)' });
    return;
  }

  const { question, context } = req.body || {};
  if (!question || typeof question !== 'string' || !question.trim()) {
    res.status(400).json({ error: 'Question manquante' });
    return;
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    res.status(400).json({ error: 'Question trop longue' });
    return;
  }

  const prompt = `Tu es l'assistant conversationnel de l'application "Suivi Coupe du Monde FIFA 2026". Réponds uniquement à partir des données de matchs fournies ci-dessous, en français, en 2 à 3 phrases maximum, sans inventer de résultats qui n'y figurent pas.

Données actuelles :
${typeof context === 'string' ? context.slice(0, 4000) : ''}

Question de l'utilisateur : ${question}`;

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 220, temperature: 0.4 },
        }),
      }
    );

    if (!upstream.ok) {
      res.status(502).json({ error: 'Service IA indisponible' });
      return;
    }

    const data = await upstream.json();
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!answer) {
      res.status(502).json({ error: 'Réponse IA vide' });
      return;
    }

    res.status(200).json({ answer });
  } catch {
    res.status(502).json({ error: 'Erreur de communication avec le service IA' });
  }
}
