import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {
	const [prompt, setPrompt] = useState(""); // State for the input prompt
	const [response, setResponse] = useState(""); // State for the response from the API
	const [isLoading, setIsLoading] = useState(false); // State to manage loading state
	const textareaRef = useRef(null); // Ref for the textarea

	const handleSubmit = async (e) => {
		e.preventDefault(); // Prevent default form submission
		setIsLoading(true); // Set loading state to true

		try {
			const result = await axios.post(
				"http://localhost:11434/api/generate",
				{
					model: tinyllama, // Include the model parameter
					prompt: prompt, // Send the prompt to the API
				}
			);
			setResponse(result.data.response); // Set the response from the API
		} catch (error) {
			console.error("Error fetching response:", error); // Log any error

			setResponse("An error occurred while fetching the response."); // Set error message
		} finally {
			setIsLoading(false); // Set loading state to false
		}
	};

	// Add Ctrl + Enter shortcut
	useEffect(() => {
		const textarea = textareaRef.current; // Get the textarea element

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
					onChange={(e) => setPrompt(e.target.value)} // Update prompt state on change
					placeholder="Enter your prompt here..."
					className="p-2 mb-10 w-full ring-2 shadow-xl ring-blue-400/80"
				/>

				<button
					type="submit"
					disabled={isLoading} // Disable button while loading
					className={`text-gray-500 rounded-sm  ${
						isLoading ? "bg-gray-50" : ""
					}`}
				>
					{isLoading ? "loading response" : "ctrl-enter to submit"} //
					Button text based on loading state
				</button>
			</form>
			{response && (
				<div className="p-5 mt-10 text-gray-800 bg-gray-50 rounded-sm">
					<h2>Response:</h2>
					<p>{response}</p> // Display the API response
				</div>
			)}
		</div>
	);
}

export default App;
