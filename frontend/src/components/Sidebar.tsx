import {
  MessageSquare,
  FileText,
  Bot,
  MessageCircle,
  GripVertical,
  ChevronDown,
  Plus,
  LayoutTemplate,
  Square,
  Diamond,
  Circle,
} from "lucide-react";

export default function Sidebar({
  onLoadTemplate,
}: {
  onLoadTemplate?: (name: string) => void;
}) {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const aiComponents = [
    {
      type: "userQuery",
      label: "User Query",
      icon: <MessageSquare size={16} />,
    },
    { type: "llm", label: "LLM (Gemini)", icon: <Bot size={16} /> },
    {
      type: "knowledgeBase",
      label: "Knowledge Base",
      icon: <FileText size={16} />,
    },
    { type: "output", label: "Output", icon: <MessageCircle size={16} /> },
  ];

  const flowchartComponents = [
    { type: "process", label: "Process", icon: <Square size={16} /> },
    { type: "decision", label: "Decision", icon: <Diamond size={16} /> },
    { type: "startEnd", label: "Terminal", icon: <Circle size={16} /> },
  ];

  const templates = [
    {
      id: "todo",
      label: "TODO List Parser",
      description: "Extract tasks from text",
    },
    { id: "rag", label: "Document Q&A", description: "Knowledge base search" },
  ];

  const DraggableItem = ({ comp }: { comp: any }) => (
    <div
      className="flex items-center justify-between p-3 bg-white border border-gray-100 hover:border-blue-400 hover:shadow-sm rounded-xl cursor-grab transition-all group active:scale-95 shadow-sm"
      onDragStart={(event) => onDragStart(event, comp.type)}
      draggable
    >
      <div className="flex items-center gap-3">
        <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
          {comp.icon}
        </div>
        <span className="text-xs font-bold text-gray-700">{comp.label}</span>
      </div>
      <GripVertical
        size={14}
        className="text-gray-300 group-hover:text-gray-400"
      />
    </div>
  );

  return (
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col h-full z-40">
      {/* Search/Dropdown section */}
      <div className="p-4 border-b border-gray-50">
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
          Workspace
        </label>
        <div className="flex items-center justify-between p-2.5 border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-blue-400 transition-all shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center text-blue-600">
              <MessageSquare size={12} />
            </div>
            <span className="text-xs font-semibold text-gray-700">
              Chat With AI
            </span>
          </div>
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">
          AI Stack
        </h2>
        <div className="space-y-3 mb-8">
          {aiComponents.map((comp) => (
            <DraggableItem key={comp.type} comp={comp} />
          ))}
        </div>

        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">
          Flowchart
        </h2>
        <div className="space-y-3 mb-8">
          {flowchartComponents.map((comp) => (
            <DraggableItem key={comp.type} comp={comp} />
          ))}
        </div>

        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">
          Templates
        </h2>
        <div className="space-y-3">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => onLoadTemplate?.(template.id)}
              className="p-3 bg-gray-50/50 border border-transparent hover:border-blue-200 hover:bg-blue-50/30 rounded-xl cursor-pointer transition-all group shadow-sm"
            >
              <div className="flex items-center gap-3 mb-1">
                <LayoutTemplate size={14} className="text-blue-500" />
                <span className="text-xs font-bold text-gray-800">
                  {template.label}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium pl-7">
                {template.description}
              </p>
            </div>
          ))}
        </div>

        <button className="w-full mt-8 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-98 transition-all flex items-center justify-center gap-2">
          <Plus size={16} />
          Add New Component
        </button>
      </div>

      <div className="p-6 bg-gray-50/50 border-t border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold ring-4 ring-white shadow-sm">
            S
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800 tracking-tight">
              Siddhi Rathor
            </p>
            <p className="text-[10px] text-gray-400 font-medium">
              Engineer Mode
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
