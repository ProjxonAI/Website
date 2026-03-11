# Pricing Estimator Form (AI-powered)

*Note this is just an estimate.*

## What it needs to do (multi-select)

- Answer questions
- Search my data (RAG)
- Automate tasks
- Integrate with proprietary software
- Other (please specify)

## Model / feasibility questions

- Are any existing models from OpenAI or Google able to solve your problem?
- If so, specify; if not, explain how they fail
- Explain the purpose and domain
- Ask how much broad capabilities matter vs specialized
- Estimate model size for this, to inform deployment costs

## Modalities

| Input modalities | Output modalities |
|---|---|
| Hear voices | Generate voices |
| Hear sounds | Generate sounds |
| See images | Generate images |
| Watch videos | Generate videos |
| Other input types | Generate reality simulations / other output types |
| Real-time vs delayed response |  |

## Deployment

- Dedicated device
- Private cloud
- On-device
- Unsure

## Data

- I have task examples including all required information to solve the problem
- Task examples, some info
- No examples  
  - If so, ask scale
- Other kinds of data/documents...

## Data quality / organization

- Ask how organized it is, format consistency, etc.

## Pricing / support

- One-time or continual maintenance + upgrades + support

## Get Quote

AI looks at info, current model performance, searches the internet for helpful datasets, looks at custom engineering required, etc.

Gives estimate, button for schedule consultation.

TODO: Create a video that explains how AI training data works.

We don't need it to be AI powered yet, just build the form and hook it up to a vercel serverless function that we also get running locally and then we'll make an admin portal (NOT LINKED TO FROM HOME, manually navigate to /admin). That lets us see all the forms and then provide estimates manually.
We need a way to give back results via email...
IDK.

Maybe AI powered system would actually be easier, because then we don't need an admin panel or email handling, we just have the AI process it and it is ready within a few minutes??? How would we get this to work properly?