/**
 * Updated query function to access document sources from Flowise API
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function query(data: { question: string }) {
  const response = await fetch(
    "https://alex-flowise.dentro-innovation.com/api/v1/prediction/633b4e7f-389d-45a9-9128-83e393a1181a",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );
  const result = await response.json();
  
  const answerText = result.text || result.answer || null;
  
  const sourceDocuments = result.sourceDocuments || [];
  
  return {
    answerText,
    sourceDocuments
  };
}

