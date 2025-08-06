# resume_helper/services/classification.py
import json
import os
from sklearn.metrics.pairwise import cosine_similarity
from resumeHelper.logger.logger import setup_file_logger
setup_file_logger()
import logging

logger = logging.getLogger(__name__)

def classify_text(text: str, embedder) -> str:
    logger.info("🔍 classify_text 호출")
    load_path = os.path.join(os.path.dirname(__file__), "../autotextrecognition/resources/llm_features.json")
    with open(load_path, "r", encoding="utf-8") as f:
        features = json.load(f)

    feature_everyday = features["everyday"]
    feature_work = features["work"]
    vec_text = embedder.embed_query(text)
    vec_everyday = embedder.embed_query(feature_everyday)
    vec_work = embedder.embed_query(feature_work)

    sim_everyday = cosine_similarity([vec_text], [vec_everyday])[0][0]
    sim_work = cosine_similarity([vec_text], [vec_work])[0][0]

    return "업무" if sim_work > sim_everyday else "일상"
