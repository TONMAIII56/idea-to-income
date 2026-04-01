import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useAI() {
  const [loading, setLoading] = useState(false);

  const generate = async (prompt: string, maxTokens = 4096): Promise<string | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-ai", {
        body: { prompt, max_tokens: maxTokens },
      });

      if (error) {
        console.error("AI Error:", error);
        toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
        return null;
      }

      if (data?.error) {
        toast.error(data.error);
        return null;
      }

      return data?.text || null;
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
