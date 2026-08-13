interface Props {
  language: string;
  setLanguage: (value: string) => void;
  handleRun: () => void;
  isRunning: boolean;
}

export default function LanguageSelector({
  language,
  setLanguage,
  handleRun,
  isRunning,
}: Props) {
  return (
    <div className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="flex gap-4 items-center">
        <label className="text-white font-medium">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="cpp">C++</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-slate-400 text-sm hidden md:block">
          Ctrl + Enter to run
        </span>
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2"
        >
          {isRunning ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Running...
            </>
          ) : (
            "▶ Run Code"
          )}
        </button>
      </div>
    </div>
  );
}