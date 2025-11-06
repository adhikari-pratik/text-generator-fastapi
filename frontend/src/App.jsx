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
			const response = await axios.post("http://127.0.0.1:8000/api/generate", {
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
		<div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-8 px-4">
			<div className="container mx-auto max-w-5xl">
				{/* Header */}
				<div className="text-center mb-8 animate-fadeIn">
					<h1 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
						AI Multi-Task Platform
					</h1>
					<p className="text-gray-700 text-lg font-medium">
						Powered by cutting-edge AI models for text generation and sentiment
						analysis
					</p>
				</div>

				<div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
					<div className="space-y-6">
						{/* Task Selection */}
						<div>
							<label className="block text-base font-bold mb-3 text-gray-800">
								📋 Select Task
							</label>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<button
									className={`p-6 rounded-xl border-3 transition-all font-bold text-lg shadow-md hover:shadow-xl ${
										task === "text-generation"
											? "border-indigo-600 bg-indigo-100 text-indigo-800 ring-2 ring-indigo-400"
											: "border-gray-300 bg-white text-gray-800 hover:border-indigo-400 hover:bg-indigo-50"
									}`}
									onClick={() => handleTaskChange("text-generation")}
									disabled={loading}
								>
									<div className="text-4xl mb-2">📝</div>
									<div className="text-lg font-bold">Text Generation</div>
									<div className="text-sm font-normal mt-1 opacity-75">
										Generate creative text with GPT-2
									</div>
								</button>
								<button
									className={`p-6 rounded-xl border-3 transition-all font-bold text-lg shadow-md hover:shadow-xl ${
										task === "sentiment-analysis"
											? "border-green-600 bg-green-100 text-green-800 ring-2 ring-green-400"
											: "border-gray-300 bg-white text-gray-800 hover:border-green-400 hover:bg-green-50"
									}`}
									onClick={() => handleTaskChange("sentiment-analysis")}
									disabled={loading}
								>
									<div className="text-4xl mb-2">😊</div>
									<div className="text-lg font-bold">Sentiment Analysis</div>
									<div className="text-sm font-normal mt-1 opacity-75">
										Analyze emotions with DistilBERT
									</div>
								</button>
							</div>
						</div>

						{/* Input Text */}
						<div>
							<label className="block text-base font-bold mb-3 text-gray-800">
								{task === "text-generation"
									? "✍️ Your Prompt"
									: "📄 Text to Analyze"}
							</label>
							<textarea
								className="w-full h-40 p-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all shadow-sm text-gray-900 text-base bg-white"
								placeholder={
									task === "text-generation"
										? "Enter your creative prompt here...\n\nExamples:\n• Once upon a time in a distant galaxy...\n• The future of artificial intelligence is...\n• In a world where technology..."
										: "Enter the text you want to analyze...\n\nExamples:\n• I absolutely love this product! It exceeded my expectations.\n• This experience was disappointing and frustrating.\n• The service was okay, nothing special."
								}
								value={inputText}
								onChange={(e) => setInputText(e.target.value)}
								disabled={loading}
							/>
							<div className="mt-2 text-sm text-gray-600">
								{inputText.length} /{" "}
								{task === "text-generation" ? "500" : "1000"} characters
							</div>
						</div>

						{/* Settings - Only for Text Generation */}
						{task === "text-generation" && (
							<div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
								<h3 className="text-base font-bold mb-4 text-gray-800">
									⚙️ Generation Settings
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<label className="block text-sm font-bold mb-3 text-gray-800">
											Max Length:{" "}
											<span className="text-indigo-600">{maxLength}</span>{" "}
											tokens
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
										<div className="flex justify-between text-xs text-gray-600 mt-1">
											<span>10</span>
											<span>500</span>
										</div>
									</div>

									<div>
										<label className="block text-sm font-bold mb-3 text-gray-800">
											Temperature:{" "}
											<span className="text-indigo-600">
												{temperature.toFixed(1)}
											</span>
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
										<div className="flex justify-between text-xs text-gray-600 mt-1">
											<span>Conservative</span>
											<span>Creative</span>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Buttons */}
						<div className="flex flex-col sm:flex-row gap-4">
							<button
								className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
								onClick={handleProcess}
								disabled={loading || !inputText.trim()}
							>
								{loading ? (
									<span className="flex items-center justify-center gap-2">
										<svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
												fill="none"
											/>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											/>
										</svg>
										Processing...
									</span>
								) : task === "text-generation" ? (
									"🚀 Generate Text"
								) : (
									"🔍 Analyze Sentiment"
								)}
							</button>
							<button
								className="bg-gray-200 text-gray-800 px-8 py-4 rounded-xl hover:bg-gray-300 transition-all font-bold text-lg shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
								onClick={handleClear}
								disabled={loading}
							>
								🗑️ Clear
							</button>
						</div>

						{/* Error Message */}
						{error && (
							<div className="p-6 border-2 border-red-400 rounded-xl bg-red-50 shadow-lg animate-fadeIn">
								<div className="flex items-start gap-3">
									<div className="text-3xl">❌</div>
									<div className="flex-1">
										<h2 className="text-xl font-bold mb-2 text-red-800">
											Error Occurred
										</h2>
										<p className="text-red-700 text-base leading-relaxed">
											{error}
										</p>
									</div>
								</div>
							</div>
						)}

						{/* Result - Text Generation */}
						{result && result.task === "text-generation" && (
							<div className="p-6 border-2 border-indigo-300 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl animate-fadeIn">
								<div className="flex items-center gap-2 mb-4">
									<span className="inline-block px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-full shadow-md">
										✨ Model: {result.model.toUpperCase()}
									</span>
								</div>
								<h2 className="text-2xl font-bold mb-4 text-indigo-900 flex items-center gap-2">
									<span>📜</span> Generated Text
								</h2>
								<div className="bg-white p-6 rounded-xl border-2 border-indigo-200 shadow-inner">
									<p className="text-gray-900 text-base whitespace-pre-wrap leading-relaxed font-medium">
										{result.generated_text}
									</p>
								</div>
								<div className="mt-4 text-sm text-gray-700 bg-white p-3 rounded-lg border border-indigo-200">
									<strong>💡 Tip:</strong> Adjust temperature for more creative
									outputs or max length for longer text.
								</div>
							</div>
						)}

						{/* Result - Sentiment Analysis */}
						{result && result.task === "sentiment-analysis" && (
							<div className="p-6 border-2 border-green-300 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl animate-fadeIn">
								<div className="flex items-center gap-2 mb-4">
									<span className="inline-block px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-full shadow-md">
										🤖 Model: DistilBERT
									</span>
								</div>
								<h2 className="text-2xl font-bold mb-4 text-green-900 flex items-center gap-2">
									<span>📊</span> Sentiment Analysis Result
								</h2>
								<div className="space-y-4">
									<div className="bg-white p-5 rounded-xl border-2 border-green-200 shadow-sm">
										<p className="text-sm font-bold text-gray-700 mb-2">
											📝 Original Text:
										</p>
										<p className="text-gray-900 text-base leading-relaxed font-medium">
											{result.text}
										</p>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-md text-center">
											<p className="text-sm font-bold text-gray-700 mb-3">
												Sentiment
											</p>
											<p
												className={`text-4xl font-extrabold mb-2 ${
													result.sentiment === "POSITIVE"
														? "text-green-600"
														: "text-red-600"
												}`}
											>
												{result.sentiment === "POSITIVE" ? "😊" : "😞"}
											</p>
											<p
												className={`text-xl font-bold ${
													result.sentiment === "POSITIVE"
														? "text-green-700"
														: "text-red-700"
												}`}
											>
												{result.sentiment}
											</p>
										</div>
										<div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-md text-center">
											<p className="text-sm font-bold text-gray-700 mb-3">
												Confidence
											</p>
											<p className="text-4xl font-extrabold text-indigo-600 mb-2">
												{(result.confidence * 100).toFixed(1)}%
											</p>
											<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
												<div
													className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
													style={{ width: `${result.confidence * 100}%` }}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Footer */}
				<div className="mt-8 text-center">
					<div className="bg-white/80 backdrop-blur-sm rounded-xl py-4 px-6 shadow-lg inline-block">
						<p className="text-gray-800 text-base font-semibold">
							⚡ Powered by{" "}
							<span className="text-indigo-600 font-bold">GPT-2</span> &{" "}
							<span className="text-green-600 font-bold">DistilBERT</span>
						</p>
						<p className="text-gray-600 text-sm mt-1">FastAPI + React + Vite</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
