import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";

const ExampleBadge = () => (
  <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded z-10">
    ตัวอย่าง
  </span>
);

function EbookCover() {
  return (
    <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
      <ExampleBadge />
      <div className="w-full h-full rounded-lg bg-gradient-to-br from-[#1B4F72] to-[#2E86C1] flex flex-col items-center justify-center p-4 text-white">
        <span className="text-5xl mb-4">📊</span>
        <h4 className="font-bold text-sm md:text-base text-center leading-tight">
          คู่มือ Excel
          <br />
          สำหรับฟรีแลนซ์
        </h4>
        <p className="text-[10px] text-white/70 mt-2">by แอน</p>
      </div>
    </div>
  );
}

function TableOfContents() {
  const chapters = [
    "ทำไมฟรีแลนซ์ต้องรู้เรื่องภาษี",
    "สูตร Excel ที่ใช้บ่อยที่สุด 10 สูตร",
    "วิธีคำนวณรายรับ-รายจ่าย",
    "Template ยื่นภาษีแบบง่าย",
    "Action Plan — ทำตามได้ใน 1 สัปดาห์",
  ];
  return (
    <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
      <ExampleBadge />
      <div className="w-full h-full rounded-lg bg-white border border-border p-4 flex flex-col">
        <h4 className="font-bold text-foreground text-sm mb-3 text-center">สารบัญ</h4>
        <ul className="space-y-2 flex-1">
          {chapters.map((ch, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="leading-tight">{ch}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SalesPageMockup() {
  return (
    <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
      <ExampleBadge />
      <div className="w-full h-full rounded-lg bg-white border border-border p-3 flex flex-col text-xs overflow-hidden">
        <h4 className="font-bold text-foreground text-sm text-center mb-2 leading-tight">
          หมดปัญหาปวดหัว
          <br />เรื่องภาษี
        </h4>
        <div className="space-y-1 mb-2">
          {["คิดภาษีไม่เป็น", "ยื่นภาษีผิดทุกปี", "เสียเงินจ้างบัญชี"].map((t, i) => (
            <div key={i} className="flex items-center gap-1 text-destructive">
              <span className="text-[10px]">✗</span>
              <span className="text-[10px]">{t}</span>
            </div>
          ))}
        </div>
        <div className="space-y-1 mb-3">
          {["รู้ทุกสูตรที่ต้องใช้", "Template พร้อมกรอก", "ยื่นภาษีเองได้"].map((t, i) => (
            <div key={i} className="flex items-center gap-1 text-green-600">
              <span className="text-[10px]">✓</span>
              <span className="text-[10px]">{t}</span>
            </div>
          ))}
        </div>
        <button className="w-full bg-accent text-accent-foreground text-[10px] font-bold py-1.5 rounded">
          สั่งซื้อเลย ฿299
        </button>
      </div>
    </div>
  );
}

function ContentCalendar() {
  const colors = ["bg-yellow-100", "bg-blue-100", "bg-green-100", "bg-purple-100"];
  const labels = ["ปลุก", "สอน", "ขาย", "proof"];
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
      <ExampleBadge />
      <div className="w-full h-full rounded-lg bg-white border border-border p-2 flex flex-col">
        <h4 className="font-bold text-foreground text-[10px] mb-1 text-center">Content Plan 30 วัน</h4>
        <div className="grid grid-cols-7 gap-[2px] flex-1">
          {["จ","อ","พ","พฤ","ศ","ส","อา"].map(d => (
            <div key={d} className="text-[7px] text-muted-foreground text-center font-medium">{d}</div>
          ))}
          {days.map((day) => {
            const colorIdx = day % 4;
            return (
              <div key={day} className={`${colors[colorIdx]} rounded-[2px] flex flex-col items-center justify-center p-[1px]`}>
                <span className="text-[6px] font-bold text-foreground/70">{day}</span>
                <span className="text-[5px] text-foreground/50">{labels[colorIdx]}</span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-2 mt-1 justify-center flex-wrap">
          {labels.map((l, i) => (
            <div key={i} className="flex items-center gap-0.5">
              <div className={`w-2 h-2 rounded-sm ${colors[i]}`} />
              <span className="text-[6px] text-muted-foreground">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TemplatePackMockup() {
  const items = [
    { label: "IG Post", color: "bg-pink-200" },
    { label: "IG Story", color: "bg-blue-200" },
    { label: "FB Cover", color: "bg-yellow-200" },
    { label: "Thumbnail", color: "bg-green-200" },
  ];
  return (
    <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
      <ExampleBadge />
      <div className="w-full h-full rounded-lg bg-white border border-border p-3 flex flex-col items-center justify-center">
        <h4 className="font-bold text-foreground text-[10px] mb-2 text-center">Template Pack</h4>
        <div className="grid grid-cols-2 gap-2 w-full max-w-[140px]">
          {items.map((item, i) => (
            <div key={i} className={`${item.color} aspect-square rounded-md flex items-center justify-center`}>
              <span className="text-[9px] font-medium text-foreground/70">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniCourseMockup() {
  const modules = [
    { name: "เริ่มต้นใช้ Excel", time: "10 นาที" },
    { name: "สูตรพื้นฐาน", time: "12 นาที" },
    { name: "Pivot Table", time: "15 นาที" },
    { name: "กราฟและ Dashboard", time: "10 นาที" },
    { name: "สรุปและ Action Plan", time: "8 นาที" },
  ];
  return (
    <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
      <ExampleBadge />
      <div className="w-full h-full rounded-lg bg-white border border-border flex flex-col overflow-hidden">
        <div className="bg-primary text-primary-foreground text-[10px] font-bold px-3 py-2 text-center">
          Mini Course: พื้นฐาน Excel
        </div>
        <div className="flex-1 p-3 space-y-1.5">
          {modules.map((m, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px]">
              <span className="text-accent">▶</span>
              <span className="flex-1 text-foreground">Module {i + 1}: {m.name}</span>
              <span className="text-muted-foreground text-[8px]">{m.time}</span>
            </div>
          ))}
        </div>
        <div className="px-3 pb-2">
          <div className="w-full bg-muted rounded-full h-1.5">
            <div className="bg-accent h-1.5 rounded-full" style={{ width: "0%" }} />
          </div>
          <p className="text-[8px] text-muted-foreground mt-1 text-center">0/5 completed</p>
        </div>
      </div>
    </div>
  );
}

const mockupCards = [
  {
    title: "ปก Ebook",
    subtitle: "สร้างปกแบบนี้ได้ใน Step 2",
    component: EbookCover,
  },
  {
    title: "สารบัญ Ebook",
    subtitle: "โครงสร้างนี้ได้จาก Template ใน Step 2",
    component: TableOfContents,
  },
  {
    title: "หน้าขาย",
    subtitle: "Template หน้าขายนี้อยู่ใน Step 4",
    component: SalesPageMockup,
  },
  {
    title: "Content Plan 30 วัน",
    subtitle: "แผน Content นี้อยู่ใน Step 5",
    component: ContentCalendar,
  },
  {
    title: "Template Pack",
    subtitle: "Designer สร้าง Template Pack ขายได้",
    component: TemplatePackMockup,
  },
  {
    title: "Mini Course",
    subtitle: "ครูสอนพิเศษ สร้าง Mini Course ขายได้",
    component: MiniCourseMockup,
  },
];

export default function MockupGallery() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section id="mockups" className="py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
          ตัวอย่างสิ่งที่คุณจะสร้างได้
        </h2>
        <p className="text-center text-muted-foreground mb-10">
          ทั้งหมดนี้สร้างได้จากทักษะที่คุณมีอยู่แล้ว — ใช้เวลาแค่ 2 สัปดาห์
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockupCards.map((card, i) => {
            const MockupComponent = card.component;
            return (
              <Card
                key={i}
                className="cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg p-4 flex flex-col items-center"
                onClick={() => setSelected(i)}
              >
                <div className="w-full max-w-[200px]">
                  <MockupComponent />
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">{card.subtitle}</p>
              </Card>
            );
          })}
        </div>

        <Dialog open={selected !== null} onOpenChange={() => setSelected(null)}>
          {selected !== null && (
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{mockupCards[selected].title}</DialogTitle>
              </DialogHeader>
              <div className="flex justify-center py-4">
                <div className="w-full max-w-[280px]">
                  {(() => {
                    const Comp = mockupCards[selected].component;
                    return <Comp />;
                  })()}
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center mb-4">
                {mockupCards[selected].subtitle}
              </p>
              <Button
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
                onClick={() => {
                  setSelected(null);
                  navigate("/dashboard");
                }}
              >
                อยากสร้างแบบนี้? เริ่มเลย!
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </section>
  );
}
