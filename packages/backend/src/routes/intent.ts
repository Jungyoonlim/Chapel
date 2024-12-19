import express from 'express';
import { OpenAI } from 'openai';
import { z } from 'zod';
import { Intent } from '@chapel/shared';

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Validation schema for the request body
const requestSchema = z.object({
  input: z.string().min(1),
});

// Validation schema for the AI response
const responseSchema = z.object({
  action: z.string(),
  goal: z.string(),
  widgets: z.array(z.string()),
  suggestions: z.array(z.string()).optional(),
});

router.post('/', async (req, res) => {
  try {
    // Validate request
    const { input } = requestSchema.parse(req.body);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that helps parse user intents for a canvas-based productivity app.
          Your role is to understand the user's goal and suggest appropriate widgets and tools to help them achieve it.
          
          Available widgets:
          - timeline: For planning events and milestones
          - task-list: For managing tasks and to-dos
          - chart: For data visualization (supports bar, line, pie charts)
          - notes: For text content and documentation
          - mindmap: For brainstorming and connecting ideas
          - calendar: For scheduling and date-based planning
          
          Convert the user's natural language input into a structured response with:
          1. The main action they want to take
          2. Their ultimate goal
          3. The most relevant widgets to help achieve that goal
          4. Optional suggestions for additional actions or widgets that might be helpful
          
          Keep the response focused and minimal - suggest only the most relevant widgets.`
        },
        {
          role: "user",
          content: input
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const result = completion.choices[0]?.message?.content;
    if (!result) {
      throw new Error('No response from OpenAI');
    }

    // Parse and validate the AI response
    const parsedResponse = responseSchema.parse(JSON.parse(result));

    // Return the validated response
    return res.json({
      success: true,
      intent: parsedResponse,
    });

  } catch (error) {
    console.error('Intent parsing error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse intent',
    });
  }
});

export const intentRouter = router; 