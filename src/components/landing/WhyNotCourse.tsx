import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const columns = [
  {
    title: "คอร์สทั่วไป",
    bgClass: "bg-red-50 dark:bg-red-950/30",
    borderClass: "",
    items: [
      { icon: "❌", text: "ดูวิดีโอ 10+ ชั่วโมง" },
      { icon: "❌", text: "ได้ความรู้ แต่ยังไม่มีของขาย" },
      { icon: "❌", text: "ดูจบแล้วก็ลืม" },
    ],
    price: "฿1,990 - ฿9,990",
    highlight: false,
  },
  {
    title: "ทำเอง (DIY)",
    bgClass: "bg-yellow-50 dark:bg-yellow-950/30",
    borderClass: "",
    items: [
      { icon: "❌", text: "ลองผิดลองถูก 3-6 เดือน" },
      { icon: "❌", text: "อาจได้ อาจไม่ได้" },
      { icon: "❌", text: "เสียเวลาหาข้อมูลกระจัดกระจาย" },
    ],
    price: "ฟรี แต่แลกด้วยเวลา",
    highlight: false,
  },
  {
    title: "ขายอะไรดีวะ",
    bgClass: "bg-green-50 dark:bg-green-950/30",
    borderClass: "border-2 border-green-500 shadow-lg scale-[1.02]",
    items: [
      { icon: "✅", text: "เปิด กรอก ทำตาม" },
      { icon: "✅", text: "ได้ Product จริงใน 2 สัปดาห์" },
      { icon: "✅", text: "Template ภาษาไทยพร้อมใช้" },
    ],
    price: "เริ่มต้น ฿199",
    highlight: true,
  },
];

export default function WhyNotCourse() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
          ทำไมไม่ใช่คอร์ส?
        </h2>
        <p className="text-center text-muted-foreground mb-10">
          เปรียบเทียบให้เห็นชัดๆ
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((col, i) => (
            <Card key={i} className={`${col.bgClass} ${col.borderClass} transition-all`}>
              <CardHeader className="pb-3 text-center">
                <CardTitle className="text-lg">{col.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {col.items.map((item, j) => (
                  <div key={j} className="flex items-start gap-2 text-sm">
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
                <div className="pt-3 border-t mt-4">
                  <p className={`text-center font-bold text-sm ${col.highlight ? "text-green-600" : "text-muted-foreground"}`}>
                    {col.price}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
