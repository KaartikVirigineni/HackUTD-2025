import { GoogleGenAI } from "@google/genai";
import readline from "readline";

const ai = new GoogleGenAI({ apiKey: "AIzaSyDc-sdnVeqVMBMNNjPz71H3-n1q_YUuJ8Y" });


let conversation = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function chat(userMessage) {
  conversation.push({ role: "user", content: userMessage });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: conversation.map(msg => msg.content).join("\n")
  });

  const text = response.text;
  conversation.push({ role: "assistant", content: text });
  return text;
}

function ask() {
  rl.question("You: ", async (msg) => {
    const reply = await chat(msg);
    console.log("AI:", reply);
    ask();
  });
}

ask();
