# Smart QA Service: An Intelligent Knowledge Base
The Smart QA Service harnesses the power of advanced technologies like Large Language Models (LLM) and Retrieval-Augmented Generation (RAG) to learn from user-customized knowledge bases. It is designed to deliver contextually relevant answers across a broad spectrum of inquiries, ensuring rapid and precise information retrieval. This capability not only enhances user experience but also supports a more efficient knowledge management process.

This project introduces an HTML5 (h5) interface for the Smart QA Service, crafted for seamless integration into your website. By embedding the service as an iframe, you can offer your users direct access to this intelligent knowledge base without navigating away from your site. This integration enriches your website's functionality, providing immediate answers to user questions based on the tailored knowledge base.

---

# Quick Start Guide

1. clone project

```shell
git clone https://github.com/open-kf/smart-qa-h5.git
```

2. install dependencies

```shell
cd smart-qa-h5
npm install
```

3. update environment variables

To ensure seamless communication between your client application and the backend service, especially when the server isn't running in the default environment or is configured to use a custom port, you need to specify the base URL of the [Smart QA Service API server](https://github.com/open-kf/smart-qa-service). This is done by setting the `VITE_BASE_URL` variable within the `.env` file to the URL where the server's API is accessible.

```bash
# Example: Setting the Smart QA Service API base URL
VITE_BASE_URL=https://smart-qa-service.com
```

This step is crucial for directing your application to the correct server location, ensuring that all API requests are routed to the appropriate endpoint.

4. start the project

```shell
npm run dev
```

open the browser and visit `http://localhost:5177`

5. build the project

```shell
npm run build
```

6. deploy

You can deploy the built application to any hosting service that supports static file hosting, such as Vercel, Netlify, or GitHub Pages. Simply upload the contents of the dist directory to your chosen hosting provider, and your application will be live and accessible to users.