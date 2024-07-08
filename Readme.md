# DApp Overview

This DApp allows users to interact with decentralized storage solutions such as IPFS and Pinata to store and retrieve files and metadata. The backend is built with Node.js and Express.js, while the front-end is deployed on a cloud platform.

## Project Setup

### Prerequisites

- Node.js installed
- NPM or Yarn installed
- Pinata account with API keys

### Backend Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/dirm02/Web3-DApp.git
   cd Web3-DApp/backend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the backend directory and add your Pinata API keys:
   ```env
   PINATA_API_KEY=your-pinata-api-key
   PINATA_API_SECRET=your-pinata-api-secret
   ```

4. Start the server:
   ```sh
   node index.js
   ```

### Front-End Setup

1. Navigate to the front-end directory:
   ```sh
   cd ../frontend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm start
   ```

### Deployment

#### Deploying to Vercel

1. Install Vercel CLI:
   ```sh
   npm install -g vercel
   ```

2. Deploy the front-end:
   ```sh
   cd frontend
   vercel
   ```

3. Follow the prompts to deploy your project. Vercel will provide a URL where your project is hosted.

#### Deploying to Netlify

1. Install Netlify CLI:
   ```sh
   npm install -g netlify-cli
   ```

2. Deploy the front-end:
   ```sh
   cd frontend
   netlify deploy
   ```

3. Follow the prompts to deploy your project. Netlify will provide a URL where your project is hosted.


## Links

- [GitHub Repository](https://github.com/dirm02/Web3-DApp.git)
- [Deployed Front-End Application]()
- [Deployed Backend Application]()
