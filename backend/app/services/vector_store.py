
import chromadb
from chromadb.config import Settings
import os
import uuid

class VectorStore:
    def __init__(self):
        chroma_host = os.getenv("CHROMA_HOST", "chroma")
        chroma_port = os.getenv("CHROMA_PORT", "8000")
        
        # Connect to ChromaDB container or run locally if configured differently
        # For simplicity in docker-compose, we use http client
        try:
             self.client = chromadb.HttpClient(host=chroma_host, port=int(chroma_port))
        except:
             # Fallback for local dev without docker container running immediately
             self.client = chromadb.Client()

        self.collection = self.client.get_or_create_collection(name="knowledge_base")

    def add_documents(self, documents: list[str], metadatas: list[dict] = None):
        ids = [str(uuid.uuid4()) for _ in documents]
        if metadatas is None:
            metadatas = [{"source": "upload"} for _ in documents]
        
        self.collection.add(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        return ids

    def query_similar(self, query_text: str, n_results: int = 3) -> list[str]:
        results = self.collection.query(
            query_texts=[query_text],
            n_results=n_results
        )
        return results['documents'][0] if results['documents'] else []

vector_store = VectorStore()
