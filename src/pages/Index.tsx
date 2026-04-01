import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import {
  Lightbulb,
  Package,
  Users,
  CreditCard,
  CalendarDays,
  ArrowRight,
  CheckCircle2,
  Zap,
  TrendingUp,
  Star,
} from "lucide-react";
import MockupGallery from "@/components/landing/MockupGallery";
import WhyNotCourse from "@/components/landing/WhyNotCourse";

const steps = [
  { icon: Lightbulb, title: "ขายอะไรดี?", desc: "บอก AI ว่าคุณเก่งอะไร — ได้ไอเดีย Ebook ใน 30 วินาที" },
  { icon: Package, title: "ทำยังไง?", desc: "AI สร้าง Ebook ให้ครบเล่ม — แค่กดปุ่มเดียว" },
  { icon: Users, title: "ลูกค้าอยู่ไหน?", desc: "รู้ว่าลูกค้าอยู่ที่ไหน พูดภาษาอะไร" },
  { icon: CreditCard, title: "หน้าขาย + รับเงิน", desc: "หน้าขายที่ดูดี + ระบบรับเงินที่ใช้ได้จริง" },
  { icon: CalendarDays, title: "Content Plan 30 วัน", desc: "แผนโปรโมทพร้อมโพสต์ 30 วัน" },
];

const personas = [
  {
    name: "ปอน",
    role: "Freelance Designer",
    pain: "ทำฟรีแลนซ์มา 5 ปี เก่งมาก แต่ยังต้องแลกเวลากับเงินทุกวัน",
    solution: "เปลี่ยนทักษะเป็น Template Pack ขายได้ไม่จำกัด",
    emoji: "🎨",
  },
  {
    name: "แอน",
    role: "พนักงานออฟฟิศ",
    pain: "อยากมีรายได้เสริม แต่ไม่มีเวลาเริ่มธุรกิจ",
    solution: "สร้าง Ebook จากความรู้ที่ใช้ทำงานทุกวัน",
    emoji: "💼",
  },
  {
    name: "โจ้",
    role: "คนทำ Content",
    pain: "สอนคนได้ แต่ไม่รู้จะ monetize ยังไง",
    solution: "สร้าง Mini Course ขาย passive income",
    emoji: "📱",
  },
];

const tiers = [
  {
    name: "Starter",
    price: "฿199",
    desc: "เริ่มต้นสร้าง Digital Product",
    features: ["ระบบ 5 ขั้นตอนครบ", "Template ทั้งหมด", "AI Prompt ช่วยคิด", "Google Docs/Sheets พร้อมใช้"],
    highlight: false,
  },
  {
    name: "Pro",
    price: "฿499",
    desc: "สำหรับคนจริงจัง",
    features: [
      "ทุกอย่างใน Starter",
      "Canva Template Premium",
      "Sales Page Template",
      "30-Day Content Calendar",
      "ตัวอย่าง Case Study",
    ],
    highlight: true,
  },
  {
    name: "Community",
    price: "฿999",
    desc: "เรียนรู้ร่วมกัน",
    features: [
      "ทุกอย่างใน Pro",
      "Facebook Group ส่วนตัว",
      "Q&A กับผู้สร้าง",
      "อัปเดต Template ตลอดชีพ",
      "Review Product ก่อนขาย",
    ],
    highlight: false,
  },
];

const faqs = [
  {
    q: "ฉันไม่มีทักษะพิเศษ จะสร้าง Digital Product ได้ไหม?",
    a: "ได้แน่นอน! ทุกคนมีความรู้บางอย่างที่คนอื่นอยากรู้ ระบบของเราจะช่วยดึงสิ่งนั้นออกมาให้ Step 1 ออกแบบมาเพื่อเรื่องนี้โดยเฉพาะ",
  },
  {
    q: "ต้องใช้เวลานานไหมกว่าจะสร้างเสร็จ?",
    a: "ด้วย Template สำเร็จรูปของเรา คุณสามารถสร้าง Digital Product ตัวแรกได้ภายใน 1-2 สัปดาห์ แม้ทำงานแค่วันละ 1-2 ชั่วโมง",
  },
  {
    q: "ต่างจากคอร์สสอนขายออนไลน์ยังไง?",
    a: "นี่ไม่ใช่คอร์ส! นี่คือ \"เครื่องมือ\" ที่คุณกรอกข้อมูลแล้วได้ผลลัพธ์ทันที ไม่ต้องนั่งดูวิดีโอ 10 ชั่วโมง แค่ทำตาม 5 ขั้นตอน",
  },
  {
    q: "รับเงินยังไง? ต้องมี website ไหม?",
    a: "ไม่ต้องมี website! เราแนะนำวิธีรับเงินง่ายๆ ผ่าน LINE OA + PromptPay, Shopee, หรือ Gumroad พร้อมระบบส่งไฟล์อัตโนมัติ",
  },
  {
    q: "ถ้าซื้อแล้วไม่ชอบ คืนเงินได้ไหม?",
    a: "ได้! เรามีนโยบายคืนเงินภายใน 7 วัน ถ้าคุณรู้สึกว่าไม่เหมาะกับคุณจริงๆ",
  },
  {
    q: "ฟรี tier ใช้ได้จริงไหม หรือแค่ล่อให้สมัคร?",
    a: "ใช้ได้จริง! Step 1 (ค้นหาไอเดีย) เปิดให้ใช้เต็มที่ ทั้ง 7 คำถาม + Scoring Matrix ไม่มีหมดอายุ ไม่มีข้อจำกัด คุณจะรู้เลยว่าควรขายอะไร — ก่อนจ่ายแม้แต่บาทเดียว",
  },
];

const ideaPills = [
  "🎨 Designer → Template Pack",
  "📊 นักบัญชี → Excel สูตร",
  "🍳 แม่บ้าน → Ebook สูตรอาหาร",
  "💼 HR → Guide สัมภาษณ์",
  "📱 คนยิง Ads → Playbook",
  "📸 ช่างภาพ → Preset Pack",
  "👩‍🏫 ครูสอนพิเศษ → Mini Course",
  "💻 คนทำเว็บ → Website Template",
];

export default function Index() {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">
            ขายอะไรดี<span className="text-accent">วะ</span>
          </span>
          <div className="hidden md:flex gap-6 text-sm text-muted-foreground">
            <button onClick={() => scrollToSection("steps")} className="hover:text-foreground transition-colors">วิธีทำงาน</button>
            <button onClick={() => scrollToSection("mockups")} className="hover:text-foreground transition-colors">ตัวอย่าง</button>
            <button onClick={() => scrollToSection("pricing")} className="hover:text-foreground transition-colors">ราคา</button>
            <button onClick={() => scrollToSection("faq")} className="hover:text-foreground transition-colors">FAQ</button>
          </div>
          <Button
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
            onClick={() => navigate("/dashboard")}
          >
            เริ่มเลย
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-28 text-center relative">
          <div className="inline-block bg-accent/15 text-accent-foreground text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            🚀 ระบบ Template สร้าง Digital Product
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            คนอื่นสอนยิง Ads...
            <br />
            <span className="text-primary">แต่ถ้ายังไม่รู้จะขายอะไรดีวะ</span>
            <br />
            <span className="text-accent">ระบบนี้คือคำตอบ</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            กรอกแล้วได้ — ไม่ใช่คอร์ส แต่คือเครื่องมือที่ช่วยคุณสร้าง Digital Product
            จากสิ่งที่คุณรู้อยู่แล้ว ใน 5 ขั้นตอน
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-base px-8 py-6 shadow-lg shadow-accent/25"
              onClick={() => navigate("/dashboard")}
            >
              เริ่มสร้าง Digital Product ของคุณวันนี้
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="py-6"
              onClick={() => scrollToSection("mockups")}
            >
              ดูตัวอย่างก่อน
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            ดูตัวอย่างผลลัพธ์ได้เลย — ไม่ต้องสมัคร ไม่ต้องจ่าย
          </p>
        </div>
      </section>

      {/* Problem */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            เคยรู้สึกแบบนี้ไหม? 🤔
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "รู้ว่าต้องทำอะไรสักอย่าง... แต่คิดไม่ออกว่าจะขายอะไร",
              "เห็นคนอื่นขายคอร์สออนไลน์ ขาย Template ได้เงินดี แต่ไม่รู้จะเริ่มยังไง",
              "กลัว AI จะมาแทนงาน... อยากมีรายได้เสริมที่ไม่ต้องแลกเวลา",
              "ลองหาข้อมูลแล้ว แต่มีแต่คอร์สสอน 10 ชั่วโมงที่ดูไม่จบ",
            ].map((pain, i) => (
              <div key={i} className="flex gap-3 items-start bg-primary-foreground/10 rounded-xl p-5">
                <span className="text-accent text-xl mt-0.5">✗</span>
                <p className="text-primary-foreground/90">{pain}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            ทางออกคือ <span className="text-accent">"การข้ามขั้น"</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10 text-lg">
            ในยุค Gold Rush คนที่รวยที่สุดไม่ใช่คนขุดทอง แต่คือคนขายพลั่ว
            — สิ่งที่คุณรู้อยู่แล้ว คือ "พลั่ว" ที่คนอื่นต้องการ
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center border-2 border-transparent hover:border-accent/30 transition-colors">
              <CardContent className="pt-6">
                <Zap className="h-10 w-10 text-accent mx-auto mb-3" />
                <h3 className="font-bold mb-2">กรอกแล้วได้</h3>
                <p className="text-sm text-muted-foreground">
                  ไม่ต้องนั่งคิดเอง Template พร้อมใช้ แค่กรอกข้อมูลก็ได้ผลลัพธ์ทันที
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-2 border-transparent hover:border-accent/30 transition-colors">
              <CardContent className="pt-6">
                <TrendingUp className="h-10 w-10 text-accent mx-auto mb-3" />
                <h3 className="font-bold mb-2">Passive Income</h3>
                <p className="text-sm text-muted-foreground">
                  สร้างครั้งเดียว ขายได้ตลอด ไม่ต้องแลกเวลากับเงินทุกวัน
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-2 border-transparent hover:border-accent/30 transition-colors">
              <CardContent className="pt-6">
                <Star className="h-10 w-10 text-accent mx-auto mb-3" />
                <h3 className="font-bold mb-2">ไม่ต้องเก่งเทค</h3>
                <p className="text-sm text-muted-foreground">
                  ใช้เครื่องมือฟรี Canva, Google Docs, LINE OA เครื่องมือที่ใช้ง่าย
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 5 Steps */}
      <section id="steps" className="py-16 md:py-20 bg-secondary/50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            5 ขั้นตอน สร้าง Digital Product
          </h2>
          <p className="text-center text-muted-foreground mb-10">
            ระบบพาทำทีละขั้น แค่กรอกข้อมูลก็ได้ผลลัพธ์
          </p>
          <div className="space-y-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <Card
                  key={i}
                  className={`transition-all hover:shadow-md ${i < 2 ? 'border-accent/30' : 'opacity-75'}`}
                >
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${i < 2 ? 'bg-accent/15 text-accent' : 'bg-muted text-muted-foreground'}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground">
                          STEP {i + 1}
                        </span>
                        {i >= 2 && (
                          <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                            เร็วๆ นี้
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-lg">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </div>
                    {i < 2 && <ArrowRight className="h-5 w-5 text-accent flex-shrink-0" />}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Idea Pills */}
          <div className="mt-10">
            <p className="text-center font-semibold text-foreground mb-4">
              ไม่ว่าคุณจะเป็นใคร ก็สร้าง Digital Product ได้
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:justify-center md:overflow-x-visible scrollbar-hide">
              {ideaPills.map((pill, i) => (
                <span
                  key={i}
                  className="flex-shrink-0 bg-accent/10 text-foreground text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap border border-accent/20"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mockup Gallery */}
      <MockupGallery />

      {/* Personas */}
      <section className="py-16 md:py-20 bg-secondary/50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            เหมาะกับใคร?
          </h2>
          <p className="text-center text-muted-foreground mb-10">
            ถ้าคุณเป็นแบบนี้... ระบบนี้ออกแบบมาเพื่อคุณ
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {personas.map((p, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="text-4xl mb-2">{p.emoji}</div>
                  <CardTitle className="text-xl">{p.name}</CardTitle>
                  <p className="text-sm text-accent font-medium">{p.role}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-destructive/10 rounded-lg p-3">
                    <p className="text-sm">
                      <span className="font-semibold text-destructive">ปัญหา:</span>{" "}
                      {p.pain}
                    </p>
                  </div>
                  <div className="bg-accent/10 rounded-lg p-3">
                    <p className="text-sm">
                      <span className="font-semibold text-accent-foreground">ทางออก:</span>{" "}
                      {p.solution}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Not Course */}
      <WhyNotCourse />

      {/* Pricing */}
      <section id="pricing" className="py-16 md:py-20 bg-secondary/50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            เลือกแพ็คเกจที่เหมาะกับคุณ
          </h2>
          <p className="text-center text-muted-foreground mb-10">
            ลงทุนครั้งเดียว ใช้ได้ตลอด
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier, i) => (
              <Card
                key={i}
                className={`relative ${tier.highlight ? 'border-2 border-accent shadow-xl shadow-accent/10 scale-[1.02]' : ''}`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-4 py-1 rounded-full">
                    แนะนำ ⭐
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{tier.desc}</p>
                  <div className="text-3xl font-bold mt-2">{tier.price}</div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {tier.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full font-semibold ${
                      tier.highlight
                        ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                        : ''
                    }`}
                    variant={tier.highlight ? "default" : "outline"}
                    asChild
                  >
                    <a
                      href="https://line.me/ti/p/~@youraccount"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      สั่งซื้อผ่าน LINE
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            คำถามที่พบบ่อย
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-card rounded-xl border px-4">
                <AccordionTrigger className="text-left font-semibold text-sm md:text-base">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            พร้อมสร้าง Digital Product ของคุณหรือยัง? 🚀
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            ลองใช้ฟรี — กรอกข้อมูลใน Step 1 แล้วดูว่าไอเดียของคุณมีศักยภาพแค่ไหน
          </p>
          <Button
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-base px-8 py-6 shadow-lg"
            onClick={() => navigate("/dashboard")}
          >
            เริ่มเลย — ฟรี!
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 bg-card">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <span className="text-lg font-bold">
                ขายอะไรดี<span className="text-accent">วะ</span>
              </span>
              <p className="text-sm text-muted-foreground mt-1">
                เครื่องมือสร้าง Digital Product สำหรับคนไทย
              </p>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <button onClick={() => scrollToSection("steps")} className="hover:text-foreground">วิธีทำงาน</button>
              <button onClick={() => scrollToSection("pricing")} className="hover:text-foreground">ราคา</button>
              <button onClick={() => scrollToSection("faq")} className="hover:text-foreground">FAQ</button>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t text-center text-xs text-muted-foreground">
            © 2026 ขายอะไรดีวะ — All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
