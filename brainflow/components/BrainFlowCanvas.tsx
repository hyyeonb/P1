'use client'

import { useCallback, useState, useEffect, useRef } from 'react'
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

  // useRef로 최신 nodes를 항상 참조
  const nodesRef = useRef(nodes)
  useEffect(() => {
    nodesRef.current = nodes
  }, [nodes])

  // 노드 확장 함수 (useCallback으로 안정화)
  const handleNodeExpand = useCallback(async (nodeId: string, keyword: string) => {
    console.log('🔍 handleNodeExpand 호출:', { nodeId, keyword, nodesCount: nodesRef.current.length })

    // 이미 확장된 노드는 무시
    setExpandedNodes(prev => {
      if (prev.has(nodeId)) {
        console.log('⚠️ 이미 확장된 노드:', nodeId)
        return prev
      }
      return prev
    })

    // 현재 노드 찾기 (ref 사용으로 항상 최신 값)
    const currentNode = nodesRef.current.find(n => n.id === nodeId)
    if (!currentNode) {
      console.error('❌ 노드를 찾을 수 없습니다:', nodeId, 'Available nodes:', nodesRef.current.map(n => n.id))
      return
    }

    console.log('✅ 노드 찾음:', currentNode)

    setIsLoading(true)
    setLoadingProgress(0)

    // 로딩 바 애니메이션
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => Math.min(prev + 10, 90))
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
      console.log('🌐 API 호출 중...')
      const response = await fetch('/api/expand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('📦 API 응답:', data)

      const childKeywords: string[] = data.keywords

      if (!childKeywords || childKeywords.length === 0) {
        throw new Error('키워드가 없습니다')
      }

      // 자식 노드들 생성
      const newNodes: Node[] = []
      const newEdges: Edge[] = []
      const radius = 250
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

      console.log('✨ 새 노드 생성:', newNodes.length)

      // 상태 업데이트
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

      console.log('🎉 노드 확장 완료!')
    } catch (error: any) {
      console.error('❌ 에러 발생:', error)
      alert(`노드 확장 중 오류: ${error.message}`)

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
      setTimeout(() => setLoadingProgress(0), 500)
    }
  }, [setNodes, setEdges, setExpandedNodes])

  // 재생성 함수
  const handleRegenerate = useCallback(async (nodeId: string, keyword: string) => {
    console.log('🔄 재생성:', nodeId)

    // 자식 노드들 삭제
    setNodes((nds) => nds.filter(n => !n.id.startsWith(`${nodeId}-`) || n.id === nodeId))
    setEdges((eds) => eds.filter(e => !e.source.startsWith(`${nodeId}-`) && !e.target.startsWith(`${nodeId}-`)))
    setExpandedNodes((prev) => {
      const newSet = new Set(prev)
      newSet.delete(nodeId)
      return newSet
    })

    // 노드를 미확장 상태로
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, isExpanded: false } }
          : node
      )
    )

    // 잠시 대기 후 다시 확장
    setTimeout(() => {
      handleNodeExpand(nodeId, keyword)
    }, 100)
  }, [setNodes, setEdges, setExpandedNodes, handleNodeExpand])

  // 노드 클릭 핸들러
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('🖱️ 노드 클릭:', node.id, node.data)

    if (node.data.isExpanded) {
      // 이미 확장된 노드 - 재생성
      if (node.data.keyword) {
        handleRegenerate(node.id, node.data.keyword)
      }
    } else {
      // 미확장 노드 - 확장
      if (node.data.keyword) {
        handleNodeExpand(node.id, node.data.keyword)
      }
    }
  }, [handleNodeExpand, handleRegenerate])

  // 초기 노드 생성
  useEffect(() => {
    console.log('🎬 초기 노드 생성:', initialKeyword)

    const initialNode: Node = {
      id: '0',
      type: 'custom',
      position: {
        x: (typeof window !== 'undefined' ? window.innerWidth / 2 : 500) - 72,
        y: 100
      },
      data: {
        label: initialKeyword,
        keyword: initialKeyword,
        isExpanded: false,
        isLoading: false,
      },
    }

    setNodes([initialNode])
    console.log('✅ 초기 노드 설정 완료')
  }, [initialKeyword, setNodes])

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
        onNodeClick={onNodeClick}
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
