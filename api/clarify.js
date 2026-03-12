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
    console.log("HERE!");
    const formData = await req.formData();
    
    // Honeypot check
    if (formData.get('contact_last_name_confirm')) {
      return new Response(JSON.stringify({ questions: [] }), { status: 200 });
    }

    let allInputsStr = '';
    for (const [key, value] of formData.entries()) {
      if (key === 'contact_last_name_confirm') continue;
      if (key === 'data_examples') {
        allInputsStr += `- File Uploaded: Yes\n`;
        continue;
      }
      if (value && String(value).trim() !== '') {
        allInputsStr += `- ${key}: ${value}\n`;
      }
    }

    // Construct Context for GPT-5.4
    let contextStr = `
CLIENT REQUEST ENTIRETY:
${allInputsStr}
    `;

    const systemPrompt = `You are a high-level AI Solutions Architect at Projxon AI.
A client has submitted a preliminary request for a custom AI system. Read their provided scope.

YOUR JOB:
Identify ambiguity specifically around the most critical blockers preventing us from quoting the project (usually Data availability, Input/Output structure, and Integration points). 

CRITICAL ADAPTIVITY RULE:
- Evaluate the technical literacy of the user based on their inputs. 
- If they selected "unsure" for technical options or their description is non-technical, DO NOT interrogate them with deep technical jargon about JSON schemas, DPO, RL, or exact token limits. Instead, ask brief, high-level, business-oriented questions to help YOU infer the technical needs (e.g., "Could you give me an example of what a perfect response from the AI would look like?" or "Where does the information the AI needs currently live?").
- If they are highly technical, you may ask specific technical questions.

INSTRUCTIONS:
- Generate 1 to 5 highly targeted, conversational, and plain-English clarifying questions.
- Each question MUST be distinct and directly address a critical unknown.
- DO NOT ask compound questions (multiple questions packed into one). Keep them very short and easy to read.
- DO NOT ask generic questions like "What is your timeline?", "What is your budget?", or "Who are the users?".
- If their provided scope description is already extremely thorough and you understand exactly how to build and train their system, return an empty array [].
- If we already have enough information to work off of, or the request is generic and/or realatively easy, you often don't need many clarifying questions.
- Don't ask stupid questions. For example, never ask if they are using it for single question and response or multi-turn conversation. That's a stupid quesiton because you can train the model for multi-turn and it will do the other.
- Don't ask them things that have obvious answers.
- Never appear behind the current generation. Aviod using analogies with specific models. Those become outdated fast and your memory is outdated, if you reference them, it makes it seem like we are outdated.

WHAT WE NEED:
- Enough details for us to get a picture of recommendations we can make for model size, base models, training data, training methods, application design, etc... We just need enough to get a good picture.

OUTPUT FORMAT:
Return ONLY a raw JSON object with a single "questions" array containing text strings.
Example: {"questions": ["Where does the information the AI needs to read currently live?", "Could you provide a quick example of a 'perfect' AI response for this use case?"]}`;

    // Fetch from OpenAI (gpt-5.4) using modern responses API
    const openAiResponse = await openai.responses.create({
      model: 'gpt-5.4',
      text: { 
          format: {
              type: "json_schema",
              name: "clarifying_questions",
              schema: {
                  type: "object",
                  properties: {
                      questions: {
                          type: "array",
                          items: { type: "string" },
                          description: "Array of clarifying questions."
                      }
                  },
                  required: ["questions"],
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
    
    // Clean potential markdown blocks if the LLM ignores instructions
    if (responseText.startsWith('```json')) responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let questions = [];
    try {
        const parsed = JSON.parse(responseText);
        questions = parsed.questions;
        if (!Array.isArray(questions)) questions = [];
    } catch (e) {
        console.error("Failed to parse GPT questions:", responseText);
        questions = [];
    }

    return new Response(JSON.stringify({ questions }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Clarify API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
