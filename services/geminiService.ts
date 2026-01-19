
import { GoogleGenAI, Type } from "@google/genai";
import { JRCGame, GenerationRequest } from "../types";

export const generateJRC = async (req: GenerationRequest): Promise<JRCGame> => {
  // Inicialização direta com a chave de ambiente
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

  const systemInstruction = `Você é um Diretor de Metodologia de Futebol especialista em Periodização Tática. 
  Sua tarefa é projetar Jogos Reduzidos e Condicionados (JRC) sistêmicos.
  IMPORTANTE: Retorne APENAS o JSON, sem markdown ou explicações extras.
  As coordenadas startX, startY, endX, endY devem ser números entre 5 e 95.`;

  const prompt = `Gere um JRC completo em formato JSON para o tema: "${req.theme}".
    Categoria: ${req.category}.
    Duração: ${req.duration}.
    Intensidade: ${req.intensity}.
    Inclua 8 jogadores no campo (visualData.players) com posições iniciais e finais que façam sentido tático para o tema.`;

  try {
    console.log("Iniciando geração com Gemini Flash...");
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Modelo mais rápido e responsivo
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

    const text = response.text;
    if (!text) throw new Error("Resposta vazia da IA.");
    
    console.log("Geração concluída com sucesso.");
    const data = JSON.parse(text);
    return {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      theme: req.theme,
      category: req.category,
      duration: req.duration
    };
  } catch (error: any) {
    console.error("Erro detalhado na geração:", error);
    throw new Error(error.message || "Falha na comunicação com o cérebro da IA.");
  }
};
