
import { Handle, Position } from '@xyflow/react';
import { MessageSquare, Settings, Play } from 'lucide-react';

export const UserQueryNode = ({ data, isConnectable, selected }: any) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.shiftKey || e.ctrlKey)) {
            e.preventDefault();
            data.onRunWorkflow?.();
        }
    };

    return (
        <div className={`bg-white rounded-xl shadow-sm border transition-all w-[280px] overflow-hidden ${selected ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between p-3 bg-white border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-gray-600" />
                    <span className="text-xs font-bold text-gray-800">User Query</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => data.onRunWorkflow?.()}
                        className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-500 hover:text-white transition-all group"
                        title="Run Workflow (Shift+Enter)"
                    >
                        <Play size={12} fill="currentColor" />
                    </button>
                    <Settings size={14} className="text-gray-400 cursor-pointer" />
                </div>
            </div>
            <div className='p-4 space-y-3 bg-gray-50/30'>
                <div>
                    <p className="text-[10px] text-blue-500 font-semibold mb-1">Entry point for queries</p>
                    <label className="block text-[11px] font-medium text-gray-500 mb-1">User Query</label>
                    <textarea
                        placeholder="Write your query here. Press Shift+Enter to run."
                        className="w-full text-xs p-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 transition-all resize-none h-24 shadow-sm"
                        value={data.value || ''}
                        onChange={(evt) => data.onChange?.(evt.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            </div>

            <div className="relative h-8 bg-white border-t border-gray-50 flex items-center justify-end px-3">
                <span className="text-[10px] text-gray-400 font-bold mr-6">Query</span>
                <Handle
                    type="source"
                    position={Position.Right}
                    id="query"
                    isConnectable={isConnectable}
                    className="bg-orange-500! w-3! h-3! border-2! border-white! mr-0!"
                    style={{ right: '8px', top: '50%' }}
                />
            </div>
        </div>
    );
};
