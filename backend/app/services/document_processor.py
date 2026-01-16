
import fitz  # PyMuPDF
import io

class DocumentProcessor:
    def process_pdf(self, file_content: bytes) -> str:
        """Extract text from PDF bytes."""
        doc = fitz.open(stream=file_content, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        return text

    def chunk_text(self, text: str, chunk_size: int = 1000) -> list[str]:
        """Simple chunking utility."""
        return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]

document_processor = DocumentProcessor()
