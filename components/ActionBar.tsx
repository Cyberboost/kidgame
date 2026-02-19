'use client';

interface ActionBarProps {
  onUndo: () => void;
  onClear: () => void;
  onSubmit: () => void;
  canUndo: boolean;
  canSubmit: boolean;
  disabled?: boolean;
}

export default function ActionBar({
  onUndo,
  onClear,
  onSubmit,
  canUndo,
  canSubmit,
  disabled,
}: ActionBarProps) {
  return (
    <div className="flex gap-3 justify-center max-w-2xl mx-auto p-4">
      <button
        onClick={onUndo}
        disabled={!canUndo || disabled}
        aria-label="Undo last letter"
        className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg shadow-md active:scale-95 transform"
      >
        ↶ Undo
      </button>
      <button
        onClick={onClear}
        disabled={!canUndo || disabled}
        aria-label="Clear all letters"
        className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg shadow-md active:scale-95 transform"
      >
        ✕ Clear
      </button>
      <button
        onClick={onSubmit}
        disabled={!canSubmit || disabled}
        aria-label="Submit word"
        className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg shadow-md active:scale-95 transform"
      >
        ✓ Submit
      </button>
    </div>
  );
}
