"use client";
import { useState, useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/AlertDialog";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { importMembersToTeam } from "@/actions/members";
import toast from "react-hot-toast";

interface ImportMembersModalProps {
  teamId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface ImportResult {
  success: boolean;
  added: number;
  failed: number;
  errors?: string[];
}

function ImportMembersModal({
  teamId,
  open,
  onOpenChange,
  onSuccess,
}: ImportMembersModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        setFileError("Please select a CSV file");
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setFileError(undefined); // Clear error when valid file selected
    }
  };

  const parseCSV = async (
    file: File,
  ): Promise<Array<{ email: string; full_name?: string }>> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0); // Remove empty lines

          if (lines.length <= 1) {
            // Only header or empty file
            resolve([]);
            return;
          }

          // Skip header row
          const dataLines = lines.slice(1);

          const members = dataLines.map((line) => {
            const [email, full_name] = line.split(",").map((s) => s.trim());
            return { email, full_name: full_name || undefined };
          });

          resolve(members);
        } catch (error) {
          reject(new Error("Failed to parse CSV file"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setFileError("Please select a file to import");
      return; // Don't close modal
    }

    setFileError(undefined);
    setIsLoading(true);

    try {
      toast.loading("Parsing CSV file...");
      const parsedMembers = await parseCSV(selectedFile);

      // Filter out invalid entries (empty email)
      const members = parsedMembers.filter((m) => m.email && m.email.trim());

      if (members.length === 0) {
        toast.dismiss();
        setFileError(
          "No valid members found in CSV. Please check the file format.",
        );
        setIsLoading(false);
        return; // Don't close modal
      }

      // Show warning if some entries were skipped
      if (members.length < parsedMembers.length) {
        const skipped = parsedMembers.length - members.length;
        toast.dismiss();
        toast(
          `Skipped ${skipped} invalid ${skipped === 1 ? "entry" : "entries"}. Importing ${members.length} members...`,
          { icon: "⚠️", duration: 3000 },
        );
      }

      toast.dismiss();
      toast.loading(`Importing ${members.length} members...`);

      const result = await importMembersToTeam(teamId, members);

      toast.dismiss();

      if (result.success) {
        const { added, failed } = result as ImportResult;
        if (failed > 0) {
          toast.success(
            `Imported ${added} members successfully. ${failed} failed.`,
            { duration: 5000 },
          );
        } else {
          toast.success(`Successfully imported ${added} members!`);
        }
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setFileError(undefined);
        onOpenChange(false); // Only close on success
        onSuccess?.();
      } else {
        setFileError(result.error || "Failed to import members");
        // Don't close modal - let user try again
      }
    } catch (error) {
      toast.dismiss();
      setFileError(
        error instanceof Error ? error.message : "Failed to import members",
      );
      // Don't close modal on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="p-4 left-4 right-4 translate-x-0 sm:left-[50%] sm:right-auto sm:translate-x-[-50%] max-w-md sm:m-0 sm:w-full">
        <AlertDialogHeader className="p-1">
          <AlertDialogTitle className="flex items-center gap-2">
            <Upload className="w-6 h-6 text-blue-600" />
            Import Members
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-600">
            Upload a CSV file with columns: email, full_name
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                fileError ? "border-red-300" : "border-gray-300"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                {selectedFile ? (
                  <>
                    <FileText className="w-12 h-12 text-blue-500" />
                    <p className="text-sm font-medium text-gray-700">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Click to change file
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400" />
                    <p className="text-sm font-medium text-gray-700">
                      Click to upload CSV
                    </p>
                    <p className="text-xs text-gray-500">or drag and drop</p>
                  </>
                )}
              </label>
            </div>
            {fileError && (
              <p className="text-sm text-red-600 mt-1">{fileError}</p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-800">
              <p className="font-medium mb-1">CSV Format:</p>
              <code className="bg-white px-2 py-1 rounded text-xs block">
                email,full_name
                <br />
                john@example.com,John Doe
                <br />
                jane@example.com,Jane Smith
              </code>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="flex flex-row">
          <AlertDialogCancel className="flex-1 sm:flex-none">
            Cancel
          </AlertDialogCancel>
          <button
            type="button"
            className="px-4 py-2 border-3 border-black bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            disabled={isLoading}
            onClick={handleImport}
          >
            <Upload className="w-4 h-4" />
            {isLoading ? "Importing..." : "Import Members"}
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ImportMembersModal;
