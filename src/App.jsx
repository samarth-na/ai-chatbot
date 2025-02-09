import React, { useState, useEffect, useRef } from "react";

// This example uses fetch and reads the streaming response from Ollama
// as line-delimited JSON objects. For each line:
//   { "model":"...", "response":"...", "done":false/true, ... }
// When "done" is true, the loop is stopped.

function App() {
	const [prompt, setPrompt] = useState(""); // User prompt to send to Ollama
	const [response, setResponse] = useState(""); // Displayed response
	const [isLoading, setIsLoading] = useState(false);
	const textareaRef = useRef(null);

	const handleSubmit = async (e) => {
		if (e) e.preventDefault(); // Prevent default form submit
		setIsLoading(true);
		setResponse(""); // Clear previous responses

		try {
			// The Ollama API supports streaming JSON lines
			// This POST *should* return a streaming response (line-based JSON)
			const res = await fetch("http://localhost:11434/api/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					model: "tinyllama", // Adjust model name if needed
					prompt: prompt,
				}),
			});

			if (!res.ok) {
				throw new Error(
					`Error from server: ${res.status} ${res.statusText}`
				);
			}
			if (!res.body) {
				throw new Error(
					"ReadableStream not yet supported in this environment or no body returned."
				);
			}

			// Use a reader to process the stream manually
			const reader = res.body.getReader();
			const decoder = new TextDecoder("utf-8");
			let buffer = "";

			while (true) {
				const { done, value } = await reader.read();
				if (done) break; // End of stream

				// Decode this chunk
				buffer += decoder.decode(value, { stream: true });

				// Split on newlines to handle multiple JSON objects per chunk
				const lines = buffer.split("\n");

				// Process all lines except possibly the last (which may be partial)
				for (let i = 0; i < lines.length - 1; i++) {
					const line = lines[i].trim();
					if (!line) continue; // Skip empty lines

					try {
						// Each line is expected to be valid JSON:
						// e.g. {"response":"some text","done":false}
						const parsed = JSON.parse(line);

						// Append the "response" field to our existing state
						setResponse((prev) => prev + parsed.response);

						// If the server says we're done, stop reading further
						if (parsed.done) {
							// Cancel any remaining reads and exit the loop
							reader.cancel();
							break;
						}
					} catch (err) {
						console.error("JSON parse error on line:", line, err);
					}
				}

				// Keep any incomplete line in the buffer for the next chunk
				buffer = lines[lines.length - 1];
			}
		} catch (error) {
			console.error("Error fetching response:", error);
			setResponse("An error occurred while fetching the response.");
		} finally {
			setIsLoading(false);
		}
	};

	// Submit on Ctrl+Enter (or Cmd+Enter on macOS)
	useEffect(() => {
		const textarea = textareaRef.current;
		const handleKeyDown = (event) => {
			if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
				event.preventDefault();
				handleSubmit();
			}
		};
		textarea.addEventListener("keydown", handleKeyDown);
		return () => {
			textarea.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return (
		<div className="p-5 mx-auto text-left max-w-[600px]">
			<h1 className="mb-5 text-xl font-bold">TinyLLama Web UI</h1>
			<form onSubmit={handleSubmit}>
				<textarea
					ref={textareaRef}
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					placeholder="Enter your prompt here..."
					className="p-2 mb-10 w-full ring-2 shadow-xl ring-blue-400/80"
				/>

				<button
					type="submit"
					disabled={isLoading}
					className={`text-gray-500 rounded-sm ${isLoading ? "bg-gray-50" : ""}`}
				>
					{isLoading
						? "loading response"
						: "click or ctrl󰌑 to submit"}
				</button>
			</form>
			{response && (
				<div className="p-5 mt-10 text-gray-800 rounded-sm">
					<h2></h2>
				</div>
			)}
		</div>
	);
}

export default App;
