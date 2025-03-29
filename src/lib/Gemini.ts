import { DronacharyaAIAgent } from "@/prompt/prompt";

const apikey: string | undefined = process.env.NEXT_PUBLIC_API_KEY;

if (!apikey) {
  throw new Error("API key is missing.");
}
console.log(apikey)

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: Array<{ type: "text"; text: string }>;
}

interface ApiResponse {
  choices?: Array<{ delta?: { content?: string } }>;
}

type HandleChunk = (chunk: string | undefined) => void;


const Gemma = {
    /*function to call the Lmm */
  ask: async (message: string, handleChunk: HandleChunk): Promise<void> => {
    /*input contains prompt **src/prompt/prompt.ts**  +  message*/
    const inputText: string = `${DronacharyaAIAgent}\n\n\n${message}`;

    try {
      const response: Response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apikey}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-lite-001",
          messages: [{ role: "user", content: [{ type: "text", text: inputText }] }] as ChatMessage[],
          stream: true,
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Readable stream is not available.");

      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n").filter(line => line.startsWith("data: "));
        buffer = "";

        for (const part of parts) {
          try {
            const trimmed = part.replace("data: ", "").trim();
            if (trimmed === "[DONE]") break;

            const json: ApiResponse = JSON.parse(trimmed);
            const content : string | undefined = json.choices?.[0]?.delta?.content;
            handleChunk(content);
            console.log(content);
          } catch (err) {
            console.error("Error parsing JSON chunk:", part, err);
          }
        }
      }
    } catch (error) {
      console.error("Error streaming data:", error);
    }
  },
};

export default Gemma;
