import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the API client
// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

export const generateStudyAid = async (
  contextText: string,
  userQuery: string
): Promise<string> => {
  try {
    const systemInstruction = `
      당신은 고도로 훈련된 학습 조교 'Study OS AI'입니다.
      당신의 목표는 학생이 제공된 학습 자료를 완벽하게 이해하도록 돕는 것입니다.
      
      지침:
      1. **항상 한국어로 답변하십시오.**
      2. 가능하면 제공된 [Context Material]을 근거로 인용하여 설명하십시오.
      3. 사용자가 요약을 요청하면, 구조화된 개조식(bullet-point)으로 정리하십시오.
      4. 사용자가 퀴즈를 요청하면, 문맥에 기반한 객관식 문제 3개를 생성하십시오.
      5. 친절하고 격려하는 어조를 유지하십시오.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `[Context Material]:\n${contextText}\n\n[User Query]: ${userQuery}`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "제공된 문맥을 바탕으로 답변을 생성할 수 없습니다.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "요청을 처리하는 중에 오류가 발생했습니다. API 키를 확인해 주세요.";
  }
};

export const analyzeWeakness = async (topics: string[]): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `다음 학습 주제들을 바탕으로 약점 분석을 해주세요: ${topics.join(', ')}. 이 주제들에서 학생들이 주로 어려워하는 부분과 추천 학습 계획을 한국어로 제안해 주세요.`
    });
    return response.text || "분석 결과를 가져올 수 없습니다.";
  } catch (error) {
    return "지금은 약점 분석을 수행할 수 없습니다.";
  }
};