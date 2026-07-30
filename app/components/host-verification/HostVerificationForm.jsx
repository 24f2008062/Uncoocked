"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function HostVerificationForm({ initialData = null, isResubmit = false }) {
  const router = useRouter();

  const [form, setForm] = useState({
    orgName: initialData?.orgName || "",
    clubName: initialData?.clubName || "",
    applicantRole: initialData?.applicantRole || "",
    eventDescription: initialData?.eventDescription || "",
    portfolioUrl: initialData?.portfolioUrl || "",
  });

  const [documents, setDocuments] = useState(
    initialData?.documents ? JSON.parse(initialData.documents) : []
  );

  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploadingDoc(true);
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const base64Data = reader.result;
        const res = await fetch("/api/host-verification/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            fileData: base64Data,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");

        setDocuments((prev) => [...prev, data.document]);
        toast.success("Document attached successfully!");
      } catch (err) {
        toast.error(err.message || "Failed to upload document");
      } finally {
        setUploadingDoc(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveDoc = (docId) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.orgName.trim() || !form.applicantRole.trim() || !form.eventDescription.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/host-verification/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          documents: JSON.stringify(documents),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      toast.success(isResubmit ? "Application re-submitted successfully!" : "Application submitted successfully!");
      router.push("/host-verification/status");
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-xs uppercase font-bold text-gray-400">
          College / Organization Name <span className="text-purple-500">*</span>
        </label>
        <input
          required
          type="text"
          placeholder="e.g. IIIT Lucknow, TechFest Org"
          value={form.orgName}
          onChange={handleChange("orgName")}
          className="input"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-xs uppercase font-bold text-gray-400">
          Club / Student Society Name
        </label>
        <input
          type="text"
          placeholder="e.g. AXIS Coding Club, E-Cell"
          value={form.clubName}
          onChange={handleChange("clubName")}
          className="input"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-xs uppercase font-bold text-gray-400">
          Your Official Role <span className="text-purple-500">*</span>
        </label>
        <input
          required
          type="text"
          placeholder="e.g. President, Event Coordinator, Faculty Lead"
          value={form.applicantRole}
          onChange={handleChange("applicantRole")}
          className="input"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-xs uppercase font-bold text-gray-400">
          Event Overview & Expected Scale <span className="text-purple-500">*</span>
        </label>
        <textarea
          required
          rows={4}
          placeholder="Describe the nature of events you plan to host, target audience size, and frequency..."
          value={form.eventDescription}
          onChange={handleChange("eventDescription")}
          className="input resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-xs uppercase font-bold text-gray-400">
          Portfolio / LinkedIn / Organization Website (Optional)
        </label>
        <input
          type="url"
          placeholder="https://linkedin.com/in/yourprofile or https://club.edu"
          value={form.portfolioUrl}
          onChange={handleChange("portfolioUrl")}
          className="input"
        />
      </div>

      {/* Document Upload Section */}
      <div className="space-y-3 pt-2">
        <label className="block text-xs uppercase font-bold text-gray-400">
          Identity / Organization Proof Attachments (Optional)
        </label>

        <div className="border border-dashed border-white/15 rounded-xl p-4 text-center bg-black/40 hover:border-purple-500/50 transition-colors">
          <input
            type="file"
            id="docUpload"
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            disabled={uploadingDoc}
            className="hidden"
          />
          <label htmlFor="docUpload" className="cursor-pointer flex flex-col items-center gap-2 py-2">
            <Upload className="w-6 h-6 text-purple-400" />
            <span className="text-xs text-gray-300 font-semibold">
              {uploadingDoc ? "Uploading document..." : "Click to attach ID proof or permission letter (PDF/Images < 5MB)"}
            </span>
          </label>
        </div>

        {/* Attached Documents List */}
        {documents.length > 0 && (
          <div className="space-y-2 pt-1">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between px-3 py-2 bg-surface-2 border border-white/10 rounded-lg text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  <span className="text-gray-200 truncate">{doc.fileName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveDoc(doc.id)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting || uploadingDoc}
        className="btn-primary w-full py-3 font-bold disabled:opacity-50"
      >
        {submitting
          ? "Submitting Application..."
          : isResubmit
          ? "Re-submit Application"
          : "Submit Verification Application"}
      </button>
    </form>
  );
}
