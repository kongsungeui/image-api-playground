import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: '프롬프트가 필요합니다.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
    });

    return NextResponse.json({
      imageUrl: response.data[0].url,
      revisedPrompt: response.data[0].revised_prompt,
    });
  } catch (error: any) {
    console.error('OpenAI API 오류:', error);
    return NextResponse.json(
      { error: error.message || 'OpenAI 이미지 생성 실패' },
      { status: 500 }
    );
  }
}
