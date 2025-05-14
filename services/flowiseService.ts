interface FlowiseRequestData {
  question: string;
  history?: Array<{
    role: string;
    content: string;
  }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  overrideConfig?: Record<string, any>;
}

interface FlowiseResponse {
  text: string;
  sourceDocuments?: Array<{
    pageContent: string;
    metadata: Record<string, any>;
  }>;
  [key: string]: any;
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
  return result;
}

// Helper function to extract source documents
export function extractSourceDocuments(response: FlowiseResponse) {
  if (!response.sourceDocuments || response.sourceDocuments.length === 0) {
    return [];
  }
  
  return response.sourceDocuments.map(doc => ({
    pageContent: doc.pageContent,
    metadata: doc.metadata
  }));
} 