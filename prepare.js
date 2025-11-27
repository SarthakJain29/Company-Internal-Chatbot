import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function indexDocument(filePath) {
  const loader = new PDFLoader(filePath, { splitPages: false });
  const doc = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });
  const allSplits = await textSplitter.splitDocuments(doc);
  const pureTexts = allSplits.map((chunk) => chunk.pageContent);
  console.log(pureTexts);
}
