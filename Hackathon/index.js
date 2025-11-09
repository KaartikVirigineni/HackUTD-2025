import { GoogleGenAI } from "@google/genai";
import readline from "readline";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://abheupvblxijzvoibmjn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiaGV1cHZibHhpanp2b2libWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NDE2OTIsImV4cCI6MjA3ODIxNzY5Mn0.EIROMlSeG9gu1_jfmN4GLekL1px0a9gd6yd640OPqCA';
const supabase = createClient(supabaseUrl, supabaseKey);

const ai = new GoogleGenAI({ apiKey: "AIzaSyDc-sdnVeqVMBMNNjPz71H3-n1q_YUuJ8Y" });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Fetch listings and parse into simple objects
async function getListings() {
  const { data, error } = await supabase.from("listings").select("*");
  if (error) {
    console.error("Supabase error:", error);
    return [];
  }

  return data.map(l => ({
    id: l.id,
    url: l.url,
    price: l.price?.toString() || "N/A",
    bed: l.beds?.toString() || "N/A",
    bath: l.baths?.toString() || "N/A",
    address: l.fullAddress || "N/A",
    city: l.city || "N/A",
    state: l.state || "N/A",
    street: l.street || "N/A",
    zip: l.zipcode || "N/A",
    mainImg: l.image || "N/A",
    otherImgs: l.photos || []
  }));
}

async function rateListing(listing, userMessage) {
  const prompt = `You are a real estate expert. Here are the house listings: ${JSON.stringify(listing)}
based on the user description: "${userMessage}" find the best fit present it to the user
and then Give the listing a rating: Excellent, Good, or Bad. Provide one short sentence 
explaining why it is rated that way. Respond only with the rating and reasoning. and alwas 
ask for clarificationmif the user enters anything unrelated to real estate. if the user enters
a place where you donthav ethe information say you dont have that info avalible, also always 
make sure that if number are entered thye are either an adress, part of an adress, or a zip code`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt
  });

  return response.text.trim();
}
function startConversation() {
  const aiPrompt = "Hi! I'm your real estate assistant. What kind of house are you looking for today?";
  console.log("AI:", aiPrompt);
}

  async function main(userMessage) {
  const listings = await getListings();
  if (!listings.length) return "No listings available.";

  const listing = listings[0];
  const rating = await rateListing(listing, userMessage);
  return rating;
}


function ask() {
  rl.question("You: ", async msg => {
    const reply = await main(msg);
    console.log("AI:", reply);
    ask();
  });
}

startConversation();
ask();
