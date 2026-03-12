import OpenAI from 'openai';
import { Resend } from 'resend';

// Vercel Edge Runtime configuration
export const config = {
  runtime: 'edge',
};

// Initialize clients (these will use environment variables automatically if set on Vercel)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const resend = new Resend(process.env.RESEND_API_KEY);

// Few-Shot Prompting Examples for Architectural Inference
const PROMPT_EXAMPLES = `
Example 1: A college student saying "I want to get rid of liberal bias in my AI. I want it to be small enough to run on my laptop (16GB RAM)"
So what we do is some abliteration, some data generation, fine-tune to retain abilities, bias detector over dataset to filter. We'll probably train a 20B or less model and deploy quantized. After abliteration just QLoRA. Can train locally. Total estimate: $700–$1500. A consultation required to get precise of course.

Example 2: A big medical company wants private AI systems that can search their records and database and be perfectly suited for what they ask it. They want a dedicated web app as well as native app for their work phones. Search based on permissions. They want a larger scale model.
Training: SFT, DPO, RLVR
SFT Data: 
- OpenMed/Medical-Reasoning-SFT-Mega
- take company records and run through synthetic data generation pipeline to generate verified training samples
RLVR:
- Verify with rewards based on such and such a rubric on such and such a task.
DPO Data:
- Team members test, select best response
Training cost: Cloud compute needs (based on data scale, context length needed, modality, model size)
Development work: Build app, connect to user database, setup RAG, test permission systems, etc...
Deployment: Private Cloud

Total: $30k – $50k (depending on specifics and difficulty of the development work). Or it may be more. I don't know what requirements medical apps have. Anyways...

Example 3: A mid-sized marketing agency wants an AI tool to automatically generate brand-compliant copy and image descriptions based on their previous successful campaigns. They have thousands of past examples but no technical team.
Training: Heavy SFT, Abliteration
SFT Data:
- Compile their thousands of past campaigns into a high-quality instructional dataset. 
RLVR:
- Not applicable (subjective creative output).
DPO Data:
- Crucial here. The agency team must rank outputs to align the model specifically to their "brand voice".
Training cost: Mid-tier cloud compute for a 30B-70B model.
Development work: Custom internal web-app with a simple prompt interface.
Deployment: Managed cloud API.
Total: $12k – $22k.

Example 4: A financial firm needs an AI to ingest real-time stock ticks and output strictly formatted JSON buy/sell signals based on a proprietary mathematical trading strategy.
Training: RLVR heavily.
SFT Data:
- minimal, mostly formatting.
RLVR:
- Extremely high potential. We can programmatically verify if the JSON is formatted correctly and if the math strategy was applied correctly to the historical ticks. We will train to 100% adherence.
DPO Data:
- Not needed, no subjective preference.
Training cost: High cloud compute for intensive RLVR loops.
Development work: System integration with their live trading API.
Deployment: Dedicated private cloud or on-prem for ultra-low latency. 
Total: $40k – $70k+.

Example 5: A small non-profit wants a small 8B model tuned for their use-case and on their data to search their few gigs of text documents.
Training: Light SFT.
SFT Data: 
- Setup a synthetic data generation system using their source data to create a training set. They have a few gigs of text documents, but we only need a subset for tuning.
RLVR:
- Not needed for basic RAG.
DPO Data:
- Not needed.
Training cost: Low cloud compute for a small 8B model. Setup RAG pipeline.
Development work: Basic RAG integration into their systems.
Deployment: Cloud API or local depending on their hardware.
Total: $1,000 – $2,500 depending on specifics.
`;

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const reqForm = await req.formData();
    
    // Spam Trap: If the hidden honeypot field is filled, silently abort to save LLM costs.
    if (reqForm.get('contact_last_name_confirm')) {
      console.log('Honeypot triggered. Aborting quietly.');
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }
    
    const formData = {
      name: reqForm.get('name'),
      email: reqForm.get('email'),
      company: reqForm.get('company'),
      deliverable: reqForm.get('deliverable') || 'Unknown',
      app_complexity: reqForm.get('app_complexity') || 'N/A',
      training_type: reqForm.get('training_type') || 'N/A',
      execution_method: reqForm.get('execution_method') || 'N/A',
      ai_engine_preference: reqForm.get('ai_engine_preference') || 'N/A',
      purpose: reqForm.get('purpose'),
      input_modalities: reqForm.getAll('input_modalities'),
      output_modalities: reqForm.getAll('output_modalities'),
      latency: reqForm.get('latency'),
      deployment: reqForm.get('deployment'),
      support_tier: reqForm.get('support_tier'),
      data_status: reqForm.get('data_status'),
      data_scale: reqForm.get('data_scale'),
      data_quality: reqForm.get('data_quality'),
      verifiable: reqForm.get('verifiable'),
      dpo_willingness: reqForm.get('dpo_willingness'),
      additional_info: reqForm.get('additional_info'),
      rag_format: reqForm.get('rag_format'),
      automation_tools: reqForm.get('automation_tools'),
      email_copy: reqForm.get('email_copy'),
      current_workflow: reqForm.get('current_workflow'),
      success_metrics: reqForm.get('success_metrics'),
      data_freshness: reqForm.get('data_freshness'),
      compliance_security: reqForm.get('compliance_security'),
      project_scale: reqForm.get('project_scale') || 'Unknown',
      // Legacy generic fields mapping
      entity_type: reqForm.get('entity_type') || 'Unknown',
      entity_size: reqForm.get('entity_size') || 'Unknown',
    };
    
    // Parse Q&A History
    let qaHistoryStr = '';
    try {
      const qaRaw = reqForm.get('qa_history');
      if (qaRaw) {
        const qaArray = JSON.parse(qaRaw);
        qaArray.forEach((item, i) => {
          qaHistoryStr += `Q${i+1}: ${item.question}\nA: ${item.answer}\n\n`;
        });
      }
    } catch (e) {
      console.error("Failed to parse QA history");
    }
    
    // Check if file was uploaded and extract its text content to feed the LLM
    const file = reqForm.get('data_examples');
    let fileName = 'None';
    let fileContentSnippet = 'None provided.';
    let fileBuffer = null;
    
    if (file && file.name) {
      fileName = file.name;
      try {
        fileBuffer = await file.arrayBuffer();
        const decoder = new TextDecoder('utf-8');
        const fullText = decoder.decode(fileBuffer);
        // Take an aggressive 5k char snippet to avoid blowing up the context window
        fileContentSnippet = fullText.slice(0, 5000); 
      } catch (err) {
        console.error("Failed to parse file upload buffer:", err);
        fileContentSnippet = 'Error reading file content format. Could not process.';
      }
    }

    // Build exhaustive list of all inputs for the Admin email payload
    let allInputsHtml = '';
    for (const [key, value] of reqForm.entries()) {
      if (key === 'data_examples' || key === 'contact_last_name_confirm') continue;
      allInputsHtml += `<p><strong>${key}:</strong> ${value}</p>`;
    }

    // 1. Initial Feasibility Research (GPT-5 with Search)
    // This block is now redundant and will be replaced by the one inside the stream.
    // const researchPrompt = `
    //   You are an elite AI architect at Projxon AI. A potential client wants to build:
    //   Route: ${formData.project_route}
    //   Purpose: ${formData.purpose}
    //   They claim existing models (like GPT-5/Gemini-3) handle it like this: ${formData.existing_models}. Reason: ${formData.model_failure || 'N/A'}.
      
    //   AI Q&A Context:
    //   ${qaHistoryStr || 'None provided.'}

    //   Use your search capability to find existing solutions, feasibility, and technical hurdles for this exact use case.
    //   IMPORTANT: Only use what you found in the search explicitly. Exclude any results from HuggingFace (HF) as we handle that separately.
    //   Return a brief technical feasibility assessment.
    // `;

    // We return a stream so Vercel Edge doesn't timeout after 25 seconds.
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Enqueue an immediate whitespace to bypass the TTFB limit
        controller.enqueue(encoder.encode(' '));

        // Keep the connection alive while the 2-minute LLM runs
        const heartbeat = setInterval(() => {
          controller.enqueue(encoder.encode(' '));
        }, 5000);

        try {
          // 1. Initial Feasibility Research (GPT-5 with Search) & 2. HF Search Query Generation
          const researchPrompt = `
            You are an elite AI architect at Projxon AI. A potential client wants to build:
            Deliverable Route: ${formData.deliverable}
            Purpose: ${formData.purpose}
            
            AI Q&A Context:
            ${qaHistoryStr || 'None provided.'}

            Use your search capability to find:
            1. Existing solutions, feasibility, and technical hurdles for this exact use case.
            2. Any high-quality HuggingFace (HF) datasets that would be perfect for training or RAG in this domain.
            
            IMPORTANT: Return a brief technical feasibility assessment. If you found specific HuggingFace datasets, name them explicitly by their ID (e.g., "OpenMed/Medical-Reasoning").
          `;
          
          const hfPrompt = `
            Based on this use case: "${formData.purpose}". 
            Generate 5 BROAD categorical or tag-based queries I can use to find datasets on HuggingFace. 
            Avoid long phrases. Use single words or short pairings.
            Examples: "medical", "legal document", "finance", "classification", "conversational".
          `;

          // Execute these two independent baseline queries in parallel to speed up the Edge function
          const [researchResponse, hfQueryResponse] = await Promise.all([
            openai.responses.create({
              model: 'gpt-5-mini',
              input: [{ role: 'user', content: researchPrompt }],
              tools: [{ type: "web_search" }], // THIS IS REQUIRED!!!
            }),
            openai.responses.create({
              model: 'gpt-5-mini',
              text: {
                format: {
                  type: "json_schema",
                  name: "hf_queries",
                  schema: {
                    type: "object",
                    properties: {
                      queries: {
                        type: "array",
                        items: { type: "string" }
                      }
                    },
                    required: ["queries"],
                    additionalProperties: false
                  },
                  strict: true
                }
              },
              input: [{ role: 'user', content: hfPrompt }]
            })
          ]);
          
          const webContext = researchResponse.output_text;
          let hfQueries = [];
          try {
            const hfQueryData = JSON.parse(hfQueryResponse.output_text);
            hfQueries = hfQueryData.queries || [];
          } catch (e) {
            console.error("Failed to parse HF queries structured output:", e);
            hfQueries = [formData.purpose.slice(0, 50)]; // ultra-fallback
          }

          // 3. Direct HF API Search
          const hfDatasets = new Set(); 
          for (const query of hfQueries) {
            if (!query || query.trim() === '') continue;
            try {
               const controller = new AbortController();
               const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout so the pipe doesn't hang
               
               const hfRes = await fetch(`https://huggingface.co/api/datasets?search=${encodeURIComponent(query.trim())}&limit=5`, {
                   signal: controller.signal,
                   headers: {
                       'User-Agent': 'Projxon-AI-Architect/1.0 (https://projxon.ai; support@projxon.ai)'
                   }
               });
               clearTimeout(timeoutId);
               
               if (hfRes.ok) {
                 const data = await hfRes.json();
                 if (Array.isArray(data)) {
                   data.forEach(d => {
                     if (d.id) hfDatasets.add(d.id);
                   });
                 }
               }
            } catch (e) {
               console.error(`HF Search Error for "${query}":`, e.message);
            }
          }
          const finalHfList = Array.from(hfDatasets);

          // 4. Final Estimation (GPT-5.4)
          const synthesisPrompt = `
            You are an elite AI architect at Projxon AI.
            Synthesize this data into a final quote.

            CLIENT CONSTRAINTS:
            - Entity: ${formData.entity_type} (Size: ${formData.entity_size || 'N/A'})
            - Expected Project Scale: ${formData.project_scale}
            - Primary Deliverable: ${formData.deliverable}
            - AI Engine Preference (App/Automation): ${formData.ai_engine_preference}
            - App Complexity (if app): ${formData.app_complexity}
            - Training Request (if model base): ${formData.training_type}
            - Target Execution Method (if model base): ${formData.execution_method}
            - Domain: ${formData.purpose}
            
            INTERACTIVE AI Q&A HISTORY:
            ${qaHistoryStr || 'No clarifying questions were needed.'}

            - Input Modalities: ${formData.input_modalities?.join(', ')}
            - Output Modalities: ${formData.output_modalities?.join(', ')}
            - Latency: ${formData.latency}
            - Deployment: ${formData.deployment}
            - Support/Maint: ${formData.support_tier}
            - Data Status: ${formData.data_status}. Scale: ${formData.data_scale || 'Unknown'}. Quality: ${formData.data_quality}
            - Uploaded Data Example: ${fileName}
            - Programmatically Verifiable (RLVR Potential): ${formData.verifiable}
            - Willing to assist w/ DPO preference pairs: ${formData.dpo_willingness}
            - RAG Format (if applicable): ${formData.rag_format || 'N/A'}
            - Automation Tools (if applicable): ${formData.automation_tools || 'N/A'}
            - Current Workflow / Bottleneck: ${formData.current_workflow || 'N/A'}
            - Success Metrics (KPIs): ${formData.success_metrics || 'N/A'}
            - Data Freshness: ${formData.data_freshness || 'N/A'}
            - Compliance / Security: ${formData.compliance_security || 'N/A'}
            - Additional Info: ${formData.additional_info || 'None'}

            WEB RESEARCH FEASIBILITY:
            ${webContext}

            POTENTIAL HF DATASETS FOUND:
            ${finalHfList.join(', ') || 'None found instantly.'}

            PROMPT EXAMPLES AND INFERENCE TARGETS:
            Use these examples to infer the architectural approach and cost, matching the scale of work:
            ${PROMPT_EXAMPLES}

            INSTRUCTIONS:
            Return ONLY a JSON block with the following schema:
            {
              "full_internal_analysis": "An unconstrained, highly detailed string explaining exactly how you arrived at these numbers and architectural choices. This is for the engineering team to review.",
              "feasibility_analysis": "Maximum 3 highly concise sentences explaining the architectural approach, whether a frontier model or specialized model is needed, and why.",
              "one_time_cost": "Total estimated one-time cost, e.g., $30,000",
              "recurring_cost": "Total estimated recurring monthly cost, e.g., $2,000/mo",
              "itemized_sheet": {
                "training_methods": "Specific methods used (SFT, RLVR, Abliteration, DPO).",
                "data_processing": "Data generation, cleaning, parsing required.",
                "deployment": "Where it runs and how it scales."
              }
            }
              One-time cost and Recurring Cost MUST be ranges. Be broad, you are estimating before the final consultation.
            
            ABOUT PROJXON & PRICING:
            Projxon AI is a company specializing in getting totally custom and unique AI systems built for a company's specific needs. Our in house experts are open to any challenge, they are skilled in tasks from app development to pre-training to fine-tuning and will happily pioneer entirely new approaches. We take projects of all size from simple fine-tunes using existing datasets we can do for $50 to big multi-year projects in the hundreds of thousands. Your goal is to provide an estimated price range from the information and do a preliminary analysis prior to a full consultation. We do things the efficient way. The costs of a project depends on the size of the model being trained, the type of training, the scale of training, as well as other factors. For dense models <40B on datasets in the tens of thousand of examples, the training cost itself is pretty low, a few hundred bucks at most. It's the data collection, app development, and deployment where the money usually goes. Now bigger models, or RL, DPO, or other things like that of course add to that cost. Models bigger than 40-50B params require specialized training setups and cost a premium.
            

            BASE MODELS:
            As of March 2026, the general best base models were the Qwen3.5 series.
          `;

          const quoteResponse = await openai.responses.create({
            model: 'gpt-5.4', 
            text: { 
              format: { 
                type: "json_schema", 
                name: "quote_schema",
                schema: { 
                  type: "object", 
                  properties: { 
                    full_internal_analysis: { type: "string" },
                    feasibility_analysis: { type: "string" },
                    one_time_cost: { type: "string" },
                    recurring_cost: { type: "string" },
                    itemized_sheet: {
                      type: "object",
                      properties: {
                        training_methods: { type: "string" },
                        data_processing: { type: "string" },
                        deployment: { type: "string" }
                      },
                      required: ["training_methods", "data_processing", "deployment"],
                      additionalProperties: false
                    }
                  },
                  required: ["full_internal_analysis", "feasibility_analysis", "one_time_cost", "recurring_cost", "itemized_sheet"],
                  additionalProperties: false
                },
                strict: true 
              } 
            },
            input: [{ role: 'user', content: synthesisPrompt }]
          });

          const quoteData = JSON.parse(quoteResponse.output_text);

          // 5. Send Internal Email to Projxon Team via Resend
          try {
            const adminEmailPayload = {
              from: 'quotes@projxon.ai',
              to: 'admin@projxon.ai',
              subject: `New AI Quote Lead: ${formData.company || formData.name}`,
              html: `
                <h2>New Lead: ${formData.company}</h2>
                <p><strong>Estimated Scale:</strong> ${formData.project_scale}</p>
                <h3>--- Full Form Submission Data ---</h3>
                ${allInputsHtml}
                <hr/>
                <h3>--- AI Clarification Q&A Transcript ---</h3>
                <pre style="white-space: pre-wrap; background: #fef08a; padding: 1rem;">${qaHistoryStr || 'No clarifying questions were needed / bypassed.'}</pre>
                <hr/>
                <h3>Data Upload File Status</h3>
                <p><strong>File Name:</strong> ${fileName}</p>
                <br/>
                <h3>AI Quote Generated</h3>
                <p><strong>One Time:</strong> ${quoteData.one_time_cost}</p>
                <p><strong>Recurring:</strong> ${quoteData.recurring_cost}</p>
                <p><strong>Training Methods:</strong> ${quoteData.itemized_sheet?.training_methods}</p>
                <p><strong>Data Processing:</strong> ${quoteData.itemized_sheet?.data_processing}</p>
                <p><strong>Deployment:</strong> ${quoteData.itemized_sheet?.deployment}</p>
                <br/><hr/><br/>
                <h3>GPT-5.4 Raw Internal Rationale (Unedited)</h3>
                <pre style="white-space: pre-wrap; background: #e0f2fe; padding: 1rem;">${quoteData.full_internal_analysis}</pre>
                <h3>Raw LLM Web Research Context</h3>
                <pre style="white-space: pre-wrap; background: #f4f4f5; padding: 1rem;">${webContext || 'None'}</pre>
                <h3>HuggingFace Datasets Found</h3>
                <p>${finalHfList.join(', ') || 'None'}</p>
                <h3>Raw Uploaded Data Sample (Snippet Sent to LLM)</h3>
                <pre style="white-space: pre-wrap; background: #f4f4f5; padding: 1rem;">${fileContentSnippet || 'None'}</pre>
              `
            };

            // Attach the full file to the admin email if it exists
            if (file && file.name && fileBuffer) {
              const uint8Array = new Uint8Array(fileBuffer);
              let binary = '';
              for (let i = 0; i < uint8Array.byteLength; i++) {
                binary += String.fromCharCode(uint8Array[i]);
              }
              const base64Content = btoa(binary);

              adminEmailPayload.attachments = [
                {
                  filename: file.name,
                  content: base64Content
                }
              ];
            }

            await resend.emails.send(adminEmailPayload);

            if (formData.email_copy === 'yes' && formData.email) {
              await resend.emails.send({
                from: 'quotes@projxon.ai',
                to: formData.email,
                subject: 'Your Projxon AI Quote Estimate',
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Your Custom AI Architecture Estimate</h2>
                    <p>Hi ${formData.name.split(' ')[0]},</p>
                    <p>Thank you for requesting an estimate from Projxon AI. Based on the requirements for <strong>${formData.company || 'your project'}</strong>, here is our initial pricing and architectural breakdown:</p>
                    
                    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0;">
                      <h3 style="margin-top: 0; color: #0284c7;">Estimated Cost</h3>
                      <p style="margin: 5px 0;"><strong>One-Time Setup:</strong> ${quoteData.one_time_cost}</p>
                      <p style="margin: 5px 0;"><strong>Recurring Monthly:</strong> ${quoteData.recurring_cost}</p>
                    </div>
                    
                    <h3 style="color: #0f172a;">Proposed Architecture</h3>
                    <p style="color: #334155; line-height: 1.6;">${quoteData.feasibility_analysis}</p>
                    
                    <h3 style="color: #0f172a; margin-top: 25px;">Itemized Setup</h3>
                    <ul style="color: #334155; line-height: 1.6;">
                      <li style="margin-bottom: 10px;"><strong>Approach:</strong> ${quoteData.itemized_sheet?.training_methods}</li>
                      <li style="margin-bottom: 10px;"><strong>Data Processing:</strong> ${quoteData.itemized_sheet?.data_processing}</li>
                      <li style="margin-bottom: 10px;"><strong>Deployment:</strong> ${quoteData.itemized_sheet?.deployment}</li>
                    </ul>
                    
                    <p style="margin-top: 30px;">This is a preliminary AI-generated estimate. Let us know if you'd like to schedule a formal consultation to discuss this architecture in depth.</p>
                    <p style="color: #64748b;">Best,<br>The Projxon AI Team</p>
                  </div>
                `
              });
            }
          } catch (emailError) {
            console.error('Failed to send Resend email:', emailError);
            // We don't fail the user request just because the internal email failed
          }

          clearInterval(heartbeat);
          controller.enqueue(encoder.encode(JSON.stringify(quoteData)));
          controller.close();

        } catch (error) {
          clearInterval(heartbeat);
          console.error("Pipeline Error:", error);
          controller.enqueue(encoder.encode(JSON.stringify({ error: error.message })));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-transform'
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate quote' }), { status: 500 });
  }
}
