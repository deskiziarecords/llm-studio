# Echo AI Assistant

Echo AI Assistant is a versatile chat application designed to interact with various AI models, including cloud-based services like OpenAI and Anthropic, as well as locally hosted language models. It features voice input/output capabilities and a customizable interface.

## Features

*   **Multi-Provider Support**: Connect to OpenAI, Anthropic, and local OpenAI-compatible AI models.
*   **Chat Interface**: Modern and intuitive interface for seamless conversations.
*   **Voice Input/Output**: Use your voice to interact with the AI (Speech-to-Text and Text-to-Speech).
*   **Customizable Settings**: Configure API keys, voice preferences, appearance (themes, font sizes), and model parameters.
*   **Local Model Focus**: Pre-configured to easily connect to local LLM servers like LM Studio.
*   **Markdown Rendering**: Support for markdown in AI responses.
*   **Responsive Design**: Works across different screen sizes.

## Getting Started

### Prerequisites

*   Node.js (version 18.x or later recommended)
*   npm or yarn

### Installation & Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/deskiziarecords/llm-studio.git
    cd llm-studio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    This will start the application, typically on `http://localhost:5173`.

4.  **Open in browser:** Navigate to the local URL provided in your terminal.

## Using with a Local LLM Server (LM Studio Example)

This application is designed to work with local Large Language Models (LLMs) that expose an OpenAI-compatible API endpoint. LM Studio is a popular tool that allows you to download, run, and serve various open-source models locally.

### 1. LM Studio Setup

*   **Download and Install**: If you haven't already, download and install [LM Studio](https://lmstudio.ai/) for your operating system.
*   **Download a Model**: Within LM Studio, search for and download a model you wish to use (e.g., a GGUF version of Mistral, Llama, etc.).
*   **Start the AI Model Server**:
    *   Navigate to the "Server" tab (often represented by an icon like `<-->`).
    *   Select the model you downloaded from the dropdown.
    *   Click "Start Server".
    *   By default, LM Studio starts the server at `http://localhost:1234/v1`. Note this address.

### 2. Application Configuration

*   **Pre-configured for LM Studio**: Echo AI Assistant comes pre-configured with a default model setting for "LM Studio (Local)".
*   **Default Endpoint**: This default configuration in the application targets `http://localhost:1234/v1`, which is the standard for LM Studio.
    *   If your LM Studio server is running on a different port or path, you can select the "LM Studio (Local)" model. The application will use its default. If you need to specify a *different* custom endpoint for the "LM Studio (Local)" entry beyond the application's default for it, you would currently need to modify its `endpoint` field in `src/store/index.ts`.
*   **Select the Model**:
    *   In the Echo AI Assistant application, click on the model selector (usually at the top or side of the chat interface).
    *   Choose "LM Studio (Local)" from the list of available models. The application is set to use this model by default on first launch.
*   **No API Key Needed**: For this local setup, API keys are not required. The API key input fields in the Settings page will be hidden or indicate they are not necessary when a local model is active.

### 3. Start Chatting!

Once your local LM Studio server is running and the "LM Studio (Local)" model is selected in the application, you can start chatting with your local LLM.

### Troubleshooting & Notes

*   **Server Must Be Running**: Ensure your LM Studio (or other local LLM) server is active and serving the model.
*   **Performance**: The speed and performance of responses from local models depend heavily on your computer's hardware (CPU, RAM, and GPU if applicable for the model).
*   **CORS Issues**: Most local server tools like LM Studio are configured to allow requests from local web applications (like this one running on `localhost:5173`). If you encounter connection problems, check the console output from your local LLM server for any Cross-Origin Resource Sharing (CORS) errors and adjust its settings if necessary.
*   **Model Compatibility**: Ensure the model you are serving is compatible with the OpenAI chat completions API format. Most models served via LM Studio aim for this compatibility.

## Configuration for Cloud Models

If you wish to use cloud-based models:

1.  Navigate to the **Settings** page within the application.
2.  Select a cloud model (e.g., GPT-3.5 Turbo, Claude 3 Opus) from the model selector.
3.  Enter your API key for the respective provider (e.g., OpenAI, Anthropic) in the API Keys section.
4.  Save your settings.

## Contributing

Contributions are welcome! If you have suggestions, bug reports, or want to contribute code, please feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature` or `bugfix/YourBugfix`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/YourFeature`).
6.  Open a Pull Request.

## License

This project is licensed under the MIT License. (A `LICENSE` file should be created and added to the repository).

---

*Powered by Vite, React, TypeScript, and Tailwind CSS.*
(The StackBlitz link can be re-added if desired, but keeping it minimal for now)