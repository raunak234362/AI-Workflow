
import { Handle, Position } from '@xyflow/react';
import { MessageCircle, Settings } from 'lucide-react';

export const OutputNode = ({ data, isConnectable, selected }: any) => {
    return (
        <div className={`bg-white rounded-xl shadow-sm border transition-all w-[300px] overflow-hidden ${selected ? 'border-purple-500 ring-1 ring-purple-500' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between p-3 bg-white border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <MessageCircle size={16} className="text-gray-600" />
                    <span className="text-xs font-bold text-gray-800">Output</span>
                </div>
                <Settings size={14} className="text-gray-400 cursor-pointer" />
            </div>

            <div className="relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1.5 pointer-events-none">
                    <Handle
                        type="target"
                        position={Position.Left}
                        isConnectable={isConnectable}
                        className="!bg-purple-500 !w-3 !h-3 !border-2 !border-white"
                    />
                </div>

                <div className="p-4 space-y-3 bg-gray-50/30">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-tight">Output of the result nodes as text</p>

                    <div>
                        <label className="block text-[11px] font-medium text-gray-500 mb-1">Output Text</label>
                        <div className="w-full text-[10px] p-3 border border-gray-200 rounded-lg bg-white min-h-[140px] text-gray-500 font-medium leading-relaxed shadow-inner overflow-y-auto">
                            {data.output || "Output will be generated based on the query"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
