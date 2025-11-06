import { useState } from "react";
import axios from "axios";

function App() {
	const [task, setTask] = useState("text-generation");
	const [inputText, setInputText] = useState("");
	const [result, setResult] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [maxLength, setMaxLength] = useState(100);
	const [temperature, setTemperature] = useState(1.0);

	const handleProcess = async () => {
		if (!inputText.trim()) {
			setError("Please enter some text");
			return;
		}

		setLoading(true);
		setError(null);
		setResult(null);

		try {
			const response = await axios.post("http://127.0.0.1:8000/api/process", {
				task: task,
				text: inputText,
				max_length: maxLength,
				temperature: temperature,
			});

			setResult(response.data);
			setError(null);
		} catch (error) {
			console.error("Error processing request:", error);
			setError(
				error.response?.data?.detail ||
					"Failed to process request. Please make sure the backend server is running."
			);
			setResult(null);
		} finally {
			setLoading(false);
		}
	};

	const handleClear = () => {
		setInputText("");
		setResult(null);
		setError(null);
	};

	const handleTaskChange = (newTask) => {
		setTask(newTask);
		setResult(null);
		setError(null);
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
			<div className="container mx-auto p-6 max-w-4xl">
				<div className="bg-white rounded-lg shadow-xl p-8">
					<div className="mb-6">
						<h1 className="text-4xl font-bold mb-2 text-indigo-700">
							AI Multi-Task Platform
						</h1>
						<p className="text-gray-600">
							Choose a task and let AI help you with text generation or
							sentiment analysis
						</p>
					</div>

					<div className="space-y-4">
						{/* Task Selection */}
						<div>
							<label className="block text-sm font-semibold mb-2 text-gray-700">
								Select Task
							</label>
							<div className="grid grid-cols-2 gap-3">
								<button
									className={`p-4 rounded-lg border-2 transition-all font-semibold ${
										task === "text-generation"
											? "border-indigo-600 bg-indigo-50 text-indigo-700"
											: "border-gray-300 bg-white text-gray-700 hover:border-indigo-300"
									}`}
									onClick={() => handleTaskChange("text-generation")}
									disabled={loading}
								>
									<div className="text-2xl mb-1">📝</div>
									Text Generation
								</button>
								<button
									className={`p-4 rounded-lg border-2 transition-all font-semibold ${
										task === "sentiment-analysis"
											? "border-indigo-600 bg-indigo-50 text-indigo-700"
											: "border-gray-300 bg-white text-gray-700 hover:border-indigo-300"
									}`}
									onClick={() => handleTaskChange("sentiment-analysis")}
									disabled={loading}
								>
									<div className="text-2xl mb-1">😊</div>
									Sentiment Analysis
								</button>
							</div>
						</div>

						{/* Input Text */}
						<div>
							<label className="block text-sm font-semibold mb-2 text-gray-700">
								{task === "text-generation" ? "Prompt" : "Text to Analyze"}
							</label>
							<textarea
								className="w-full h-32 p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
								placeholder={
									task === "text-generation"
										? "Enter your prompt here... (e.g., 'Once upon a time')"
										: "Enter text for sentiment analysis... (e.g., 'I love this product!')"
								}
								value={inputText}
								onChange={(e) => setInputText(e.target.value)}
								disabled={loading}
							/>
						</div>

						{/* Settings - Only for Text Generation */}
						{task === "text-generation" && (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-semibold mb-2 text-gray-700">
										Max Length: {maxLength}
									</label>
									<input
										type="range"
										min="10"
										max="500"
										step="10"
										value={maxLength}
										onChange={(e) => setMaxLength(Number(e.target.value))}
										className="w-full"
										disabled={loading}
									/>
								</div>

								<div>
									<label className="block text-sm font-semibold mb-2 text-gray-700">
										Temperature: {temperature}
									</label>
									<input
										type="range"
										min="0.1"
										max="2.0"
										step="0.1"
										value={temperature}
										onChange={(e) => setTemperature(Number(e.target.value))}
										className="w-full"
										disabled={loading}
									/>
								</div>
							</div>
						)}

						{/* Buttons */}
						<div className="flex gap-3">
							<button
								className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
								onClick={handleProcess}
								disabled={loading || !inputText.trim()}
							>
								{loading
									? "Processing..."
									: task === "text-generation"
									? "Generate Text"
									: "Analyze Sentiment"}
							</button>
							<button
								className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
								onClick={handleClear}
								disabled={loading}
							>
								Clear
							</button>
						</div>

						{/* Error Message */}
						{error && (
							<div className="p-4 border-2 border-red-300 rounded-lg bg-red-50">
								<h2 className="text-lg font-semibold mb-2 text-red-700">
									Error
								</h2>
								<p className="text-red-600">{error}</p>
							</div>
						)}

						{/* Result - Text Generation */}
						{result && result.task === "text-generation" && (
							<div className="p-6 border-2 border-indigo-200 rounded-lg bg-indigo-50">
								<div className="mb-4">
									<span className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full">
										Model: {result.model}
									</span>
								</div>
								<h2 className="text-xl font-semibold mb-3 text-indigo-900">
									Generated Text:
								</h2>
								<div className="bg-white p-4 rounded-lg border border-indigo-200">
									<p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
										{result.generated_text}
									</p>
								</div>
							</div>
						)}

						{/* Result - Sentiment Analysis */}
						{result && result.task === "sentiment-analysis" && (
							<div className="p-6 border-2 border-green-200 rounded-lg bg-green-50">
								<div className="mb-4">
									<span className="inline-block px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
										Model: DistilBERT
									</span>
								</div>
								<h2 className="text-xl font-semibold mb-3 text-green-900">
									Sentiment Analysis Result:
								</h2>
								<div className="space-y-4">
									<div className="bg-white p-4 rounded-lg border border-green-200">
										<p className="text-sm text-gray-600 mb-2">Original Text:</p>
										<p className="text-gray-800 leading-relaxed">
											{result.text}
										</p>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div className="bg-white p-4 rounded-lg border border-green-200">
											<p className="text-sm text-gray-600 mb-1">Sentiment:</p>
											<p
												className={`text-2xl font-bold ${
													result.sentiment === "POSITIVE"
														? "text-green-600"
														: "text-red-600"
												}`}
											>
												{result.sentiment === "POSITIVE"
													? "😊 Positive"
													: "😞 Negative"}
											</p>
										</div>
										<div className="bg-white p-4 rounded-lg border border-green-200">
											<p className="text-sm text-gray-600 mb-1">Confidence:</p>
											<p className="text-2xl font-bold text-indigo-600">
												{(result.confidence * 100).toFixed(2)}%
											</p>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Footer */}
				<div className="mt-6 text-center text-gray-600 text-sm">
					<p>Powered by GPT-2 & DistilBERT | FastAPI + React + Vite</p>
				</div>
			</div>
		</div>
	);
}

export default App;
