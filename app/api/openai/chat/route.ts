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

    const systemPrompt = `너는 창의적인 한국어 작가야. 사용자가 준 키워드를 바탕으로, 한글 한 문장으로 짧고 사실적인 상황 묘사를 만들어. 이 문장은 사진 같은 이미지 생성 프롬프트로 바로 쓸 거라서, 사람의 일상에서 나올 법한 장면이 선명하게 떠오르게 해줘. 동물이나 환상적인 요소를 넣지 마. 영어/다국어는 쓰지 말고 반드시 한글만 사용해.

예시 (키워드: "학교"): "햇살 좋은 오후, 학생들이 도서관 창가에 앉아 조용히 책을 읽고 있다."
예시 (키워드: "직장"): "퇴근 시간, 동료들과 함께 웃으며 사무실을 나서는 직장인들의 활기찬 모습."`;

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
