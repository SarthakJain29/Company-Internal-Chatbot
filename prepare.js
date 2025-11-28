import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OllamaEmbeddings } from "@langchain/ollama";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import dotenv from "dotenv";


dotenv.config();

const embeddings = new OllamaEmbeddings({
  //ollamaEmbeddings class ka object
  model: "mxbai-embed-large",
});

const pinecone = new PineconeClient({  //client to communicate with pinecone db
  apiKey: process.env.PINECONE_API_KEY,
}); 

const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME); //for vector index

export const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex,
  maxConcurrency: 5,
});

export async function indexDocument(filePath) {
  const loader = new PDFLoader(filePath, { splitPages: false });
  const doc = await loader.load(); //loading the doc

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });
  const allSplits = await textSplitter.splitDocuments(doc); //splitting the doc into chunks
  const pureTexts = allSplits.map((chunk) => chunk.pageContent);

  await vectorStore.addDocuments(allSplits);
}
