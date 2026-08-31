# Contributing to RoomVexo

Thanks for your interest in contributing to RoomVexo! This document covers how to set up the project locally, the coding conventions used, and how to submit changes.

---

## Project Structure

This is a two-app monorepo:

```
roomvexo/
├── client/     # React + Vite frontend
└── server/     # Express + MongoDB backend
```

Each has its own `package.json` and must be set up independently.

---

## Getting Started

1. **Fork** the repository and clone your fork:
   ```bash
   git clone https://github.com/<your-username>/roomvexo.git
   cd roomvexo
   ```

2. **Install dependencies** for both apps:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

3. **Set up environment variables.** Copy the variables listed in the main [README](./README.md#getting-started) into `client/.env` and `server/.env`. You'll need your own free-tier accounts for Clerk, Cloudinary, Razorpay, and Resend to run the full app locally.

4. **Run both apps** (in separate terminals):
   ```bash
   cd server && npm run server   # backend on http://localhost:3000
   cd client && npm run dev      # frontend on http://localhost:5173
   ```

5. **Webhooks won't fire against `localhost`.** If your change touches the Clerk or Razorpay webhook handlers, test with a tunneling tool like [ngrok](https://ngrok.com) pointed at your local server, and register that URL in the respective dashboard.

---

## Before You Start Working

- **Open an issue first** for anything beyond a small fix (typo, small bug) — this avoids duplicate work and lets us discuss the approach before you spend time on it.
- Check existing issues/PRs to make sure someone isn't already working on the same thing.

---

## Making Changes

1. Create a new branch off `main`:
   ```bash
   git checkout -b fix/short-description
   # or: feat/short-description, docs/short-description
   ```

2. Keep changes focused — one fix or feature per branch/PR. Unrelated changes make review harder and slow things down.

3. **Test your change locally** before opening a PR:
   - Run `npm run build` in `client/` to make sure the production build succeeds
   - Manually walk through the affected flow (see the [Testing Checklist](./README.md#testing-checklist) in the README for the core booking/dashboard flow)
   - Check the browser console and server terminal for new errors or warnings

4. Follow the existing code style:
   - Match the patterns already used in the file you're editing (e.g. `req.user._id` for the current authenticated user on the backend — never `req.auth.userId` or `req.userId`, which don't exist in this codebase)
   - Use the existing `toast.success` / `toast.error` pattern for user-facing feedback, with `error.message` in `catch` blocks and `data.message` for backend-reported failures
   - Keep Tailwind classes inline as done elsewhere in the project; don't introduce a separate CSS methodology

---

## Commit Messages

Use a short, conventional prefix so history stays easy to scan:

```
fix: correct total revenue calculation to exclude unpaid bookings
feat: add cancel booking functionality
docs: update setup instructions in README
refactor: simplify room filter logic
```

---

## Submitting a Pull Request

1. Push your branch and open a PR against `main`.
2. In the PR description, include:
   - What the change does and why
   - How you tested it
   - Screenshots for any UI changes
3. Link the related issue if one exists (`Closes #12`).
4. Be responsive to review feedback — small follow-up commits are fine, no need to force-push/squash until review is done.

---

## Reporting Bugs

When filing a bug report, please include:
- Steps to reproduce
- What you expected to happen vs. what actually happened
- Browser/OS (for frontend issues)
- Any relevant console or server error output
- Screenshots if it's a visual issue

---

## Code of Conduct

Be respectful and constructive. Assume good intent, and keep feedback focused on the code, not the person.

---

Questions? Open an issue and tag it `question`.
