import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), service: "Kooking API Server" });
});

// AI Chef Chat Endpoint
app.post("/api/ai/chef-chat", async (req, res) => {
  const { message, fridgeItems = [], preferences = "", history = [] } = req.body;

  try {
    const ai = getGenAI();
    if (ai) {
      const systemInstruction = `당신은 친절하고 전문적인 대한민국 최고의 스마트 AI 요리 셰프 '쿠킹(Kooking) AI'입니다.
사용자가 가진 재료(냉장고 재료), 요리 목적, 식단(다이어트, 채식 등), 난이도에 맞춰 맛있고 실현 가능한 레시피와 팁을 제안합니다.
- 친절하고 위트 있는 한국어로 답변하세요.
- 재료 양(g/큰술)과 조리 단계(Step), 조리 시간, 셰프의 꿀팁을 깔끔한 마크다운 형식으로 작성하세요.
- 사용자가 냉장고 재료를 주면 우선적으로 해당 재료를 활용하는 레시피를 제안하세요.`;

      const prompt = `[냉장고 보유 재료]: ${fridgeItems.join(", ") || "지정되지 않음"}
[식단/선호도]: ${preferences || "없음"}
[사용자 질문]: ${message}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({
        reply: response.text,
        success: true,
      });
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error?.message || error);
  }

  // Smart fallback response if API key is not yet set or errored
  let fallbackReply = `안녕하세요! Kooking AI 셰프입니다. 👩‍🍳\n\n`;
  if (fridgeItems.length > 0) {
    fallbackReply += `냉장고에 있는 **${fridgeItems.join(", ")}** 재료를 활용한 추천 요리를 제안해 드립니다!\n\n`;
    fallbackReply += `### 🍳 추천 레시피: **초간단 ${fridgeItems[0] || "달걀"} 볶음밥 & 전골**\n`;
    fallbackReply += `- **예상 조리시간**: 15분\n`;
    fallbackReply += `- **난이도**: ★☆☆ (초보 가능)\n\n`;
    fallbackReply += `#### 📌 조리 단계:\n`;
    fallbackReply += `1. **재료 손질**: ${fridgeItems.join(", ")}을(를) 한 입 크기로 깍둑썰기합니다.\n`;
    fallbackReply += `2. **팬 예열**: 달군 팬에 식용유 1큰술과 다진 마늘을 넣고 향을 냅니다.\n`;
    fallbackReply += `3. **볶기**: 손질한 재료를 센 불에서 3분간 고르게 볶아줍니다.\n`;
    fallbackReply += `4. **간 맞추기**: 굴소스 1큰술(또는 진간장 1큰술)과 참기름을 둘러 완성합니다.\n\n`;
    fallbackReply += `💡 **셰프의 팁**: 불을 끄기 직전에 후추를 살짝 뿌려주면 풍미가 훨씬 살아납니다!`;
  } else {
    fallbackReply += `어떤 요리를 찾고 계신가요? 냉장고에 남은 재료를 알려주시면 가장 맛있는 맞춤형 레시피를 제안해 드릴게요!\n예: "두부랑 계란으로 10분 만에 만들 수 있는 다이어트 요리 알려줘"`;
  }

  return res.json({
    reply: fallbackReply,
    success: true,
    fallback: true,
  });
});

// Mock Vision AI ingredient extractor
app.post("/api/v1/ai/vision-extract", async (req, res) => {
  const { imageBase64 } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: "Image data is required" });
  }

  // Vision AI mock extraction results
  setTimeout(() => {
    res.json({
      detectedIngredients: [
        { name: "계란", confidence: 0.98, count: "3개", freshScore: "A+" },
        { name: "양파", confidence: 0.94, count: "1개", freshScore: "A" },
        { name: "대파", confidence: 0.91, count: "1/2대", freshScore: "B+" },
        { name: "스팸/햄", confidence: 0.88, count: "1캔", freshScore: "A" },
        { name: "김치", confidence: 0.95, count: "150g", freshScore: "A+" },
      ],
      suggestedRecipes: ["스팸 김치찌개", "계란 볶음밥", "대파 계란말이"],
      success: true,
    });
  }, 600);
});

// RESTful Mock APIs for 30 Specifications
app.post("/api/v1/auth/login", (req, res) => {
  const { email, password } = req.body;
  res.json({
    token: "mock-jwt-token-kooking-" + Date.now(),
    refreshToken: "mock-refresh-token-" + Date.now(),
    user: {
      id: "usr_101",
      email: email || "kooking_chef@example.com",
      name: email ? email.split("@")[0] : "마스터셰프",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      role: "chef",
    },
  });
});

app.post("/api/v1/orders/mealkit", (req, res) => {
  const { items, address, paymentMethod } = req.body;
  res.json({
    orderId: "ORD-" + Math.floor(100000 + Math.random() * 900000),
    status: "CONFIRMED",
    totalAmount: items?.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0) || 15000,
    estimatedDelivery: "내일 새벽 07:00 도착 보장",
    paymentMethod: paymentMethod || "TOSS_PAY",
  });
});

// Vite Middleware integration for Fullstack
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🍳 Kooking server running on port ${PORT}`);
  });
}

startServer();
