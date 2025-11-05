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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            BrainFlow
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            AI 기반 무한 확장 브레인스토밍
          </p>
          <p className="text-sm text-gray-500">
            키워드를 입력하면 AI가 연관 아이디어를 무한으로 펼쳐드립니다
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            시작 키워드를 입력하세요
          </label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleStart()}
            placeholder="예: 대한민국, 인공지능, 비즈니스 아이디어..."
            className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
          />

          <button
            onClick={handleStart}
            disabled={!keyword.trim()}
            className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
          >
            브레인스토밍 시작하기 🚀
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p className="mb-2">💡 노드를 클릭하면 하위 아이디어가 펼쳐집니다</p>
          <p>🎨 드래그로 캔버스를 이동하고 스크롤로 확대/축소하세요</p>
        </div>
      </div>
    </div>
  )
}
