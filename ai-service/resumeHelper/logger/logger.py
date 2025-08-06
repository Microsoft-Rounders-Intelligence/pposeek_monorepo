import logging
import os

def setup_file_logger(log_file="logs/app.log", level=logging.INFO):
    # logs 폴더가 없으면 생성
    os.makedirs(os.path.dirname(log_file), exist_ok=True)

    logger = logging.getLogger()
    logger.setLevel(level)

    # 기존 핸들러 제거 (중복 방지)
    if logger.hasHandlers():
        logger.handlers.clear()

    formatter = logging.Formatter("[%(asctime)s] %(levelname)s - %(name)s - %(message)s")

    # 파일 핸들러만 등록
    file_handler = logging.FileHandler(log_file, encoding="utf-8")
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)
