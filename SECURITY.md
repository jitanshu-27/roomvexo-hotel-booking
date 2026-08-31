# Security Policy

## Supported Versions

This project is actively maintained on the `main` branch. Security fixes are applied there; there are no older maintained release branches.

| Version | Supported |
| ------- | --------- |
| `main`  | ✅        |

---

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.** Publicly disclosing a vulnerability before it's fixed puts real users' data and payments at risk.

Instead, report it privately by:

- Opening a [GitHub Security Advisory](../../security/advisories/new) for this repository (preferred), **or**
- Emailing the maintainer directly (see the profile/README for contact info)

Please include:
- A description of the vulnerability and its potential impact
- Steps to reproduce it (proof-of-concept code, request/response samples, etc.)
- The affected file(s)/endpoint(s), if known

### What to expect

- **Acknowledgement:** within a few days of your report
- **Assessment:** we'll confirm whether it's a valid vulnerability and its severity
- **Fix & disclosure:** once patched, we'll credit you (if you'd like) in the fix's commit/release notes, unless you prefer to remain anonymous

We ask that you give us a reasonable amount of time to fix an issue before disclosing it publicly.

---

## Scope

This project handles:
- **Authentication** via Clerk (user sessions, JWT verification)
- **Payments** via Razorpay (order creation, signature verification, webhooks)
- **File uploads** via Cloudinary (user-submitted room images)
- **User data** in MongoDB (profile info, bookings, hotel listings)

Vulnerabilities in the following areas are especially relevant and encouraged to report:
- Authentication/authorization bypass (e.g. accessing another user's bookings, hotel dashboard, or admin-only actions without proper `req.user` checks)
- Payment logic flaws (e.g. manipulating booking price, bypassing payment verification, replaying a webhook payload)
- Webhook signature verification bypass (Clerk `/api/clerk` or Razorpay `/api/payment/razorpay/webhook`)
- Injection vulnerabilities (NoSQL injection, XSS in user-submitted content like hotel/room descriptions)
- Exposure of secrets (API keys, database credentials) through the client bundle, error messages, or logs
- Insecure direct object references (e.g. modifying another user's booking or hotel by guessing/changing an ID in a request)

### Out of scope
- Issues requiring physical access to a user's device
- Social engineering attacks
- Denial-of-service attacks against the hosting infrastructure (Vercel/MongoDB Atlas) rather than the application itself
- Vulnerabilities in third-party services this project depends on (Clerk, Razorpay, Cloudinary, Resend) — please report those directly to the respective vendor

---

## Security Practices in This Project

For contributors and reviewers, some things to keep in mind:

- **Never commit `.env` files or secrets.** Both `client/.env` and `server/.env` are gitignored — keep it that way. If a secret is ever accidentally committed or exposed, treat it as compromised and rotate it immediately (regenerate the key in the relevant dashboard — Clerk, Cloudinary, Razorpay, Resend, MongoDB Atlas — don't just delete it from the repo history).
- **Every backend route that touches user-specific data must use `req.user._id`** (set by the `protect` middleware) to scope the query — never trust a user/hotel/room ID passed directly in the request body or params without verifying it belongs to the authenticated user.
- **Webhook endpoints (`/api/clerk`, `/api/payment/razorpay/webhook`) must always verify the signature** before processing the payload, using the raw request body (not JSON-parsed) as required by Svix and Razorpay respectively.
- **Payment amounts are always calculated server-side** (nights × room price) — never trust a total price sent from the client.

---

Thank you for helping keep RoomVexo and its users safe.
