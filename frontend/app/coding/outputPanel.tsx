interface Props {
  output: string;
}

export default function OutputPanel({
  output,
}: Props) {
  return (
    <div className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 p-6 mt-6">
      <h2 className="text-xl font-semibold text-white mb-4">
        Output
      </h2>

      <div className="bg-black text-green-400 rounded-lg p-4 min-h-[120px] font-mono">
        <pre>{output}</pre>
      </div>
    </div>
  );
}