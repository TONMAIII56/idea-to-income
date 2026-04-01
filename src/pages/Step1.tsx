import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepLayout from "@/components/StepLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAI } from "@/hooks/useAI";
import { toast } from "sonner";
import {
  Lightbulb,
  Sparkles,
  PenLine,
  Send,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Users,
  DollarSign,
  CheckCircle2,
} from "lucide-react";

interface IdeaResult {
  title: string;
  subtitle: string;
  target: string;
  why: string;
  price: string;
  chapters: string[];
}

interface AIResponse {
  ideas: IdeaResult[];
  analysis: string;
}

const quickFills = [
  "ทำบัญชีมา 5 ปี เพื่อนถามเรื่อง Excel กับภาษี",
  "เป็นแม่บ้าน ทำอาหาร meal prep เก่ง",
  "ทำ IT support แก้ปัญหาคอมให้คนทั้งออฟฟิศ",
  "สอนพิเศษเด็กมัธยม วิชาคณิตศาสตร์",
];

// Manual mode questions
const questions = [
  "ความรู้อะไรที่คนเคยมาถามคุณซ้ำๆ?",
  "คุณทำอะไรได้ดีกว่าคนรอบข้าง?",
  "คุณเคยช่วยแก้ปัญหาอะไรให้คนอื่นบ้าง?",
  "ถ้าจะสอนใครสักคนเรื่องหนึ่ง คุณจะสอนอะไร?",
  "คุณใช้เวลาว่างทำอะไรที่คนอื่นอาจไม่ทำ?",
  "มีเครื่องมือหรือวิธีลัดอะไรที่คุณรู้แต่คนอื่นไม่รู้?",
  "ถ้าเขียนหนังสือได้ 1 เล่ม จะเขียนเรื่องอะไร?",
];

const scoringCriteria = [
  { key: "demand", label: "ความต้องการ", desc: "คนอยากได้แค่ไหน?" },
  { key: "competition", label: "การแข่งขัน", desc: "คู่แข่งน้อย = คะแนนสูง" },
  { key: "skill", label: "ทักษะคุณ", desc: "คุณเก่งเรื่องนี้แค่ไหน?" },
  { key: "speed", label: "ทำได้เร็ว", desc: "สร้างได้เร็วแค่ไหน?" },
];

interface IdeaScore {
  name: string;
  scores: Record<string, number>;
}

export default function Step1() {
  const navigate = useNavigate();
  const { generateJSON, loading } = useAI();

  // Mode: null = choosing, "ai" = AI mode, "manual" = manual mode
  const [mode, setMode] = useLocalStorage<string | null>("step1-mode", null);
  const [userInput, setUserInput] = useLocalStorage<string>("user-input", "");
  const [aiResult, setAiResult] = useLocalStorage<AIResponse | null>("ai-ideas-result", null);
  const [selectedIdea, setSelectedIdea] = useLocalStorage<IdeaResult | null>("selected-idea", null);

  // Manual mode state
  const [manualStep, setManualStep] = useLocalStorage<number>("step1-manual-step", 0);
  const [answers, setAnswers] = useLocalStorage<string[]>("step1-answers", Array(7).fill(""));
  const [ideas, setIdeas] = useLocalStorage<IdeaScore[]>("step1-ideas", [
    { name: "", scores: { demand: 0, competition: 0, skill: 0, speed: 0 } },
    { name: "", scores: { demand: 0, competition: 0, skill: 0, speed: 0 } },
    { name: "", scores: { demand: 0, competition: 0, skill: 0, speed: 0 } },
  ]);

  const handleAISend = async () => {
    if (!userInput.trim()) {
      toast.error("กรุณาพิมพ์ข้อมูลก่อน");
      return;
    }

    const prompt = `คุณเป็น AI ที่ช่วยคนไทยหาไอเดียทำ Ebook ขาย

ผู้ใช้บอกว่า: "${userInput}"

จากข้อมูลนี้ ช่วยแนะนำ 3 ไอเดีย Ebook ที่เหมาะกับเขา

ตอบเป็น JSON เท่านั้น ไม่ต้องมี markdown backtick:
{
  "ideas": [
    {
      "title": "ชื่อ ebook ภาษาไทย",
      "subtitle": "subtitle สั้นๆ",
      "target": "กลุ่มเป้าหมาย",
      "why": "ทำไมน่าจะขายได้ (1 ประโยค)",
      "price": "ราคาแนะนำ",
      "chapters": ["ชื่อบทที่ 1", "ชื่อบทที่ 2", "ชื่อบทที่ 3", "ชื่อบทที่ 4", "ชื่อบทที่ 5"]
    }
  ],
  "analysis": "วิเคราะห์สั้นๆ ว่าผู้ใช้มีจุดแข็งอะไร"
}`;

    const result = await generateJSON<AIResponse>(prompt);
    if (result) {
      setAiResult(result);
    }
  };

  const handleSelectIdea = (idea: IdeaResult) => {
    setSelectedIdea(idea);
    localStorage.setItem("step1-completed", "true");
    toast.success(`เยี่ยม! พร้อมสร้าง ebook '${idea.title}' แล้ว!`);
  };

  const handleGoToStep2 = () => {
    navigate("/step/2");
  };

  // Manual mode handlers
  const updateAnswer = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const updateIdeaName = (index: number, name: string) => {
    const newIdeas = [...ideas];
    newIdeas[index] = { ...newIdeas[index], name };
    setIdeas(newIdeas);
  };

  const updateScore = (ideaIndex: number, criterion: string, score: number) => {
    const newIdeas = [...ideas];
    newIdeas[ideaIndex] = {
      ...newIdeas[ideaIndex],
      scores: { ...newIdeas[ideaIndex].scores, [criterion]: score },
    };
    setIdeas(newIdeas);
  };

  const getTotal = (idea: IdeaScore) =>
    Object.values(idea.scores).reduce((a, b) => a + b, 0);

  const handleManualSelect = (idea: IdeaScore) => {
    if (!idea.name.trim()) {
      toast.error("กรุณาใส่ชื่อไอเดียก่อน");
      return;
    }
    const selected: IdeaResult = {
      title: idea.name,
      subtitle: "",
      target: "",
      why: "",
      price: "",
      chapters: [],
    };
    setSelectedIdea(selected);
    localStorage.setItem("step1-completed", "true");
    toast.success(`เยี่ยม! พร้อมสร้าง ebook '${idea.name}' แล้ว!`);
  };

  // Render mode selector
  if (!mode) {
    return (
      <StepLayout
        currentStep={1}
        title="ค้นหาไอเดีย Ebook ของคุณ"
        subtitle="เลือกวิธีที่เหมาะกับคุณ"
      >
        <div className="space-y-4 max-w-md mx-auto">
          <button
            onClick={() => setMode("ai")}
            className="w-full p-6 rounded-2xl border-2 border-accent bg-accent/5 hover:bg-accent/10 transition-all text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="h-6 w-6 text-accent" />
              <span className="text-lg font-bold">⚡ ให้ AI ช่วยคิด</span>
              <span className="text-[10px] bg-accent text-accent-foreground px-2 py-0.5 rounded-full font-semibold">
                แนะนำ
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              แค่เล่าว่าคุณเก่งอะไร AI จะแนะนำไอเดีย Ebook ให้ใน 30 วินาที
            </p>
          </button>

          <button
            onClick={() => setMode("manual")}
            className="w-full p-5 rounded-2xl border border-border hover:border-muted-foreground/30 transition-all text-left"
          >
            <div className="flex items-center gap-3 mb-1">
              <PenLine className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">✍️ กรอกเอง</span>
            </div>
            <p className="text-sm text-muted-foreground">
              ตอบ 7 คำถาม + ให้คะแนนไอเดียด้วยตัวเอง
            </p>
          </button>

          <p className="text-center text-xs text-muted-foreground">
            คนส่วนใหญ่เลือก AI ช่วย — เร็วกว่า 10 เท่า
          </p>
        </div>
      </StepLayout>
    );
  }

  // Selected idea confirmation
  if (selectedIdea) {
    return (
      <StepLayout
        currentStep={1}
        title="เลือกไอเดียเรียบร้อย! ✅"
        subtitle={`คุณเลือก: ${selectedIdea.title}`}
      >
        <Card className="mb-6 border-accent/40">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold">{selectedIdea.title}</h3>
                {selectedIdea.subtitle && (
                  <p className="text-muted-foreground">{selectedIdea.subtitle}</p>
                )}
                {selectedIdea.target && (
                  <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    🎯 {selectedIdea.target}
                  </span>
                )}
                {selectedIdea.chapters && selectedIdea.chapters.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold mb-2">สารบัญเบื้องต้น:</p>
                    <ul className="space-y-1">
                      {selectedIdea.chapters.map((ch, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-accent/15 text-accent text-[10px] flex items-center justify-center font-bold flex-shrink-0">
                            {i + 1}
                          </span>
                          {ch}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleGoToStep2}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-base py-6"
          size="lg"
        >
          ไปสร้าง Ebook เลย →
        </Button>

        <Button
          variant="ghost"
          className="w-full mt-2"
          onClick={() => {
            setSelectedIdea(null);
            localStorage.removeItem("step1-completed");
          }}
        >
          เลือกไอเดียอื่น
        </Button>
      </StepLayout>
    );
  }

  // AI Mode
  if (mode === "ai") {
    return (
      <StepLayout
        currentStep={1}
        title="AI ช่วยหาไอเดีย Ebook"
        subtitle="เล่าให้ AI ฟังว่าคุณเก่งอะไร — ได้ไอเดียใน 30 วินาที"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMode(null)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          เลือกโหมดใหม่
        </Button>

        {/* AI Chat */}
        <div className="space-y-4 mb-6">
          {/* AI bubble */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-4 w-4 text-accent" />
            </div>
            <div className="bg-secondary rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
              <p className="text-sm">
                เล่าให้ฟังสั้นๆ ว่าตอนนี้คุณทำอะไรอยู่ เก่งเรื่องอะไร คนชอบมาถามคุณเรื่องอะไร?
              </p>
            </div>
          </div>

          {/* User input */}
          {!aiResult && (
            <>
              <div className="pl-11">
                <Textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="เช่น: ผมทำกราฟิกมา 5 ปี เพื่อนชอบให้ช่วยทำโลโก้"
                  className="resize-none min-h-[100px]"
                  rows={4}
                  disabled={loading}
                />
                <Button
                  onClick={handleAISend}
                  disabled={loading || !userInput.trim()}
                  className="w-full mt-3 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold py-5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      🔍 AI กำลังวิเคราะห์ทักษะของคุณ...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      ส่ง
                    </>
                  )}
                </Button>
              </div>

              {/* Quick fill pills */}
              <div className="pl-11">
                <p className="text-xs text-muted-foreground mb-2">ลองกดตัวอย่าง:</p>
                <div className="flex flex-wrap gap-2">
                  {quickFills.map((text, i) => (
                    <button
                      key={i}
                      onClick={() => setUserInput(text)}
                      className="text-xs bg-secondary hover:bg-secondary/80 text-foreground px-3 py-1.5 rounded-full border border-border transition-colors"
                    >
                      {text}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* User message bubble */}
          {aiResult && (
            <div className="flex gap-3 justify-end">
              <div className="bg-accent/15 rounded-2xl rounded-tr-md px-4 py-3 max-w-[85%]">
                <p className="text-sm">{userInput}</p>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-4 w-4 text-accent" />
              </div>
              <div className="bg-secondary rounded-2xl rounded-tl-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-accent" />
                  <p className="text-sm text-muted-foreground">🔍 กำลังวิเคราะห์ทักษะของคุณ...</p>
                </div>
              </div>
            </div>
          )}

          {/* AI Results */}
          {aiResult && !loading && (
            <>
              {/* Analysis bubble */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-accent" />
                </div>
                <div className="bg-secondary rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
                  <p className="text-sm">{aiResult.analysis}</p>
                  <p className="text-sm mt-2 font-semibold">นี่คือ 3 ไอเดีย Ebook ที่เหมาะกับคุณ:</p>
                </div>
              </div>

              {/* Idea cards */}
              <div className="pl-11 space-y-4">
                {aiResult.ideas.map((idea, i) => (
                  <Card
                    key={i}
                    className="border hover:border-accent/40 transition-all hover:shadow-md"
                  >
                    <CardContent className="pt-5 pb-4">
                      <h3 className="text-lg font-bold mb-1">{idea.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{idea.subtitle}</p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {idea.target}
                        </span>
                        <span className="text-xs bg-green-500/10 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {idea.price}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground mb-3">{idea.why}</p>

                      {/* Chapter preview */}
                      <div className="bg-secondary/50 rounded-lg p-3 mb-3">
                        <p className="text-xs font-semibold mb-1.5">สารบัญเบื้องต้น:</p>
                        <ul className="space-y-1">
                          {idea.chapters.map((ch, j) => (
                            <li key={j} className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-accent/15 text-accent text-[9px] flex items-center justify-center font-bold flex-shrink-0">
                                {j + 1}
                              </span>
                              {ch}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button
                        onClick={() => handleSelectIdea(idea)}
                        className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                      >
                        เลือกอันนี้ →
                      </Button>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setAiResult(null);
                  }}
                >
                  ลองใหม่ด้วยข้อมูลอื่น
                </Button>
              </div>
            </>
          )}
        </div>
      </StepLayout>
    );
  }

  // Manual Mode (Typeform-style)
  if (mode === "manual") {
    const isQuestionPhase = manualStep < 7;
    const isScoringPhase = manualStep >= 7;
    const maxTotal = Math.max(...ideas.map(getTotal));

    return (
      <StepLayout
        currentStep={1}
        title={isQuestionPhase ? "กรอกเอง — คำถามค้นหาไอเดีย" : "ให้คะแนนไอเดียของคุณ"}
        subtitle={
          isQuestionPhase
            ? `คำถามที่ ${manualStep + 1} จาก 7`
            : "ใส่ชื่อไอเดีย แล้วให้คะแนน 1-5"
        }
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (manualStep > 0) {
              setManualStep(manualStep - 1);
            } else {
              setMode(null);
            }
          }}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {manualStep > 0 ? "ข้อก่อนหน้า" : "เลือกโหมดใหม่"}
        </Button>

        {/* Progress dots */}
        <div className="flex gap-1.5 justify-center mb-6">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i < manualStep
                    ? "bg-accent"
                    : i === manualStep
                    ? "bg-foreground"
                    : "bg-muted"
                }`}
              />
            ))}
        </div>

        {isQuestionPhase && (
          <Card>
            <CardContent className="pt-6">
              <label className="text-base font-medium mb-3 block">
                {manualStep + 1}. {questions[manualStep]}
              </label>
              <Textarea
                value={answers[manualStep] || ""}
                onChange={(e) => updateAnswer(manualStep, e.target.value)}
                placeholder="พิมพ์คำตอบของคุณที่นี่..."
                className="resize-none min-h-[120px]"
                rows={4}
              />
              <Button
                onClick={() => setManualStep(manualStep + 1)}
                className="w-full mt-4 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
              >
                {manualStep < 6 ? "ต่อไป →" : "ไปให้คะแนนไอเดีย →"}
              </Button>
            </CardContent>
          </Card>
        )}

        {isScoringPhase && (
          <>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-2 font-semibold min-w-[140px]">ไอเดีย</th>
                        {scoringCriteria.map((c) => (
                          <th key={c.key} className="text-center py-2 px-1 font-semibold min-w-[70px]">
                            <div>{c.label}</div>
                            <div className="text-[10px] text-muted-foreground font-normal">{c.desc}</div>
                          </th>
                        ))}
                        <th className="text-center py-2 pl-2 font-bold">รวม</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ideas.map((idea, i) => {
                        const total = getTotal(idea);
                        const isTop = total > 0 && total === maxTotal;
                        return (
                          <tr key={i} className={`border-b ${isTop ? "bg-accent/10" : ""}`}>
                            <td className="py-2 pr-2">
                              <Input
                                value={idea.name}
                                onChange={(e) => updateIdeaName(i, e.target.value)}
                                placeholder={`ไอเดีย ${i + 1}`}
                                className="h-8 text-sm"
                              />
                            </td>
                            {scoringCriteria.map((c) => (
                              <td key={c.key} className="py-2 px-1 text-center">
                                <select
                                  value={idea.scores[c.key]}
                                  onChange={(e) => updateScore(i, c.key, Number(e.target.value))}
                                  className="w-14 h-8 rounded border border-input bg-background text-center text-sm mx-auto block"
                                >
                                  {[0, 1, 2, 3, 4, 5].map((n) => (
                                    <option key={n} value={n}>
                                      {n}
                                    </option>
                                  ))}
                                </select>
                              </td>
                            ))}
                            <td className={`py-2 pl-2 text-center font-bold text-lg ${isTop ? "text-accent-foreground" : ""}`}>
                              {total}
                              {isTop && total > 0 && " ⭐"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Select idea buttons */}
            <div className="space-y-2">
              {ideas.filter((idea) => idea.name.trim()).length > 0 ? (
                ideas
                  .filter((idea) => idea.name.trim())
                  .sort((a, b) => getTotal(b) - getTotal(a))
                  .map((idea, i) => (
                    <Button
                      key={i}
                      onClick={() => handleManualSelect(idea)}
                      variant={i === 0 ? "default" : "outline"}
                      className={`w-full ${i === 0 ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}`}
                    >
                      เลือก "{idea.name}" (คะแนน: {getTotal(idea)}) →
                    </Button>
                  ))
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  ใส่ชื่อไอเดียและให้คะแนนเพื่อเลือก
                </p>
              )}
            </div>
          </>
        )}
      </StepLayout>
    );
  }

  return null;
}
