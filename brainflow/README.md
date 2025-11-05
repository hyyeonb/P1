# 🧠 BrainFlow

AI 기반 무한 확장 브레인스토밍 마인드맵

## ✨ 주요 기능

- 🎯 **키워드 입력** → AI가 관련 아이디어 자동 생성
- 🔵 **동그란 노드** 클릭 → 확대되며 하위 주제 펼쳐짐
- 🔄 **다시 생성** → 마음에 안 들면 새로운 아이디어로!
- 📊 **로딩 바** → 실시간 진행상황 표시
- 🎨 **예쁜 애니메이션** → 부드러운 UX
- ♾️ **무한 확장** → 계속 깊이 파고들 수 있음

## 🚀 시작하기

### 1. 환경 변수 설정

`.env.local` 파일 생성:

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

`.env.local`에 OpenAI API 키 입력:

\`\`\`
OPENAI_API_KEY=sk-...
\`\`\`

### 2. 의존성 설치

\`\`\`bash
npm install
\`\`\`

### 3. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

http://localhost:3000 접속!

## 💰 수익화 모델 (향후 계획)

### 무료 버전
- 노드 3단계까지
- 세션당 5개 주제
- 기본 테마

### 프리미엄 (월 9,900원)
- ♾️ 무제한 노드
- 💾 저장/불러오기
- 🎨 커스텀 테마
- 📥 이미지/PDF 내보내기
- 🤝 협업 (공유 링크)

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, React, TypeScript
- **UI**: TailwindCSS, React Flow
- **AI**: OpenAI GPT-3.5 Turbo
- **Deploy**: Vercel

## 📁 프로젝트 구조

\`\`\`
brainflow/
├── app/
│   ├── page.tsx           # 메인 페이지 (키워드 입력)
│   ├── layout.tsx         # 레이아웃
│   ├── globals.css        # 전역 스타일
│   └── api/
│       └── expand/
│           └── route.ts   # AI 노드 생성 API
├── components/
│   ├── BrainFlowCanvas.tsx  # 메인 캔버스
│   └── CustomNode.tsx       # 동그란 노드 컴포넌트
└── package.json
\`\`\`

## 🎯 사용 예시

1. **학생**: "기후 변화" → 온실가스, 재생에너지, 탄소중립...
2. **기획자**: "비즈니스 아이디어" → SaaS, 구독 모델, B2B...
3. **작가**: "스토리 아이디어" → 판타지, 시간여행, 로맨스...
4. **개발자**: "프로젝트 구조" → 프론트엔드, 백엔드, DB...

## 📝 TODO

- [ ] 회원가입/로그인
- [ ] 데이터베이스 연동 (Supabase)
- [ ] 저장/불러오기 기능
- [ ] 이미지 내보내기 (PNG, PDF)
- [ ] 다크모드
- [ ] 모바일 최적화
- [ ] 결제 연동 (Stripe)
- [ ] 소셜 공유 기능

## 🐛 문제 해결

### "API 키 오류"가 뜨면?
`.env.local` 파일에 `OPENAI_API_KEY`가 올바르게 설정되었는지 확인하세요.

### 노드가 안 펼쳐지면?
개발자 도구(F12) → Console에서 에러 메시지를 확인하세요.

## 📄 라이선스

MIT

---

Made with 💜 by Claude Code
