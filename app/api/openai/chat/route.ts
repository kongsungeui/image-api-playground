import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { keyword } = await request.json();

    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json(
        { error: '키워드가 필요합니다.' },
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

    const systemPrompt = `너는 창의적인 한국어 작가야. 사용자가 준 키워드를 바탕으로, 한글 한 문장으로 짧고 재치 있고 상황이 잘 그려지는 묘사를 만들어. 이 문장은 이미지 생성 프롬프트로 바로 쓸 거라서 장면이 선명하게 떠오르게 해줘. 영어/다국어는 쓰지 말고 반드시 한글만 사용해.

예시 (키워드: "학교"): "피곤한 부엉이들이 고급 낮잠 기술을 배우는 수업을 듣느라 칠판 앞에서 꾸벅꾸벅 졸고 있다."
예시 (키워드: "직장"): "정장을 입은 기린이 너무 작은 사무실 칸막이에 목을 꾸역꾸역 끼워 넣으며 회의에 참석하려 애쓰고 있다."`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: keyword },
      ],
      max_tokens: 100,
      temperature: 0.8,
    });

    const generatedText = response.choices[0].message.content?.trim();

    if (!generatedText) {
      throw new Error('텍스트 생성 실패: 응답이 비어있습니다.');
    }

    return NextResponse.json({ prompt: generatedText });
  } catch (error: any) {
    console.error('OpenAI Chat API 오류:', error);
    return NextResponse.json(
      { error: error.message || 'OpenAI 텍스트 생성 실패' },
      { status: 500 }
    );
  }
}
