import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepLayout from "@/components/StepLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "sonner";
import { Copy, ExternalLink, Lightbulb } from "lucide-react";

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

const examples = [
  { skill: "Designer", product: "Template Pack", icon: "🎨", desc: "รวม Template Canva/Figma ขายเป็น pack" },
  { skill: "นักบัญชี", product: "Excel สำเร็จรูป", icon: "📊", desc: "สูตร Excel คำนวณภาษีสำหรับฟรีแลนซ์" },
  { skill: "แม่บ้าน", product: "Ebook สูตรอาหาร", icon: "🍳", desc: "รวมสูตรอาหาร meal prep สำหรับคนทำงาน" },
  { skill: "HR", product: "Guide การสัมภาษณ์", icon: "💼", desc: "คู่มือเตรียมตัวสัมภาษณ์งาน" },
];

const aiPrompt = `ฉันอยากสร้าง Digital Product (เช่น Ebook, Template, Mini Course) จากสิ่งที่ฉันรู้

นี่คือข้อมูลเกี่ยวกับฉัน:
- ความรู้ที่คนถามซ้ำๆ: [กรอกคำตอบข้อ 1]
- สิ่งที่ทำได้ดี: [กรอกคำตอบข้อ 2]
- ปัญหาที่เคยช่วยแก้: [กรอกคำตอบข้อ 3]

ช่วยแนะนำ 3 ไอเดีย Digital Product ที่เหมาะกับฉัน พร้อมบอก:
1. ชื่อ Product
2. กลุ่มเป้าหมาย
3. ราคาที่แนะนำ
4. เหตุผลว่าทำไมน่าจะขายได้`;

interface IdeaScore {
  name: string;
  scores: Record<string, number>;
}

export default function Step1() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useLocalStorage<string[]>("step1-answers", Array(7).fill(""));
  const [ideas, setIdeas] = useLocalStorage<IdeaScore[]>("step1-ideas", [
    { name: "", scores: { demand: 0, competition: 0, skill: 0, speed: 0 } },
    { name: "", scores: { demand: 0, competition: 0, skill: 0, speed: 0 } },
    { name: "", scores: { demand: 0, competition: 0, skill: 0, speed: 0 } },
  ]);

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

  const maxTotal = Math.max(...ideas.map(getTotal));

  const copyPrompt = () => {
    navigator.clipboard.writeText(aiPrompt);
    toast.success("คัดลอก Prompt แล้ว! ไปวางใน ChatGPT/Claude ได้เลย");
  };

  const handleNext = () => {
    localStorage.setItem("step1-completed", "true");
    toast.success("บันทึกข้อมูล Step 1 เรียบร้อย!");
    navigate("/step/2");
  };

  return (
    <StepLayout
      currentStep={1}
      title="ค้นหาไอเดีย Digital Product ของคุณ"
      subtitle="ตอบ 7 คำถามนี้ แล้วให้คะแนนไอเดียที่ได้ — เพื่อหาสิ่งที่เหมาะกับคุณที่สุด"
      onNext={handleNext}
    >
      {/* 7 Questions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            7 คำถามค้นหาไอเดีย
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {questions.map((q, i) => (
            <div key={i}>
              <label className="text-sm font-medium mb-1.5 block">
                {i + 1}. {q}
              </label>
              <Textarea
                value={answers[i] || ""}
                onChange={(e) => updateAnswer(i, e.target.value)}
                placeholder="พิมพ์คำตอบของคุณที่นี่..."
                className="resize-none"
                rows={2}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Scoring Matrix */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">📊 ให้คะแนนไอเดียของคุณ</CardTitle>
          <p className="text-sm text-muted-foreground">
            ใส่ชื่อไอเดีย แล้วให้คะแนน 1-5 ในแต่ละเกณฑ์
          </p>
        </CardHeader>
        <CardContent>
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
                    <tr key={i} className={`border-b ${isTop ? 'bg-accent/10' : ''}`}>
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
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </td>
                      ))}
                      <td className={`py-2 pl-2 text-center font-bold text-lg ${isTop ? 'text-accent-foreground' : ''}`}>
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

      {/* Examples */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">💡 ตัวอย่างไอเดีย</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {examples.map((ex, i) => (
              <div key={i} className="bg-secondary/50 rounded-xl p-4">
                <div className="text-2xl mb-1">{ex.icon}</div>
                <div className="text-xs text-muted-foreground">{ex.skill}</div>
                <div className="font-semibold text-sm">{ex.product}</div>
                <div className="text-xs text-muted-foreground mt-1">{ex.desc}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Prompt */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">🤖 ใช้ AI ช่วยคิด</CardTitle>
          <p className="text-sm text-muted-foreground">
            คัดลอก Prompt นี้ไปวางใน ChatGPT, Claude หรือ Gemini
          </p>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-xl p-4 text-sm font-mono whitespace-pre-wrap mb-3">
            {aiPrompt}
          </div>
          <Button variant="outline" onClick={copyPrompt} className="w-full">
            <Copy className="h-4 w-4 mr-2" />
            คัดลอก Prompt
          </Button>
        </CardContent>
      </Card>

      {/* Google Docs/Sheets Links */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">📄 Template สำหรับบันทึก</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href="https://docs.google.com/document/d/create" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              สร้าง Google Docs บันทึกไอเดีย
            </a>
          </Button>
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href="https://docs.google.com/spreadsheets/d/create" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              สร้าง Google Sheets ตาราง Scoring
            </a>
          </Button>
        </CardContent>
      </Card>
    </StepLayout>
  );
}
