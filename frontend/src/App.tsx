import React, { useState } from 'react';

const App: React.FC = () => {
  const [review, setReview] = useState('');
  const [response, setResponse] = useState<{ sentiment: string; confidence: number; rating: number } | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: review }),
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Film Review App</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Enter your film review here"
          rows={4}
          cols={50}
        />
        <br />
        <button type="submit">Submit Review</button>
      </form>
      {response && (
        <div>
          <h2>Response:</h2>
          <p>Sentiment: {response.sentiment}</p>
          <p>Confidence: {response.confidence.toFixed(2)}</p>
          <p>Rating: {response.rating.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default App;