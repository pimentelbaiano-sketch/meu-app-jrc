
import { GoogleGenAI, Type } from "@google/genai";
import { JRCGame, GenerationRequest } from "../types";

export const generateJRC = async (req: GenerationRequest): Promise<JRCGame> => {
  // Inicializa o cliente com a chave de API do ambiente
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

  const systemInstruction = `Você é um Diretor de Metodologia especialista em Periodização Tática e Teoria da Complexidade aplicada ao futebol. 
  Seu objetivo é projetar Jogos Reduzidos e Condicionados (JRC) que foquem na dimensão tática, mas sem descurar das outras (técnica, física, psicológica).
  Utilize conceitos como: Densidade de Jogo, Princípios e Sub-princípios de Jogo, Comportamentos Emergentes e Auto-organização.`;

  const prompt = `Projete um JRC sistêmico com os seguintes parâmetros:
    TEMA: ${req.theme}
    CATEGORIA: ${req.category}
    DURAÇÃO ESTIMADA: ${req.duration}
    INTENSIDADE: ${req.intensity}
    
    O resultado deve ser um plano de treino detalhado para um técnico profissional.
    Inclua dados visuais para 8 jogadores (4 vs 4) simulando um cenário real deste tema.`;

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
            complexityPrinciples: { type: Type.ARRAY, items: { type: Type.STRING } },
            emergentBehaviors: { type: Type.ARRAY, items: { type: Type.STRING } },
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
    if (!text) throw new Error("A IA não retornou conteúdo.");
    
    const parsed = JSON.parse(text);
    return {
      ...parsed,
      id: Math.random().toString(36).substr(2, 9),
      theme: req.theme,
      category: req.category,
      duration: req.duration
    };
  } catch (error) {
    console.error("Erro na geração Gemini:", error);
    throw error;
  }
};
