import React, { useState } from 'react';
import Header from './components/Header';
import ReviewForm from './components/ReviewForm';
import ResultDisplay from './components/ResultDisplay';
import { AnalysisResult, ApiError } from './types';
import { apiUrl, validateReview } from './utils';

const App: React.FC = () => {
  const [response, setResponse] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const clearResponse = () => {
    setResponse(null);
  };

  const handleSubmit = async (review: string) => {
    const validationError = validateReview(review);
    if (validationError) {
      setError(validationError);
      setResponse(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: review.trim() }),
      });

      if (!res.ok) {
        const errorData: ApiError = await res.json();
        throw new Error(errorData.detail || 'An error occurred while processing your request');
      }

      const data: AnalysisResult = await res.json();
      setResponse(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <ReviewForm onSubmit={handleSubmit} loading={loading} error={error} clearResponse={clearResponse}/>
          {response && !error && <ResultDisplay result={response} />}
        </div>
      </main>
    </div>
  );
};

export default App;