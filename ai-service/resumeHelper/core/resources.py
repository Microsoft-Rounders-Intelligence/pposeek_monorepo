# resume_helper/core/resources.py
from resumeHelper.embeddings.text_embedding_3_large_2 import get_embedder
from resumeHelper.models.llm_04mini_model import load_llm
from resumeHelper.logger.logger import setup_file_logger
setup_file_logger()
import logging

logger = logging.getLogger(__name__)

class ResourceManager:
    _llm = None
    _embedder = None

    @classmethod
    def get_llm(cls):
        if cls._llm is None:
            logger.info("🤖 LLM 모델 로딩 중...")
            cls._llm = load_llm()
            logger.info("✅ LLM 모델 로딩 완료")
        return cls._llm

    @classmethod
    def get_embedder(cls):
        if cls._embedder is None:
            logger.info("🔍 임베딩 모델 로딩 중...")
            cls._embedder = get_embedder()
            logger.info("✅ 임베딩 모델 로드 완료")
        return cls._embedder
