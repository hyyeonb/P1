import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY || '',
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

    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY

    // Mock 모드 체크 (API 크레딧 없어도 테스트 가능)
    const useMockMode = !apiKey || process.env.MOCK_MODE === 'true'

    if (useMockMode) {
      console.log(`🎭 Mock 모드로 실행: ${keyword}`)
      // 약간의 지연 추가 (실제 API 호출처럼 보이게)
      await new Promise(resolve => setTimeout(resolve, 800))

      const keywords = generateMockKeywords(keyword)
      return NextResponse.json({
        keywords,
        mock: true,
        message: '💡 Mock 데이터입니다. 실제 AI는 Claude API 키가 필요합니다. https://console.anthropic.com/settings/keys 에서 발급받으세요.'
      })
    }

    // 실제 Claude API 호출
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
결과: ["머신러닝", "딥러닝", "자연어처리", "컴퓨터 비전", "AI 윤리", "ChatGPT", "자동화"]

반드시 JSON 배열만 출력하고 다른 설명은 하지 마세요.`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '[]'

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
      keywords = generateMockKeywords(keyword)
    }

    // 배열인지 확인
    if (!Array.isArray(keywords) || keywords.length === 0) {
      keywords = generateMockKeywords(keyword)
    }

    return NextResponse.json({ keywords, mock: false, ai: 'claude' })
  } catch (error: any) {
    console.error('Error:', error)

    // 크레딧 부족 또는 API 키 문제 시 자동으로 Mock 모드로 전환
    if (error.status === 429 || error.status === 401 || error.code === 'insufficient_quota') {
      console.log('💳 Claude API 문제 - Mock 모드로 전환')
      const { keyword } = await request.json().catch(() => ({ keyword: '테스트' }))
      const keywords = generateMockKeywords(keyword)

      return NextResponse.json({
        keywords,
        mock: true,
        warning: '⚠️ Claude API 키가 없거나 크레딧이 부족합니다. Mock 데이터로 실행 중입니다. https://console.anthropic.com/settings/keys 에서 API 키를 발급받으세요.'
      })
    }

    const errorMessage = error?.message || error?.toString() || '서버 오류가 발생했습니다.'
    return NextResponse.json(
      {
        error: '서버 오류가 발생했습니다.',
        details: errorMessage,
        apiKeySet: !!(process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY)
      },
      { status: 500 }
    )
  }
}
