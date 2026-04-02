import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useAI() {
  const [loading, setLoading] = useState(false);

  const generate = async (prompt: string, maxTokens = 4096): Promise<string | null> => {
    setLoading(true);
    try {
      console.log("Calling AI with prompt length:", prompt.length);

      const { data, error } = await supabase.functions.invoke("generate-ai", {
        body: { prompt, max_tokens: maxTokens },
      });

      console.log("AI Response data:", data);
      console.log("AI Response error:", error);

      if (error) {
        console.error("Supabase function error:", error);
        toast.error("เกิดข้อผิดพลาด: " + (error.message || "Unknown error"));
        return null;
      }

      if (data?.error) {
        console.error("AI gateway error:", data.error);
        toast.error("AI Error: " + data.error);
        return null;
      }

      return data?.text || null;
    } catch (err) {
      console.error("Network error:", err);
      toast.error("ไม่สามารถเชื่อมต่อ AI ได้ กรุณาลองใหม่");
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
