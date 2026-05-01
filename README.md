# 🛣️ EcoRoad: Textile Waste Asphalt Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.0.0-blue.svg?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg?logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore-orange.svg?logo=firebase)
![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-orange.svg)

## 📌 Overview
**EcoRoad** is a next-generation sustainable infrastructure platform designed to analyze and optimize the integration of **textile waste** into asphalt mixtures. Powered by the Google Gemini AI, EcoRoad enables civil engineers, researchers, and environmental advocates to evaluate road quality, calculate sustainability impacts, and advance eco-friendly construction techniques.

## ✨ Key Features
- **🧠 AI-Powered Analysis Tool:** Utilize advanced machine learning models (Google Gemini) to analyze textile waste composition and predict its viability in specific asphalt mixtures.
- **📊 Impact Calculator:** Quantify the environmental benefits, measuring reduced carbon footprint, landfill diversion, and overall sustainability metric improvements.
- **🛣️ Road Quality Evaluation:** Monitor and assess infrastructure durability, cost-effectiveness, and safety using data-driven analytics.
- **📚 Learning Hub & Research Center:** Access a curated repository of case studies, technical documentation, and best practices on eco-friendly road construction.
- **📈 Interactive Dashboards:** Seamless role-based access control (Admin/User) featuring dynamic data visualization charts (powered by Recharts).
- **🤖 Built-in AI Chatbot:** An integrated, context-aware assistant dedicated to answering technical inquiries regarding textile asphalt guidelines and platform features.

## 🛠️ Tech Stack
- **Frontend Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
- **Styling & UI:** [Tailwind CSS v4](https://tailwindcss.com/), [Motion](https://motion.dev/) (Animations), [Lucide React](https://lucide.dev/) (Icons)
- **Data Visualization:** [Recharts](https://recharts.org/)
- **Backend & Database:** [Firebase](https://firebase.google.com/) (Authentication, Cloud Firestore)
- **AI Integration:** [Google GenAI SDK](https://ai.google.dev/) (`@google/genai`)

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed on your local machine:
- Node.js (v18 or higher)
- npm or yarn

### 2. Installation
Clone the repository and install the required dependencies:

```bash
git clone https://github.com/your-username/ecoroad.git
cd ecoroad
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your Google Gemini API Key and App URL:

```env
VITE_GEMINI_API_KEY="your_gemini_api_key_here"
VITE_APP_URL="http://localhost:3000"
```

Configure your Firebase credentials in `src/firebase.ts` (or `firebase-applet-config.json` based on your setup).

### 4. Run the Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
