
import { GoogleGenAI, Type } from "@google/genai";
import { JRCGame, GenerationRequest } from "../types";

export const generateJRC = async (req: GenerationRequest): Promise<JRCGame> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

  const prompt = `
    Como um Diretor de Metodologia de futebol de elite, projete um Jogo Reduzido e Condicionado (JRC) sistêmico.
    TEMA: ${req.theme}
    CATEGORIA: ${req.category}
    DURAÇÃO: ${req.duration}
    INTENSIDADE: ${req.intensity}
    
    Retorne um JSON com: title, description, setup (players, dimensions, materials[]), rules[], systemicFocus, visualData (8 players com startX, startY, endX, endY de 0 a 100).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          setup: {
            type: Type.OBJECT,
            properties: {
              players: { type: Type.STRING },
              dimensions: { type: Type.STRING },
              materials: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          rules: { type: Type.ARRAY, items: { type: Type.STRING } },
          systemicFocus: { type: Type.STRING },
          visualData: {
            type: Type.OBJECT,
            properties: {
              players: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    team: { type: Type.STRING },
                    label: { type: Type.STRING },
                    startX: { type: Type.NUMBER },
                    startY: { type: Type.NUMBER },
                    endX: { type: Type.NUMBER },
                    endY: { type: Type.NUMBER }
                  }
                }
              }
            }
          }
        },
        required: ["title", "description", "rules", "visualData"]
      }
    }
  });

  const data = JSON.parse(response.text || "{}");
  return {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
    theme: req.theme,
    category: req.category,
    duration: req.duration
  };
};

