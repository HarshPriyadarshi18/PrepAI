
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  Code2,
  FileText,
  BarChart3,
  Building2,
  History,
  ClipboardCheck,
  CheckCircle2,
  Sparkles,
  Target,
  Zap,
  ShieldCheck,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "ATS Resume Analyzer",
    description:
      "Analyze your resume with AI, get an ATS score, identify missing keywords and improve your resume.",
    href: "/dashboard/ats",
    tag: "Resume",
  },
  {
    icon: BrainCircuit,
    title: "AI Mock Interview",
    description:
      "Practice realistic technical and HR interviews with AI-generated questions and detailed feedback.",
    href: "/dashboard/interview",
    tag: "Interview",
  },
  {
    icon: Code2,
    title: "Coding Arena",
    description:
      "Solve coding problems, write code in the editor and test your solutions like a real coding round.",
    href: "/coding",
    tag: "DSA",
  },
  {
    icon: BarChart3,
    title: "Interview Analytics",
    description:
      "Track your interview scores, performance trends and identify the areas where you need improvement.",
    href: "/interviews",
    tag: "Analytics",
  },
  {
    icon: Building2,
    title: "Company Interview",
    description:
      "Prepare specifically for company interviews with role-based and difficulty-based AI questions.",
    href: "/companyinterview",
    tag: "Companies",
  },
  {
    icon: History,
    title: "Company History",
    description:
      "Explore previous interview patterns, commonly asked topics and company-specific preparation.",
    href: "/companyhistory",
    tag: "Research",
  },
  {
    icon: ClipboardCheck,
    title: "Online Assessment",
    description:
      "Prepare for placement OAs with coding, aptitude and company-oriented assessment practice.",
    href: "/coding",
    tag: "OA",
  },
 {
  icon: History,
  title: "Coding Interview History",
  description:
    "Track your past coding interview attempts, scores, follow-up performance and overall progress.",
  href: "/dashboard/hIstoryq",
  tag: "History",
},
];

const steps = [
  {
    number: "01",
    title: "Build Your Resume",
    description: "Upload your resume and let AI understand your profile.",
  },
  {
    number: "02",
    title: "Improve Your ATS Score",
    description:
      "Find missing keywords and get actionable improvement suggestions.",
  },
  {
    number: "03",
    title: "Practice Interviews",
    description:
      "Take AI-powered mock interviews based on your target role.",
  },
  {
    number: "04",
    title: "Master Coding",
    description:
      "Practice DSA and simulate real coding interview environments.",
  },
  {
    number: "05",
    title: "Prepare Company-wise",
    description:
      "Target your preparation according to specific companies and roles.",
  },
  {
    number: "06",
    title: "Track Your Growth",
    description:
      "Use analytics and interview history to continuously improve.",
  },
];

export default function Home() {
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

  return (
    <main
      className={`min-h-screen overflow-hidden transition-colors duration-300 ${
        darkMode
          ? "bg-[#050816] text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div
          className={`absolute left-[15%] top-[-200px] h-[500px] w-[500px] rounded-full blur-[140px] ${
            darkMode ? "bg-indigo-600/20" : "bg-indigo-300/30"
          }`}
        />

        <div
          className={`absolute right-[-100px] top-[500px] h-[450px] w-[450px] rounded-full blur-[140px] ${
            darkMode ? "bg-purple-600/15" : "bg-purple-300/20"
          }`}
        />
      </div>

      <nav
        className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
          darkMode
            ? "border-white/10 bg-[#050816]/80"
            : "border-slate-200 bg-white/85"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <BrainCircuit size={21} />
            </div>

            <span className="text-xl font-bold tracking-tight">
              Prep<span className="text-indigo-500">AI</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className={`text-sm transition ${
                darkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className={`text-sm transition ${
                darkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              How It Works
            </a>

            <a
              href="#why-prepai"
              className={`text-sm transition ${
                darkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Why PrepAI
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDarkMode((prev) => !prev)}
              aria-label="Toggle theme"
              className={`flex h-10 w-10 items-center justify-center rounded-lg border transition ${
                darkMode
                  ? "border-white/10 bg-white/5 text-yellow-300 hover:bg-white/10"
                  : "border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-100"
              }`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link
              href="/login"
              className={`hidden rounded-lg px-4 py-2 text-sm font-medium transition sm:block ${
                darkMode
                  ? "text-gray-300 hover:bg-white/5 hover:text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              Login
            </Link>

            <Link
              href="/signup"
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                darkMode
                  ? "bg-white text-black hover:bg-gray-200"
                  : "bg-indigo-600 text-white hover:bg-indigo-500"
              }`}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-24 lg:pb-32 lg:pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <div
              className={`mb-7 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${
                darkMode
                  ? "border-indigo-400/20 bg-indigo-500/10 text-indigo-300"
                  : "border-indigo-200 bg-indigo-50 text-indigo-600"
              }`}
            >
              <Sparkles size={15} />
              AI-Powered Placement Preparation
            </div>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Crack Your Next
              <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Placement With AI
              </span>
            </h1>

            <p
              className={`mx-auto mt-7 max-w-2xl text-lg leading-8 ${
                darkMode ? "text-gray-400" : "text-slate-500"
              }`}
            >
              One platform to build your resume, practice AI interviews,
              master coding rounds, prepare company-wise and track your
              placement performance.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="group flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 font-semibold text-white transition hover:bg-indigo-500"
              >
                Start Preparing
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#features"
                className={`rounded-xl border px-7 py-3.5 font-semibold transition ${
                  darkMode
                    ? "border-white/10 bg-white/5 text-gray-200 hover:bg-white/10"
                    : "border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-100"
                }`}
              >
                Explore Features
              </a>
            </div>
          </div>

          <div className="mx-auto mt-20 max-w-6xl">
            <div
              className={`rounded-2xl border p-2 shadow-2xl ${
                darkMode
                  ? "border-white/10 bg-white/[0.03] shadow-indigo-900/20"
                  : "border-slate-200 bg-white shadow-slate-200"
              }`}
            >
              <div
                className={`rounded-xl border p-6 ${
                  darkMode
                    ? "border-white/10 bg-[#0b1020]"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-500" : "text-slate-400"
                      }`}
                    >
                      Placement Preparation
                    </p>

                    <h3 className="mt-1 text-xl font-bold">
                      Your preparation dashboard
                    </h3>
                  </div>

                  <div
                    className={`rounded-lg px-3 py-2 text-sm ${
                      darkMode
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    ● AI Ready
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    darkMode={darkMode}
                    icon={<FileText size={20} />}
                    title="ATS Score"
                    value="86%"
                    text="Good"
                  />

                  <StatCard
                    darkMode={darkMode}
                    icon={<BrainCircuit size={20} />}
                    title="Interviews"
                    value="12"
                    text="Completed"
                  />

                  <StatCard
                    darkMode={darkMode}
                    icon={<Code2 size={20} />}
                    title="Coding"
                    value="48"
                    text="Problems"
                  />

                  <StatCard
                    darkMode={darkMode}
                    icon={<BarChart3 size={20} />}
                    title="Performance"
                    value="+24%"
                    text="Improvement"
                  />
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-3">
                  <div
                    className={`rounded-xl border p-5 lg:col-span-2 ${
                      darkMode
                        ? "border-white/10 bg-white/[0.02]"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-500" : "text-slate-400"
                          }`}
                        >
                          Interview Performance
                        </p>

                        <p className="mt-1 text-lg font-semibold">
                          Your progress
                        </p>
                      </div>

                      <BarChart3 className="text-indigo-500" />
                    </div>

                    <div className="flex h-40 items-end gap-3">
                      {[35, 48, 42, 61, 58, 73, 86, 92].map(
                        (height, index) => (
                          <div
                            key={index}
                            className="flex flex-1 items-end"
                          >
                            <div
                              className="w-full rounded-t-md bg-gradient-to-t from-indigo-600 to-purple-400 opacity-80"
                              style={{ height: `${height}%` }}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div
                    className={`rounded-xl border p-5 ${
                      darkMode
                        ? "border-white/10 bg-white/[0.02]"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-500" : "text-slate-400"
                      }`}
                    >
                      Preparation
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      Placement Readiness
                    </p>

                    <div className="mx-auto mt-7 flex h-32 w-32 items-center justify-center rounded-full border-[10px] border-indigo-500/30">
                      <div className="text-center">
                        <p className="text-3xl font-bold">78%</p>

                        <p
                          className={`text-xs ${
                            darkMode ? "text-gray-500" : "text-slate-400"
                          }`}
                        >
                          Ready
                        </p>
                      </div>
                    </div>

                    <p
                      className={`mt-5 text-center text-sm ${
                        darkMode ? "text-gray-500" : "text-slate-400"
                      }`}
                    >
                      Keep practicing to reach your target.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className={`border-y ${
          darkMode
            ? "border-white/10 bg-white/[0.02]"
            : "border-slate-200 bg-white"
        }`}
      >
        <div
          className={`mx-auto grid max-w-6xl grid-cols-2 divide-x md:grid-cols-4 ${
            darkMode ? "divide-white/10" : "divide-slate-200"
          }`}
        >
          <Stat darkMode={darkMode} number="8+" label="Placement Tools" />
          <Stat darkMode={darkMode} number="AI" label="Powered Feedback" />
          <Stat darkMode={darkMode} number="24/7" label="Practice Access" />
          <Stat darkMode={darkMode} number="360°" label="Preparation" />
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">
            Everything You Need
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Your complete placement toolkit
          </h2>

          <p
            className={`mt-5 ${
              darkMode ? "text-gray-400" : "text-slate-500"
            }`}
          >
            From resume screening to final interview preparation,
            PrepAI brings your complete placement journey into one platform.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Link
                href={feature.href}
                key={feature.title}
                className={`group rounded-2xl border p-6 transition duration-300 hover:-translate-y-1 ${
                  darkMode
                    ? "border-white/10 bg-white/[0.025] hover:border-indigo-500/40 hover:bg-indigo-500/[0.06]"
                    : "border-slate-200 bg-white shadow-sm hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 transition group-hover:bg-indigo-500 group-hover:text-white">
                    <Icon size={22} />
                  </div>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] ${
                      darkMode
                        ? "border-white/10 text-gray-500"
                        : "border-slate-200 text-slate-400"
                    }`}
                  >
                    {feature.tag}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-semibold">
                  {feature.title}
                </h3>

                <p
                  className={`mt-3 text-sm leading-6 ${
                    darkMode ? "text-gray-500" : "text-slate-500"
                  }`}
                >
                  {feature.description}
                </p>

                <div className="mt-5 flex items-center gap-1 text-sm font-medium text-indigo-500">
                  Explore
                  <ChevronRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section
        id="how-it-works"
        className={`border-y ${
          darkMode
            ? "border-white/10 bg-white/[0.02]"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">
              Placement Journey
            </p>

            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
              From preparation to placement
            </h2>

            <p
              className={`mt-5 ${
                darkMode ? "text-gray-400" : "text-slate-500"
              }`}
            >
              Follow a structured preparation journey instead of randomly
              solving problems and practicing interviews.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`rounded-2xl border p-7 ${
                  darkMode
                    ? "border-white/10 bg-[#080d1c]"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <span className="text-4xl font-black text-indigo-500/20">
                  {step.number}
                </span>

                <h3 className="mt-5 text-xl font-semibold">
                  {step.title}
                </h3>

                <p
                  className={`mt-3 text-sm leading-6 ${
                    darkMode ? "text-gray-500" : "text-slate-500"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="why-prepai" className="mx-auto max-w-7xl px-6 py-28">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">
              Why PrepAI
            </p>

            <h2 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
              Stop preparing randomly.
              <span className="block text-indigo-500">
                Start preparing intelligently.
              </span>
            </h2>

            <p
              className={`mt-6 leading-7 ${
                darkMode ? "text-gray-400" : "text-slate-500"
              }`}
            >
              Placement preparation becomes easier when you know what to
              improve, what companies expect and where you currently stand.
              PrepAI turns your preparation into a measurable process.
            </p>

            <div className="mt-8 space-y-5">
              <Benefit
                darkMode={darkMode}
                icon={<Sparkles size={19} />}
                title="AI-Powered Feedback"
                description="Get personalized feedback instead of generic preparation advice."
              />

              <Benefit
                darkMode={darkMode}
                icon={<Target size={19} />}
                title="Company-Focused Preparation"
                description="Prepare according to company, role and interview difficulty."
              />

              <Benefit
                darkMode={darkMode}
                icon={<BarChart3 size={19} />}
                title="Track Your Performance"
                description="Understand your strengths and weaknesses through analytics."
              />

              <Benefit
                darkMode={darkMode}
                icon={<ShieldCheck size={19} />}
                title="One Complete Platform"
                description="Resume, interviews, coding and company preparation in one place."
              />
            </div>
          </div>

          <div>
            <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 p-8">
              <div
                className={`rounded-2xl border p-7 ${
                  darkMode
                    ? "border-white/10 bg-[#080d1c]"
                    : "border-slate-200 bg-white shadow-sm"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                    <Zap />
                  </div>

                  <div>
                    <p className="font-semibold">Your AI Preparation</p>

                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-500" : "text-slate-400"
                      }`}
                    >
                      Personalized for your placement
                    </p>
                  </div>
                </div>

                <div className="mt-8 space-y-5">
                  <Progress
                    darkMode={darkMode}
                    title="Resume Strength"
                    value="86%"
                    width="86%"
                  />

                  <Progress
                    darkMode={darkMode}
                    title="Technical Interview"
                    value="74%"
                    width="74%"
                  />

                  <Progress
                    darkMode={darkMode}
                    title="Coding Skills"
                    value="68%"
                    width="68%"
                  />

                  <Progress
                    darkMode={darkMode}
                    title="Company Readiness"
                    value="79%"
                    width="79%"
                  />
                </div>

                <div
                  className={`mt-8 rounded-xl border p-4 ${
                    darkMode
                      ? "border-emerald-500/20 bg-emerald-500/5"
                      : "border-emerald-200 bg-emerald-50"
                  }`}
                >
                  <div className="flex items-center gap-2 text-emerald-500">
                    <CheckCircle2 size={18} />

                    <span className="text-sm font-medium">
                      You are improving!
                    </span>
                  </div>

                  <p
                    className={`mt-2 text-xs leading-5 ${
                      darkMode ? "text-gray-500" : "text-slate-500"
                    }`}
                  >
                    Your interview performance has improved by 24% over
                    your recent attempts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent px-6 py-20 text-center">
          <Sparkles className="mx-auto text-indigo-500" size={28} />

          <h2 className="mt-5 text-4xl font-bold sm:text-5xl">
            Ready to crack your placement?
          </h2>

          <p
            className={`mx-auto mt-5 max-w-xl ${
              darkMode ? "text-gray-400" : "text-slate-500"
            }`}
          >
            Build your resume. Practice interviews. Master coding.
            Prepare company-wise. Let PrepAI guide your preparation.
          </p>

          <Link
            href="/signup"
            className={`mt-8 inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-semibold transition ${
              darkMode
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-indigo-600 text-white hover:bg-indigo-500"
            }`}
          >
            Create Free Account
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer
        className={`border-t ${
          darkMode ? "border-white/10" : "border-slate-200"
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <BrainCircuit size={17} />
            </div>

            <span className="font-semibold">
              Prep<span className="text-indigo-500">AI</span>
            </span>
          </div>

          <p
            className={`text-sm ${
              darkMode ? "text-gray-600" : "text-slate-400"
            }`}
          >
            AI-powered placement preparation platform.
          </p>

          <div
            className={`flex gap-5 text-sm ${
              darkMode ? "text-gray-500" : "text-slate-500"
            }`}
          >
            <Link
              href="/login"
              className="transition hover:text-indigo-500"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="transition hover:text-indigo-500"
            >
              Signup
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function StatCard({
  icon,
  title,
  value,
  text,
  darkMode,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  text: string;
  darkMode: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        darkMode
          ? "border-white/10 bg-white/[0.025]"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-2 text-indigo-500">
        {icon}

        <span
          className={`text-xs ${
            darkMode ? "text-gray-500" : "text-slate-400"
          }`}
        >
          {title}
        </span>
      </div>

      <p className="mt-4 text-3xl font-bold">{value}</p>

      <p
        className={`mt-1 text-xs ${
          darkMode ? "text-gray-600" : "text-slate-400"
        }`}
      >
        {text}
      </p>
    </div>
  );
}

function Stat({
  number,
  label,
  darkMode,
}: {
  number: string;
  label: string;
  darkMode: boolean;
}) {
  return (
    <div className="px-5 py-8 text-center">
      <p className="text-3xl font-bold">{number}</p>

      <p
        className={`mt-1 text-sm ${
          darkMode ? "text-gray-500" : "text-slate-400"
        }`}
      >
        {label}
      </p>
    </div>
  );
}

function Benefit({
  icon,
  title,
  description,
  darkMode,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  darkMode: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold">{title}</h3>

        <p
          className={`mt-1 text-sm leading-6 ${
            darkMode ? "text-gray-500" : "text-slate-500"
          }`}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

function Progress({
  title,
  value,
  width,
  darkMode,
}: {
  title: string;
  value: string;
  width: string;
  darkMode: boolean;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span
          className={darkMode ? "text-gray-400" : "text-slate-500"}
        >
          {title}
        </span>

        <span className="font-medium">{value}</span>
      </div>

      <div
        className={`h-2 overflow-hidden rounded-full ${
          darkMode ? "bg-white/10" : "bg-slate-200"
        }`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
          style={{ width }}
        />
      </div>
    </div>
  );
}