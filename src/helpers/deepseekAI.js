import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

export async function getDeepSeekStream({ messages, maxTokens = 500 }) {
  try {
    const stream = await client.chatCompletionStream({
      provider: "fireworks-ai",
      model: "deepseek-ai/DeepSeek-V3-0324",
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      max_tokens: maxTokens,
    });
    return stream;
  } catch (error) {
    if (error.message?.includes("exceeded your monthly included credits")) {
      const creditError = new Error("API_CREDIT_LIMIT_EXCEEDED");
      creditError.status = 429;
      throw creditError;
    }
    throw error;
  }
}

export function createReadableStream(stream, onComplete) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      try {
        let fullResponse = "";
        for await (const chunk of stream) {
          if (chunk.choices && chunk.choices.length > 0) {
            const content = chunk.choices[0].delta.content;
            fullResponse += content;
            controller.enqueue(encoder.encode(content));
          }
        }

        // Call the completion callback with the full response
        if (onComplete) {
          await onComplete(fullResponse);
        }

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

export async function start(messages) {
  try {
    const response = await client.chatCompletionStream({
      model: "deepseek-ai/deepseek-coder-6.7b-instruct",
      messages: messages,
    });
    return response;
  } catch (error) {
    if (error.message?.includes("exceeded your monthly included credits")) {
      throw new Error("API_CREDIT_LIMIT_EXCEEDED");
    }
    throw error;
  }
}
