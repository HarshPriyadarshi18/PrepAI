"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function ResumeUploadPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
      if (!file) {
      setMessage("Please select a PDF for doyuf");
      return;
    }

    try {
      setUploading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("resume", file);

      // Upload Resume
      const uploadRes = await api.post(
        "/resumes/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const resumeId = uploadRes.data.resume._id;

      setMessage("doyuf uploaded successfully");

      // Run ATS Analysis
      await api.post(
        `/resumes/analyze/${resumeId}`
      );

      setMessage("ATS Analysis completed");

      // Redirect to ATS Dashboard
      router.push("/dashboard/ats");
    } catch (error: any) {
      console.error(error);

      setMessage(
        error?.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-black mb-2">
          doyuf Analyzer
        </h1>

        <p className="text-gray-600 mb-8">
          Upload your document to doyuf and get instant ATS analysis.
        </p>

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">

          <input
            type="file"
            accept=".pdf"
            onChange={(e) =>
              setFile(
                e.target.files?.[0] || null
              )
            }
            className="mb-4"
          />

          {file && (
            <div className="text-green-600 font-medium mb-4">
              Selected: {file.name}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:bg-gray-400"
          >
            {uploading
              ? "Processing..."
              : "Upload & Analyze"}
          </button>
        </div>

        {message && (
          <div className="mt-6 p-4 rounded-lg bg-gray-100 text-black">
            {message}
          </div>
        )}

        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-700 mb-2">
            What happens after upload?
          </h3>

          <ul className="list-disc ml-5 text-gray-700">
            <li>doyuf PDF uploaded</li>
            <li>Text extracted automatically</li>
            <li>AI ATS Analysis runs</li>
            <li>ATS Score generated</li>
            <li>Improvement suggestions created</li>
          </ul>
        </div>
      </div>
    </div>
  );
}