"use client";

import { useEffect, useState } from "react";
import CodeEditor from "@/app/coding/codeEditor";
import LanguageSelector from "@/app/coding/languageSelector";
import InputPanel from "@/app/coding/inputPanel";
import OutputPanel from "@/app/coding/outputPanel";
export default function CodingPage() {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("// Start coding here");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const savedCode =
      localStorage.getItem("prepai-code");

    const savedLanguage =
      localStorage.getItem("prepai-language");

    if (savedCode) {
      setCode(savedCode);
    }

    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "prepai-code",
      code
    );

    localStorage.setItem(
      "prepai-language",
      language
    );
  }, [code, language]);

  const handleRun = () => {
    setIsRunning(true);
    setOutput("Judge0 integration coming on Day 13...");
    setTimeout(() => setIsRunning(false), 600);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 p-6 mb-6">
          <h1 className="text-3xl font-bold text-white">
            Coding Platform
          </h1>

          <p className="text-slate-400 mt-2">
            Practice coding interviews with Monaco Editor.
          </p>
        </div>

        <LanguageSelector
          language={language}
          setLanguage={setLanguage}
          handleRun={handleRun}
          isRunning={isRunning}
        />

        <CodeEditor
          language={language}
          code={code}
          setCode={setCode}
          onRunShortcut={handleRun}
          isRunning={isRunning}
        />

        <InputPanel
          input={input}
          setInput={setInput}
        />

        <OutputPanel
          output={output}
        />

      </div>
    </div>
  );
}