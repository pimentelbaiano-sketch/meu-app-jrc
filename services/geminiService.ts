
import { GoogleGenAI, Type } from "@google/genai";
import { JRCGame, GenerationRequest } from "../types";

export const generateJRC = async (req: GenerationRequest): Promise<JRCGame> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

  const systemInstruction = `Você é um Diretor de Metodologia de Futebol de Elite.
  Sua especialidade é projetar Jogos Reduzidos e Condicionados (JRC) baseados na Periodização Tática e Teoria da Complexidade.
  Ao criar a prancheta visual (visualData), forneça sempre 8 jogadores com coordenadas X e Y entre 5 e 95 para garantir que fiquem visíveis no campo.
  O time A deve atacar da esquerda para a direita, e o time B da direita para a esquerda.`;

  const prompt = `Crie um JRC técnico-tático completo:
    TEMA: ${req.theme}
    CATEGORIA: ${req.category}
    DURAÇÃO: ${req.duration}
    INTENSIDADE: ${req.intensity}
    
    O JSON deve conter: title, description, systemicFocus, setup (players, dimensions, materials[]), rules[], visualData (players[] com id, team, label, startX, startY, endX, endY).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction,
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
          required: ["title", "description", "rules", "visualData", "systemicFocus"]
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
  } catch (error) {
    console.error("Falha na geração do JRC:", error);
    throw error;
  }
};
