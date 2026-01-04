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
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [openaiResult, setOpenaiResult] = useState<GeneratedImage>({
    imageUrl: '',
    loading: false,
  });
  const [geminiResult, setGeminiResult] = useState<GeneratedImage>({
    imageUrl: '',
    loading: false,
  });

  const generateImages = async (keyword: string) => {
    setIsGenerating(true);
    setGeneratedPrompt('');
    setOpenaiResult({ imageUrl: '', loading: false, error: undefined });
    setGeminiResult({ imageUrl: '', loading: false, error: undefined });

    try {
      // Step 1: Fetch funny prompt from the new chat API
      const chatResponse = await fetch('/api/openai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
      });

      const chatData = await chatResponse.json();

      if (chatData.error) {
        throw new Error(chatData.error);
      }

      const prompt = chatData.prompt;
      setGeneratedPrompt(prompt);

      // Indicate that image generation is starting
      setOpenaiResult({ imageUrl: '', loading: true, error: undefined });
      setGeminiResult({ imageUrl: '', loading: true, error: undefined });

      // Step 2: Generate images from both APIs in parallel
      const openaiPromise = fetch('/api/openai', {
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

      const geminiPromise = fetch('/api/gemini', {
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
      
      await Promise.all([openaiPromise, geminiPromise]);

    } catch (error: any) {
      // Handle errors from the chat API call or other issues
      setOpenaiResult({ imageUrl: '', loading: false, error: error.message });
      setGeminiResult({ imageUrl: '', loading: false, error: '프롬프트 생성에 실패하여 이미지 생성을 진행하지 않았습니다.' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container">
      <h1>AI 이미지 생성 비교</h1>
      <p className="subtitle">OpenAI DALL-E vs Gemini</p>

      <div className="button-section">
        <p>키워드를 선택하여 재미있는 이미지 프롬프트를 생성해보세요!</p>
        <div className="button-group">
          <button onClick={() => generateImages('직장')} disabled={isGenerating}>
            직장
          </button>
          <button onClick={() => generateImages('학교')} disabled={isGenerating}>
            학교
          </button>
          <button onClick={() => generateImages('거리')} disabled={isGenerating}>
            거리
          </button>
          <button onClick={() => generateImages('가정')} disabled={isGenerating}>
            가정
          </button>
        </div>
      </div>

      {generatedPrompt && (
        <div className="generated-prompt-section">
          <strong>생성된 프롬프트:</strong>
          <p>{generatedPrompt}</p>
        </div>
      )}

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
          <h2>Gemini 2.5</h2>
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

        .button-section {
          max-width: 800px;
          margin: 0 auto 3rem;
          text-align: center;
        }

        .button-section p {
          font-size: 1.1rem;
          color: #555;
          margin-bottom: 1.5rem;
        }

        .button-group {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .button-group button {
          padding: 0.8rem 1.5rem;
          font-size: 1rem;
          font-weight: bold;
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .button-group button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .button-group button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .generated-prompt-section {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1rem;
          margin: 2rem auto;
          max-width: 800px;
        }

        .generated-prompt-section strong {
          color: #495057;
        }

        .generated-prompt-section p {
          margin: 0.5rem 0 0 0;
          color: #666;
          line-height: 1.6;
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

          .button-group {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
