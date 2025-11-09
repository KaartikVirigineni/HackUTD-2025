import { GoogleGenAI } from "@google/genai";
import readline from "readline";

import fs from "fs";

const ai = new GoogleGenAI({ apiKey: "AIzaSyDc-sdnVeqVMBMNNjPz71H3-n1q_YUuJ8Y" });

const parser = fs.readFileSync('./listings.json', 'utf8');
const listings = JSON.parse(parser);

let conversation = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function chat(userMessage) {
  conversation.push({ role: "user", content: userMessage });
 
  const prompt = `You are a real estate expert who only knowws about these listings: ${JSON.stringify(listings)}
  User question: ${userMessage} If given a number with no other context, ask for context. 
  Respond with the best matching listing ONLY THREE, and then ask if they want more, NO OUTSIDE KNOWLEDGE In regards to real estate data, DO NOT ANSWER ANY OTHER QUESTIONS.
  If provided with numbers check if its an adress or zip code if not they say you cant provide information, 
  if the user asks for something outside of the listings then say you are unable to find that,
  summarize as Grade A+ to F-, and explain why.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt
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
