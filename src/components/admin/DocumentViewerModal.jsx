"use client";

import { useEffect, useState } from "react";
import { X, ExternalLink, ShieldCheck, FileText, Download, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export default function DocumentViewerModal({
  isOpen,
  onClose,
  docUrl,
  docTitle = "Identity Verification Document",
  applicationId,
}) {
  const [copied, setCopied] = useState(false);
  const [isPdf, setIsPdf] = useState(false);
  const [isImage, setIsImage] = useState(false);

  useEffect(() => {
    if (!docUrl) return;
    const lower = docUrl.toLowerCase();
    const pdf = lower.endsWith(".pdf") || lower.includes("application/pdf");
    const img =
      lower.endsWith(".png") ||
      lower.endsWith(".jpg") ||
      lower.endsWith(".jpeg") ||
      lower.endsWith(".webp") ||
      lower.endsWith(".svg") ||
      docUrl.startsWith("data:image");

    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional prop sync
    setIsPdf(pdf);
    setIsImage(img || (!pdf && !lower.includes("google.com/drive")));
  }, [docUrl]);

  // Log document access audit event when modal opens
  useEffect(() => {
    if (isOpen && applicationId && docUrl) {
      fetch("/api/admin/audit-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DOCUMENT_VIEWED",
          applicationId,
          details: `Viewed verification document: ${docTitle}`,
        }),
      }).catch((err) => console.error("Document audit log failed:", err));
    }
  }, [isOpen, applicationId, docUrl, docTitle]);

  if (!isOpen || !docUrl) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(docUrl);
    setCopied(true);
    toast.success("Document link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                {docTitle}
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Access Logged
                </span>
              </h3>
              <p className="text-[11px] text-gray-400 truncate max-w-md font-mono">{docUrl}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="bg-neutral-800 hover:bg-neutral-700 text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-700 transition flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy Link"}
            </button>
            <a
              href={docUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-700 transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" /> External
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewer Body */}
        <div className="p-6 overflow-y-auto flex-1 flex items-center justify-center bg-black/50 min-h-[400px]">
          {isImage ? (
            <div className="max-w-full max-h-[70vh] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={docUrl}
                alt={docTitle}
                className="max-w-full max-h-[65vh] object-contain rounded-lg border border-neutral-800 shadow-xl"
              />
            </div>
          ) : isPdf ? (
            <iframe
              src={docUrl}
              title={docTitle}
              className="w-full h-[65vh] rounded-lg border border-neutral-800 bg-white"
            />
          ) : (
            <div className="w-full h-[65vh] rounded-lg border border-neutral-800 bg-neutral-950 overflow-hidden relative">
              <iframe
                src={docUrl}
                title={docTitle}
                className="w-full h-full border-0"
              />
            </div>
          )}
        </div>

        {/* Footer Security Badge */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-950 text-center text-[10px] text-gray-500 font-mono flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Security Notice: Document viewing activity is recorded in the immutable audit log for compliance.
        </div>
      </div>
    </div>
  );
}
