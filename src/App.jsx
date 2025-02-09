import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {
	const [prompt, setPrompt] = useState("");
	const [response, setResponse] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const textareaRef = useRef(null); // Ref for the textarea

	const handleSubmit = async (e) => {
		if (e) e.preventDefault(); // Prevent default form submission if called from an event
		if (isLoading) return; // Prevent multiple submissions

		setIsLoading(true);

		try {
			const result = await axios.post(
				"http://localhost:11434/api/generate",
				{
					model: tinyllama,
					prompt: prompt,
				}
			);
			setResponse(result.data.response);
		} catch (error) {
			console.error("Error fetching response:", error);
			setResponse("An error occurred while fetching the response.");
		} finally {
			setIsLoading(false);
		}
	};

	// Add Ctrl + Enter shortcut
	useEffect(() => {
		const textarea = textareaRef.current;

		const handleKeyDown = (event) => {
			// Check if Ctrl (or Cmd on macOS) and Enter are pressed
			if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
				event.preventDefault(); // Prevent default behavior (e.g., new line in textarea)
				handleSubmit(); // Trigger the submit action
			}
		};

		// Add event listener to the textarea
		textarea.addEventListener("keydown", handleKeyDown);

		// Cleanup the event listener on component unmount
		return () => {
			textarea.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleSubmit]); // Add handleSubmit to the dependency array

	return (
		<div className="p-5 mx-auto max-w-[600px]">
			<h1 className="mb-5 text-xl font-bold">Ollama Web UI</h1>
			<form onSubmit={handleSubmit}>
				<textarea
					ref={textareaRef} // Attach the ref to the textarea
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					placeholder="Enter your prompt here..."
					className="p-2 mb-10 w-full ring-2 shadow-xl ring-blue-400/80"
				/>

				<button
					type="submit"
					disabled={isLoading}
					className={`text-gray-500 rounded-sm  ${
						isLoading ? "bg-gray-50" : ""
					}`}
				>
					{isLoading ? "loading response" : "ctrl-enter to submit"}
				</button>
			</form>
			{response && (
				<div className="p-5 mt-10 text-gray-800 bg-gray-50 rounded-sm">
					<h2>Response:</h2>
					<p>{response}</p>
				</div>
			)}
		</div>
	);
}

export default App;
