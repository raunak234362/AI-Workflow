import { MarkerType } from "@xyflow/react";

export const TODO_LIST_WORKFLOW = {
  nodes: [
    {
      id: "node_1",
      type: "userQuery",
      position: { x: 100, y: 150 },
      data: {
        value: "Remind me to buy groceries tomorrow at 10 AM",
        label: "Task Input",
      },
    },
    {
      id: "node_2",
      type: "llm",
      position: { x: 500, y: 100 },
      data: {
        provider: "gemini",
        prompt:
          "You are a task extractor. Extract the task description and the deadline from the user query. Output in JSON format.\n\nQuery: {query}\n\nResponse:",
        temperature: 0.5,
      },
    },
    {
      id: "node_3",
      type: "output",
      position: { x: 950, y: 200 },
      data: {
        label: "Processed Task",
      },
    },
  ],
  edges: [
    {
      id: "e1-2",
      source: "node_1",
      target: "node_2",
      targetHandle: "query",
      sourceHandle: "query",
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
      style: { stroke: "#94a3b8", strokeWidth: 2 },
    },
    {
      id: "e2-3",
      source: "node_2",
      target: "node_3",
      sourceHandle: "response",
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
      style: { stroke: "#94a3b8", strokeWidth: 2 },
    },
  ],
};

export const RAG_WORKFLOW = {
  nodes: [
    {
      id: "node_1",
      type: "userQuery",
      position: { x: 50, y: 200 },
      data: { value: "What is the company policy on remote work?" },
    },
    {
      id: "node_2",
      type: "knowledgeBase",
      position: { x: 400, y: 100 },
      data: { label: "Employee Handbook PDF" },
    },
    {
      id: "node_3",
      type: "llm",
      position: { x: 750, y: 150 },
      data: {
        provider: "gemini",
        prompt:
          "Use the following context to answer the user query.\n\nContext: {context}\n\nQuery: {query}",
      },
    },
    {
      id: "node_4",
      type: "output",
      position: { x: 1150, y: 200 },
      data: { label: "Answer" },
    },
  ],
  edges: [
    {
      id: "e1-3",
      source: "node_1",
      target: "node_3",
      targetHandle: "query",
      sourceHandle: "query",
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
      style: { stroke: "#94a3b8", strokeWidth: 2 },
    },
    {
      id: "e2-3",
      source: "node_2",
      target: "node_3",
      targetHandle: "context",
      sourceHandle: "output",
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
      style: { stroke: "#94a3b8", strokeWidth: 2 },
    },
    {
      id: "e3-4",
      source: "node_3",
      target: "node_4",
      sourceHandle: "response",
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
      style: { stroke: "#94a3b8", strokeWidth: 2 },
    },
  ],
};
