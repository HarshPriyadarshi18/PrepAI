interface Props {
  input: string;
  setInput: (value: string) => void;
}

export default function InputPanel({
  input,
  setInput,
}: Props) {
  return (
    <div className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 p-6 mt-6">
      <h2 className="text-xl font-semibold text-white mb-4">
        Custom Input
      </h2>

      <textarea
        rows={5}
        value={input}
        onChange={(e) =>
          setInput(e.target.value)
        }
        placeholder="Enter custom input..."
        className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}