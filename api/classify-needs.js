import OpenAI from 'openai';

export const config = {
  runtime: 'edge',
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { purpose, techNeeds } = await req.json();

    const systemPrompt = `You are a technical routing AI for Projxon's intake pipeline.
A prospective client has provided their objective in plain english, along with a few technologies they *think* they need.

YOUR JOB:
Analyze their plain english purpose and determine which underlying technical components are actually required to build their solution.

COMPONENTS:
- needs_custom_model: (boolean) Does this require fine-tuning an LLM, training a custom model on proprietary data, or applying RL/DPO?
- needs_rag: (boolean) Does this involve searching through internal documents, PDFs, databases, or a knowledge base (Retrieval-Augmented Generation)?
- needs_app: (boolean) Do they need a user-facing interface built (React/Flutter frontend, web app, mobile app)? If they just want a model or API, this is false.
- needs_automation: (boolean) Does this AI need to take actions in other software natively? (e.g. sending emails, writing to Salesforce, executing code, agentic workflows).

OUTPUT FORMAT:
Return ONLY a raw JSON object with those 4 boolean keys. Do not use markdown blocks.
Example: {"needs_custom_model": false, "needs_rag": true, "needs_app": true, "needs_automation": false}`;

    const contextStr = `
CLIENT PURPOSE:
"${purpose}"

TECHNOLOGIES THEY SELECTED:
[${(techNeeds || []).join(', ')}]
    `;

    // Fetch from OpenAI (gpt-5-mini) using modern responses API
    const openAiResponse = await openai.responses.create({
      model: 'gpt-5-mini',
      text: { 
        format: { 
          type: "json_schema", 
          name: "routing_schema",
          schema: { 
            type: "object", 
            properties: { 
              needs_custom_model: { type: "boolean" },
              needs_rag: { type: "boolean" },
              needs_app: { type: "boolean" },
              needs_automation: { type: "boolean" }
            },
            required: ["needs_custom_model", "needs_rag", "needs_app", "needs_automation"],
            additionalProperties: false
          },
          strict: true 
        } 
      },
      input: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: contextStr }
      ]
    });

    let responseText = openAiResponse.output_text.trim();
    
    let classification = {
        needs_custom_model: false,
        needs_rag: false,
        needs_app: false,
        needs_automation: false
    };

    try {
        classification = JSON.parse(responseText);
    } catch (e) {
        console.error("Failed to parse GPT classification:", responseText);
        // Fallback to true for all to be safe and ask all questions
        classification = { needs_custom_model: true, needs_rag: true, needs_app: true, needs_automation: true };
    }

    return new Response(JSON.stringify(classification), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Classify API Error:', error);
    // Return a safe fallback so the frontend doesn't break
    return new Response(JSON.stringify({ needs_custom_model: true, needs_rag: true, needs_app: true, needs_automation: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
