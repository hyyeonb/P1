'use client'

import { useState } from 'react'
import BrainFlowCanvas from '@/components/BrainFlowCanvas'

export default function Home() {
  const [keyword, setKeyword] = useState('')
  const [isStarted, setIsStarted] = useState(false)

  const handleStart = () => {
    if (keyword.trim()) {
      setIsStarted(true)
    }
  }

  if (isStarted) {
    return <BrainFlowCanvas initialKeyword={keyword} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="max-w-2xl w-full">
          {/* Logo & Title */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
              BrainFlow
            </h1>
            <p className="text-xl text-gray-600 mb-3 font-medium">
              AI 무한 브레인스토밍
            </p>
            <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              아이디어가 필요한 순간, AI가 생각의 흐름을 이어갑니다
            </p>
          </div>

          {/* Input Card */}
          <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl p-10 border border-white/20">
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              시작 키워드
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleStart()}
              placeholder="예: 인공지능, 비즈니스 아이디어, 창업..."
              className="w-full px-6 py-5 text-lg bg-white/80 border-2 border-gray-200/50 rounded-2xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all placeholder-gray-400"
              autoFocus
            />

            <button
              onClick={handleStart}
              disabled={!keyword.trim()}
              className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-5 px-6 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
            >
              <span className="flex items-center justify-center gap-2">
                시작하기
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            <div className="backdrop-blur-sm bg-white/40 rounded-2xl p-4 border border-white/20">
              <div className="text-2xl mb-2">✨</div>
              <p className="text-sm font-medium text-gray-700">무한 확장</p>
            </div>
            <div className="backdrop-blur-sm bg-white/40 rounded-2xl p-4 border border-white/20">
              <div className="text-2xl mb-2">🎨</div>
              <p className="text-sm font-medium text-gray-700">시각화</p>
            </div>
            <div className="backdrop-blur-sm bg-white/40 rounded-2xl p-4 border border-white/20">
              <div className="text-2xl mb-2">🚀</div>
              <p className="text-sm font-medium text-gray-700">빠른 생성</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
