"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportDialog } from "./export-dialog";

interface ExportButtonProps {
  sessionId: string;
  variant?: "default" | "outline";
  className?: string;
}

export function ExportButton({
  sessionId,
  variant = "default",
  className = "",
}: ExportButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        variant={variant}
        className={className}
      >
        <Download className="mr-2 h-4 w-4" />
        Export Results
      </Button>

      <ExportDialog
        sessionId={sessionId}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}
