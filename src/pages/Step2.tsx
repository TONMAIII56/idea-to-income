import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StepLayout from "@/components/StepLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAI } from "@/hooks/useAI";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  CheckCircle2,
  Circle,
  PenLine,
  Sparkles,
  FileText,
  BookOpen,
  ExternalLink,
} from "lucide-react";

interface SelectedIdea {
  title: string;
  subtitle: string;
  target: string;
  chapters: string[];
  why?: string;
  price?: string;
}

interface CoverData {
  title_en: string;
  title_th: string;
  subtitle: string;
  tagline: string;
  author: string;
}

interface TocItem {
  title: string;
  subtopics: string[];
}

interface ChapterData {
  title: string;
  content: string;
  expand_hints?: string[];
}

interface ClosingData {
  content: string;
  quote: string;
}

type GenerationStage = "idle" | "cover" | "chapters" | "closing" | "done";

export default function Step2() {
  const navigate = useNavigate();
  const { generateJSON, loading } = useAI();

  const [selectedIdea] = useLocalStorage<SelectedIdea | null>("selected-idea", null);
  const [ebookMode, setEbookMode] = useLocalStorage<string | null>("ebook-mode", null);
  const [cover, setCover] = useLocalStorage<CoverData | null>("ebook-cover", null);
  const [intro, setIntro] = useLocalStorage<string>("ebook-intro", "");
  const [toc, setToc] = useLocalStorage<TocItem[]>("ebook-toc", []);
  const [chapters, setChapters] = useLocalStorage<ChapterData[]>("ebook-chapters", []);
  const [closing, setClosing] = useLocalStorage<ClosingData | null>("ebook-closing", null);

  const [stage, setStage] = useState<GenerationStage>("idle");
  const [currentChapter, setCurrentChapter] = useState(0);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editCover, setEditCover] = useState<CoverData | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const isComplete = cover && intro && chapters.length > 0 && closing;

  useEffect(() => {
    if (isComplete) {
      localStorage.setItem("step2-completed", "true");
    }
  }, [isComplete]);

  if (!selectedIdea) {
    return (
      <StepLayout currentStep={2} title="ยังไม่ได้เลือกไอเดีย" subtitle="กลับไปเลือกไอเดียที่ Step 1 ก่อน">
        <Button onClick={() => navigate("/step/1")} className="bg-accent text-accent-foreground">
          กลับไป Step 1
        </Button>
      </StepLayout>
    );
  }

  // Mode selection
  if (!ebookMode && !isComplete) {
    return (
      <StepLayout currentStep={2} title="AI Ebook Generator" subtitle={`สร้าง "${selectedIdea.title}" ด้วย AI`}>
        <Card className="mb-6 border-accent/30">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">{selectedIdea.title}</h3>
                {selectedIdea.subtitle && <p className="text-sm text-muted-foreground">{selectedIdea.subtitle}</p>}
                {selectedIdea.target && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full inline-block mt-2">
                    🎯 {selectedIdea.target}
                  </span>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/step/1")}>
                แก้ไข
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <button
            onClick={() => { setEbookMode("draft"); handleGenerate("draft"); }}
            className="w-full p-5 rounded-2xl border border-border hover:border-accent/40 transition-all text-left"
          >
            <div className="flex items-center gap-3 mb-1">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="font-bold">📝 Draft Mode</span>
            </div>
            <p className="text-sm text-muted-foreground ml-8">AI วางโครงสร้าง + เขียน draft ให้แก้ต่อ</p>
            <p className="text-xs text-muted-foreground ml-8 mt-1">เร็ว สร้างใน 30 วินาที เหมาะสำหรับคนที่อยากเขียนเอง</p>
          </button>

          <button
            onClick={() => { setEbookMode("full"); handleGenerate("full"); }}
            className="w-full p-5 rounded-2xl border-2 border-accent bg-accent/5 hover:bg-accent/10 transition-all text-left relative"
          >
            <span className="absolute -top-2 right-4 text-[10px] bg-accent text-accent-foreground px-2 py-0.5 rounded-full font-semibold">
              แนะนำ ⭐
            </span>
            <div className="flex items-center gap-3 mb-1">
              <BookOpen className="h-5 w-5 text-accent" />
              <span className="font-bold">📖 Full Mode</span>
            </div>
            <p className="text-sm text-muted-foreground ml-8">AI เขียนเนื้อหาครบทุกบท</p>
            <p className="text-xs text-muted-foreground ml-8 mt-1">ละเอียด สร้างใน 2-3 นาที ได้ ebook พร้อมขาย</p>
          </button>
        </div>
      </StepLayout>
    );
  }

  async function handleGenerate(mode: string) {
    const idea = selectedIdea!;
    const chaptersStr = idea.chapters?.join(", ") || "บทที่ 1, บทที่ 2, บทที่ 3, บทที่ 4, บทที่ 5";
    setStage("cover");

    if (mode === "draft") {
      const prompt = `คุณเป็น AI นักเขียน ebook ภาษาไทย สไตล์การเขียนเหมือนเพื่อนคุยกัน ตรง กวนตีนนิดๆ อ่านง่าย

สร้าง Draft Ebook ตามนี้:
- ชื่อ: ${idea.title}
- subtitle: ${idea.subtitle || idea.title}
- กลุ่มเป้าหมาย: ${idea.target || "คนทั่วไป"}
- บทที่ต้องมี: ${chaptersStr}

สร้างโครงสร้าง ebook โดยมี:
1. หน้าปก: ชื่อ (EN + TH), subtitle, tagline 1 บรรทัด, ชื่อผู้เขียน (ใส่ placeholder [ชื่อผู้เขียน])
2. คำนำ: เขียน draft 3-5 ย่อหน้า
3. สารบัญ: รายชื่อทุกบท + หัวข้อย่อย 2-3 หัวข้อต่อบท
4. แต่ละบท: เขียน draft สั้นๆ 2-3 ย่อหน้า + bullet points หัวข้อที่ควรเขียนเพิ่ม
5. บทส่งท้าย: draft 1-2 ย่อหน้า + quote ปิดท้าย

ตอบเป็น JSON เท่านั้น ไม่ต้องมี markdown backtick:
{
  "cover": {"title_en": "...", "title_th": "...", "subtitle": "...", "tagline": "...", "author": "[ชื่อผู้เขียน]"},
  "intro": "เนื้อหาคำนำ",
  "toc": [{"title": "ชื่อบท", "subtopics": ["หัวข้อย่อย 1", "หัวข้อย่อย 2"]}],
  "chapters": [{"title": "ชื่อบท", "content": "เนื้อหา draft", "expand_hints": ["หัวข้อที่ควรเขียนเพิ่ม"]}],
  "closing": {"content": "เนื้อหาบทส่งท้าย", "quote": "quote ปิดท้าย"}
}`;

      const result = await generateJSON<any>(prompt, 8192);
      if (result) {
        setCover(result.cover);
        setIntro(result.intro);
        setToc(result.toc);
        setChapters(result.chapters);
        setClosing(result.closing);
        setStage("done");
        toast.success("สร้าง Draft Ebook เสร็จแล้ว! 🎉");
      } else {
        setStage("idle");
        setEbookMode(null);
      }
    } else {
      // Full mode: multiple calls
      const prompt1 = `คุณเป็น AI นักเขียน ebook ภาษาไทยมืออาชีพ

สไตล์การเขียน:
- ภาษาเหมือนเพื่อนคุยกัน ตรง จี้ใจ กวนตีนนิดๆ
- ใช้อุปมาเปรียบเทียบเยอะๆ
- มีชื่อเทคนิคเป็นภาษาอังกฤษ
- ใช้ตัวหนาเน้นจุดสำคัญ

สร้างส่วนแรกของ ebook:
- ชื่อ: ${idea.title}
- subtitle: ${idea.subtitle || idea.title}
- กลุ่มเป้าหมาย: ${idea.target || "คนทั่วไป"}
- บทที่ต้องมี: ${chaptersStr}

สร้าง:
1. หน้าปก
2. คำนำ (5-8 ย่อหน้า)
3. สารบัญ (ทุกบท + หัวข้อย่อย 2-3 ข้อ)

ตอบเป็น JSON เท่านั้น ไม่ต้องมี markdown backtick:
{
  "cover": {"title_en": "...", "title_th": "...", "subtitle": "...", "tagline": "...", "author": "[ชื่อผู้เขียน]"},
  "intro": "เนื้อหาคำนำเต็ม",
  "toc": [{"title": "ชื่อบท", "subtopics": ["หัวข้อย่อย 1", "หัวข้อย่อย 2"]}]
}`;

      const r1 = await generateJSON<any>(prompt1, 4096);
      if (!r1) { setStage("idle"); setEbookMode(null); return; }

      setCover(r1.cover);
      setIntro(r1.intro);
      setToc(r1.toc);

      setStage("chapters");
      const generatedChapters: ChapterData[] = [];
      const tocItems = r1.toc as TocItem[];

      for (let i = 0; i < tocItems.length; i++) {
        setCurrentChapter(i);
        const ch = tocItems[i];
        const prompt = `คุณเป็น AI นักเขียน ebook ภาษาไทยมืออาชีพ

สไตล์: ภาษาเหมือนเพื่อนคุยกัน ตรง กวนตีน ใช้อุปมาเปรียบเทียบ

Ebook: ${idea.title}
กลุ่มเป้าหมาย: ${idea.target || "คนทั่วไป"}

เขียนเนื้อหา บทที่ ${i + 1}: "${ch.title}"
หัวข้อย่อย: ${ch.subtopics.join(", ")}

เขียนเนื้อหาจริงยาว 800-1200 คำ

ตอบเป็น JSON เท่านั้น ไม่ต้องมี markdown backtick:
{"chapter_title": "ชื่อบท", "content": "เนื้อหาเต็ม"}`;

        const chResult = await generateJSON<any>(prompt, 8192);
        if (chResult) {
          generatedChapters.push({ title: chResult.chapter_title || ch.title, content: chResult.content });
          setChapters([...generatedChapters]);
        }
      }

      setStage("closing");
      const closingPrompt = `คุณเป็น AI นักเขียน ebook ภาษาไทยมืออาชีพ

เขียนบทส่งท้ายสำหรับ ebook: ${idea.title}

เขียน:
1. สรุปสิ่งที่ได้เรียนรู้ (3-5 ย่อหน้า)
2. ให้กำลังใจ
3. Call to action
4. Quote ปิดท้าย

ตอบเป็น JSON เท่านั้น ไม่ต้องมี markdown backtick:
{"closing_content": "เนื้อหาบทส่งท้าย", "quote": "quote ปิดท้าย"}`;

      const closingResult = await generateJSON<any>(closingPrompt, 4096);
      if (closingResult) {
        setClosing({ content: closingResult.closing_content, quote: closingResult.quote });
      }

      setStage("done");
      toast.success("สร้าง Ebook เสร็จสมบูรณ์! 🎉");
    }
  }

  async function regenerateChapter(index: number) {
    const ch = chapters[index];
    const tocItem = toc[index];
    const idea = selectedIdea!;

    const prompt = `คุณเป็น AI นักเขียน ebook ภาษาไทยมืออาชีพ

Ebook: ${idea.title}
กลุ่มเป้าหมาย: ${idea.target || "คนทั่วไป"}

เขียนเนื้อหาใหม่สำหรับ บทที่ ${index + 1}: "${ch.title}"
หัวข้อย่อย: ${tocItem?.subtopics?.join(", ") || ""}

เขียนเนื้อหาจริงยาว 800-1200 คำ

ตอบเป็น JSON เท่านั้น ไม่ต้องมี markdown backtick:
{"chapter_title": "ชื่อบท", "content": "เนื้อหาเต็ม"}`;

    const result = await generateJSON<any>(prompt, 8192);
    if (result) {
      const newChapters = [...chapters];
      newChapters[index] = { title: result.chapter_title || ch.title, content: result.content };
      setChapters(newChapters);
      toast.success(`เขียนบทที่ ${index + 1} ใหม่เรียบร้อย!`);
    }
  }

  const handleExport = async () => {
    if (!cover || !closing) return;
    const fullContent = [
      `${cover.title_en}\n${cover.title_th}\n${cover.subtitle}\n${cover.tagline}\nby ${cover.author}`,
      `\n\n---\n\nคำนำ\n\n${intro}`,
      `\n\n---\n\nสารบัญ\n\n${toc.map((ch, i) => `${i + 1}. ${ch.title}\n${ch.subtopics.map((s) => `   - ${s}`).join("\n")}`).join("\n")}`,
      ...chapters.map((ch, i) => `\n\n---\n\nบทที่ ${i + 1}: ${ch.title}\n\n${ch.content}`),
      `\n\n---\n\nบทส่งท้าย\n\n${closing.content}\n\n"${closing.quote}"`,
    ].join("");
    await navigator.clipboard.writeText(fullContent);
    window.open("https://docs.google.com/document/create", "_blank");
    setShowExportModal(true);
  };

  function renderContent(text: string) {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .split(/\\n\\n|\n\n/)
      .map((p) => `<p class="mb-3">${p.replace(/\\n- |\\n• |\n- |\n• /g, "<br/>• ")}</p>`)
      .join("");
  }

  const saveEdit = () => {
    if (!editingSection) return;
    if (editingSection === "intro") {
      setIntro(editContent);
    } else if (editingSection === "closing") {
      if (closing) setClosing({ ...closing, content: editContent });
    } else if (editingSection.startsWith("chapter-")) {
      const idx = parseInt(editingSection.split("-")[1]);
      const newChapters = [...chapters];
      newChapters[idx] = { ...newChapters[idx], content: editContent };
      setChapters(newChapters);
    }
    setEditingSection(null);
    toast.success("บันทึกแล้ว!");
  };

  // Generating progress view
  if (stage !== "idle" && stage !== "done") {
    const stageItems = [
      { label: "ออกแบบหน้าปก + คำนำ + สารบัญ", done: !!cover, current: stage === "cover" },
      ...(toc.length > 0
        ? toc.map((t, i) => ({
            label: `บทที่ ${i + 1}: ${t.title}`,
            done: chapters.length > i,
            current: stage === "chapters" && currentChapter === i,
          }))
        : (selectedIdea?.chapters || []).map((c, i) => ({
            label: `บทที่ ${i + 1}: ${c}`,
            done: chapters.length > i,
            current: stage === "chapters" && currentChapter === i,
          }))),
      { label: "บทส่งท้าย", done: !!closing, current: stage === "closing" },
    ];

    return (
      <StepLayout currentStep={2} title="กำลังสร้าง Ebook..." subtitle={selectedIdea.title}>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {stageItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  {item.done ? (
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                  ) : item.current ? (
                    <Loader2 className="h-5 w-5 text-accent animate-spin flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground/30 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${item.done ? "text-foreground" : item.current ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {item.current ? "⏳ กำลัง" : item.done ? "✅" : "○"} {item.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {cover && (
          <Card className="mt-4">
            <CardHeader className="pb-2"><CardTitle className="text-base">✅ หน้าปกพร้อมแล้ว</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">{cover.title_th} — {cover.subtitle}</p></CardContent>
          </Card>
        )}
      </StepLayout>
    );
  }

  // Preview & Edit view
  return (
    <StepLayout currentStep={2} title="Ebook ของคุณ" subtitle={`${selectedIdea.title} — ${ebookMode === "draft" ? "Draft" : "Full"} Mode`}>
      {/* Cover */}
      {cover && (
        <Card className="mb-4 overflow-hidden">
          <div className="bg-gradient-to-br from-primary to-accent p-8 text-center text-primary-foreground">
            <p className="text-2xl font-bold mb-1">{cover.title_en}</p>
            <p className="text-xl font-bold mb-2">{cover.title_th}</p>
            <p className="text-sm opacity-80 mb-1">{cover.subtitle}</p>
            <p className="text-xs opacity-60 italic">{cover.tagline}</p>
            <p className="text-xs opacity-50 mt-4">by {cover.author}</p>
          </div>
          <CardContent className="pt-3 pb-3 flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => setEditCover(cover)}>
              <PenLine className="h-3 w-3 mr-1" /> แก้ไข
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Intro */}
      {intro && (
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">📝 คำนำ</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => { setEditingSection("intro"); setEditContent(intro); }}>
                <PenLine className="h-3 w-3 mr-1" /> แก้ไข
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-sm" dangerouslySetInnerHTML={{ __html: renderContent(intro) }} />
          </CardContent>
        </Card>
      )}

      {/* TOC */}
      {toc.length > 0 && (
        <Card className="mb-4">
          <CardHeader className="pb-2"><CardTitle className="text-base">📋 สารบัญ</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {toc.map((item, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-accent/15 text-accent text-xs flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                    <span className="font-semibold text-sm">{item.title}</span>
                  </div>
                  <ul className="ml-8 mt-1 space-y-0.5">
                    {item.subtopics.map((sub, j) => (
                      <li key={j} className="text-xs text-muted-foreground">— {sub}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chapters */}
      {chapters.map((ch, i) => (
        <Card key={i} className="mb-4">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">บทที่ {i + 1}: {ch.title}</CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => { setEditingSection(`chapter-${i}`); setEditContent(ch.content); }}>
                  <PenLine className="h-3 w-3 mr-1" /> แก้ไข
                </Button>
                <Button variant="ghost" size="sm" onClick={() => regenerateChapter(i)} disabled={loading}>
                  <Sparkles className="h-3 w-3 mr-1" /> {loading ? "..." : "AI เขียนใหม่"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-sm" dangerouslySetInnerHTML={{ __html: renderContent(ch.content) }} />
            {ch.expand_hints && ch.expand_hints.length > 0 && (
              <div className="mt-3 bg-accent/5 rounded-lg p-3">
                <p className="text-xs font-semibold mb-1">💡 หัวข้อที่ควรเขียนเพิ่ม:</p>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  {ch.expand_hints.map((h, j) => <li key={j}>• {h}</li>)}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Closing */}
      {closing && (
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">🎬 บทส่งท้าย</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => { setEditingSection("closing"); setEditContent(closing.content); }}>
                <PenLine className="h-3 w-3 mr-1" /> แก้ไข
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-sm" dangerouslySetInnerHTML={{ __html: renderContent(closing.content) }} />
            <blockquote className="mt-4 border-l-4 border-accent pl-4 italic text-muted-foreground">"{closing.quote}"</blockquote>
          </CardContent>
        </Card>
      )}

      <div className="h-24" />

      {/* Sticky export bar */}
      {isComplete && (
        <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur border-t p-4 z-50">
          <div className="max-w-2xl mx-auto flex gap-3">
            <Button onClick={handleExport} className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-bold py-5">
              <ExternalLink className="h-4 w-4 mr-2" /> 📄 Export เป็น Google Docs
            </Button>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>Dashboard</Button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={!!editingSection} onOpenChange={() => setEditingSection(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>แก้ไขเนื้อหา</DialogTitle></DialogHeader>
          <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="min-h-[300px] font-mono text-sm" rows={15} />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setEditingSection(null)}>ยกเลิก</Button>
            <Button onClick={saveEdit} className="bg-accent text-accent-foreground">บันทึก</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cover Edit Modal */}
      <Dialog open={!!editCover} onOpenChange={() => setEditCover(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>แก้ไขหน้าปก</DialogTitle></DialogHeader>
          {editCover && (
            <div className="space-y-3">
              <div><label className="text-sm font-medium">ชื่อ EN</label><Input value={editCover.title_en} onChange={(e) => setEditCover({ ...editCover, title_en: e.target.value })} /></div>
              <div><label className="text-sm font-medium">ชื่อ TH</label><Input value={editCover.title_th} onChange={(e) => setEditCover({ ...editCover, title_th: e.target.value })} /></div>
              <div><label className="text-sm font-medium">Subtitle</label><Input value={editCover.subtitle} onChange={(e) => setEditCover({ ...editCover, subtitle: e.target.value })} /></div>
              <div><label className="text-sm font-medium">Tagline</label><Input value={editCover.tagline} onChange={(e) => setEditCover({ ...editCover, tagline: e.target.value })} /></div>
              <div><label className="text-sm font-medium">ผู้เขียน</label><Input value={editCover.author} onChange={(e) => setEditCover({ ...editCover, author: e.target.value })} /></div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditCover(null)}>ยกเลิก</Button>
                <Button onClick={() => { setCover(editCover); setEditCover(null); toast.success("บันทึกหน้าปกแล้ว!"); }} className="bg-accent text-accent-foreground">บันทึก</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>📋 เนื้อหา ebook ถูกคัดลอกแล้ว!</DialogTitle></DialogHeader>
          <div className="space-y-3 text-sm">
            <p>1. Google Docs กำลังเปิดในแท็บใหม่</p>
            <p>2. กด <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">Ctrl+V</kbd> (หรือ <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">Cmd+V</kbd>) เพื่อวางเนื้อหา</p>
            <p>3. จัดรูปแบบตามใจชอบ แล้วพร้อมขาย!</p>
          </div>
          <Button onClick={() => setShowExportModal(false)} className="w-full bg-accent text-accent-foreground">เข้าใจแล้ว ✓</Button>
        </DialogContent>
      </Dialog>
    </StepLayout>
  );
}
