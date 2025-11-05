'use client'

import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'

interface CustomNodeData {
  label: string
  keyword: string
  onExpand: (nodeId: string, keyword: string) => void
  onRegenerate?: (nodeId: string, keyword: string) => void
  isExpanded: boolean
  isLoading?: boolean
}

function CustomNode({ id, data }: NodeProps<CustomNodeData>) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!data.isExpanded && !data.isLoading) {
      data.onExpand(id, data.keyword)
    }
  }

  const handleRegenerate = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (data.onRegenerate) {
      data.onRegenerate(id, data.keyword)
    }
  }

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-purple-400 !border-2 !border-white"
        style={{ opacity: 0 }}
      />

      <div
        onClick={handleClick}
        className={`
          relative
          w-36 h-36 rounded-full border-4 shadow-2xl
          transition-all duration-500 ease-out
          flex flex-col items-center justify-center
          group overflow-hidden
          ${
            data.isLoading
              ? 'bg-gradient-to-br from-orange-400 to-pink-500 border-orange-300 cursor-wait animate-pulse'
              : data.isExpanded
              ? 'bg-gradient-to-br from-purple-500 to-purple-700 border-purple-300 cursor-default scale-105'
              : 'bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 border-white cursor-pointer hover:scale-125 hover:shadow-purple-500/50 hover:shadow-2xl animate-pulse-slow'
          }
        `}
      >
        {/* 로딩 상태 */}
        {data.isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* 텍스트 */}
        <div className="font-bold text-sm text-center px-4 leading-tight text-white z-10">
          {data.label}
        </div>

        {/* 클릭 유도 */}
        {!data.isExpanded && !data.isLoading && (
          <div className="absolute bottom-4 text-xs font-medium text-white/90 animate-bounce">
            ✨ 클릭
          </div>
        )}

        {/* 확장됨 뱃지 */}
        {data.isExpanded && (
          <div className="absolute -bottom-7 text-xs bg-purple-600 text-white px-3 py-1 rounded-full shadow-lg font-medium">
            확장됨
          </div>
        )}

        {/* 다시 생성 버튼 */}
        {data.isExpanded && data.onRegenerate && (
          <button
            onClick={handleRegenerate}
            className="absolute -top-8 bg-white text-purple-600 px-3 py-1 rounded-full shadow-lg text-xs font-bold hover:bg-purple-50 transition-all hover:scale-110"
          >
            🔄 다시
          </button>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-purple-400 !border-2 !border-white"
        style={{ opacity: 0 }}
      />
    </div>
  )
}

export default memo(CustomNode)
