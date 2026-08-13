"use client";

import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface Props {
  language: string;
  code: string;
  setCode: (value: string) => void;
  onRunShortcut: () => void;
  isRunning?: boolean;
}

export default function CodeEditor({
  language,
  code,
  setCode,
  onRunShortcut,
  isRunning = false,
}: Props) {
  return (
    <div className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-slate-700">
        <span className="text-slate-400 text-sm font-medium">Editor</span>

        <div className="flex items-center gap-3">
          <span className="text-slate-500 text-xs uppercase">
            {language}
          </span>

          <button
            onClick={onRunShortcut}
            disabled={isRunning}
            className="px-4 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white text-sm font-medium rounded-lg transition"
          >
            {isRunning ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      <Editor
        height="60vh"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || "")}
        onMount={(editor, monaco) => {
          editor.addCommand(
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
            onRunShortcut
          );
        }}
        options={{
          fontSize: 15,
          minimap: { enabled: false },
          automaticLayout: true,
          padding: { top: 16 },
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}