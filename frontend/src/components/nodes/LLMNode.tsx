import { Handle, Position } from "@xyflow/react";
import { Bot, Settings, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export const LLMNode = ({ data, isConnectable, selected }: any) => {
  const [showKey, setShowKey] = useState(false);
  const [webSearch, setWebSearch] = useState(true);

  const providerNames: Record<string, string> = {
    openai: "OpenAI",
    gemini: "Gemini",
    claude: "Anthropic Claude",
  };

  const currentProvider = data.provider || "gemini";

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border transition-all w-[340px] overflow-hidden ${selected ? "border-purple-500 ring-1 ring-purple-500" : "border-gray-200"}`}
    >
      <div className="flex items-center justify-between p-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Bot size={16} className="text-gray-600" />
          <span className="text-xs font-bold text-gray-800">
            LLM ({providerNames[currentProvider] || "Engine"})
          </span>
        </div>
        <Settings size={14} className="text-gray-400 cursor-pointer" />
      </div>

      <div className="relative">
        {/* Input Handles with Labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-start pt-14 gap-16 pointer-events-none">
          <div className="flex items-center translate-x-[-6px]">
            <Handle
              type="target"
              position={Position.Left}
              id="query"
              isConnectable={isConnectable}
              className="!bg-purple-500 !w-3 !h-3 !border-2 !border-white !relative !translate-x-0 !shadow-sm"
            />
            <span className="text-[10px] text-gray-400 font-bold ml-2">
              Query
            </span>
          </div>
          <div className="flex items-center translate-x-[-6px] mt-2">
            <Handle
              type="target"
              position={Position.Left}
              id="context"
              isConnectable={isConnectable}
              className="!bg-purple-500 !w-3 !h-3 !border-2 !border-white !relative !translate-x-0 !shadow-sm"
            />
            <span className="text-[10px] text-gray-400 font-bold ml-2">
              Context
            </span>
          </div>
        </div>

        <div className="p-4 pl-16 space-y-4 bg-gray-50/30">
          <p className="text-[10px] text-blue-500 font-semibold uppercase tracking-tight">
            Run a query with {providerNames[currentProvider]} LLM
          </p>

          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1">
              Model Provider
            </label>
            <select
              className="w-full text-xs p-2 border border-gray-200 rounded-lg bg-white outline-none focus:border-purple-400 shadow-sm font-medium"
              value={currentProvider}
              onChange={(e) => data.onProviderChange?.(e.target.value)}
            >
              <option value="gemini">Gemini (1.5 Flash)</option>
              <option value="gemini">Google Gemini (1.5 Pro)</option>
              <option value="claude">Anthropic Claude (3.5 Sonnet)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1">
              {providerNames[currentProvider]} API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                placeholder={`Enter your ${providerNames[currentProvider]} API key`}
                className="w-full text-xs p-2 pr-8 border border-gray-200 rounded-lg bg-white outline-none focus:border-purple-400 shadow-sm"
                value={data.apiKey || ""}
                onChange={(e) => data.onChange?.(e.target.value, "apiKey")}
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1">
              Prompt
            </label>
            <textarea
              className="w-full text-xs p-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-purple-400 transition-all resize-none h-24 shadow-sm font-medium leading-relaxed"
              value={
                data.prompt ||
                "You are a helpful assistant. Use web search if the context lacks information... CONTEXT: {context} User Query: {query}"
              }
              onChange={(e) => data.onChange?.(e.target.value, "prompt")}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-[11px] font-medium text-gray-500 mb-1">
                Temperature
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={data.temperature || 0.7}
                onChange={(e) =>
                  data.onChange?.(parseFloat(e.target.value), "temperature")
                }
                className="w-full text-xs p-2 border border-gray-200 rounded-lg bg-white shadow-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-medium text-gray-500 mb-1 text-right">
                WebSearch Tool
              </label>
              <div className="flex justify-end pt-1">
                <div
                  className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${webSearch ? "bg-green-500" : "bg-gray-300"}`}
                  onClick={() => {
                    setWebSearch(!webSearch);
                    data.onChange?.(!webSearch, "webSearch");
                  }}
                >
                  <div
                    className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${webSearch ? "right-1" : "left-1"}`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative h-8 bg-white border-t border-gray-50 flex items-center justify-end px-3">
          <span className="text-[10px] text-gray-400 font-bold mr-6">
            Response
          </span>
          <Handle
            type="source"
            position={Position.Right}
            id="response"
            isConnectable={isConnectable}
            className="!bg-purple-500 !w-3 !h-3 !border-2 !border-white"
            style={{ right: "8px", top: "50%" }}
          />
        </div>
      </div>
    </div>
  );
};
