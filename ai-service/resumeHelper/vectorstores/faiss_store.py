import os
from langchain.vectorstores.faiss import FAISS

def save_vectorstore_for_user(user_id: str, chunks, embedder):
    vs = FAISS.from_documents(chunks, embedder)
    user_dir = f"ai-service/resumeHelper/vectorstores/db/{user_id}"
    os.makedirs(user_dir, exist_ok=True)
    vs.save_local(user_dir)

def create_vectorstore(chunks, embedder):
    """ Create a FAISS vector store from document chunks."""
    vs = FAISS.from_documents(chunks, embedder)
    return vs 

def load_vectorstore_for_user(user_id: str, embedder):
    user_dir = f"ai-service/resumeHelper/vectorstores/db/{user_id}"
    if not os.path.exists(user_dir):
        return None
    return FAISS.load_local(user_dir, embedder, allow_dangerous_deserialization=True)