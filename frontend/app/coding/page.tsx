"use client";

import { useState } from "react";
import CodeEditor from "./codeEditor";
import InputPanel from "./inputPanel";
import LanguageSelector from "./languageSelector";
import OutputPanel from "./outputPanel";

const TEMPLATES: Record<string, string> = {
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello PrepAI" << endl;
    return 0;
}`,
  python: `print("Hello PrepAI")`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello PrepAI");
    }
}`,
};

export default function CodingPage() {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(TEMPLATES["cpp"]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isDefaultCode, setIsDefaultCode] = useState(true);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);

    if (isDefaultCode) {
      setCode(TEMPLATES[lang]);
    }
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
    setIsDefaultCode(false);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Running...");
    setStatus("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code,
          language,
          input,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setOutput(data.message || "Failed to execute code");
        setStatus("Error");
        return;
      }

      setOutput(data.output || "No output");
      setStatus(data.status || "Success");
    } catch (err) {
      console.error(err);
      setOutput("Failed to connect to backend.");
      setStatus("Error");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">
            Coding Practice
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            Write, run, and test your solution — just like a real interview.
          </p>
        </div>

        <LanguageSelector
          language={language}
          setLanguage={handleLanguageChange}
          handleRun={handleRun}
          isRunning={isRunning}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CodeEditor
            language={language}
            code={code}
            setCode={handleCodeChange}
            onRunShortcut={handleRun}
            isRunning={isRunning}
          />

          <div className="flex flex-col gap-6">
            <InputPanel
              input={input}
              setInput={setInput}
            />

            <OutputPanel
              output={output}
              status={status}
            />
          </div>
        </div>
      </div>
    </div>
  );
}