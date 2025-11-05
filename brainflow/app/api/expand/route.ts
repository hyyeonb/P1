import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const { keyword } = await request.json()

    if (!keyword) {
      return NextResponse.json(
        { error: '키워드가 필요합니다.' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    const prompt = `주제: "${keyword}"

위 주제와 관련된 5-7개의 하위 주제나 연관 키워드를 생성해주세요.

규칙:
1. 각 키워드는 2-4단어로 간결하게
2. 서로 다른 관점이나 카테고리로 구성
3. 한국어로 작성
4. 중복 없이
5. JSON 배열 형식으로만 반환: ["키워드1", "키워드2", ...]

예시:
주제: "인공지능"
결과: ["머신러닝", "딥러닝", "자연어처리", "컴퓨터 비전", "AI 윤리", "ChatGPT", "자동화"]`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '당신은 브레인스토밍을 도와주는 창의적인 AI입니다. 주어진 주제에 대해 다양한 관점의 하위 주제를 제안합니다.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 200,
    })

    const responseText = completion.choices[0]?.message?.content || '[]'

    // JSON 추출 (```json ... ``` 형식일 수도 있음)
    let keywords: string[] = []
    try {
      const jsonMatch = responseText.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        keywords = JSON.parse(jsonMatch[0])
      } else {
        keywords = JSON.parse(responseText)
      }
    } catch (e) {
      console.error('JSON 파싱 실패:', responseText)
      // 파싱 실패 시 기본값
      keywords = ['관련 주제 1', '관련 주제 2', '관련 주제 3', '관련 주제 4', '관련 주제 5']
    }

    // 배열인지 확인
    if (!Array.isArray(keywords)) {
      keywords = ['관련 주제 1', '관련 주제 2', '관련 주제 3', '관련 주제 4', '관련 주제 5']
    }

    return NextResponse.json({ keywords })
  } catch (error: any) {
    console.error('Error:', error)
    const errorMessage = error?.message || error?.toString() || '서버 오류가 발생했습니다.'
    return NextResponse.json(
      {
        error: '서버 오류가 발생했습니다.',
        details: errorMessage,
        apiKeySet: !!process.env.OPENAI_API_KEY
      },
      { status: 500 }
    )
  }
}
