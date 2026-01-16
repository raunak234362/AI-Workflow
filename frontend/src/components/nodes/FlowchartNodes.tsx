
import { Handle, Position } from '@xyflow/react';

export const ProcessNode = ({ data, selected }: any) => (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${selected ? 'border-blue-500' : 'border-gray-300'}`}>
        <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-400" />
        <div className="text-xs font-bold text-gray-700">{data.label || 'Process'}</div>
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-gray-400" />
    </div>
);

export const DecisionNode = ({ data, selected }: any) => (
    <div className={`w-24 h-24 flex items-center justify-center relative ${selected ? 'text-blue-500' : 'text-gray-700'}`}>
        <div className={`absolute inset-0 border-2 rotate-45 bg-white ${selected ? 'border-blue-500' : 'border-gray-300'}`} />
        <Handle type="target" position={Position.Top} className="z-10 w-3 h-3 bg-gray-400" style={{ top: '-8px' }} />
        <span className="z-10 text-[10px] font-bold text-center px-2">{data.label || 'Decision?'}</span>
        <Handle type="source" position={Position.Bottom} id="yes" className="z-10 w-3 h-3 bg-gray-400" style={{ bottom: '-8px' }} />
        <Handle type="source" position={Position.Right} id="no" className="z-10 w-3 h-3 bg-gray-400" style={{ right: '-8px' }} />
    </div>
);

export const StartEndNode = ({ data, selected }: any) => (
    <div className={`px-6 py-2 shadow-md rounded-full bg-white border-2 ${selected ? 'border-green-500' : 'border-gray-300'}`}>
        <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-400" />
        <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">{data.label || 'Start/End'}</div>
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-gray-400" />
    </div>
);
