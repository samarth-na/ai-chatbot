import React, { useState, useEffect, useRef } from "react";

function App() {
	const [prompt, setPrompt] = useState("");
	const [messages, setMessages] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const textareaRef = useRef(null);
	const chatContainerRef = useRef(null);

	// Handle streaming response from Ollama
	const handleStream = async (reader) => {
		const decoder = new TextDecoder("utf-8");
		let buffer = "";
		let botMessage = "";

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
					botMessage += parsed.response;
					setMessages((prev) => {
						const lastMessage = prev[prev.length - 1];
						if (lastMessage.role === "bot") {
							return [
								...prev.slice(0, -1),
								{ ...lastMessage, content: botMessage },
							];
						}
						return prev;
					});

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
	};

	const handleSubmit = async (e) => {
		if (e) e.preventDefault();
		if (!prompt.trim()) return;

		setIsLoading(true);
		setMessages((prev) => [
			...prev,
			{ role: "user", content: prompt },
			{ role: "bot", content: "" },
		]);
		setPrompt("");

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

			await handleStream(res.body.getReader());
		} catch (error) {
			console.error("Error:", error);
			setMessages((prev) => [
				...prev,
				{ role: "bot", content: `Error: ${error.message}` },
			]);
		} finally {
			setIsLoading(false);
		}
	};

	// Keyboard shortcut and auto-scroll effects
	useEffect(() => {
		const textarea = textareaRef.current;
		const handleKeyDown = (event) => {
			if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
				event.preventDefault();
				handleSubmit();
			}
		};

		textarea.addEventListener("keydown", handleKeyDown);
		return () => textarea.removeEventListener("keydown", handleKeyDown);
	}, [handleSubmit]);

	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<div className="flex flex-col flex-1 gap-2">
			<div className="overflow-hidden top-0 flex-1 mb-36">
				<div className="flex flex-col p-4 min-w-[700px] border border-gray-200 mx-auto rounded-b-xl w-[50%] bg-white  h-full">
					<h1 className="mb-4 text-xl text-gray-800">Ollama Chat</h1>

					{/* Chat Messages */}
					<div
						ref={chatContainerRef}
						className="overflow-y-auto flex-1 pr-2 space-y-4"
					>
						{messages.map((message, index) => (
							<div
								key={index}
								className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
							>
								<div
									className={`max-w-[80%] rounded-xl px-3 py-2  ${
										message.role === "user"
											? "bg-blue-100/50 text-gray-800"
											: " text-gray-800"
									}`}
								>
									<p className="whitespace-pre-wrap">
										{message.content}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Input Area - Fixed at bottom */}
			<div className="left-1/2 transform -translate-x-1/2 flex flex-col fixed bottom-0 min-w-[700px] rounded-md w-[50%]">
				<form onSubmit={handleSubmit} className="flex flex-col gap-2">
					<button
						type="submit"
						disabled={isLoading}
						className="text-sm text-gray-500 rounded-lg cursor-pointer"
					>
						{isLoading ? "Sending..." : "Ctrl󰌑 or click to send "}
					</button>
					<textarea
						ref={textareaRef}
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
						placeholder="Type message"
						rows="3"
						className="flex-1 p-2 mb-4 bg-gray-100 rounded-xl border border-gray-200"
					/>
				</form>
			</div>
		</div>
	);
}

export default App;
