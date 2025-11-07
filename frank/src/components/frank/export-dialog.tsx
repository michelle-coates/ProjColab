"use client";

import { useState } from "react";
import { Download, FileText, Table, CheckCircle, AlertCircle } from "lucide-react";
import { api } from "@/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ExportDialogProps {
  sessionId: string;
  isOpen: boolean;
  onClose: () => void;
}

type ExportFormat = "csv" | "summary";

export function ExportDialog({ sessionId, isOpen, onClose }: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("csv");
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Get export data preview
  const { data: exportData, isLoading: isLoadingPreview } =
    api.export.getExportData.useQuery(
      { sessionId },
      { enabled: isOpen && !!sessionId }
    );

  // Export mutations
  const exportCSV = api.export.exportCSV.useMutation();
  const exportSummary = api.export.exportSummary.useMutation();

  const handleExport = async () => {
    setIsExporting(true);

    try {
      let result: { filename: string; data: string; mimeType: string };

      if (selectedFormat === "csv") {
        result = await exportCSV.mutateAsync({ sessionId });
      } else {
        result = await exportSummary.mutateAsync({ sessionId });
      }

      // Create blob and trigger download
      const blob = new Blob([result.data], { type: result.mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setExportStatus({
        type: "success",
        message: `${result.filename} has been downloaded successfully.`,
      });

      // Close dialog after 2 seconds
      setTimeout(() => {
        onClose();
        setExportStatus({ type: null, message: "" });
      }, 2000);
    } catch (error) {
      setExportStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "An error occurred during export. Please try again.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export Prioritization Results</DialogTitle>
          <DialogDescription>
            Choose a format to export your prioritized improvements and share
            with your team.
          </DialogDescription>
        </DialogHeader>

        {/* Export Preview */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-2 text-sm font-medium text-gray-700">
            Export Preview
          </h3>
          {isLoadingPreview ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : exportData?.hasData ? (
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <span className="font-medium">Session:</span>{" "}
                {exportData.sessionName}
              </p>
              <p>
                <span className="font-medium">Total Improvements:</span>{" "}
                {exportData.totalImprovements}
              </p>
              <p>
                <span className="font-medium">Categories:</span>{" "}
                {Object.keys(exportData.categoryCounts).join(", ")}
              </p>
            </div>
          ) : (
            <p className="text-sm text-yellow-600">
              No improvements found in this session to export.
            </p>
          )}
        </div>

        {/* Format Selection */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Select Format</h3>

          {/* CSV Format */}
          <button
            onClick={() => setSelectedFormat("csv")}
            className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
              selectedFormat === "csv"
                ? "border-[#76A99A] bg-[#76A99A]/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`rounded p-1.5 ${
                  selectedFormat === "csv"
                    ? "bg-[#76A99A] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <Table className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">CSV Export</h4>
                <p className="text-xs text-gray-600">
                  Excel, Sheets, Jira, Linear compatible
                </p>
              </div>
            </div>
          </button>

          {/* Summary Report Format */}
          <button
            onClick={() => setSelectedFormat("summary")}
            className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
              selectedFormat === "summary"
                ? "border-[#76A99A] bg-[#76A99A]/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`rounded p-1.5 ${
                  selectedFormat === "summary"
                    ? "bg-[#76A99A] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Summary Report</h4>
                <p className="text-xs text-gray-600">
                  Executive summary with Quick Wins
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Status Message */}
        {exportStatus.type && (
          <div
            className={`rounded-lg p-3 ${
              exportStatus.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {exportStatus.type === "success" ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <p className="text-sm font-medium">{exportStatus.message}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || !exportData?.hasData}
            className="bg-[#76A99A] hover:bg-[#68927f]"
          >
            {isExporting ? (
              <>
                <Download className="mr-2 h-4 w-4 animate-pulse" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export {selectedFormat === "csv" ? "CSV" : "Summary"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
