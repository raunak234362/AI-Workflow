import { useCallback, useRef, useState, useEffect } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  MarkerType,
  ConnectionMode,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Sidebar from "./components/Sidebar";
import { UserQueryNode } from "./components/nodes/UserQueryNode";
import { KnowledgeBaseNode } from "./components/nodes/KnowledgeBaseNode";
import { LLMNode } from "./components/nodes/LLMNode";
import { OutputNode } from "./components/nodes/OutputNode";
import {
  ProcessNode,
  DecisionNode,
  StartEndNode,
} from "./components/nodes/FlowchartNodes";
import { Play, Save, Share2, Bell, Sparkles } from "lucide-react";
import { executeWorkflow } from "./api";
import { TODO_LIST_WORKFLOW, RAG_WORKFLOW } from "./presets";

const nodeTypes = {
  userQuery: UserQueryNode,
  knowledgeBase: KnowledgeBaseNode,
  llm: LLMNode,
  output: OutputNode,
  process: ProcessNode,
  decision: DecisionNode,
  startEnd: StartEndNode,
};

type NodeData = {
  label?: string;
  value?: string;
  output?: string;
  provider?: string;
  apiKey?: string;
  prompt?: string;
  temperature?: number;
  webSearch?: boolean;
  onChange?: (val: any, key?: string) => void;
  onProviderChange?: (val: string) => void;
  [key: string]: any;
};

const initialNodes: Node<NodeData>[] = [
  {
    id: "1",
    type: "userQuery",
    position: { x: 340, y: 160 },
    data: { value: "" },
  },
];

let id = 1;
const getId = () => `node_${id++}_${Math.random().toString(36).substr(2, 4)}`;

function Flow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [magicPrompt, setMagicPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const nodesRef = useRef(nodes);
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  const onNodeDataChange = useCallback(
    (id: string, key: string, value: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id !== id) return node;
          return {
            ...node,
            data: {
              ...node.data,
              [key]: value,
            },
          };
        }),
      );
    },
    [setNodes],
  );

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "smoothstep",
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
            style: { stroke: "#94a3b8", strokeWidth: 2 },
          },
          eds,
        ),
      ),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node<NodeData> = {
        id: getId(),
        type,
        position,
        data: {
          value: "",
          provider: "gemini",
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  const runWorkflow = useCallback(async () => {
    setIsRunning(true);
    try {
      const currentNodes = nodesRef.current;
      const queryNode = currentNodes.find((n) => n.type === "userQuery");
      if (!queryNode || !queryNode.data.value) {
        alert("Please enter a User Query first.");
        setIsRunning(false);
        return;
      }

      const llmNode = currentNodes.find((n) => n.type === "llm");
      const provider = llmNode?.data.provider || "gemini";

      const result = await executeWorkflow(
        queryNode.data.value as string,
        provider as string,
      );

      setNodes((nds) =>
        nds.map((node) => {
          if (node.type === "output") {
            return {
              ...node,
              data: {
                ...node.data,
                output: result.response,
              },
            };
          }
          return node;
        }),
      );
    } catch (error) {
      console.error(error);
      alert("Workflow execution failed.");
    } finally {
      setIsRunning(false);
    }
  }, [setNodes]);

  const handleLoadTemplate = useCallback(
    (templateId: string) => {
      let template: any = null;
      if (templateId === "todo") template = TODO_LIST_WORKFLOW;
      if (templateId === "rag") template = RAG_WORKFLOW;

      if (template) {
        // Inject callbacks into preset data
        const nodesWithCallbacks = template.nodes.map((n: any) => ({
          ...n,
          data: {
            ...n.data,
            onChange: (val: any, key: string = "value") =>
              onNodeDataChange(n.id, key, val),
            onProviderChange: (val: string) =>
              onNodeDataChange(n.id, "provider", val),
            onRunWorkflow: runWorkflow,
          },
        }));
        setNodes(nodesWithCallbacks as any);
        setEdges(template.edges as any);

        // Auto-fit view after a short delay
        setTimeout(() => {
          reactFlowInstance?.fitView({ duration: 800 });
        }, 100);
      }
    },
    [onNodeDataChange, reactFlowInstance, setEdges, setNodes],
  );

  const handleMagicGenerate = async () => {
    if (!magicPrompt) return;
    setIsGenerating(true);
    // Simulate AI thinking and generating a workflow
    setTimeout(() => {
      if (magicPrompt.toLowerCase().includes("todo")) {
        handleLoadTemplate("todo");
      }
      setMagicPrompt("");
      setIsGenerating(false);
    }, 1500);
  };

  useEffect(() => {
    setNodes((nds) => {
      const needsUpdate = nds.some(
        (n) =>
          !n.data.onChange || !n.data.onProviderChange || !n.data.onRunWorkflow,
      );
      if (!needsUpdate) return nds;

      return nds.map((n) => {
        if (n.data.onChange && n.data.onProviderChange && n.data.onRunWorkflow)
          return n;
        return {
          ...n,
          data: {
            ...n.data,
            onChange: (val: any, key: string = "value") =>
              onNodeDataChange(n.id, key, val),
            onProviderChange: (val: string) =>
              onNodeDataChange(n.id, "provider", val),
            onRunWorkflow: runWorkflow,
          },
        };
      });
    });
  }, [onNodeDataChange, setNodes, runWorkflow]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Figma Inspired Header */}
      <header className="h-14 bg-white border-b border-gray-100 flex justify-between items-center px-6 z-50 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-sm">
              <Share2 size={18} strokeWidth={2.5} className="rotate-90" />
            </div>
            <span className="text-sm font-bold text-gray-800 tracking-tight">
              GenAI Stack
            </span>
          </div>
          <div className="h-6 w-px bg-gray-100 mx-2"></div>
          <div className="flex items-center gap-3 bg-indigo-50/50 border border-indigo-100 rounded-xl px-3 py-1.5 focus-within:border-indigo-300 focus-within:bg-white transition-all shadow-sm group">
            <Sparkles
              size={14}
              className={`text-indigo-500 ${isGenerating ? "animate-pulse" : ""}`}
            />
            <input
              type="text"
              placeholder="Generate with AI..."
              className="bg-transparent text-xs font-semibold text-gray-700 outline-none w-48 placeholder:text-indigo-300"
              value={magicPrompt}
              onChange={(e) => setMagicPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleMagicGenerate()}
            />
            <button
              onClick={handleMagicGenerate}
              className="text-[10px] font-bold text-indigo-500 bg-white border border-indigo-200 px-1.5 py-0.5 rounded shadow-sm hover:bg-indigo-500 hover:text-white transition-all"
            >
              Generate
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 mr-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell size={18} />
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-50 transition-all active:scale-95">
            <Save size={16} />
            Save Workflow
          </button>
          <button
            onClick={runWorkflow}
            disabled={isRunning}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold shadow-lg shadow-emerald-100 transition-all active:scale-95 ${
              isRunning
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-emerald-500 text-white hover:bg-emerald-600"
            }`}
          >
            {isRunning ? (
              <div className="w-4 h-4 border-2 border-emerald-200 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Play size={14} fill="white" />
            )}
            {isRunning ? "Executing..." : "Run Stack"}
          </button>
        </div>
      </header>

      {/* Main Interface */}
      <div className="flex flex-1 overflow-hidden relative">
        <ReactFlowProvider>
          <Sidebar onLoadTemplate={handleLoadTemplate} />
          <main className="flex-1 relative bg-[#F9F9F9]" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              connectionMode={ConnectionMode.Loose}
              fitView
            >
              <Background
                color="#E2E8F0"
                gap={20}
                size={1}
                variant={BackgroundVariant.Dots}
              />
              <Controls className="bg-white! border-gray-100! shadow-xl! rounded-2xl!" />
              <MiniMap
                className="bg-white! border-gray-100! shadow-xl! rounded-2xl!"
                nodeStrokeWidth={3}
              />
            </ReactFlow>
          </main>
        </ReactFlowProvider>
      </div>
    </div>
  );
}

export default Flow;
