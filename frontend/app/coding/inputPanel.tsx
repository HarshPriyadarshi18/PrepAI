interface Props {
  input: string;
  setInput: (value: string) => void;
}

export default function InputPanel({ input, setInput }: Props) {
  return (
    <div className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 p-5">
      <h2 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
        Custom Input
      </h2>
      <textarea
        rows={5}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter custom input (stdin)..."
        className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
    </div>
  );
}