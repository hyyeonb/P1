'use client'

import { useCallback, useState, useEffect } from 'react'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
} from 'reactflow'
import 'reactflow/dist/style.css'
import CustomNode from './CustomNode'

const nodeTypes = {
  custom: CustomNode,
}

interface BrainFlowCanvasProps {
  initialKeyword: string
}

export default function BrainFlowCanvas({ initialKeyword }: BrainFlowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [isLoading, setIsLoading] = useState(false)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingNodeId, setLoadingNodeId] = useState<string | null>(null)

  // 초기 노드 생성
  useEffect(() => {
    const initialNode: Node = {
      id: '0',
      type: 'custom',
      position: { x: typeof window !== 'undefined' ? window.innerWidth / 2 - 100 : 400, y: 100 },
      data: {
        label: initialKeyword,
        keyword: initialKeyword,
        onExpand: handleNodeExpand,
        onRegenerate: handleRegenerate,
        isExpanded: false,
        isLoading: false,
      },
    }
    setNodes([initialNode])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialKeyword, setNodes]) // initialKeyword가 바뀔 때만 재생성

  async function handleNodeExpand(nodeId: string, keyword: string) {
    if (expandedNodes.has(nodeId)) return

    // 현재 노드 찾기 (먼저 찾아야 함!)
    const currentNode = nodes.find(n => n.id === nodeId)
    if (!currentNode) {
      console.error('Node not found:', nodeId)
      return
    }

    setIsLoading(true)
    setLoadingNodeId(nodeId)
    setLoadingProgress(0)

    // 로딩 바 애니메이션
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) return prev
        return prev + 10
      })
    }, 200)

    // 노드를 로딩 상태로 변경
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, isLoading: true } }
          : node
      )
    )

    try {
      const response = await fetch('/api/expand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
      })

      if (!response.ok) throw new Error('Failed to expand')

      const data = await response.json()
      console.log('API Response:', data) // 디버깅용
      const childKeywords: string[] = data.keywords

      if (!childKeywords || childKeywords.length === 0) {
        throw new Error('No keywords returned')
      }

      // 자식 노드들 생성
      const newNodes: Node[] = []
      const newEdges: Edge[] = []
      const radius = 200
      const angleStep = (2 * Math.PI) / childKeywords.length

      childKeywords.forEach((childKeyword, index) => {
        const angle = angleStep * index
        const childId = `${nodeId}-${index}`

        const childNode: Node = {
          id: childId,
          type: 'custom',
          position: {
            x: currentNode.position.x + radius * Math.cos(angle),
            y: currentNode.position.y + radius * Math.sin(angle),
          },
          data: {
            label: childKeyword,
            keyword: childKeyword,
            onExpand: handleNodeExpand,
            onRegenerate: handleRegenerate,
            isExpanded: false,
            isLoading: false,
          },
        }

        const edge: Edge = {
          id: `e${nodeId}-${childId}`,
          source: nodeId,
          target: childId,
          animated: true,
          style: { stroke: '#9333ea', strokeWidth: 2 },
        }

        newNodes.push(childNode)
        newEdges.push(edge)
      })

      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, isExpanded: true, isLoading: false } }
            : node
        ).concat(newNodes)
      )
      setEdges((eds) => eds.concat(newEdges))
      setExpandedNodes((prev) => new Set([...prev, nodeId]))
      setLoadingProgress(100)
    } catch (error) {
      console.error('Error expanding node:', error)
      alert('노드 확장 중 오류가 발생했습니다. API 키를 확인해주세요.')
      // 로딩 상태 제거
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, isLoading: false } }
            : node
        )
      )
    } finally {
      clearInterval(progressInterval)
      setIsLoading(false)
      setLoadingNodeId(null)
      setTimeout(() => setLoadingProgress(0), 500)
    }
  }

  async function handleRegenerate(nodeId: string, keyword: string) {
    // 기존 자식 노드들 삭제
    const childNodeIds = nodes
      .filter(n => n.id.startsWith(`${nodeId}-`))
      .map(n => n.id)

    setNodes((nds) => nds.filter(n => !childNodeIds.includes(n.id)))
    setEdges((eds) => eds.filter(e => !childNodeIds.includes(e.target)))
    setExpandedNodes((prev) => {
      const newSet = new Set(prev)
      newSet.delete(nodeId)
      return newSet
    })

    // 노드를 미확장 상태로 변경
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, isExpanded: false } }
          : node
      )
    )

    // 다시 확장
    await handleNodeExpand(nodeId, keyword)
  }

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  return (
    <div className="w-full h-screen relative">
      {/* 로딩 바 */}
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 z-50">
          <div className="h-1 bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>AI가 아이디어를 생성하고 있습니다...</span>
            </div>
          </div>
        </div>
      )}

      {/* 통계 */}
      <div className="absolute top-4 left-4 z-10 bg-white px-4 py-2 rounded-lg shadow-md">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-purple-600">{nodes.length}</span> 개의 아이디어
        </p>
      </div>

      {/* 초기화 버튼 */}
      <button
        onClick={() => window.location.reload()}
        className="absolute top-4 right-4 z-10 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition-all text-sm font-medium"
      >
        🔄 처음부터
      </button>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            return node.data.isExpanded ? '#9333ea' : '#3b82f6'
          }}
          className="bg-white border-2 border-gray-200 rounded-lg"
        />
      </ReactFlow>
    </div>
  )
}
