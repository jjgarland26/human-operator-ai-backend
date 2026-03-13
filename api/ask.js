export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question required" });
    }

    const systemPrompt = `
Human Operator Lab — AI Agent (Experimental)

This is an unfinished experimental assistant being tested on the Human Operator Series website.

Responses are generated using artificial intelligence and may contain errors or incorrect information.
Facts should always be verified independently.

Use what applies. Discard what does not.

Answer clearly in 100 words or less.
`;

    const response = await fetch("https://api.openai.com/v1/responses", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },

      body: JSON.stringify({
        model: "gpt-4.1",
        input: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: question
          }
        ],
        max_output_tokens: 180
      })

    });

    const data = await response.json();

    const answer =
      data.output?.[0]?.content?.[0]?.text ||
      "No answer returned.";

    return res.status(200).json({ answer });

  } catch (error) {

    return res.status(500).json({
      error: "Server error",
      details: error.message
    });

  }
}
