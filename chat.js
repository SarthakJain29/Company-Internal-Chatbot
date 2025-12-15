import Groq from "groq-sdk";
import readline from "node:readline/promises";
import { vectorStore } from "./prepare.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function chat() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const question = await rl.question("You: ");
    if (question === "/bye") {
      break;
    }

    //retrieval step
    const relevantChunks = await vectorStore.similaritySearch(question, 3);
    //similarity search gives us info relevant to the query
    const context = relevantChunks
      .map((chunk) => chunk.pageContent)
      .join("\n\n");

    const SYSTEM_PROMPT = `You are an assistant for question-answering tasks. Use the following relevant pieces of retrived context to answer the query. If you dont know the answer, say I dont know`

    const userQuery = `Question: ${question}
    Relevant context: ${context}
    Answer:`;  //updated prompt which we will send to llm

    const completion = await groq.chat.completions.create({
      messages: [
        {
            role: "system",
            content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userQuery,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    console.log(`Assistant: ${completion.choices[0].message.content}`)
    
  }
  rl.close();
}

chat();
