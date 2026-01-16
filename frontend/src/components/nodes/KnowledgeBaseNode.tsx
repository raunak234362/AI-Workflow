import { Handle, Position } from "@xyflow/react";
import { FileText, Settings, Upload, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { uploadDocument } from "../../api";

export const KnowledgeBaseNode = ({
  data: _data,
  isConnectable,
  selected,
}: any) => {
  const [uploading, setUploading] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    try {
      await uploadDocument(e.target.files[0]);
      alert("File uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border transition-all w-[300px] overflow-hidden ${selected ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-200"}`}
    >
      <div className="flex items-center justify-between p-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-gray-600" />
          <span className="text-xs font-bold text-gray-800">
            Knowledge Base
          </span>
        </div>
        <Settings size={14} className="text-gray-400 cursor-pointer" />
      </div>

      <div className="p-4 space-y-4 bg-gray-50/30">
        <p className="text-[10px] text-blue-500 font-semibold">
          Let LLM search info in your file
        </p>

        <div>
          <label className="block text-[11px] font-medium text-gray-500 mb-1">
            File for Knowledge Base
          </label>
          <label className="flex items-center justify-center gap-2 w-full p-4 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-white hover:border-gray-400 transition-all bg-white shadow-sm">
            <Upload size={14} className="text-gray-400" />
            <span className="text-[11px] text-gray-600 font-medium">
              {uploading ? "Uploading..." : "Upload File"}
            </span>
            <input
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-gray-500 mb-1">
            Embedding Model
          </label>
          <select className="w-full text-xs p-2 border border-gray-200 rounded-lg bg-white outline-none focus:border-blue-400 shadow-sm font-medium">
            <option>text-embedding-3-large</option>
            <option>text-embedding-3-small</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-gray-500 mb-1">
            API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              placeholder="Enter your API key"
              className="w-full text-xs p-2 pr-8 border border-gray-200 rounded-lg bg-white outline-none focus:border-blue-400 shadow-sm"
              defaultValue="************************"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>
      </div>

      <div className="relative h-8 bg-white border-t border-gray-50 flex items-center justify-end px-3">
        <span className="text-[10px] text-gray-400 font-bold mr-6">
          Context
        </span>
        <Handle
          type="source"
          position={Position.Right}
          id="context"
          isConnectable={isConnectable}
          className="!bg-orange-500 !w-3 !h-3 !border-2 !border-white"
          style={{ right: "8px", top: "50%" }}
        />
      </div>
    </div>
  );
};
