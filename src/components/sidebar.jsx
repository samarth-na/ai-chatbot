import React, { useState } from "react";

const Sidebar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleSidebar = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="flex">
			{/* Sidebar */}
			<div
				className={`bg-gray-800 text-white h-screen w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out`}
			>
				{/* Close Button inside Sidebar */}
				<button
					onClick={toggleSidebar}
					className="absolute top-2 right-2 p-2 text-white rounded hover:bg-gray-700"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="w-6 h-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>

				<a href="#" className="flex items-center px-4 space-x-2">
					<span className="text-2xl font-extrabold">Sidebar</span>
				</a>
				<nav>
					<a
						href="#"
						className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
					>
						Home
					</a>
					<a
						href="#"
						className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
					>
						About
					</a>
					<a
						href="#"
						className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
					>
						Services
					</a>
					<a
						href="#"
						className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
					>
						Contact
					</a>
				</nav>
			</div>

			{/* Main Content */}
			<div className="flex-1 p-10">
				<button
					onClick={toggleSidebar}
					className="p-2 text-white bg-gray-800 rounded"
				>
					{isOpen ? "Close Sidebar" : "Open Sidebar"}
				</button>
				<h1 className="text-2xl font-bold">Main Content</h1>
				<p>This is the main content area.</p>
			</div>
		</div>
	);
};

export default Sidebar;
