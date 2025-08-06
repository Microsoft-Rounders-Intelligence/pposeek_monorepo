from langchain.text_splitter import CharacterTextSplitter
from resumeHelper.config.settings import settings
from resumeHelper.logger.logger import setup_file_logger
setup_file_logger()
import logging
logger = logging.getLogger(__name__)

def split_documents(pages, chunk_overlap=50):
    logger.info(f"split_documents 호출: chunk_size={settings.EMBEDDING_CHUNK_SIZE}, chunk_overlap={chunk_overlap}")
    if chunk_overlap >= settings.EMBEDDING_CHUNK_SIZE:
        raise ValueError(f"chunk_overlap({chunk_overlap}) must be smaller than chunk_size({settings.EMBEDDING_CHUNK_SIZE})")
    
    splitter = CharacterTextSplitter(chunk_size=settings.EMBEDDING_CHUNK_SIZE, chunk_overlap=chunk_overlap)
    return splitter.split_documents(pages)
