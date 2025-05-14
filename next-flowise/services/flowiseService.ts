interface FlowiseRequestData {
    question: string;
    history?: Array<{
      role: string;
      content: string;
    }>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    overrideConfig?: Record<string, unknown>;
  }
  
  // Define the PDF metadata structure
  interface PdfInfo {
    PDFFormatVersion?: string;
    IsAcroFormPresent?: boolean;
    IsXFAPresent?: boolean;
    Title?: string;
    Creator?: string;
    Producer?: string;
    CreationDate?: string;
    ModDate?: string;
  }
  
  interface PdfMetadata {
    version?: string;
    info?: PdfInfo;
    metadata?: unknown;
    totalPages?: number;
  }
  
  interface Location {
    pageNumber?: number;
  }
  
  interface DocumentMetadata {
    source?: string;
    blobType?: string;
    pdf?: PdfMetadata;
    loc?: Location;
    [key: string]: unknown;
  }
  
  interface DocumentSource {
    pageContent: string;
    metadata: DocumentMetadata;
  }
  
  export interface FlowiseResponse {
    text: string;
    answer?: string;
    sourceDocuments?: DocumentSource[];
    [key: string]: unknown;
  }
  
  export async function query(data: FlowiseRequestData): Promise<FlowiseResponse> {
    // Add a sessionId to connect all messages as one conversation
    const dataWithSession = {
      ...data,
      overrideConfig: {
        ...(data.overrideConfig || {}),
        sessionId: "persistent-session-123" // Use a consistent sessionId
      }
    };
  
    const response = await fetch(
      "https://alex-flowise.dentro-innovation.com/api/v1/prediction/633b4e7f-389d-45a9-9128-83e393a1181a",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataWithSession)
      }
    );
    const result = await response.json();
    return result as FlowiseResponse;
  }

  // Helper function to extract source documents
  export function extractSourceDocuments(response: FlowiseResponse): DocumentSource[] {
    if (!response.sourceDocuments || response.sourceDocuments.length === 0) {
      return [];
    }
    
    return response.sourceDocuments.map(doc => ({
      pageContent: doc.pageContent,
      metadata: doc.metadata
    }));
  }