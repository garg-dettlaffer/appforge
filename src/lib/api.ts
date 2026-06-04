export async function runFullPipeline(prompt: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/pipeline/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    let errMsg = `API error: ${response.statusText}`;
    try {
      const errBody = await response.json();
      if (errBody.detail && errBody.detail.message) {
        errMsg = errBody.detail.message;
      }
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
}

export async function getEvalResults() {
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/eval/results`);
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
}

export async function runEvalSuite() {
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/eval/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
}
