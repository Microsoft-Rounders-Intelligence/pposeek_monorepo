# resume_helper/loaders/pdf_loader.py
from langchain.document_loaders import PyPDFLoader
from resumeHelper.logger.logger import setup_file_logger
setup_file_logger()
import logging

logger = logging.getLogger(__name__)

def load_pdf(file_path: str):
    logger.info(f"📄 PDF 로딩 시작: {file_path}")
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    logger.info(f"✅ PDF 로드 완료 - {len(documents)} 페이지")
    return documents
