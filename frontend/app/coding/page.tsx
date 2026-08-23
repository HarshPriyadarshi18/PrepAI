"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import CodeEditor from "./codeEditor";
import InputPanel from "./inputPanel";
import LanguageSelector from "./languageSelector";
import OutputPanel from "./outputPanel";

const BACKEND_URL = "http://localhost:5000";
const TIMER_DURATION = 45 * 60; // 45 minutes in seconds

const DIFFICULTY_STYLES: Record<string, { badge: string; button: string; glow: string }> = {
  easy: {
    badge: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    button: "bg-gradient-to-br from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 shadow-emerald-900/50",
    glow: "hover:shadow-emerald-500/25",
  },
  medium: {
    badge: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    button: "bg-gradient-to-br from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 shadow-amber-900/50",
    glow: "hover:shadow-amber-500/25",
  },
  hard: {
    badge: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
    button: "bg-gradient-to-br from-rose-500 to-rose-700 hover:from-rose-400 hover:to-rose-600 shadow-rose-900/50",
    glow: "hover:shadow-rose-500/25",
  },
};

// Reusable vertical drag handle
function VerticalResizer({ onDrag }: { onDrag: (deltaX: number) => void }) {
  const dragging = useRef(false);
  const lastX = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const delta = e.clientX - lastX.current;
      lastX.current = e.clientX;
      onDrag(delta);
    };
    const onMouseUp = () => {
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onDrag]);

  return (
    <div
      onMouseDown={onMouseDown}
      className="w-1.5 shrink-0 cursor-col-resize bg-slate-800 hover:bg-blue-500/50 active:bg-blue-500 transition-colors relative group"
    >
      <div className="absolute inset-y-0 -left-1 -right-1" />
    </div>
  );
}

// Reusable horizontal drag handle
function HorizontalResizer({ onDrag }: { onDrag: (deltaY: number) => void }) {
  const dragging = useRef(false);
  const lastY = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    lastY.current = e.clientY;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const delta = e.clientY - lastY.current;
      lastY.current = e.clientY;
      onDrag(delta);
    };
    const onMouseUp = () => {
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onDrag]);

  return (
    <div
      onMouseDown={onMouseDown}
      className="h-1.5 shrink-0 cursor-row-resize bg-slate-800 hover:bg-blue-500/50 active:bg-blue-500 transition-colors relative"
    >
      <div className="absolute inset-x-0 -top-1 -bottom-1" />
    </div>
  );
}

export default function CodingPage() {
  const [difficulty, setDifficulty] = useState("");
  const [question, setQuestion] = useState<any>(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [questionError, setQuestionError] = useState("");

  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isDefaultCode, setIsDefaultCode] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<any>(null);

  const [followUp, setFollowUp] = useState("");
  const [loadingFollowUp, setLoadingFollowUp] = useState(false);
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [gradingAnswer, setGradingAnswer] = useState(false);
  const [followUpGrade, setFollowUpGrade] = useState<any>(null);

  const [followUp2, setFollowUp2] = useState("");
  const [loadingFollowUp2, setLoadingFollowUp2] = useState(false);
  const [followUpAnswer2, setFollowUpAnswer2] = useState("");
  const [gradingAnswer2, setGradingAnswer2] = useState(false);
  const [followUpGrade2, setFollowUpGrade2] = useState<any>(null);

  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [timerActive, setTimerActive] = useState(false);

  // NAYA — theme toggle
  const [isDark, setIsDark] = useState(true);

  // Resizable panel widths/heights
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState(420); // px
  const [editorHeight, setEditorHeight] = useState(55); // percent of right column height

  const handleLeftResize = useCallback((deltaX: number) => {
    setLeftWidth((prev) => {
      const next = prev + deltaX;
      return Math.min(Math.max(next, 300), 800);
    });
  }, []);

  const handleVerticalResize = useCallback((deltaY: number) => {
    setEditorHeight((prev) => {
      const containerHeight = containerRef.current?.clientHeight || 800;
      const deltaPercent = (deltaY / containerHeight) * 100;
      const next = prev + deltaPercent;
      return Math.min(Math.max(next, 20), 80);
    });
  }, []);

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const loadQuestion = async (level: string) => {
    setLoadingQuestion(true);
    setDifficulty(level);
    setQuestionError("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${BACKEND_URL}/api/questions/random?difficulty=${level}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        setQuestionError(data.message || "Failed to load question");
        return;
      }

      setQuestion(data.question);
      setCode(data.question.starterCode?.[language] || "");
      setIsDefaultCode(true);
      setOutput("");
      setStatus("");
      setInput("");
      setSubmitResult(null);
      setFollowUp("");
      setFollowUpAnswer("");
      setFollowUpGrade(null);
      setFollowUp2("");
      setFollowUpAnswer2("");
      setFollowUpGrade2(null);
      setTimeLeft(TIMER_DURATION);
      setTimerActive(true);
    } catch (err) {
      console.error(err);
      setQuestionError("Failed to connect to backend.");
    } finally {
      setLoadingQuestion(false);
    }
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    if (isDefaultCode && question) {
      setCode(question.starterCode?.[lang] || "");
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

      const res = await fetch(`${BACKEND_URL}/api/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code, language, input }),
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

  const handleSubmit = async () => {
    if (!question?.testCases || question.testCases.length === 0) {
      setSubmitResult({ error: "No test cases available for this question." });
      return;
    }

    setSubmitting(true);
    setSubmitResult(null);
    setFollowUp("");
    setFollowUpAnswer("");
    setFollowUpGrade(null);
    setFollowUp2("");
    setFollowUpAnswer2("");
    setFollowUpGrade2(null);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BACKEND_URL}/api/execute/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code, language, testCases: question.testCases }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setSubmitResult({ error: data.message || "Submission failed" });
        return;
      }

      setSubmitResult(data);

      if (data.score >= 7) {
        fetchFollowUp();
      }
    } catch (err) {
      console.error(err);
      setSubmitResult({ error: "Failed to connect to backend." });
    } finally {
      setSubmitting(false);
    }
  };

  const fetchFollowUp = async () => {
    setLoadingFollowUp(true);
    setFollowUp("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/interview/followup`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ question: question.title, code, language, round: 1 }),
      });
      const data = await res.json();
      if (data.success) setFollowUp(data.followUp);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFollowUp(false);
    }
  };

  const fetchFollowUp2 = async () => {
    setLoadingFollowUp2(true);
    setFollowUp2("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/interview/followup`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ question: question.title, code, language, round: 2 }),
      });
      const data = await res.json();
      if (data.success) setFollowUp2(data.followUp);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFollowUp2(false);
    }
  };

  const submitFollowUpAnswer = async () => {
    if (!followUpAnswer.trim()) return;
    setGradingAnswer(true);
    setFollowUpGrade(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/interview/followup/grade`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          question: question.title,
          code,
          language,
          followUpQuestion: followUp,
          answer: followUpAnswer,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFollowUpGrade(data);
        fetchFollowUp2();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGradingAnswer(false);
    }
  };

  const submitFollowUpAnswer2 = async () => {
    if (!followUpAnswer2.trim()) return;
    setGradingAnswer2(true);
    setFollowUpGrade2(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/interview/followup/grade`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          question: question.title,
          code,
          language,
          followUpQuestion: followUp2,
          answer: followUpAnswer2,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFollowUpGrade2(data);

        try {
          await fetch(`${BACKEND_URL}/api/interview/coding-attempt`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              questionTitle: question.title,
              difficulty: question.difficulty,
              language,
              code,
              codingScore: submitResult.score,
              passed: submitResult.passed,
              total: submitResult.total,
              followUp1: {
                question: followUp,
                answer: followUpAnswer,
                score: followUpGrade.score,
                feedback: followUpGrade.feedback,
              },
              followUp2: {
                question: followUp2,
                answer: followUpAnswer2,
                score: data.score,
                feedback: data.feedback,
              },
            }),
          });
        } catch (saveErr) {
          console.error("Failed to save coding attempt", saveErr);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGradingAnswer2(false);
    }
  };

  // Theme tokens
  const theme = {
    bg: isDark ? "bg-[#0a0e1a]" : "bg-gray-50",
    topBar: isDark ? "bg-[#0d1220] border-slate-800" : "bg-white border-gray-200",
    panel: isDark ? "bg-[#0d1220]" : "bg-white",
    text: isDark ? "text-white" : "text-gray-900",
    textBody: isDark ? "text-slate-300" : "text-gray-600",
    textMuted: isDark ? "text-slate-400" : "text-gray-500",
    textFaint: isDark ? "text-slate-500" : "text-gray-400",
    exampleBox: isDark ? "bg-black/30 border-slate-700/50" : "bg-gray-50 border-gray-200",
    card: isDark ? "bg-linear-to-br from-slate-800/80 to-slate-800/40 border-slate-700/60" : "bg-white border-gray-200 shadow-sm",
    statBox: isDark ? "bg-slate-900/40" : "bg-gray-100",
    trackBg: isDark ? "bg-slate-900/60" : "bg-gray-200",
    inputBg: isDark ? "bg-slate-900/60" : "bg-gray-50",
  };

  // Difficulty selection screen
  if (!question) {
    return (
      <div className={`min-h-screen relative overflow-hidden flex items-center justify-center px-4 transition-colors ${theme.bg}`}>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />

        {/* NAYA — theme toggle on difficulty screen */}
        <button
          onClick={() => setIsDark(!isDark)}
          className={`absolute top-6 right-6 w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
            isDark ? "bg-slate-800 hover:bg-slate-700" : "bg-white hover:bg-gray-100 border border-gray-200"
          }`}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <svg className="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>

        <div className="relative text-center max-w-2xl">
          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border ${
            isDark ? "bg-slate-800/60 border-slate-700" : "bg-white border-gray-200"
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className={`text-xs font-medium tracking-wide ${theme.textMuted}`}>PrepAI Coding Round</span>
          </div>

          <h1 className={`text-4xl font-bold mb-3 tracking-tight ${theme.text}`}>
            Ready to solve a problem?
          </h1>
          <p className={`mb-10 text-lg ${theme.textMuted}`}>
            Pick a difficulty and get matched with a random question.
          </p>

          <div className="flex gap-5 justify-center flex-wrap">
            {["easy", "medium", "hard"].map((level) => {
              const style = DIFFICULTY_STYLES[level];
              return (
                <button
                  key={level}
                  onClick={() => loadQuestion(level)}
                  disabled={loadingQuestion}
                  className={`group relative px-10 py-5 rounded-2xl font-semibold capitalize text-white text-lg
                    shadow-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
                    hover:-translate-y-1 hover:shadow-2xl ${style.button} ${style.glow}`}
                >
                  <span className="relative z-10">
                    {loadingQuestion && difficulty === level ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Loading
                      </span>
                    ) : (
                      level
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {questionError && (
            <p className="text-rose-400 text-sm mt-6 bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-2 inline-block">
              {questionError}
            </p>
          )}
        </div>
      </div>
    );
  }

  const diffStyle = DIFFICULTY_STYLES[question.difficulty] || DIFFICULTY_STYLES.easy;

  return (
    <div className={`h-screen flex flex-col overflow-hidden transition-colors ${theme.bg}`}>
      {/* top bar */}
      <div className={`flex items-center justify-between px-6 py-3 border-b shrink-0 transition-colors ${theme.topBar}`}>
        <div className="flex items-center gap-3">
          <span className={`font-bold text-sm ${theme.text}`}>PrepAI</span>
          <span className={theme.textFaint}>/</span>
          <span className={`text-sm ${theme.textMuted}`}>{question.title}</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              isDark ? "bg-slate-800 hover:bg-slate-700" : "bg-gray-100 hover:bg-gray-200 border border-gray-200"
            }`}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <svg className="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-sm font-semibold ${
              timeLeft <= 300
                ? "bg-rose-500/10 border-rose-500/40 text-rose-400"
                : timeLeft <= 900
                ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                : isDark
                ? "bg-slate-800/60 border-slate-700 text-slate-300"
                : "bg-gray-100 border-gray-300 text-gray-700"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                timerActive && timeLeft > 0 ? "bg-current animate-pulse" : "bg-slate-600"
              }`}
            />
            {formatTime(timeLeft)}
          </div>

          <button
            onClick={() => setQuestion(null)}
            className={`text-sm font-medium transition ${
              isDark ? "text-slate-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            ← Change difficulty
          </button>
        </div>
      </div>

      {/* main split — resizable */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden">
        {/* LEFT: question panel */}
        <div
          style={{ width: leftWidth }}
          className={`shrink-0 overflow-y-auto p-6 transition-colors ${theme.panel}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className={`text-xl font-bold ${theme.text}`}>{question.title}</h1>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide ${diffStyle.badge}`}>
              {question.difficulty}
            </span>
          </div>

          {timeLeft === 0 && (
            <div className="mb-4 bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-center">
              <p className="text-rose-400 font-semibold text-sm">Time's up!</p>
              <p className={`text-xs mt-1 ${theme.textMuted}`}>You can still submit, but the timer has ended.</p>
            </div>
          )}

          <p className={`text-sm leading-relaxed mb-5 ${theme.textBody}`}>
            {question.description}
          </p>

          {question.examples?.length > 0 && (
            <div className="mb-5">
              <h3 className={`text-xs font-semibold uppercase tracking-wide mb-2 ${theme.textFaint}`}>
                Examples
              </h3>
              <div className="space-y-2">
                {question.examples.map((ex: any, i: number) => (
                  <div key={i} className={`rounded-lg p-3 text-xs font-mono border ${theme.exampleBox}`}>
                    <div className={`mb-1 ${theme.textFaint}`}>
                      Input: <span className={isDark ? "text-blue-300" : "text-blue-600"}>{ex.input}</span>
                    </div>
                    <div className={theme.textFaint}>
                      Output: <span className={isDark ? "text-emerald-300" : "text-emerald-600"}>{ex.output}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {question.constraints?.length > 0 && (
            <div className="mb-5">
              <h3 className={`text-xs font-semibold uppercase tracking-wide mb-2 ${theme.textFaint}`}>
                Constraints
              </h3>
              <ul className="space-y-1">
                {question.constraints.map((c: string, i: number) => (
                  <li key={i} className={`text-xs font-mono ${theme.textMuted}`}>
                    • {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {submitResult && !submitResult.error && (
            <div className={`mt-6 border rounded-xl p-5 animate-[fadeIn_0.3s_ease] ${theme.card}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-semibold text-sm ${theme.text}`}>Submission Result</h3>
                <div className="text-right">
                  <span
                    className={`text-2xl font-bold ${
                      submitResult.score >= 7
                        ? "text-emerald-400"
                        : submitResult.score >= 4
                        ? "text-amber-400"
                        : "text-rose-400"
                    }`}
                  >
                    {submitResult.score}
                  </span>
                  <span className={theme.textFaint}> / 10</span>
                </div>
              </div>

              <div className={`w-full rounded-full h-1.5 mb-3 overflow-hidden ${theme.trackBg}`}>
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    submitResult.score >= 7
                      ? "bg-linear-to-r from-emerald-500 to-emerald-400"
                      : submitResult.score >= 4
                      ? "bg-linear-to-r from-amber-500 to-amber-400"
                      : "bg-linear-to-r from-rose-500 to-rose-400"
                  }`}
                  style={{ width: `${(submitResult.score / 10) * 100}%` }}
                />
              </div>

              <p className={`text-xs mb-3 ${theme.textMuted}`}>
                <span className={`font-medium ${theme.text}`}>{submitResult.passed}</span> / {submitResult.total} test cases passed
              </p>

              <div className="flex flex-col gap-1.5">
                {submitResult.results.map((r: any, i: number) => (
                  <div
                    key={i}
                    className={`text-xs font-mono p-2.5 rounded-lg border flex items-start gap-2 ${
                      r.passed
                        ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300"
                        : "bg-rose-500/5 border-rose-500/20 text-rose-300"
                    }`}
                  >
                    <span className="mt-0.5">{r.passed ? "✓" : "✗"}</span>
                    <span className="break-all">
                      In: {r.input || "(none)"} | Exp: {r.expectedOutput} | Got: {r.actualOutput}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loadingFollowUp && (
            <div className={`mt-4 flex items-center gap-2 text-sm ${theme.textMuted}`}>
              <span className="w-4 h-4 border-2 border-slate-600 border-t-purple-400 rounded-full animate-spin" />
              Interviewer is thinking of a follow-up...
            </div>
          )}

          {followUp && (
            <div className="mt-4 bg-linear-to-br from-purple-900/30 to-purple-900/10 border border-purple-700/40 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <h3 className="text-purple-300 font-semibold text-sm">Interviewer Follow-up</h3>
              </div>
              <p className="text-purple-100 text-sm leading-relaxed mb-3">{followUp}</p>

              <textarea
                value={followUpAnswer}
                onChange={(e) => setFollowUpAnswer(e.target.value)}
                placeholder="Type your answer here..."
                rows={3}
                className={`w-full text-sm rounded-lg p-3 resize-none mb-3 border border-purple-700/40 focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme.inputBg} ${theme.text}`}
              />

              <button
                onClick={submitFollowUpAnswer}
                disabled={gradingAnswer || !followUpAnswer.trim()}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
              >
                {gradingAnswer ? "Evaluating..." : "Submit Answer"}
              </button>

              {followUpGrade && (
                <div className="mt-4 bg-black/20 border border-purple-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-300 text-xs font-semibold uppercase tracking-wide">
                      Answer Evaluation
                    </span>
                    <span
                      className={`text-lg font-bold ${
                        followUpGrade.score >= 7 ? "text-emerald-400" : followUpGrade.score >= 4 ? "text-amber-400" : "text-rose-400"
                      }`}
                    >
                      {followUpGrade.score} / 10
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm">{followUpGrade.feedback}</p>
                </div>
              )}
            </div>
          )}

          {loadingFollowUp2 && (
            <div className={`mt-4 flex items-center gap-2 text-sm ${theme.textMuted}`}>
              <span className="w-4 h-4 border-2 border-slate-600 border-t-indigo-400 rounded-full animate-spin" />
              Interviewer is thinking of a complexity question...
            </div>
          )}

          {followUp2 && (
            <div className="mt-4 bg-linear-to-br from-indigo-900/30 to-indigo-900/10 border border-indigo-700/40 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <h3 className="text-indigo-300 font-semibold text-sm">Complexity & Optimization</h3>
              </div>
              <p className="text-indigo-100 text-sm leading-relaxed mb-3">{followUp2}</p>

              <textarea
                value={followUpAnswer2}
                onChange={(e) => setFollowUpAnswer2(e.target.value)}
                placeholder="Type your answer here..."
                rows={3}
                className={`w-full text-sm rounded-lg p-3 resize-none mb-3 border border-indigo-700/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme.inputBg} ${theme.text}`}
              />

              <button
                onClick={submitFollowUpAnswer2}
                disabled={gradingAnswer2 || !followUpAnswer2.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
              >
                {gradingAnswer2 ? "Evaluating..." : "Submit Answer"}
              </button>

              {followUpGrade2 && (
                <div className="mt-4 bg-black/20 border border-indigo-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-indigo-300 text-xs font-semibold uppercase tracking-wide">
                      Answer Evaluation
                    </span>
                    <span
                      className={`text-lg font-bold ${
                        followUpGrade2.score >= 7 ? "text-emerald-400" : followUpGrade2.score >= 4 ? "text-amber-400" : "text-rose-400"
                      }`}
                    >
                      {followUpGrade2.score} / 10
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm">{followUpGrade2.feedback}</p>
                </div>
              )}
            </div>
          )}

          {submitResult?.score !== undefined && followUpGrade?.score !== undefined && followUpGrade2?.score !== undefined && (
            <div className="mt-4 bg-linear-to-br from-blue-900/30 to-indigo-900/20 border border-blue-700/40 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-blue-300 font-semibold text-sm uppercase tracking-wide">
                  Overall Performance
                </h3>
                <span
                  className={`text-3xl font-bold ${
                    (submitResult.score + followUpGrade.score + followUpGrade2.score) / 3 >= 7
                      ? "text-emerald-400"
                      : (submitResult.score + followUpGrade.score + followUpGrade2.score) / 3 >= 4
                      ? "text-amber-400"
                      : "text-rose-400"
                  }`}
                >
                  {((submitResult.score + followUpGrade.score + followUpGrade2.score) / 3).toFixed(1)} / 10
                </span>
              </div>

              <div className="flex gap-3 text-xs">
                <div className="flex-1 bg-black/20 rounded-lg p-2.5">
                  <p className="text-slate-400 mb-1">Coding</p>
                  <p className="text-white font-semibold text-sm">{submitResult.score} / 10</p>
                </div>
                <div className="flex-1 bg-black/20 rounded-lg p-2.5">
                  <p className="text-slate-400 mb-1">Follow-up 1</p>
                  <p className="text-white font-semibold text-sm">{followUpGrade.score} / 10</p>
                </div>
                <div className="flex-1 bg-black/20 rounded-lg p-2.5">
                  <p className="text-slate-400 mb-1">Follow-up 2</p>
                  <p className="text-white font-semibold text-sm">{followUpGrade2.score} / 10</p>
                </div>
              </div>

              <div className="w-full bg-black/20 rounded-full h-1.5 mt-3 overflow-hidden">
                <div
                  className="h-full rounded-full bg-linear-to-r from-blue-500 to-indigo-400 transition-all duration-700"
                  style={{ width: `${((submitResult.score + followUpGrade.score + followUpGrade2.score) / 3 / 10) * 100}%` }}
                />
              </div>
            </div>
          )}

          {submitResult?.error && (
            <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-3 mt-4">
              {submitResult.error}
            </p>
          )}
        </div>

        {/* drag handle: left <-> right */}
        <VerticalResizer onDrag={handleLeftResize} />

        {/* RIGHT: editor (top) + input/output (bottom), resizable vertically */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 pt-3 shrink-0">
            <LanguageSelector
              language={language}
              setLanguage={handleLanguageChange}
              handleRun={handleRun}
              isRunning={isRunning}
            />
          </div>

          <div className="flex-1 flex flex-col px-4 pb-4 pt-3 overflow-hidden">
            {/* Editor section */}
            <div style={{ height: `${editorHeight}%` }} className="overflow-hidden">
              <CodeEditor
                language={language}
                code={code}
                setCode={handleCodeChange}
                onRunShortcut={handleRun}
                isRunning={isRunning}
              />
            </div>

            {/* drag handle: editor <-> IO */}
            <HorizontalResizer onDrag={handleVerticalResize} />

            {/* Input/Output section */}
            <div
              style={{ height: `${100 - editorHeight}%` }}
              className="overflow-y-auto flex flex-col gap-3 pt-3"
            >
              <InputPanel input={input} setInput={setInput} />
              <OutputPanel output={output} status={status} />

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="relative overflow-hidden bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500
                  disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-semibold text-base
                  transition-all shadow-lg shadow-emerald-900/30 hover:shadow-emerald-700/40 hover:-translate-y-0.5"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Checking your solution...
                  </span>
                ) : (
                  "Submit Solution"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}