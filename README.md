# TextToImage - AI Image Generation Project

**TextToImage** is an AI-powered image generation platform that leverages [Dezgo's API](https://dev.dezgo.com/guides/models/) to create images from text prompts using models like [Stable Diffusion](https://dev.dezgo.com/guides/models/#models-stable-diffusion). This project demonstrates the integration of AI models in a scalable, user-friendly web application.

## What is AI Image Generation?

AI image generation uses advanced deep learning models to convert text into visuals. Models like [Flux Schnell](https://dezgo.com/model/flux_1_schnell) and [DreamshaperXL Lightning](https://dezgo.com/model/dreamshaperxl_lightning_1024px) process language and generate stylistically diverse images based on the prompts.

## Tech Stack

### Frontend
- **HTML5 & CSS3**: To create a responsive, accessible, and visually appealing user interface.
- **JavaScript**: For client-side logic and dynamic interactions with the server, allowing users to send prompts and receive images in real-time.

### Backend
- **Node.js & Express.js**: Handles routing, API integration, and server-side processing. Express simplifies server setup and efficiently handles incoming HTTP requests and responses.
  
  #### Code Architecture
  The backend architecture is clean and modular:
  - **Router-Based Structure**: Routes are organized in a way that keeps the code easy to maintain and scale. The routing separates concerns by directing requests (e.g., `/generate-image`) to the appropriate controllers.
  - **Middleware**: Used effectively to handle errors, input validation, and API authentication, ensuring the system is robust and secure.

- **Dezgo API**: Integrates with the Dezgo platform, allowing the application to tap into powerful AI models to generate images based on user prompts. This API-driven approach allows for easy expansion to new models and functionalities.

### Deployment
- The project is designed for deployment in any cloud-based infrastructure, offering scalability as user demand grows.

## Key Features

- **AI Model Selection**: Users can choose from different models to generate images with various styles.
- **Trigger Word Optimization**: Input trigger words (like "8k uhd") for enhanced results.
- **Modular Code Design**: The project’s code is structured into distinct modules, making it maintainable and extendable. Each component (e.g., routing, model selection, image generation) is encapsulated in its own file for clarity and scalability.

### Code Architecture Review
The architecture follows modern best practices for a clean, readable codebase:
- **Separation of Concerns**: Each major feature (e.g., image generation, API calls) is modular, which prevents duplication and enhances readability.
- **Asynchronous Programming**: The project makes efficient use of async/await for non-blocking I/O operations, ensuring responsiveness even when calling external APIs.
- **Error Handling**: There’s a comprehensive error-handling strategy in place, making the system resilient and easy to debug.

## How to Use Locally (for Beginners)

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/MattBaccam/TextToImage.git
   
2. Install Node.js:
   Download and install Node.js from nodejs.org.

3. Navigate to the Project Directory:
   ```bash
   cd TextToImage

4. Install Dependencies:
   ```bash
   npm install

5. Insert Dezgo API Key
   - If your [Dezgo account](https://dezgo.com/account) has not yet been created on dezgo please create one.
   - Once account has been created deposit funds for a API key.
   - Find and replace all instances of "process.env.DEZGO_API_KEY" with your newly created API key.

6. Start the Server
   ```bash
   npm start

7. Visit http://localhost:3000 in your browser to use the app.

## Why This Project?
- Clean Codebase: Implements modular code with excellent separation of concerns, making it easy to extend and maintain.
- Cutting-Edge AI Integration/RESTful API Integration: Leverages advanced AI models and demonstrates proficiency in integrating external APIs. 
- Scalable Design: Built for growth, with a flexible structure that supports new features and models with minimal rework.


## To Do List
- Add models page to for further details on all the models available
- Information page that explains image generation and explains how to leverage specific models for your advantage
 (ex. trigger words, prompt weighting and etc) 
