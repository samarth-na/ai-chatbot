import React, { useState, useEffect, useRef } from "react";

function App() {
	const [prompt, setPrompt] = useState("");
	const [response, setResponse] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const textareaRef = useRef(null);

	async function handleSubmit(e) {
		if (e) e.preventDefault(); // Prevent default form submission
		setIsLoading(true);
		setResponse(""); // Clear previous responses

		try {
			const res = await fetch("http://localhost:11434/api/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					model: "llama3.2:1b",
					prompt: prompt,
				}),
			});

			if (!res.ok)
				throw new Error(
					`Server error: ${res.status} ${res.statusText}`
				);
			if (!res.body)
				throw new Error("Streaming not supported or no body returned.");

			const reader = res.body.getReader();
			const decoder = new TextDecoder("utf-8");
			let buffer = "";

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split("\n");

				for (let i = 0; i < lines.length - 1; i++) {
					const line = lines[i].trim();
					if (!line) continue;

					try {
						const parsed = JSON.parse(line);
						setResponse((prev) => prev + parsed.response);
						if (parsed.done) {
							reader.cancel();
							break;
						}
					} catch (err) {
						console.error("JSON parse error:", line, err);
					}
				}

				buffer = lines[lines.length - 1];
			}
		} catch (error) {
			console.error("Error:", error);
			setResponse(`Error: ${error.message}`);
		} finally {
			setIsLoading(false);
		}
	}

	// Fix for Ctrl+Enter: Ensure `handleSubmit` is in the dependency array
	useEffect(() => {
		const textarea = textareaRef.current;
		const handleKeyDown = (event) => {
			if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
				event.preventDefault(); // Prevent default textarea behavior
				handleSubmit(); // Manually trigger submission
			}
		};

		textarea.addEventListener("keydown", handleKeyDown);
		return () => textarea.removeEventListener("keydown", handleKeyDown);
	}, [handleSubmit]); // Include handleSubmit in dependencies

	return (
		<div className="p-5 mx-auto max-w-[800px]">
			<h1 className="mb-5 text-xl font-bold">Ollama Web UI</h1>

			{response && (
				<div className="p-5 mt-10 bg-white rounded-sm hover:ring-2 ring-blue-900/90">
					<h2></h2>
					{/* Add the response text here! */}
					<p className="mt-2 text-left whitespace-pre-wrap">
						{response}
					</p>
				</div>
			)}
			<form onSubmit={handleSubmit}>
				<textarea
					ref={textareaRef}
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					placeholder="Enter your prompt here..."
					className="p-2 mb-10 w-full ring-2 shadow-xl ring-blue-900/90"
					rows="2"
				/>
				<button
					type="submit"
					disabled={isLoading}
					className={`text-gray-500 rounded-sm  cursor-pointer   ${isLoading ? "bg-gray-50" : ""}`}
				>
					{isLoading
						? "loading response"
						: "click or ctrl󰌑 to submit"}
				</button>
			</form>
		</div>
	);
}

export default App;
