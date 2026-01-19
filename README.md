# Pet Pooja Desktop Application

A production-ready desktop application built with React + Electron for restaurant management.

## 🚀 Features

- ✅ **Cross-platform**: Works on Windows, macOS, and Linux
- ✅ **Online/Offline Support**: Seamless operation in both modes
- ✅ **Modern UI**: Built with Material-UI components
- ✅ **State Management**: Redux Toolkit for efficient state handling
- ✅ **Authentication**: Secure login with token-based auth
- ✅ **Fast Development**: Vite for lightning-fast HMR

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your backend API URL

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```

This will start:
- Vite dev server on `http://localhost:5173`
- Electron app in development mode with hot reload

### Production Build

Build for Windows:
```bash
npm run build:win
```

Build for macOS:
```bash
npm run build:mac
```

Build for Linux:
```bash
npm run build:linux
```

## 📁 Project Structure

```
PetPooja-Frontend/
├── electron/              # Electron main process
│   ├── main.js           # Main process entry
│   └── preload.js        # Preload script
├── src/                  # React application
│   ├── features/         # Feature modules
│   │   ├── auth/        # Authentication
│   │   └── dashboard/   # Dashboard
│   ├── services/        # API services
│   ├── store/           # Redux store
│   ├── hooks/           # Custom hooks
│   ├── routes/          # Route components
│   └── styles/          # Global styles
├── package.json
├── vite.config.js
└── README.md
```

## 🔧 Configuration

### Backend API

Update the API base URL in `.env`:
```
VITE_API_BASE_URL=http://your-backend-url/api
```

### Backend Login Endpoint

The app expects the following response from `/api/auth/login`:

```json
{
  "token": "your-jwt-token",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

## 🎨 Tech Stack

- **Frontend**: React 18
- **Desktop**: Electron
- **UI Library**: Material-UI (MUI)
- **State Management**: Redux Toolkit
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Routing**: React Router v6

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:win` - Build Windows installer
- `npm run build:mac` - Build macOS app
- `npm run build:linux` - Build Linux package
- `npm run preview` - Preview production build

## 🔐 Authentication

The app uses JWT token-based authentication:
- Tokens are stored in localStorage
- Automatic token injection in API requests
- Auto-redirect on 401 responses

## 🌐 Offline Support

- Network status detection
- Offline mode indicator
- Request queue for offline operations
- Auto-sync when connection restored

## 📦 Building for Production

The build process creates installers for your target platform:

**Windows**: Creates `.exe` installer in `dist/`
**macOS**: Creates `.dmg` file in `dist/`
**Linux**: Creates `.AppImage` in `dist/`

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT

---

**Made with ❤️ for Pet Pooja**
