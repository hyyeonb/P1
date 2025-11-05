import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

// Mock 데이터 생성 함수 (API 크레딧 없이 테스트용)
function generateMockKeywords(keyword: string): string[] {
  const mockDatabase: Record<string, string[]> = {
    '인공지능': ['머신러닝', '딥러닝', '자연어처리', '컴퓨터 비전', 'AI 윤리', 'ChatGPT', '자동화'],
    '비즈니스': ['스타트업', '마케팅', '재무관리', '인사관리', '전략기획', '고객관리'],
    '프로그래밍': ['웹개발', '앱개발', '데이터베이스', 'API', '알고리즘', '디버깅'],
    '대한민국': ['역사', '문화', '정치', '경제', '지리', 'K-POP', '한국음식'],
    '기후변화': ['온실가스', '재생에너지', '탄소중립', '지구온난화', '환경보호', '친환경'],
    '스타트업': ['MVP', '투자유치', '린스타트업', '피벗', '그로스해킹', '시리즈A'],
    '마케팅': ['콘텐츠마케팅', 'SEO', 'SNS마케팅', '브랜딩', '퍼포먼스마케팅', '인플루언서'],
  }

  // 정확히 일치하는 키워드가 있으면 반환
  const lowerKeyword = keyword.toLowerCase().trim()
  for (const [key, value] of Object.entries(mockDatabase)) {
    if (key.toLowerCase().includes(lowerKeyword) || lowerKeyword.includes(key.toLowerCase())) {
      return value
    }
  }

  // 없으면 일반적인 하위 주제 생성
  return [
    `${keyword} 정의`,
    `${keyword} 역사`,
    `${keyword} 현황`,
    `${keyword} 미래`,
    `${keyword} 활용`,
    `${keyword} 문제점`,
  ]
}

export async function POST(request: NextRequest) {
  try {
    const { keyword } = await request.json()

    if (!keyword) {
      return NextResponse.json(
        { error: '키워드가 필요합니다.' },
        { status: 400 }
      )
    }

    // Mock 모드 체크 (API 크레딧 없어도 테스트 가능)
    const useMockMode = !process.env.OPENAI_API_KEY || process.env.MOCK_MODE === 'true'

    if (useMockMode) {
      console.log(`🎭 Mock 모드로 실행: ${keyword}`)
      // 약간의 지연 추가 (실제 API 호출처럼 보이게)
      await new Promise(resolve => setTimeout(resolve, 800))

      const keywords = generateMockKeywords(keyword)
      return NextResponse.json({
        keywords,
        mock: true,
        message: '💡 Mock 데이터입니다. 실제 AI는 OpenAI API 크레딧이 필요합니다.'
      })
    }

    // 실제 OpenAI API 호출
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

    return NextResponse.json({ keywords, mock: false })
  } catch (error: any) {
    console.error('Error:', error)

    // 429 에러 (크레딧 부족) 시 자동으로 Mock 모드로 전환
    if (error.status === 429 || error.code === 'insufficient_quota') {
      console.log('💳 OpenAI 크레딧 부족 - Mock 모드로 전환')
      const { keyword } = await request.json()
      const keywords = generateMockKeywords(keyword)

      return NextResponse.json({
        keywords,
        mock: true,
        warning: '⚠️ OpenAI API 크레딧이 부족합니다. Mock 데이터로 실행 중입니다. https://platform.openai.com/account/billing 에서 크레딧을 충전하세요.'
      })
    }

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
