import { useState } from "react";
import { toast } from "sonner";

export function useAI() {
  const [loading, setLoading] = useState(false);

  const generate = async (prompt: string, maxTokens = 4096): Promise<string | null> => {
    setLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: maxTokens,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Anthropic API error:", response.status, errText);
        toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
        return null;
      }

      const data = await response.json();
      const text = data.content?.[0]?.text || "";
      return text;
    } catch (err) {
      console.error("AI Error:", err);
      toast.error("ไม่สามารถเชื่อมต่อได้ กรุณาตรวจสอบอินเทอร์เน็ต");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateJSON = async <T = any>(prompt: string, maxTokens = 4096): Promise<T | null> => {
    const text = await generate(prompt, maxTokens);
    if (!text) return null;
    try {
      const clean = text.replace(/```json|```/g, "").trim();
      return JSON.parse(clean) as T;
    } catch {
      console.error("JSON parse error, raw:", text);
      toast.error("เกิดข้อผิดพลาดในการอ่านข้อมูล กรุณาลองใหม่");
      return null;
    }
  };

  return { generate, generateJSON, loading };
}
