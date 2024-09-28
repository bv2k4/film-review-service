import React from 'react';
import { AnalysisResult } from '../types';

interface ResultDisplayProps {
  result: AnalysisResult;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const getSentimentClass = (sentiment: string) => {
    return sentiment.toLowerCase() === 'positive' ? 'sentiment-positive' : 'sentiment-negative';
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-green-400 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-green-400">Analysis Result</h2>
      <div className="space-y-4">
        <div>
          <p className="text-gray-400">Sentiment</p>
          <p className={`text-xl font-semibold ${getSentimentClass(result.sentiment)}`}>
            {result.sentiment}
          </p>
        </div>
        <div>
          <p className="text-gray-400">Confidence</p>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${result.confidence * 100}%` }}
            ></div>
          </div>
          <p className="text-right mt-1 text-green-400">{(result.confidence * 100).toFixed(2)}%</p>
        </div>
        <div>
          <p className="text-gray-400">Rating</p>
          <p className="text-xl font-semibold text-green-400">{result.rating.toFixed(1)} / 10</p>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;