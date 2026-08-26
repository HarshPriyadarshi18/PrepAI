
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BrainCircuit,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("prepai-theme");

    if (savedTheme === "light") {
      setDarkMode(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("prepai-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const res = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.token) {
        try {
          localStorage.setItem("token", data.token);
        } catch {}
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${
        darkMode
          ? "bg-[#050816] text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className={`absolute left-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full blur-[130px] ${
            darkMode ? "bg-indigo-600/20" : "bg-indigo-300/30"
          }`}
        />

        <div
          className={`absolute bottom-[-150px] right-[-100px] h-[450px] w-[450px] rounded-full blur-[140px] ${
            darkMode ? "bg-purple-600/15" : "bg-purple-300/20"
          }`}
        />

        <div
          className={`absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] ${
            darkMode ? "bg-indigo-500/10" : "bg-indigo-200/20"
          }`}
        />
      </div>

      <nav
        className={`absolute left-0 right-0 top-0 z-20 border-b backdrop-blur-xl ${
          darkMode
            ? "border-white/10 bg-[#050816]/60"
            : "border-slate-200 bg-white/70"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
              <BrainCircuit size={21} />
            </div>

            <span className="text-xl font-bold tracking-tight">
              Prep<span className="text-indigo-500">AI</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setDarkMode((prev) => !prev)}
            aria-label="Toggle theme"
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
              darkMode
                ? "border-white/10 bg-white/5 text-yellow-300 hover:bg-white/10"
                : "border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-100"
            }`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      <div className="flex min-h-screen items-center justify-center px-6 pb-10 pt-28">
        <div className="grid w-full max-w-6xl items-center gap-14 lg:grid-cols-2">
          <div className="hidden lg:block">
            <div
              className={`mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${
                darkMode
                  ? "border-indigo-400/20 bg-indigo-500/10 text-indigo-300"
                  : "border-indigo-200 bg-indigo-50 text-indigo-600"
              }`}
            >
              <Sparkles size={15} />
              AI-Powered Placement Preparation
            </div>

            <h1 className="max-w-xl text-5xl font-black leading-[1.08] tracking-tight xl:text-6xl">
              Welcome back to
              <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                PrepAI
              </span>
            </h1>

            <p
              className={`mt-6 max-w-lg text-lg leading-8 ${
                darkMode ? "text-gray-400" : "text-slate-500"
              }`}
            >
              Continue your placement preparation, practice interviews,
              improve your resume and track your progress with AI.
            </p>

            <div className="mt-8 grid max-w-lg gap-4 sm:grid-cols-3">
              <FeatureItem
                darkMode={darkMode}
                title="AI Interviews"
                text="Practice"
              />

              <FeatureItem
                darkMode={darkMode}
                title="ATS Analysis"
                text="Improve"
              />

              <FeatureItem
                darkMode={darkMode}
                title="Analytics"
                text="Track"
              />
            </div>

            <div
              className={`mt-10 flex items-center gap-3 text-sm ${
                darkMode ? "text-gray-500" : "text-slate-400"
              }`}
            >
              <ShieldCheck className="text-emerald-500" size={20} />
              Your preparation data is securely handled.
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div
              className={`rounded-3xl border p-1 shadow-2xl ${
                darkMode
                  ? "border-white/10 bg-white/[0.04] shadow-indigo-950/30"
                  : "border-slate-200 bg-white/80 shadow-slate-200"
              }`}
            >
              <div
                className={`rounded-[22px] border p-7 sm:p-9 ${
                  darkMode
                    ? "border-white/10 bg-[#0b1020]"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
                    <BrainCircuit size={28} />
                  </div>

                  <h2 className="text-3xl font-bold tracking-tight">
                    Welcome back
                  </h2>

                  <p
                    className={`mt-2 text-sm ${
                      darkMode ? "text-gray-500" : "text-slate-400"
                    }`}
                  >
                    Sign in to continue your preparation
                  </p>
                </div>

                {error && (
                  <div
                    className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
                      darkMode
                        ? "border-red-500/20 bg-red-500/10 text-red-400"
                        : "border-red-200 bg-red-50 text-red-600"
                    }`}
                  >
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className={`mb-2 block text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      Email address
                    </label>

                    <div className="relative">
                      <Mail
                        size={18}
                        className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                          darkMode ? "text-gray-500" : "text-slate-400"
                        }`}
                      />

                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        autoComplete="email"
                        className={`w-full rounded-xl border py-3.5 pl-11 pr-4 text-sm outline-none transition ${
                          darkMode
                            ? "border-white/10 bg-white/[0.04] text-white placeholder:text-gray-600 focus:border-indigo-500 focus:bg-white/[0.06]"
                            : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-300" : "text-slate-700"
                        }`}
                      >
                        Password
                      </label>

                      <button
                        type="button"
                        className="text-xs font-medium text-indigo-500 transition hover:text-indigo-400"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div className="relative">
                      <Lock
                        size={18}
                        className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                          darkMode ? "text-gray-500" : "text-slate-400"
                        }`}
                      />

                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        autoComplete="current-password"
                        className={`w-full rounded-xl border py-3.5 pl-11 pr-12 text-sm outline-none transition ${
                          darkMode
                            ? "border-white/10 bg-white/[0.04] text-white placeholder:text-gray-600 focus:border-indigo-500 focus:bg-white/[0.06]"
                            : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white"
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        className={`absolute right-4 top-1/2 -translate-y-1/2 transition ${
                          darkMode
                            ? "text-gray-500 hover:text-gray-300"
                            : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <ArrowRight
                          size={18}
                          className="transition group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>
                </form>

                <div className="my-7 flex items-center gap-3">
                  <div
                    className={`h-px flex-1 ${
                      darkMode ? "bg-white/10" : "bg-slate-200"
                    }`}
                  />

                  <span
                    className={`text-xs ${
                      darkMode ? "text-gray-600" : "text-slate-400"
                    }`}
                  >
                    SECURE LOGIN
                  </span>

                  <div
                    className={`h-px flex-1 ${
                      darkMode ? "bg-white/10" : "bg-slate-200"
                    }`}
                  />
                </div>

                <p
                  className={`text-center text-sm ${
                    darkMode ? "text-gray-500" : "text-slate-500"
                  }`}
                >
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-semibold text-indigo-500 transition hover:text-indigo-400"
                  >
                    Create one
                  </Link>
                </p>

                <Link
                  href="/"
                  className={`mt-5 block text-center text-xs transition ${
                    darkMode
                      ? "text-gray-600 hover:text-gray-400"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  ← Back to PrepAI
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function FeatureItem({
  title,
  text,
  darkMode,
}: {
  title: string;
  text: string;
  darkMode: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        darkMode
          ? "border-white/10 bg-white/[0.03]"
          : "border-slate-200 bg-white"
      }`}
    >
      <p className="text-sm font-semibold">{title}</p>

      <p
        className={`mt-1 text-xs ${
          darkMode ? "text-gray-500" : "text-slate-400"
        }`}
      >
        {text}
      </p>
    </div>
  );
}
