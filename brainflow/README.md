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

**이제 Claude API를 사용합니다!** (OpenAI보다 나을 수 있음)

#### Option A: .env.local 파일 사용 (추천)

`brainflow` 폴더(package.json이 있는 곳)에 `.env.local` 파일을 생성:

```bash
# Claude API (추천!)
ANTHROPIC_API_KEY=sk-ant-your-key-here

# 또는 OpenAI (선택)
# OPENAI_API_KEY=sk-your-key-here
```

**Claude API 키 발급:**
1. https://console.anthropic.com/settings/keys 접속
2. "Create Key" 클릭
3. 키 복사해서 위에 붙여넣기

**주의사항:**
- 파일 위치: `C:\STN\ETC\P1\brainflow\.env.local` (Windows)
- 또는: `/home/user/P1/brainflow/.env.local` (Linux)
- **파일 이름**: `.env.local` (점으로 시작!)
- **인코딩**: UTF-8
- **줄바꿈**: LF (Unix 스타일)

#### Option B: 시스템 환경 변수 (Windows)

```powershell
# PowerShell에서 (임시)
$env:ANTHROPIC_API_KEY = "sk-ant-your-key-here"
npm run dev

# 또는 영구 설정 (관리자 권한)
[Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", "sk-ant-your-key-here", "User")
```

#### Option C: Mock 모드 (API 없이 테스트)

API 키가 없어도 Mock 데이터로 UI/UX 테스트 가능:

```bash
# .env.local에 추가
MOCK_MODE=true
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 접속!

### 4. 문제 해결

**"OPENAI_API_KEY가 설정되지 않았습니다" 오류가 계속 뜨면:**

1. **서버를 완전히 종료** (Ctrl+C)
2. PowerShell 창도 완전히 닫기
3. 새 PowerShell 창 열기
4. `brainflow` 폴더로 이동
5. `.env.local` 파일이 있는지 확인: `ls .env.local`
6. 파일 내용 확인: `cat .env.local`
7. 다시 시작: `npm run dev`

**여전히 안 되면 임시 방법:**

```powershell
# 실행할 때마다 환경 변수 설정
$env:OPENAI_API_KEY="sk-your-key"; npm run dev
```

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
- **AI**: Claude 3.5 Sonnet (Anthropic) - OpenAI도 지원
- **Deploy**: Vercel

## 📁 프로젝트 구조

```
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
```

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

1. `.env.local` 파일이 `brainflow` 폴더(package.json 옆)에 있는지 확인
2. 파일 내용: `OPENAI_API_KEY=sk-...` (따옴표 없이!)
3. 서버를 **완전히 재시작** (Ctrl+C 후 `npm run dev`)
4. PowerShell도 재시작해보기

### 노드가 안 펼쳐지면?

개발자 도구(F12) → Console에서 에러 메시지를 확인하세요.

### Windows에서 .env.local이 작동하지 않으면?

임시 해결책:
```powershell
$env:OPENAI_API_KEY="sk-your-key"; npm run dev
```

## 📄 라이선스

MIT

---

Made with 💜 by Claude Code
