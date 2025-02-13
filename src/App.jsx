import React, { useState, useEffect, useRef } from "react";

const saveChatToLocalStorage = (chat) => {
	const existingChats = JSON.parse(localStorage.getItem("chats")) || [];
	existingChats.push(chat);
	localStorage.setItem("chats", JSON.stringify(existingChats));
};

function App() {
	const [prompt, setPrompt] = useState("");
	const [messages, setMessages] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const [chat, setChat] = useState("qwen2.5:1.5b");
	const textareaRef = useRef(null);
	const chatContainerRef = useRef(null);

	// Save chat object to local storage

	// Handle streaming response from Ollama
	const handleOutputStream = async (reader) => {
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
					// model: "deepseek-r1:1.5b",
					// model: "llama3.2:1b",
					model: chat,

					// model: "deepseek-coder:1.3b",
					prompt: prompt,
				}),
			});

			if (!res.ok)
				throw new Error(
					`Server error: ${res.status} ${res.statusText}`
				);
			if (!res.body)
				throw new Error("Streaming not supported or no body returned.");
			console.log(res);
			await handleOutputStream(res.body.getReader());
		} catch (error) {
			console.error("Error:", error);
			setMessages((prev) => [
				...prev,
				{ role: "bot", content: `Error: ${error.message}` },
			]);
		} finally {
			setIsLoading(false);
			const chatId = new Date().toISOString();
			const chatObject = {
				id: chatId,
				heading: prompt,
				messages: [...messages, { role: "user", content: prompt }],
			};
			console.log(chatObject);
			saveChatToLocalStorage(chatObject);
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

	const onChatChange = (e) => {
		e.preventDefault();
		setChat(e.target.textContent); // Use textContent to get the button's text
	};

	useEffect(() => {
		console.log(chat);
	}, [chat]); // Add chat as a dependency
	return (
		<div className="flex flex-col flex-1 gap-2">
			{/* main wrapper*/}
			<div className="overflow-hidden top-0 flex-1 mb-36">
				<div className="flex flex-col p-4 min-w-[700px] border border-gray-200 mx-auto rounded-b-xl w-[50%] bg-white  h-full">
					<div className="flex flex-row gap-2 justify-center">
						<button
							onClick={onChatChange} // Corrected to onClick
							className="py-2 px-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
						>
							llama3.2:1b
						</button>
						<button
							onClick={onChatChange} // Corrected to onClick
							className="py-2 px-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
						>
							deepseek-r1:1.5b
						</button>
						<button
							onClick={onChatChange} // Corrected to onClick
							className="py-2 px-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
						>
							qwen2.5:1.5b
						</button>
					</div>
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
											? "bg-blue-100/50 text-gray-900"
											: " text-gray-900"
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
			<div className="left-1/2 transform bg-gray-50 -translate-x-1/2 flex flex-col fixed bottom-0 min-w-[700px] rounded-md w-[50%]">
				<form onSubmit={handleSubmit} className="flex flex-col">
					<textarea
						ref={textareaRef}
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
						placeholder="Type message"
						rows="3"
						className="flex-1 p-2 px-3 mb-2 rounded-xl border border-gray-200 bg-blue-100/50"
					/>
					<button
						type="submit"
						disabled={isLoading}
						className={`mb-2 text-sm text-gray-500  rounded-lg cursor-pointer hover:text-gray-800 ${isLoading ? "text-red-400 hover:text-red-500 font-bold" : ""}`}
					>
						{isLoading
							? "cancel message"
							: "Ctrl󰌑 or click to send"}
					</button>
				</form>
			</div>
		</div>
	);
}
export default App;
