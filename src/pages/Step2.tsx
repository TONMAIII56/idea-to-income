import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepLayout from "@/components/StepLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "sonner";
import { Copy, ExternalLink, BookOpen, Layout, Video } from "lucide-react";

type ProductType = "ebook" | "template" | "course" | "";

const ebookChapters = [
  { label: "บทที่ 1: เปิดด้วย Pain Point", placeholder: "ลูกค้าของคุณกำลังเจอปัญหา___" },
  { label: "บทที่ 2: ทำไมวิธีเดิมไม่เวิร์ค", placeholder: "สิ่งที่คนส่วนใหญ่ทำผิด___" },
  { label: "บทที่ 3: แนะนำวิธีของคุณ", placeholder: "วิธีที่ดีกว่าคือ___" },
  { label: "บทที่ 4: วิธีทำ Step-by-Step", placeholder: "ขั้นตอนที่ 1 คือ___" },
  { label: "บทที่ 5: Case Study / ตัวอย่าง", placeholder: "ตัวอย่างที่ได้ผลจริง___" },
  { label: "บทที่ 6: สรุปและ Action Plan", placeholder: "สิ่งที่ต้องทำหลังอ่านจบ___" },
];

const templateChecklist = [
  "ไฟล์ Template หลัก (Canva/Google Docs/Excel)",
  "คู่มือการใช้งาน (วิธีใช้ Template)",
  "ตัวอย่างที่กรอกแล้ว (Filled Example)",
  "Video walkthrough สั้นๆ (ไม่จำเป็น แต่เพิ่มมูลค่า)",
  "Bonus: Checklist / Cheatsheet",
];

const courseModules = [
  { label: "Module 1: ปูพื้นฐาน", placeholder: "สิ่งที่ต้องรู้ก่อนเริ่ม___" },
  { label: "Module 2: เริ่มต้นทำ", placeholder: "วิธีเริ่มต้น step แรก___" },
  { label: "Module 3: เทคนิคหลัก", placeholder: "เทคนิคสำคัญที่ต้องรู้___" },
  { label: "Module 4: ปัญหาที่พบบ่อย", placeholder: "วิธีแก้ปัญหาที่มักเจอ___" },
  { label: "Module 5: สรุปและขั้นต่อไป", placeholder: "ทำอะไรต่อหลังเรียนจบ___" },
];

const freeTools = [
  { name: "Loom", desc: "อัดหน้าจอฟรี ทำวิดีโอสอน", url: "https://loom.com" },
  { name: "Canva", desc: "ออกแบบ Ebook, Slide, Template", url: "https://canva.com" },
  { name: "OBS Studio", desc: "อัดวิดีโอฟรีระดับโปร", url: "https://obsproject.com" },
  { name: "Google Docs", desc: "เขียน Ebook ฟรี", url: "https://docs.google.com" },
];

const aiPrompts: Record<string, string> = {
  ebook: `ช่วยเขียนเนื้อหา Ebook เรื่อง [ชื่อ Ebook ของคุณ]
กลุ่มเป้าหมาย: [กลุ่มเป้าหมาย]
โครงสร้าง: 6 บท ตามนี้
- บท 1: เปิดด้วย Pain Point
- บท 2: ทำไมวิธีเดิมไม่เวิร์ค
- บท 3: แนะนำวิธีใหม่
- บท 4: Step-by-Step วิธีทำ
- บท 5: Case Study
- บท 6: สรุปและ Action Plan

เขียนให้อ่านง่าย ภาษาเป็นกันเอง มี bullet points และตัวอย่างจริง`,
  template: `ช่วยคิดโครงสร้าง Template Pack เรื่อง [ชื่อ Template]
กลุ่มเป้าหมาย: [กลุ่มเป้าหมาย]
ช่วยบอก:
1. Template หลักควรมีอะไรบ้าง (5-10 ไฟล์)
2. คู่มือการใช้งานควรเขียนอะไร
3. ราคาที่เหมาะสม
4. จุดขายหลัก (ทำไมคนควรซื้อ)`,
  course: `ช่วยวางโครงสร้าง Mini Course เรื่อง [ชื่อคอร์ส]
กลุ่มเป้าหมาย: [กลุ่มเป้าหมาย]
5 modules ตามนี้:
- Module 1: ปูพื้นฐาน
- Module 2: เริ่มต้นทำ
- Module 3: เทคนิคหลัก
- Module 4: ปัญหาที่พบบ่อย
- Module 5: สรุป

แต่ละ module ช่วยเขียน:
1. หัวข้อย่อย 3-5 ข้อ
2. สคริปต์สำหรับอัดวิดีโอ (5-10 นาที/module)
3. แบบฝึกหัดให้ผู้เรียน`,
};

const productTypes = [
  { key: "ebook" as const, icon: BookOpen, name: "Ebook / Guide", desc: "เขียนคู่มือจากความรู้ของคุณ" },
  { key: "template" as const, icon: Layout, name: "Template Pack", desc: "รวม Template สำเร็จรูปขาย" },
  { key: "course" as const, icon: Video, name: "Mini Course", desc: "สร้างคอร์สสั้นๆ 5 บท" },
];

export default function Step2() {
  const navigate = useNavigate();
  const [productType, setProductType] = useLocalStorage<ProductType>("step2-type", "");
  const [ebookData, setEbookData] = useLocalStorage<string[]>("step2-ebook", Array(6).fill(""));
  const [templateCheck, setTemplateCheck] = useLocalStorage<boolean[]>("step2-template-check", Array(5).fill(false));
  const [templateNotes, setTemplateNotes] = useLocalStorage<string>("step2-template-notes", "");
  const [courseData, setCourseData] = useLocalStorage<string[]>("step2-course", Array(5).fill(""));

  const updateEbook = (i: number, v: string) => {
    const n = [...ebookData]; n[i] = v; setEbookData(n);
  };
  const updateCourse = (i: number, v: string) => {
    const n = [...courseData]; n[i] = v; setCourseData(n);
  };
  const toggleCheck = (i: number) => {
    const n = [...templateCheck]; n[i] = !n[i]; setTemplateCheck(n);
  };

  const copyPrompt = () => {
    if (!productType) return;
    navigator.clipboard.writeText(aiPrompts[productType]);
    toast.success("คัดลอก Prompt แล้ว!");
  };

  const handleNext = () => {
    localStorage.setItem("step2-completed", "true");
    toast.success("บันทึกข้อมูล Step 2 เรียบร้อย! 🎉");
    navigate("/dashboard");
  };

  return (
    <StepLayout
      currentStep={2}
      title="สร้าง Digital Product ของคุณ"
      subtitle="เลือกประเภท Product แล้วกรอกตาม Template — จากไอเดียในขั้นที่ 1"
      onNext={handleNext}
      nextLabel="บันทึกและกลับ Dashboard"
    >
      {/* Product Type Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {productTypes.map((pt) => {
          const Icon = pt.icon;
          const selected = productType === pt.key;
          return (
            <button
              key={pt.key}
              onClick={() => setProductType(pt.key)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selected
                  ? "border-accent bg-accent/10 shadow-md"
                  : "border-border hover:border-accent/40"
              }`}
            >
              <Icon className={`h-8 w-8 mb-2 ${selected ? "text-accent" : "text-muted-foreground"}`} />
              <div className="font-semibold text-sm">{pt.name}</div>
              <div className="text-xs text-muted-foreground">{pt.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Forms */}
      {productType === "ebook" && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">📖 โครงสร้าง Ebook ของคุณ</CardTitle>
            <p className="text-sm text-muted-foreground">กรอกเนื้อหาแต่ละบท ตาม Template</p>
          </CardHeader>
          <CardContent className="space-y-5">
            {ebookChapters.map((ch, i) => (
              <div key={i}>
                <label className="text-sm font-medium mb-1.5 block">{ch.label}</label>
                <Textarea
                  value={ebookData[i] || ""}
                  onChange={(e) => updateEbook(i, e.target.value)}
                  placeholder={ch.placeholder}
                  rows={3}
                  className="resize-none"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {productType === "template" && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">📦 Checklist สร้าง Template Pack</CardTitle>
            <p className="text-sm text-muted-foreground">เช็คว่าเตรียมครบทุกอย่าง</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {templateChecklist.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <Checkbox
                  checked={templateCheck[i]}
                  onCheckedChange={() => toggleCheck(i)}
                />
                <span className={`text-sm ${templateCheck[i] ? "line-through text-muted-foreground" : ""}`}>
                  {item}
                </span>
              </div>
            ))}
            <div className="mt-4">
              <label className="text-sm font-medium mb-1.5 block">โน้ตเพิ่มเติม / โครงสร้างไฟล์</label>
              <Textarea
                value={templateNotes}
                onChange={(e) => setTemplateNotes(e.target.value)}
                placeholder="เช่น: จะทำ 10 Template สำหรับ Social Media Post..."
                rows={3}
                className="resize-none"
              />
            </div>
            <div className="bg-accent/10 rounded-xl p-4 mt-4">
              <p className="text-sm font-semibold mb-1">💰 ราคาแนะนำ</p>
              <p className="text-sm text-muted-foreground">
                Template Pack 5-10 ชิ้น: ฿99-299 | 10-20 ชิ้น: ฿299-599 | Premium Bundle: ฿599-999
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {productType === "course" && (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">🎬 โครงสร้าง Mini Course</CardTitle>
              <p className="text-sm text-muted-foreground">วางเนื้อหา 5 Modules</p>
            </CardHeader>
            <CardContent className="space-y-5">
              {courseModules.map((m, i) => (
                <div key={i}>
                  <label className="text-sm font-medium mb-1.5 block">{m.label}</label>
                  <Textarea
                    value={courseData[i] || ""}
                    onChange={(e) => updateCourse(i, e.target.value)}
                    placeholder={m.placeholder}
                    rows={3}
                    className="resize-none"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">🛠 เครื่องมือฟรีที่แนะนำ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {freeTools.map((tool, i) => (
                  <a
                    key={i}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-secondary/50 rounded-xl p-3 hover:bg-secondary transition-colors block"
                  >
                    <div className="font-semibold text-sm">{tool.name}</div>
                    <div className="text-xs text-muted-foreground">{tool.desc}</div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Canva Templates */}
      {productType && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">🎨 Canva Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.canva.com/templates/?query=ebook+cover" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Template ปก Ebook / Product
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.canva.com/templates/?query=social+media+mockup" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Template Mockup สำหรับโปรโมท
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* AI Prompt */}
      {productType && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">🤖 ใช้ AI ช่วยเขียนเนื้อหา</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-xl p-4 text-sm font-mono whitespace-pre-wrap mb-3 max-h-48 overflow-y-auto">
              {aiPrompts[productType]}
            </div>
            <Button variant="outline" onClick={copyPrompt} className="w-full">
              <Copy className="h-4 w-4 mr-2" />
              คัดลอก Prompt
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Google Docs Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📄 Template สำหรับสร้าง Product</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href="https://docs.google.com/document/d/create" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              สร้าง Google Docs เขียนเนื้อหา
            </a>
          </Button>
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href="https://docs.google.com/presentation/d/create" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              สร้าง Google Slides สำหรับคอร์ส
            </a>
          </Button>
        </CardContent>
      </Card>
    </StepLayout>
  );
}
