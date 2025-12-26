---
title: React Contexts
sidebar_position: 2
---

# React Contexts

The `/src/contexts` directory hosts React context providers that deliver cross-cutting functionality such as chat state, theme preferences, and app-wide modals.  Contexts complement Zustand stores by wrapping top-level components with additional behaviour.

## Context Directory

| File | Purpose |
| --- | --- |
| `contexts/ChatContextv2.jsx` | Provides chat socket connection, message handlers, typing indicators, unread count management. |
| `contexts/NotificationContext.jsx` (if present) | Global notification preferences (sound, desktop notifications). |
| `contexts/ThemeContext.jsx` (if present) | Manages light/dark theme switching. |
| `contexts/UserPreferenceContext.jsx` (if present) | Stores misc user preferences beyond auth store (e.g., dashboard layouts). |

> ⚠️ Context files evolve; check the directory for additional providers.

## Chat Context Highlight

`ChatContextv2.jsx` is the most actively used context. It wraps `<App />` in `main.jsx` (or inside router) to make chat functions available throughout the component tree.

### Responsibilities

- Initialise Socket.io client with auth token (`useAuthStore`).
- Join chat rooms, handle incoming messages, typing indicators.
- Provide functions like `sendMessage`, `markConversationRead`, `openConversation`.
- Syncs with `useNotificationStore` to update unread counts.

### Usage

```jsx
import { ChatProviderv2 } from "../contexts/ChatContextv2";

function AppShell() {
  return (
    <ChatProviderv2>
      <RouterProvider router={router} />
    </ChatProviderv2>
  );
}
```

Components use the context via:

```jsx
const { conversations, sendMessage, typingUsers } = useChatContext();
```

## When to Use Context vs Store

- **Use Context** when you need to wrap the component tree with providers (e.g., sockets, modals) or integrate third-party libraries that require React context.
- **Use Zustand stores** for data/state shared between components but not requiring React context contract.
- Many contexts internally use stores to persist state.

## Adding a New Context

1. Create file under `src/contexts/MyContext.jsx`.
2. Define a context and provider:
   ```jsx
   const MyContext = createContext();
   export const MyProvider = ({ children }) => {
     const value = { ... };
     return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
   };
   export const useMyContext = () => useContext(MyContext);
   ```
3. Wrap `App.jsx` (or relevant subtree) with the provider.
4. Document the new context here.

Context providers are critical for features that require lifecycle awareness (socket connections, i18n, modal portals). Keep this page updated whenever new contexts are introduced.

