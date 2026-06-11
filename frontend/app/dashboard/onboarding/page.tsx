"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleComplete() {
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/complete-first-login");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  }

  async function handleUploadAndComplete() {
    setUploading(true);
    setError("");
    setMessage("");
    try {
      if (!file) {
        setError("Please select a PDF to upload.");
        return;
      }

      const formData = new FormData();
      formData.append("resume", file);

      const uploadRes = await api.post("/resumes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const resumeId = uploadRes.data?.resume?._id;
      setMessage("Resume uploaded successfully");

      if (resumeId) {
        await api.post(`/resumes/analyze/${resumeId}`);
        setMessage("ATS Analysis completed");
      }

      await api.post("/auth/complete-first-login");
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-md">
        <h1 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">Welcome — one last step</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">Before we take you to your dashboard, complete this quick setup so your profile and preferences are ready.</p>

        <ul className="list-disc list-inside mb-6 text-sm text-slate-700 dark:text-slate-300">
          <li>Confirm profile basics</li>
          <li>Set job preferences</li>
          <li>Allow ATS analysis access</li>
        </ul>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Upload your resume (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mb-2"
          />

          {file && <div className="text-sm text-green-700 mb-2">Selected: {file.name}</div>}

          {message && <div className="text-sm text-slate-700 mb-2">{message}</div>}

          <div className="flex gap-3">
            <button onClick={handleUploadAndComplete} disabled={uploading} className="px-4 py-2 bg-blue-600 text-white rounded-md">
              {uploading ? "Uploading..." : "Upload & Complete setup"}
            </button>

            <button onClick={handleComplete} disabled={loading} className="px-4 py-2 bg-slate-900 text-white rounded-md">
              {loading ? "Working..." : "Complete setup and continue"}
            </button>

            <button onClick={() => router.push("/dashboard")} disabled={loading || uploading} className="px-4 py-2 border rounded-md">
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
