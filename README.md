# AI Multi-Task Platform

A full-stack application that provides text generation and sentiment analysis capabilities using state-of-the-art transformer models. Built with FastAPI backend and React + Vite frontend.

## Features

- 🤖 **Text Generation** - Generate creative text continuations using GPT-2
- 😊 **Sentiment Analysis** - Analyze text sentiment (Positive/Negative) using DistilBERT
- 🎨 **Modern UI** - Clean and responsive interface with Tailwind CSS
- ⚡ **Fast API** - High-performance backend with automatic API documentation
- 🔧 **Configurable Parameters** - Adjust max length and temperature for text generation

## Tech Stack

### Backend

- **FastAPI** - Modern, fast web framework for building APIs
- **Transformers** (Hugging Face) - State-of-the-art NLP models
- **PyTorch** - Deep learning framework
- **Pydantic** - Data validation and settings management
- **Uvicorn** - ASGI server

### Frontend

- **React** - UI library
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework

## Models Used

- **GPT-2** - Text generation model by OpenAI
- **DistilBERT** - Distilled version of BERT for sentiment analysis (`distilbert-base-uncased-finetuned-sst-2-english`)

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/adhikari-pratik/text-generator-fastapi.git
cd text-generator-fastapi
```

### 2. Backend Setup

```bash
# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

## Running the Application

### Start the Backend Server

```bash
# Make sure virtual environment is activated
# From the root directory
python main.py
```

The backend will start on `http://localhost:8000`

- API Documentation: `http://localhost:8000/docs`
- Alternative API docs: `http://localhost:8000/redoc`

### Start the Frontend Development Server

```bash
# From the frontend directory
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

## API Endpoints

### Unified Processing Endpoint

- **POST** `/api/process` - Process text for generation or sentiment analysis

Request body:

```json
{
	"task": "text-generation", // or "sentiment-analysis"
	"text": "Once upon a time",
	"max_length": 100, // optional, for text generation
	"temperature": 1.0 // optional, for text generation
}
```

### Text Generation

- **POST** `/api/generate` - Generate text from a prompt

Request body:

```json
{
	"prompt": "Once upon a time",
	"max_length": 100,
	"temperature": 1.0,
	"num_return_sequences": 1
}
```

### Sentiment Analysis

- **POST** `/api/sentiment` - Analyze sentiment of text

Request body:

```json
{
	"text": "I love this product!"
}
```

### Health Check

- **GET** `/` - API information
- **GET** `/health` - Health status

## Usage Examples

### Text Generation

1. Select "Text Generation" task
2. Enter a prompt (e.g., "Once upon a time in a distant galaxy")
3. Adjust max length (10-500 tokens)
4. Adjust temperature (0.1-2.0) - higher = more creative
5. Click "Generate Text"

### Sentiment Analysis

1. Select "Sentiment Analysis" task
2. Enter text to analyze (e.g., "I love this product!")
3. Click "Analyze Sentiment"
4. View the sentiment (Positive/Negative) and confidence score

## Project Structure

```
.
├── main.py                 # FastAPI backend
├── requirements.txt        # Python dependencies
├── .gitignore             # Git ignore file
├── README.md              # This file
└── frontend/
    ├── src/
    │   ├── App.jsx        # Main React component
    │   └── main.jsx       # React entry point
    ├── package.json       # Node.js dependencies
    ├── vite.config.js     # Vite configuration
    └── index.html         # HTML template
```

## Configuration

### Backend Configuration

Edit `main.py` to customize:

- CORS origins
- Model parameters
- API settings

### Frontend Configuration

Edit `frontend/vite.config.js` to customize:

- Development server port
- Build settings

## Development

### Backend Development

The backend uses FastAPI's automatic reload feature:

```bash
uvicorn main:app --reload
```

### Frontend Development

Vite provides hot module replacement (HMR):

```bash
npm run dev
```

## Building for Production

### Backend

```bash
# Run with production settings
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm run build
```

The production build will be in `frontend/dist/`

## Environment Variables

Create a `.env` file in the root directory for sensitive configuration:

```env
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Troubleshooting

### Model Download Issues

On first run, the models will be downloaded automatically. This may take some time depending on your internet connection.

### CORS Errors

Ensure the frontend URL is added to the `allow_origins` list in `main.py`

### Port Already in Use

- Backend: Change the port in `main.py` or use `--port` flag
- Frontend: Set `VITE_PORT` environment variable or edit `vite.config.js`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [Hugging Face Transformers](https://huggingface.co/transformers/) for the pre-trained models
- [FastAPI](https://fastapi.tiangolo.com/) for the excellent web framework
- [Vite](https://vitejs.dev/) for the blazing fast frontend tooling

## Contact

For questions or support, please open an issue on GitHub.

---

**Note**: This application requires significant computational resources for the first run as it downloads the models. Subsequent runs will use cached models.
