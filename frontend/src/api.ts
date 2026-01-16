import axios from "axios";

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "") + "/api",
});

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const executeWorkflow = async (query: string, provider: string) => {
  const response = await api.post("/execute", { query, provider });
  return response.data;
};

export const saveWorkflow = async (name: string, data: any) => {
  const response = await api.post("/workflows", { name, data });
  return response.data;
};

export const getWorkflows = async () => {
  const response = await api.get("/workflows");
  return response.data;
};
