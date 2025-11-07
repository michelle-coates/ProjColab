"use client";

import { useState } from "react";
import { PartyPopper, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export function CompletionCelebration() {
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);

  const completeOnboarding = api.onboarding.completeOnboarding.useMutation();

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await completeOnboarding.mutateAsync();
      // Navigate to main dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      setIsCompleting(false);
    }
  };

  const achievements = [
    "First Improvement Captured!",
    "AI Collaboration",
    "Decision Made",
    "Visual Thinker",
    "Ready to Share",
    "Frank Expert",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Celebration header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <PartyPopper className="h-24 w-24 text-primary animate-bounce" />
              <Sparkles className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
              <Sparkles className="h-6 w-6 text-blue-500 absolute -bottom-1 -left-1 animate-pulse delay-150" />
            </div>
          </div>
          <h1 className="text-4xl font-bold">Congratulations!</h1>
          <p className="text-xl text-muted-foreground">
            You've completed the Frank guided tour
          </p>
        </div>

        {/* Achievement summary */}
        <Card>
          <CardHeader>
            <CardTitle>Your Achievements</CardTitle>
            <CardDescription>
              You've unlocked all the basics of using Frank
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {achievements.map((achievement, index) => (
                <Badge key={index} variant="secondary" className="text-sm py-1">
                  {achievement}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* What's next */}
        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                Start Your First Real Session
              </h3>
              <p className="text-sm text-muted-foreground pl-6">
                Create a new prioritization session with your actual improvements
                and let Frank help you make decisions.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                Explore Advanced Features
              </h3>
              <p className="text-sm text-muted-foreground pl-6">
                As you use Frank, you'll discover more powerful features for
                collaboration, analytics, and integration.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                Share Your Results
              </h3>
              <p className="text-sm text-muted-foreground pl-6">
                Use the export feature to share your prioritization decisions with
                your team and stakeholders.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="flex justify-center">
          <Button onClick={handleComplete} size="lg" disabled={isCompleting}>
            {isCompleting ? "Completing..." : "Go to Dashboard"}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Ready to make better prioritization decisions with confidence!
        </p>
      </div>
    </div>
  );
}
