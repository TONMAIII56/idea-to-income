import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StepLayoutProps {
  currentStep: number;
  totalSteps?: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}

const stepNames = [
  "ขายอะไรดี?",
  "ทำยังไง?",
  "ลูกค้าอยู่ไหน?",
  "หน้าขาย + รับเงิน",
  "Content Plan 30 วัน",
];

export default function StepLayout({
  currentStep,
  totalSteps = 5,
  title,
  subtitle,
  children,
  onNext,
  nextLabel = "บันทึกและไปขั้นตอนต่อไป",
  nextDisabled = false,
}: StepLayoutProps) {
  const navigate = useNavigate();
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur border-b">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(currentStep > 1 ? `/step/${currentStep - 1}` : '/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              กลับ
            </Button>
            <span className="text-sm font-medium text-muted-foreground">
              ขั้นที่ {currentStep}/{totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-1">
            {stepNames.map((name, i) => (
              <span
                key={i}
                className={`text-[10px] md:text-xs ${
                  i + 1 === currentStep
                    ? "text-foreground font-semibold"
                    : i + 1 < currentStep
                    ? "text-accent"
                    : "text-muted-foreground"
                }`}
              >
                {i + 1 <= 2 ? name : ""}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 md:py-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground mb-8">{subtitle}</p>
        {children}

        {onNext && (
          <div className="mt-10 pb-8">
            <Button
              onClick={onNext}
              disabled={nextDisabled}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base py-6"
              size="lg"
            >
              {nextLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
