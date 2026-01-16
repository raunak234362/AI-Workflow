
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.services.document_processor import document_processor
from app.services.vector_store import vector_store
from app.services.llm_orchestrator import llm_orchestrator
from app.models import get_db, Workflow
import json

router = APIRouter()

class QueryRequest(BaseModel):
    query: str
    provider: str = "gemini"
    use_knowledge_base: bool = True

class WorkflowCreate(BaseModel):
    name: str
    data: dict

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")
    
    content = await file.read()
    text = document_processor.process_pdf(content)
    chunks = document_processor.chunk_text(text)
    
    vector_store.add_documents(chunks, metadatas=[{"filename": file.filename} for _ in chunks])
    
    return {"message": "Processing successful", "chunks": len(chunks)}

@router.post("/execute")
async def execute_workflow(request: QueryRequest):
    context = ""
    if request.use_knowledge_base:
        docs = vector_store.query_similar(request.query)
        context = "\n".join(docs)
    
    response = llm_orchestrator.execute_query(request.query, context, request.provider)
    return {"response": response, "context_used": context}

@router.post("/workflows")
def save_workflow(workflow: WorkflowCreate, db: Session = Depends(get_db)):
    db_workflow = Workflow(name=workflow.name, data=workflow.data)
    db.add(db_workflow)
    db.commit()
    db.refresh(db_workflow)
    return db_workflow

@router.get("/workflows")
def get_workflows(db: Session = Depends(get_db)):
    return db.query(Workflow).all()
