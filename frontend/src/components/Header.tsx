import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [text, setText] = useState('');
  const fullText = 'sentiment_analysis';

  useEffect(() => {
    let i = 0;
    const typingEffect = setInterval(() => {
      if (i <= fullText.length) {
        setText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(typingEffect);
      }
    }, 100);

    return () => clearInterval(typingEffect);
  }, []);

  return (
    <header className="bg-gray-800 text-green-400 p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold">
          <span className="text-blue-400">$ </span>
          {text}
          <span className="console-cursor"></span>
        </h1>
      </div>
    </header>
  );
};

export default Header;