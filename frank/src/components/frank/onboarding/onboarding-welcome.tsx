"use client";

import { useState } from "react";
import { Rocket, Users, TrendingUp, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import type { OnboardingRole } from "@/lib/onboarding/types";
import { getAvailableRoles } from "@/lib/onboarding/role-configs";

const ROLE_ICONS = {
  SOLO_PM: Rocket,
  TEAM_LEAD: Users,
  FOUNDER: TrendingUp,
};

export function OnboardingWelcome() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<OnboardingRole | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const startOnboarding = api.onboarding.startOnboarding.useMutation();
  const skipOnboarding = api.onboarding.skipOnboarding.useMutation();
  const resetOnboarding = api.onboarding.resetOnboarding.useMutation();

  const availableRoles = getAvailableRoles();

  const handleStartOnboarding = async () => {
    if (!selectedRole) {
      return;
    }

    setIsStarting(true);
    try {
      const result = await startOnboarding.mutateAsync({ role: selectedRole });
      // Navigate to first onboarding step
      router.push(`/onboarding/improvement-capture?sessionId=${result.sessionId}`);
    } catch (error) {
      console.error("Failed to start onboarding:", error);
      setIsStarting(false);
    }
  };

  const handleSkipOnboarding = async () => {
    try {
      await skipOnboarding.mutateAsync();
      // Navigate to main dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to skip onboarding:", error);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Frank!</h1>
        <p className="text-xl text-muted-foreground">
          Your AI-powered prioritization assistant
        </p>
        <p className="mt-4 text-muted-foreground">
          Get productive in 15 minutes with our guided tour
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Choose your role to personalize your experience
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {availableRoles.map((roleConfig) => {
            const Icon = ROLE_ICONS[roleConfig.role];
            const isSelected = selectedRole === roleConfig.role;

            return (
              <Card
                key={roleConfig.role}
                className={`cursor-pointer transition-all hover:border-primary ${
                  isSelected ? "border-primary ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedRole(roleConfig.role)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="h-8 w-8 text-primary" />
                    {isSelected && (
                      <CheckCircle className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <CardTitle>{roleConfig.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{roleConfig.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={handleSkipOnboarding}
          disabled={skipOnboarding.isPending}
        >
          Skip Tour
        </Button>
        <Button
          onClick={handleStartOnboarding}
          disabled={!selectedRole || isStarting}
          size="lg"
        >
          {isStarting ? "Starting..." : "Start Guided Tour"}
        </Button>
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>
          The guided tour takes approximately 12-15 minutes and covers all core
          features
        </p>
      </div>

      {/* Dev-only reset button */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              try {
                await resetOnboarding.mutateAsync();
                window.location.reload();
              } catch (error) {
                console.error("Failed to reset onboarding:", error);
              }
            }}
            disabled={resetOnboarding.isPending}
          >
            {resetOnboarding.isPending ? "Resetting..." : "🔧 Reset Onboarding (Dev)"}
          </Button>
        </div>
      )}
    </div>
  );
}
