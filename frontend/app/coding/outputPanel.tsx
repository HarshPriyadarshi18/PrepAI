interface Props {
  output: string;
  status?: string;
}

export default function OutputPanel({ output, status }: Props) {
  const isError = status === "Error";

  return (
    <div className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
          Output
        </h2>
        {status && (
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              isError
                ? "bg-red-500/20 text-red-400"
                : "bg-green-500/20 text-green-400"
            }`}
          >
            {status}
          </span>
        )}
      </div>
      <div className="bg-black text-green-400 rounded-lg p-4 min-h-[160px] font-mono text-sm overflow-auto whitespace-pre-wrap">
        {output || (
          <span className="text-slate-500">Output will appear here...</span>
        )}
      </div>
    </div>
  );
}