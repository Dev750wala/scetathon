'use client';
import { useState } from 'react';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { SUPPORTED_LANGUAGES } from '@/lib/constants';

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
}

export default function VoiceRecorder({ onTranscript }: VoiceRecorderProps) {
  const { transcript, isListening, startListening, stopListening, clearTranscript, error, language, setLanguage } = useVoiceRecognition();
  const [shown, setShown] = useState(false);

  const handleUseText = () => {
    if (transcript.trim()) {
      onTranscript(transcript.trim());
      clearTranscript();
      setShown(false);
    }
  };

  return (
    <div className="mt-2">
      {!shown ? (
        <button
          type="button"
          onClick={() => setShown(true)}
          className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
        >
          🎙️ Use voice instead
        </button>
      ) : (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3">
          {/* Language selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 font-medium">Language:</label>
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code)}
                className={`text-xs px-2 py-1 rounded-full border transition-colors ${language === l.code ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'}`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Mic button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-red-500 animate-pulse shadow-lg shadow-red-200' : 'bg-green-600 hover:bg-green-700'}`}
            >
              <span className="text-white text-xl">{isListening ? '⏹️' : '🎙️'}</span>
            </button>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">{isListening ? 'Listening...' : 'Tap to speak'}</p>
              {transcript && <p className="text-xs text-gray-500 mt-0.5 italic truncate">"{transcript}"</p>}
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          {transcript && (
            <div className="flex gap-2">
              <button type="button" onClick={handleUseText} className="flex-1 bg-green-600 text-white text-sm py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                Use this text
              </button>
              <button type="button" onClick={clearTranscript} className="text-sm text-gray-500 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
