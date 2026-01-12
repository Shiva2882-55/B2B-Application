
import { GoogleGenAI, Type } from "@google/genai";

// Always use named parameters for initialization and use process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSupplyChainInsights = async (inventoryData: any, role: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `As a supply chain AI assistant for a ${role}, analyze this data: ${JSON.stringify(inventoryData)}. 
      Provide 3 concise strategic recommendations for bulk buying or distribution management. 
      Format as a JSON object with an array of recommendations.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  urgency: { type: Type.STRING }
                },
                required: ["title", "description", "urgency"]
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || '{"recommendations": []}');
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return { recommendations: [] };
  }
};

export const analyzeSupportIssue = async (issue: { type: string, description: string }) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a Senior Technical Support Lead. A retailer has reported a problem:
      Category: ${issue.type}
      Description: ${issue.description}
      
      Tasks:
      1. Provide a "Severity Level" (Low, Medium, High, Critical).
      2. Generate a "Technical Brief" for the engineering team.
      3. Give 2 "Immediate Steps" the retailer can take.
      
      Return as a JSON object.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            severity: { type: Type.STRING },
            technicalBrief: { type: Type.STRING },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["severity", "technicalBrief", "suggestions"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Support Analysis Error:", error);
    return null;
  }
};
