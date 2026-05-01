import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const analyzeRoadImage = async (base64Image: string) => {
  const model = "gemini-3.1-pro-preview";
  const prompt = `Analyze this road surface image for defects. 
  Detect: Cracks, Potholes, Surface wear, Rutting.
  Provide a JSON response with:
  - condition: "Good" | "Moderate" | "Poor"
  - damagePercentage: number (0-100)
  - detectedIssues: string[]
  - suggestions: string (maintenance advice)`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "image/jpeg", data: base64Image } }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          condition: { type: Type.STRING },
          damagePercentage: { type: Type.NUMBER },
          detectedIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestions: { type: Type.STRING }
        },
        required: ["condition", "damagePercentage", "detectedIssues", "suggestions"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const getChatResponse = async (history: { role: 'user' | 'model', parts: { text: string }[] }[], message: string) => {
  const model = "gemini-3.1-pro-preview";
  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction: `You are an expert assistant for the "EcoRoad: Textile Waste Asphalt Platform". 
      Your goal is to help users understand how textile waste (polyester, cotton, etc.) can be used as a sustainable material in asphalt road construction.
      Explain the benefits: durability, crack resistance, environmental sustainability.
      Guide users on using the Waste Analysis Tool and Road Quality Detection tool.
      Be professional, scientific, and encouraging about sustainable infrastructure.
      
      IMPORTANT: Format your responses clearly using Markdown. Use bullet points, numbered lists, and bold text for emphasis. 
      Avoid long, dense paragraphs. Break information into digestible sections.`,
    },
    history
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};

export const calculateWasteImpact = (amount: number) => {
  // Simple heuristic for demo purposes
  const landfillDiverted = amount; // kg
  const co2Saved = amount * 1.5; // kg CO2 equivalent (estimated)
  const materialSaved = amount * 0.8; // kg of virgin bitumen/aggregate saved
  
  return {
    landfillDiverted,
    co2Saved,
    materialSaved
  };
};

export const getWasteRecommendation = (type: string, amount: number, form: string) => {
  // Heuristic logic for waste analysis
  let percentage = 2.5;
  let suitability = "High";
  let improvement = "Significant increase in fatigue life and rutting resistance.";

  if (type.toLowerCase().includes("cotton")) {
    percentage = 1.5;
    suitability = "Moderate";
    improvement = "Improved tensile strength; requires careful moisture sensitivity monitoring.";
  } else if (type.toLowerCase().includes("polyester")) {
    percentage = 3.0;
    suitability = "Very High";
    improvement = "Excellent thermal cracking resistance and high-temperature stability.";
  }

  return {
    recommendedPercentage: percentage,
    suitabilityRating: suitability,
    durabilityImprovement: improvement
  };
};
