'use client';

interface WordListProps {
  targetWords: string[];
  foundWords: string[];
}

export default function WordList({ targetWords, foundWords }: WordListProps) {
  const foundWordsUpper = foundWords.map(w => w.toUpperCase());
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-4 max-w-2xl mx-auto">
      <p className="text-sm text-gray-600 mb-3 text-center font-semibold">
        Find these words:
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        {targetWords.map((word, index) => {
          const isFound = foundWordsUpper.includes(word.toUpperCase());
          return (
            <div
              key={index}
              className={`
                px-4 py-2 rounded-lg border-2 font-bold text-lg
                transition-all duration-300
                ${isFound 
                  ? 'bg-green-100 border-green-500 text-green-700 line-through opacity-60' 
                  : 'bg-blue-50 border-blue-400 text-gray-800'
                }
              `}
              aria-label={`Word ${index + 1}: ${word}${isFound ? ' - found' : ''}`}
            >
              {word}
              {isFound && <span className="ml-2">✅</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
