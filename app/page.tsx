'use client';

import { useState } from 'react';
import Image from 'next/image';

interface GeneratedImage {
  imageUrl: string;
  revisedPrompt?: string;
  description?: string;
  note?: string;
  loading: boolean;
  error?: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [openaiResult, setOpenaiResult] = useState<GeneratedImage>({
    imageUrl: '',
    loading: false,
  });
  const [geminiResult, setGeminiResult] = useState<GeneratedImage>({
    imageUrl: '',
    loading: false,
  });

  const generateImages = async () => {
    if (!prompt.trim()) {
      alert('프롬프트를 입력해주세요.');
      return;
    }

    if (prompt.length > 200) {
      alert('프롬프트는 200자 이하로 입력해주세요.');
      return;
    }

    // OpenAI 이미지 생성
    setOpenaiResult({ imageUrl: '', loading: true });
    fetch('/api/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setOpenaiResult({ imageUrl: '', loading: false, error: data.error });
        } else {
          setOpenaiResult({
            imageUrl: data.imageUrl,
            revisedPrompt: data.revisedPrompt,
            loading: false,
          });
        }
      })
      .catch((error) => {
        setOpenaiResult({
          imageUrl: '',
          loading: false,
          error: error.message,
        });
      });

    // Gemini 이미지 생성
    setGeminiResult({ imageUrl: '', loading: true });
    fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setGeminiResult({ imageUrl: '', loading: false, error: data.error });
        } else {
          setGeminiResult({
            imageUrl: data.imageUrl,
            description: data.description,
            note: data.note,
            loading: false,
          });
        }
      })
      .catch((error) => {
        setGeminiResult({
          imageUrl: '',
          loading: false,
          error: error.message,
        });
      });
  };

  return (
    <div className="container">
      <h1>AI 이미지 생성 비교</h1>
      <p className="subtitle">OpenAI DALL-E vs Gemini</p>

      <div className="input-section">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="이미지를 생성할 프롬프트를 입력하세요 (최대 200자)"
          maxLength={200}
          rows={4}
        />
        <div className="char-count">{prompt.length}/200</div>
        <button onClick={generateImages} disabled={openaiResult.loading || geminiResult.loading}>
          {openaiResult.loading || geminiResult.loading ? '생성 중...' : '이미지 생성'}
        </button>
      </div>

      <div className="results">
        <div className="result-card">
          <h2>OpenAI DALL-E 3</h2>
          {openaiResult.loading && <div className="loading">생성 중...</div>}
          {openaiResult.error && <div className="error">{openaiResult.error}</div>}
          {openaiResult.imageUrl && (
            <div>
              <div className="image-container">
                <img src={openaiResult.imageUrl} alt="OpenAI generated" />
              </div>
              {openaiResult.revisedPrompt && (
                <div className="info">
                  <strong>수정된 프롬프트:</strong>
                  <p>{openaiResult.revisedPrompt}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="result-card">
          <h2>Gemini</h2>
          {geminiResult.loading && <div className="loading">생성 중...</div>}
          {geminiResult.error && <div className="error">{geminiResult.error}</div>}
          {geminiResult.imageUrl && (
            <div>
              <div className="image-container">
                <img src={geminiResult.imageUrl} alt="Gemini generated" />
              </div>
              {geminiResult.note && (
                <div className="note">
                  <strong>참고:</strong>
                  <p>{geminiResult.note}</p>
                </div>
              )}
              {geminiResult.description && (
                <div className="info">
                  <strong>생성된 설명:</strong>
                  <p>{geminiResult.description}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
            Cantarell, sans-serif;
        }

        h1 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: #333;
        }

        .subtitle {
          text-align: center;
          color: #666;
          font-size: 1.2rem;
          margin-bottom: 2rem;
        }

        .input-section {
          max-width: 800px;
          margin: 0 auto 3rem;
        }

        textarea {
          width: 100%;
          padding: 1rem;
          font-size: 1rem;
          border: 2px solid #ddd;
          border-radius: 8px;
          resize: vertical;
          font-family: inherit;
          transition: border-color 0.3s;
        }

        textarea:focus {
          outline: none;
          border-color: #0070f3;
        }

        .char-count {
          text-align: right;
          color: #666;
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }

        button {
          width: 100%;
          padding: 1rem;
          margin-top: 1rem;
          font-size: 1.1rem;
          font-weight: bold;
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .results {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 2rem;
        }

        .result-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .result-card h2 {
          margin-top: 0;
          color: #333;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 0.5rem;
        }

        .loading {
          text-align: center;
          padding: 3rem;
          color: #666;
          font-size: 1.1rem;
        }

        .error {
          background: #fee;
          color: #c33;
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid #c33;
        }

        .note {
          background: #fff3cd;
          color: #856404;
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
          border-left: 4px solid #ffc107;
        }

        .image-container {
          width: 100%;
          margin: 1rem 0;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .image-container img {
          width: 100%;
          height: auto;
          display: block;
        }

        .info {
          margin-top: 1rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .info strong {
          color: #495057;
        }

        .info p {
          margin: 0.5rem 0 0 0;
          color: #666;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .results {
            grid-template-columns: 1fr;
          }

          h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
