# ChatHive Frontend

React client for **ChatHive**, a real-time chat app with servers, channels, direct messages, and 1-on-1 video calling.

**Live demo:** https://chathive-chat.vercel.app

## Features

- Real-time channel and direct messaging
- Create servers, join via invite links
- Online status and typing indicators
- 1-on-1 video/voice calls (WebRTC) with mute toggles
- Profile picture upload
- Instant UI updates: socket events write straight into the React Query cache
- Duplicate-safe messages (deduplicated by `_id`)

## Tech Stack

- **React** + **Vite**
- **React Router v6**
- **TanStack React Query** for data fetching and caching
- **Socket.io Client** for real-time events
- **WebRTC** for peer-to-peer calls (STUN only)
- Deployed on **Vercel**

## Getting Started

```bash
git clone https://github.com/MuhammadSami-ud-din/chathive-frontend.git
cd chathive-frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`. You'll need the [ChatHive backend](https://github.com/MuhammadSami-ud-din/CHATHIVE) running for it to work.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build locally |

## Deployment

Hosted on Vercel. A `vercel.json` rewrite sends all routes to `index.html`, so client-side routes like `/channels/123` don't 404 on refresh.

## Notes

- Video calling uses STUN only (no TURN), so calls may fail on strict or symmetric NATs.

## Author

**Muhammad Sami ud Din**, [GitHub](https://github.com/MuhammadSami-ud-din)
