
import { Document } from '../types';

const STORAGE_KEY = 'spk-document-tracker-documents';

// Helper to get all documents from localStorage
const getMockDocuments = (): Document[] => {
    try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
        console.error("Error reading from localStorage:", error);
        localStorage.removeItem(STORAGE_KEY); // Clear corrupted data
        return [];
    }
};

// Helper to save all documents to localStorage
const saveMockDocuments = (documents: Document[]): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
    } catch (error) {
        console.error("Error writing to localStorage:", error);
    }
};

// Helper to generate a new document number for local dev
const generateMockDocumentNumber = (docs: Document[]): string => {
    const currentYear = new Date().getFullYear();
    const yearDocs = docs.filter(d => d.submissionDate && new Date(d.submissionDate).getFullYear() === currentYear);
    const nextId = yearDocs.length + 1;
    const formattedId = nextId.toString().padStart(3, '0');
    return `SPK-${currentYear}-${formattedId}`;
};

export const getDocuments = async (): Promise<Document[]> => {
    console.log("MOCK: Getting documents from localStorage");
    return Promise.resolve(getMockDocuments());
};

export const saveDocument = async (doc: Document | Omit<Document, 'id' | 'docNumber'>): Promise<Document> => {
    console.log("MOCK: Saving document to localStorage", doc);
    const documents = getMockDocuments();
    
    // Check if it's an update by checking for 'id'
    if ('id' in doc && doc.id) {
        const docIndex = documents.findIndex(d => d.id === doc.id);
        if (docIndex !== -1) {
            documents[docIndex] = doc as Document;
            saveMockDocuments(documents);
            return Promise.resolve(doc as Document);
        }
    }
    
    // It's a new document
    const newDoc: Document = {
        ...doc,
        id: new Date().getTime().toString() + Math.random().toString(36).substr(2, 9), // Simple UUID for mock
        docNumber: generateMockDocumentNumber(documents),
    };

    documents.push(newDoc);
    saveMockDocuments(documents);
    return Promise.resolve(newDoc);
};

export const deleteDocument = async (id: string): Promise<{success: boolean; id: string}> => {
    console.log("MOCK: Deleting document from localStorage", id);
    let documents = getMockDocuments();
    const initialLength = documents.length;
    documents = documents.filter(doc => doc.id !== id);
    
    if (documents.length < initialLength) {
        saveMockDocuments(documents);
        return Promise.resolve({ success: true, id });
    } else {
        return Promise.reject(new Error("Mock document not found"));
    }
};
