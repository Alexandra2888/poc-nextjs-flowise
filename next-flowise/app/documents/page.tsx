"use client";

import React, { useState } from "react";
import { query } from "../../services/flowiseService";

// Define basic types for type-safety
interface DocumentSource {
  pageContent: string;
  metadata: Record<string, unknown>;
}

export default function DocumentSourcesPage() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<DocumentSource[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setSources([]);
    setAnswer("");

    try {
      const response = await query({ question });

      // Set answer
      setAnswer(response.text || "");

      // Extract sources
      const documents = response.sourceDocuments || [];
      setSources(documents);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to retrieve documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Document Sources Explorer</h1>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {answer && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Answer:</h2>
          <div className="p-4 bg-gray-50 rounded border">{answer}</div>
        </div>
      )}

      {sources.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Source Documents:</h2>

          <div className="space-y-4">
            {sources.map((source, index) => (
              <div key={index} className="border rounded p-4 bg-gray-50">
                <h3 className="font-medium mb-2">Document #{index + 1}</h3>

                <div className="mb-3">
                  <h4 className="text-sm font-semibold mb-1">Content:</h4>
                  <div className="bg-white p-3 border rounded overflow-auto max-h-60">
                    <pre className="whitespace-pre-wrap text-sm">
                      {source.pageContent}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-1">Metadata:</h4>
                  <div className="bg-white p-3 border rounded overflow-auto max-h-40">
                    <pre className="whitespace-pre-wrap text-sm">
                      {JSON.stringify(source.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
