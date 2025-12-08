/* eslint-env node */
/* eslint-disable no-undef */

export default async function handler(req, res) {
  try {
    const { messages, mode } = req.body;

    const SYSTEM_PROMPTS = {
      general:
        "You are CARE-ASSIST, a friendly assistant for dialysis patients.",
      pd: "You assist with Peritoneal Dialysis: UF, fill/drain, symptoms, logs.",
      diet: "You assist CKD patients with safe renal diets and warnings.",
      doctor: "You summarize logs like a nephrologist: clinical, precise.",
      support: "You provide emotional support and gentle motivation.",
    };

    const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.general;

    const openAIRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: systemPrompt }, ...messages],
        }),
      }
    );

    const data = await openAIRes.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
