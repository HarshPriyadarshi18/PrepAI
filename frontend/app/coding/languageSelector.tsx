interface Props {
  language: string;
  setLanguage: (value: string) => void;
  handleRun: () => void;
}

export default function LanguageSelector({
  language,
  setLanguage,
  handleRun,
}: Props) {
  return (
    <div className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="flex gap-4 items-center">
        <label className="text-white font-medium">
          Language
        </label>

        <select
          value={language}
          onChange={(e) =>
            setLanguage(e.target.value)
          }
          className="bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2"
        >
          <option value="cpp">C++</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
      </div>

      <button
        onClick={handleRun}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
      >
        Run Code
      </button>
    </div>
  );
}