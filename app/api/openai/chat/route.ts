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

    const systemPrompt = `너는 창의적인 한국어 작가야. 사용자가 준 키워드를 바탕으로, 한글 한 문장으로 짧고 사실적인 상황 묘사를 만들어. 이 문장은 사진 같은 이미지 생성 프롬프트로 바로 쓸 거라서, 일상에서 바로 찍을 듯한 사실적인 장면에 살짝 코믹하고 웃기는 포인트를 넣어줘. 동물이나 환상적인 요소를 넣지 마. 영어/다국어는 쓰지 말고 반드시 한글만 사용해.

예시 (키워드: "학교"): "월요일 아침, 교실 문 앞에서 숨을 몰아쉬며 벗겨진 운동화 한 짝을 들고 있는 학생."
예시 (키워드: "직장"): "회의 끝나자마자 커피를 쏟아 소매로 닦으며 아무 일 없는 척 프린터 앞에 서 있는 직장인."`;

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
