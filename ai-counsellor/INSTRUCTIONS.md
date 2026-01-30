# AI Counsellor - Setup Instructions

## 1. Prerequisites
- Node.js installed.
- **Disk Space**: Please ensure you have sufficient disk space. The initial installation failed due to "No space left on device". You will need to free up approximately 200-500MB for `node_modules`.

## 2. Installation
Once you have cleared disk space, run the following command in the `ai-counsellor` directory:
```bash
npm install
```

## 3. Running the App
Start the development server:
```bash
npm run dev
```

## 4. Features
- **Landing Page**: Modern, responsive design explaining the platform.
- **Dashboard**: Stage-based progress tracking (Onboarding -> Shortlisting -> Locking -> Applications).
- **Dark Mode**: Sleek dark UI with glassmorphism effects.
- **State Management**: Stages are locked/unlocked sequentially.

## 5. Technology
- Next.js (App Router)
- Typescript
- CSS Modules (Vanilla CSS for styling)
