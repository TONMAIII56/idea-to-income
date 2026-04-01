import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Lightbulb,
  Package,
  Users,
  CreditCard,
  CalendarDays,
  CheckCircle2,
  Lock,
  ArrowRight,
  Home,
  ExternalLink,
} from "lucide-react";

const steps = [
  { key: "1", icon: Lightbulb, title: "ขายอะไรดี?", desc: "ค้นหาไอเดีย Ebook ด้วย AI", path: "/step/1", storageKey: "step1-completed", active: true },
  { key: "2", icon: Package, title: "ทำยังไง?", desc: "AI สร้าง Ebook ให้คุณครบเล่ม", path: "/step/2", storageKey: "step2-completed", active: true },
  { key: "3", icon: Users, title: "ลูกค้าอยู่ไหน?", desc: "ค้นหากลุ่มเป้าหมาย", path: "", storageKey: "", active: false },
  { key: "4", icon: CreditCard, title: "หน้าขาย + รับเงิน", desc: "สร้างหน้าขายและระบบรับเงิน", path: "", storageKey: "", active: false },
  { key: "5", icon: CalendarDays, title: "Content Plan 30 วัน", desc: "แผนโปรโมท 30 วัน", path: "", storageKey: "", active: false },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const completedSteps = steps.filter(
    (s) => s.storageKey && localStorage.getItem(s.storageKey) === "true"
  ).length;
  const totalActive = steps.filter((s) => s.active).length;
  const progress = totalActive > 0 ? (completedSteps / 5) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">
              ขายอะไรดี<span className="text-accent">วะ</span>
            </h1>
            <p className="text-sm text-muted-foreground">Dashboard</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <Home className="h-4 w-4 mr-1" />
            หน้าแรก
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 md:py-10">
        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">ความคืบหน้า</span>
              <span className="text-sm text-muted-foreground">
                {completedSteps}/5 ขั้นตอน
              </span>
            </div>
            <Progress value={progress} className="h-3 mb-3" />
            <p className="text-xs text-muted-foreground">
              {completedSteps === 0
                ? "เริ่มจากขั้นที่ 1 เลย! 💪"
                : completedSteps < totalActive
                ? "กำลังไปได้ดี! ทำต่อเลย 🚀"
                : "ทำ Step 1-2 ครบแล้ว! รอ Step 3-5 เร็วๆ นี้ 🎉"}
            </p>
          </CardContent>
        </Card>

        {/* Steps */}
        <h2 className="text-lg font-bold mb-4">ขั้นตอนทั้งหมด</h2>
        <div className="space-y-3 mb-8">
          {steps.map((step) => {
            const Icon = step.icon;
            const completed = step.storageKey && localStorage.getItem(step.storageKey) === "true";
            return (
              <Card
                key={step.key}
                className={`transition-all ${!step.active ? "opacity-60" : "hover:shadow-md cursor-pointer"} ${
                  completed ? "border-accent/40" : ""
                }`}
                onClick={() => step.active && step.path && navigate(step.path)}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      completed
                        ? "bg-accent/20 text-accent"
                        : step.active
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {completed ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : step.active ? (
                      <Icon className="h-5 w-5" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground">
                        STEP {step.key}
                      </span>
                      {completed && (
                        <span className="text-[10px] bg-accent/15 text-accent-foreground px-2 py-0.5 rounded-full font-medium">
                          เสร็จแล้ว ✓
                        </span>
                      )}
                      {!step.active && (
                        <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                          เร็วๆ นี้
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                  {step.active && <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Ebook section */}
        {localStorage.getItem("step2-completed") === "true" && (
          <>
            <h2 className="text-lg font-bold mb-4">📕 Ebook ของคุณ</h2>
            <Card className="mb-8 border-accent/30">
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span className="font-semibold">
                    {(() => {
                      try { return JSON.parse(localStorage.getItem("ebook-cover") || "{}").title_th || "Ebook"; } catch { return "Ebook"; }
                    })()}
                  </span>
                  <span className="text-[10px] bg-accent/15 text-accent-foreground px-2 py-0.5 rounded-full">เสร็จแล้ว ✓</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => navigate("/step/2")}>ดู/แก้ไข Ebook</Button>
                  <Button size="sm" variant="outline" onClick={async () => {
                    try {
                      const cover = JSON.parse(localStorage.getItem("ebook-cover") || "{}");
                      const intro = localStorage.getItem("ebook-intro") || "";
                      const tocData = JSON.parse(localStorage.getItem("ebook-toc") || "[]");
                      const chaptersData = JSON.parse(localStorage.getItem("ebook-chapters") || "[]");
                      const closingData = JSON.parse(localStorage.getItem("ebook-closing") || "{}");
                      const full = [
                        `${cover.title_en}\n${cover.title_th}\n${cover.subtitle}\nby ${cover.author}`,
                        `\n\n---\n\nคำนำ\n\n${intro}`,
                        `\n\n---\n\nสารบัญ\n\n${tocData.map((c: any, i: number) => `${i+1}. ${c.title}`).join("\n")}`,
                        ...chaptersData.map((c: any, i: number) => `\n\n---\n\nบทที่ ${i+1}: ${c.title}\n\n${c.content}`),
                        `\n\n---\n\nบทส่งท้าย\n\n${closingData.content}\n\n"${closingData.quote}"`,
                      ].join("");
                      await navigator.clipboard.writeText(full);
                      window.open("https://docs.google.com/document/create", "_blank");
                    } catch {}
                  }}>
                    <ExternalLink className="h-3 w-3 mr-1" />Export Google Docs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Resources */}
        <h2 className="text-lg font-bold mb-4">📄 ลิงก์ Template</h2>
        <Card>
          <CardContent className="pt-4 space-y-2">
            <Button variant="outline" className="w-full justify-start text-sm" asChild>
              <a href="https://docs.google.com/document/d/create" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Google Docs — บันทึกไอเดีย
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start text-sm" asChild>
              <a href="https://docs.google.com/spreadsheets/d/create" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Google Sheets — ตาราง Scoring
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start text-sm" asChild>
              <a href="https://www.canva.com/templates/?query=ebook" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Canva — Template ออกแบบ
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
