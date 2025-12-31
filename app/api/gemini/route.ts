import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: '프롬프트가 필요합니다.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
      config: {
        responseModalities: ['Text', 'Image'],
      },
    });

    // 응답에서 이미지 데이터 추출
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error('이미지 생성 실패: 응답이 없습니다.');
    }

    const parts = response.candidates[0].content?.parts;
    if (!parts) {
      throw new Error('이미지 생성 실패: 파트가 없습니다.');
    }

    let imageUrl = '';
    let textResponse = '';

    for (const part of parts) {
      if (part.text) {
        textResponse = part.text;
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mimeType};base64,${imageData}`;
      }
    }

    if (!imageUrl) {
      throw new Error('이미지 생성 실패: 이미지 데이터가 없습니다.' + (textResponse ? ` 응답: ${textResponse}` : ''));
    }

    return NextResponse.json({
      imageUrl,
      model: 'gemini-2.5-flash-image',
      text: textResponse || undefined,
    });
  } catch (error: any) {
    console.error('Gemini API 오류:', error);
    return NextResponse.json(
      { error: error.message || 'Gemini API 호출 실패' },
      { status: 500 }
    );
  }
}
