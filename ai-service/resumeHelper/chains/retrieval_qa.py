from langchain.chains import RetrievalQA
from resumeHelper.logger.logger import setup_file_logger
setup_file_logger()
import logging

logger = logging.getLogger(__name__)

def create_qa_chain(llm, vectorstore):
    """
    LLM과 벡터 스토어를 받아서 RAG 기반 QA 체인을 생성합니다.
    """
    # 벡터 스토어에서 문서 검색을 담당하는 retriever 객체 생성
    logger.info("🔍 벡터 스토어에서 retriever 생성 중...")
    retriever = vectorstore.as_retriever(search_kwargs={"k": 5})  # k=5개 문서 검색
    logger.info ("🔍 벡터 스토어에서 retriever 생성 완료")
    return RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        chain_type="stuff"
    )
