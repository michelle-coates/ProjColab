"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, MessageSquare, Scale, BarChart3, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FeatureDemoProps {
  children: React.ReactNode;
  onComplete?: () => void;
}

export function FeatureDemo({ children, onComplete }: FeatureDemoProps) {
  return (
    <div className="space-y-6">
      {children}
      {onComplete && (
        <div className="flex justify-end">
          <Button onClick={onComplete} size="lg">
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}

interface ImprovementCaptureDemo {
  improvements: Array<{ title: string; description: string }>;
  onComplete: () => void;
}

export function ImprovementCaptureDemo({
  improvements,
  onComplete,
}: ImprovementCaptureDemo) {
  return (
    <FeatureDemo onComplete={onComplete}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Sample Improvements
          </CardTitle>
          <CardDescription>
            We've loaded some example improvements for you to explore. In a real
            session, you'd add your own ideas here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {improvements.map((improvement, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-muted/50"
              >
                <h3 className="font-semibold mb-1">{improvement.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {improvement.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">💡 Quick Tip</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Frank works best when you add improvements as they come to mind.
            Don't worry about having all the details - the AI will help you
            think through each one!
          </p>
        </CardContent>
      </Card>
    </FeatureDemo>
  );
}

interface AIInterrogationDemo {
  conversation: Array<{ role: "assistant" | "user"; content: string }>;
  onComplete: () => void;
}

export function AIInterrogationDemo({
  conversation,
  onComplete,
}: AIInterrogationDemo) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const handleNext = () => {
    if (currentMessageIndex < conversation.length - 1) {
      setCurrentMessageIndex(currentMessageIndex + 1);
    } else {
      onComplete();
    }
  };

  return (
    <FeatureDemo>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            AI-Powered Context Gathering
          </CardTitle>
          <CardDescription>
            Watch how Frank's AI helps you think through your improvements by
            asking thoughtful questions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {conversation.slice(0, currentMessageIndex + 1).map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Badge variant="outline">
          Message {currentMessageIndex + 1} of {conversation.length}
        </Badge>
        <Button onClick={handleNext} size="lg">
          {currentMessageIndex < conversation.length - 1 ? "Next Message" : "Continue"}
        </Button>
      </div>
    </FeatureDemo>
  );
}

interface PairwiseComparisonDemo {
  comparisons: Array<{
    itemA: string;
    itemB: string;
    winner: "A" | "B";
    reasoning: string;
  }>;
  onComplete: () => void;
}

export function PairwiseComparisonDemo({
  comparisons,
  onComplete,
}: PairwiseComparisonDemo) {
  const [currentComparisonIndex, setCurrentComparisonIndex] = useState(0);
  const [showReasoning, setShowReasoning] = useState(false);

  const currentComparison = comparisons[currentComparisonIndex];

  const handleNext = () => {
    if (currentComparisonIndex < comparisons.length - 1) {
      setCurrentComparisonIndex(currentComparisonIndex + 1);
      setShowReasoning(false);
    } else {
      onComplete();
    }
  };

  if (!currentComparison) {
    onComplete();
    return null;
  }

  return (
    <FeatureDemo>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Pairwise Comparison
          </CardTitle>
          <CardDescription>
            Frank makes prioritization easy by asking simple "this or that"
            questions instead of complex scoring.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card
              className={`cursor-pointer transition-all ${
                showReasoning && currentComparison.winner === "A"
                  ? "border-primary ring-2 ring-primary"
                  : "hover:border-primary/50"
              }`}
            >
              <CardHeader>
                <CardTitle className="text-lg">Option A</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{currentComparison.itemA}</p>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all ${
                showReasoning && currentComparison.winner === "B"
                  ? "border-primary ring-2 ring-primary"
                  : "hover:border-primary/50"
              }`}
            >
              <CardHeader>
                <CardTitle className="text-lg">Option B</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{currentComparison.itemB}</p>
              </CardContent>
            </Card>
          </div>

          {showReasoning && (
            <Card className="bg-primary/5 border-primary/20 mb-4">
              <CardHeader>
                <CardTitle className="text-base">Decision Reasoning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{currentComparison.reasoning}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Badge variant="outline">
          Comparison {currentComparisonIndex + 1} of {comparisons.length}
        </Badge>
        <div className="flex gap-2">
          {!showReasoning && (
            <Button variant="outline" onClick={() => setShowReasoning(true)}>
              Show Decision
            </Button>
          )}
          <Button onClick={handleNext} size="lg">
            {currentComparisonIndex < comparisons.length - 1 ? "Next" : "Continue"}
          </Button>
        </div>
      </div>
    </FeatureDemo>
  );
}

export function MatrixVisualizationDemo({ onComplete }: { onComplete: () => void }) {
  return (
    <FeatureDemo onComplete={onComplete}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Impact vs Effort Matrix
          </CardTitle>
          <CardDescription>
            Visualize your priorities in a clear, actionable format. Quick wins
            become immediately obvious!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-square max-w-md mx-auto border-2 rounded-lg relative bg-gradient-to-br from-green-50 via-yellow-50 to-red-50">
            {/* Matrix quadrants */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
              <div className="border-r border-b p-4 flex items-start justify-end">
                <span className="text-xs font-semibold text-muted-foreground">
                  High Impact
                  <br />
                  Low Effort
                </span>
              </div>
              <div className="border-b p-4 flex items-start justify-start">
                <span className="text-xs font-semibold text-muted-foreground">
                  High Impact
                  <br />
                  High Effort
                </span>
              </div>
              <div className="border-r p-4 flex items-end justify-end">
                <span className="text-xs font-semibold text-muted-foreground">
                  Low Impact
                  <br />
                  Low Effort
                </span>
              </div>
              <div className="p-4 flex items-end justify-start">
                <span className="text-xs font-semibold text-muted-foreground">
                  Low Impact
                  <br />
                  High Effort
                </span>
              </div>
            </div>

            {/* Axis labels */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-semibold">
              Effort →
            </div>
            <div className="absolute -left-16 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-semibold">
              Impact →
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">🎯 Focus on Quick Wins</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Items in the top-left quadrant are your "quick wins" - high impact
            with low effort. These should typically be your first priority!
          </p>
        </CardContent>
      </Card>
    </FeatureDemo>
  );
}

export function ExportDemo({ onComplete }: { onComplete: () => void }) {
  return (
    <FeatureDemo onComplete={onComplete}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Export & Share Results
          </CardTitle>
          <CardDescription>
            Export your prioritization to CSV or summary format to share with
            your team or stakeholders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-muted/50">
              <h3 className="font-semibold mb-2">CSV Export</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Download all your improvements with scores, decisions, and
                evidence in a spreadsheet-friendly format.
              </p>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
            </div>

            <div className="border rounded-lg p-4 bg-muted/50">
              <h3 className="font-semibold mb-2">Summary Report</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Generate a formatted summary report perfect for sharing with
                stakeholders or documenting decisions.
              </p>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Summary
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">📤 Team Handoff Made Easy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Export your prioritization decisions to share with your team,
            document your thinking, or create a reference for future planning
            sessions.
          </p>
        </CardContent>
      </Card>
    </FeatureDemo>
  );
}
