RAG Implementation plan

Stage 1: Indexing
1. Load the document - pdf, excel, text
2. Chunk the document
3. Generate vector embeddings via embedding models
4. Store them in vector database
5. vector db automatically does indexing

Stage2: Using the chatbot
1. Setup LLM
2. Add retrieval step
3. Get vector embedding of the query, retrieve relevant info from db.
4. Pass input + relevant information to the llm
5. LLM generates final output