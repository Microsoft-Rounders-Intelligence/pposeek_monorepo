from langchain.embeddings import AzureOpenAIEmbeddings
from resumeHelper.config.settings import settings
from resumeHelper.logger.logger import setup_file_logger
setup_file_logger()
import logging

logger = logging.getLogger(__name__)
def get_embedder():
    logger.info(" 🔍 text_large_embedder 로딩 ")
    return AzureOpenAIEmbeddings(
            azure_deployment=settings.EMBEDDING_DEPLOYMENT,
            openai_api_key=settings.EMBEDDING_API_KEY,
            openai_api_version=settings.EMBEDDING_API_VERSION,
            azure_endpoint=settings.EMBEDDING_ENDPOINT,
            chunk_size=settings.EMBEDDING_CHUNK_SIZE,
        )