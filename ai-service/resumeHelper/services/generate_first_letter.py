from langchain.tools.tavily_search import TavilySearchResults
#========= 추후 최상위 폴더에서 실행 시 경로 삭제==================
import os
import sys
project_root = os.path.abspath(os.path.join(os.getcwd(), ""))
print('root: ',project_root)
if project_root not in sys.path:
    sys.path.append(project_root)
from resumeHelper.config.settings import settings
from dotenv import load_dotenv
#========================================================
from resumeHelper.prompts.prompts import (
    SUMMARIZE_COMPANY_PROMPT, GENERATE_COVER_LETTER_PROMPT,SUMMARIZE_RESUME_PROMPT,
    ASK_MORE_DETAILS_PROMPT)
from resumeHelper.prompts.token_counter import count_tokens
from resumeHelper.loaders.pdf_loader import load_pdf
from resumeHelper.processors.text_splitter import split_documents
from resumeHelper.core.resources import ResourceManager

# 이것도 추후에 빠질거임. 최상위 계층에서 실행되면
def load_env_settings():
    dotenv_path = '.env'
    print(f"Loading .env from: {dotenv_path}")
    load_dotenv(dotenv_path)

    print("EMBEDDING_CHUNK_SIZE =", os.getenv("EMBEDDING_CHUNK_SIZE"))
    print("LLM_TEMPERATURE =", os.getenv("LLM_TEMPERATURE"))
    print("TAVILY_API_KEY =", os.getenv("TAVILY_API_KEY"))
    return settings

# pdf 로드
def load_resume_pdf(file_path: str):
    loader = load_pdf(file_path)
    pages = loader.load()
    docs = split_documents(pages)
    return docs

# 이력서 요약
def summarize_resume(llm, docs):
    print('자소서 요약중')
    print("============================")
    prompt = SUMMARIZE_RESUME_PROMPT.format(docs=docs)
    response = llm.invoke(prompt)
    print('자소서 요약본 : ', response.content)
    print('token count:', count_tokens(prompt))
    print("============================")
    return response.content


# 타빌리에서 회사 정보 관련된 상위 3개 추출
def search_company_info(company_name: str):
    print('TAVILY 웹에서 해당 기업 정보 추출중 ')
    print("============================")
    search = TavilySearchResults()
    results = search.run(company_name)

    if not results:
        return "웹에서 검색된 정보가 없습니다."

    top_results = "\n\n".join([f"- {r['title']}\n{r['content']}" for r in results[:3]])
    print(top_results)
    print("============================")
    return f"다음은 최근 웹 검색 결과입니다:\n\n{top_results}"

# 해당 정보들 바탕으로 회사 비전, 인재상, 최근 동향 추출하는 llm
def summarize_company_info(llm, company_raw_text: str):
    print('회사 인재상, 비전 및 최근 동향')
    print("============================")
    prompt = SUMMARIZE_COMPANY_PROMPT.format(company_raw_text=company_raw_text)
    print('PROMPT: ',prompt)
    response = llm.invoke(prompt)
    print(response.content)
    print('token count:', count_tokens(prompt))
    print("============================")
    return response.content

# 1차 자소서 생성
def generate_cover_letter(llm, company_info_summary, resume_summary):
    print('1차 자소서 생성중')
    print("============================")
    prompt = GENERATE_COVER_LETTER_PROMPT.format(
        company_info_summary=company_info_summary,
        resume_summary=resume_summary
    )
    response = llm.invoke(prompt)
    print(response.content)
    print('token count:', count_tokens(prompt))
    print("============================")
    return response.content

# HITL 한번 물어볼 내용 생성
def ask_for_more_details(llm, cover_letter, user_basic_info, company_info):
    print('휴먼인더 루프 질문 생성 중')
    print("============================")
    prompt = ASK_MORE_DETAILS_PROMPT.format(
        cover_letter=cover_letter,
        user_basic_info=user_basic_info,
        company_info=company_info
    )
    response = llm.invoke(prompt)
    print(response.content)
    print('token count:', count_tokens(prompt))
    print("============================")
    return response.content

# 테스트용 코드
if __name__ == "__main__":
    load_env_settings()
    llm = ResourceManager.get_llm()
    pdf_path = "resumeHelper/test/data/sample.pdf"
    resume = load_pdf(pdf_path)
    resume_summary = summarize_resume(llm,resume)
    company_search_info = search_company_info('마크 클라우드')
    company_info_summary = summarize_company_info(llm,company_search_info)
    first_generate_cover_letter = generate_cover_letter(llm,company_info_summary,resume_summary)
    hitl_questions = ask_for_more_details(llm,first_generate_cover_letter,resume_summary,company_info_summary)
    print('수현이가 짠 UI 좌측에 들어갈 1차 자소서 내용 : ', first_generate_cover_letter)
    print('우측에 AI가 만들어낸 구체적 경험에 대한 내용 : ',hitl_questions)