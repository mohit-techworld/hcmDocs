# Troubleshooting Guide

## Issue: Seeing Raw HTML Instead of React App

If you're seeing the raw HTML source code instead of the rendered React app, follow these steps:

### 1. Check Browser Console
- Open Developer Tools (F12 or Cmd+Option+I)
- Check the Console tab for JavaScript errors
- Look for any red error messages

### 2. Verify You're Using the Dev Server
Make sure you're accessing the app through the Vite dev server:
- ✅ Correct: `http://localhost:3000`
- ❌ Wrong: Opening `index.html` directly in the browser

### 3. Restart the Dev Server
```bash
# Stop the server (Ctrl+C)
# Then restart
pnpm dev
```

### 4. Clear Browser Cache
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Or clear browser cache completely

### 5. Check Dependencies
```bash
# Make sure all dependencies are installed
pnpm install

# Check if highlight.js is installed
pnpm list highlight.js
```

### 6. Common Errors

#### "Failed to resolve import"
- Run `pnpm install` to install missing dependencies

#### "Cannot find module"
- Delete `node_modules` and `.pnpm-store` (if exists)
- Run `pnpm install` again

#### "Root element not found"
- Check that `index.html` has `<div id="root"></div>`
- Make sure the script tag is correct: `<script type="module" src="/src/main.jsx"></script>`

### 7. Verify Files Exist
```bash
# Check if main files exist
ls src/main.jsx
ls src/App.jsx
ls src/components/Layout.jsx
ls src/components/Sidebar.jsx
ls src/components/Header.jsx
ls src/pages/Home.jsx
```

### 8. Check Vite Server Output
When you run `pnpm dev`, you should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

If you see errors, they will be displayed in the terminal.

### 9. Test with Simple Component
If nothing works, try creating a simple test:

Create `src/App.jsx`:
```jsx
export default function App() {
  return <h1>Hello World</h1>
}
```

If this works, the issue is in one of your components.

### 10. Check Network Tab
- Open Developer Tools → Network tab
- Refresh the page
- Check if `main.jsx` and other files are loading (status 200)
- If files show 404, there's a routing issue

## Still Not Working?

1. Check the terminal where `pnpm dev` is running for errors
2. Check the browser console (F12) for JavaScript errors
3. Make sure you're accessing `http://localhost:3000` (not file://)
4. Try a different browser
5. Make sure Node.js version is >= 18.0

