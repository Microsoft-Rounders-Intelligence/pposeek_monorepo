from langchain.chat_models import AzureChatOpenAI
from resumeHelper.config.settings import settings
from resumeHelper.logger.logger import setup_file_logger
setup_file_logger()
import logging

logger = logging.getLogger(__name__)
def load_llm():
    logger.info("🔄 llm_04mini 로드 중...")
    return AzureChatOpenAI(
        deployment_name=settings.LLM_DEPLOYMENT,
        openai_api_key=settings.LLM_API_KEY,
        api_version=settings.LLM_API_VERSION,
        azure_endpoint=settings.LLM_ENDPOINT,
        temperature=settings.LLM_TEMPERATURE
    )