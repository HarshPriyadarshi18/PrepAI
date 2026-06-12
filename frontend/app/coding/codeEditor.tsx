"use client";

import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("@monaco-editor/react"),
  { ssr: false }
);

interface Props {
  language: string;
  code: string;
  setCode: (value: string) => void;
}

export default function CodeEditor({
  language,
  code,
  setCode,
}: Props) {
  return (
    <div className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 overflow-hidden">
      <Editor
        height="70vh"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(value) =>
          setCode(value || "")
        }
        options={{
          fontSize: 16,
          minimap: {
            enabled: false,
          },
          automaticLayout: true,
        }}
      />
    </div>
  );
}