# FlowBoard

FlowBoard is a modern SaaS-style project management dashboard for teams that move fast. It provides a polished interface for managing projects, tasks, and team workflows in one place.

## What it does
FlowBoard centralizes project work in a lightweight Kanban interface — create projects, manage tasks, and collaborate with your team using secure Supabase authentication and a responsive, accessible UI.

## Key Features

- Kanban board with drag-and-drop task workflow
- Create, assign, prioritize, and track tasks
- Team member and role-based access management
- Secure email OTP authentication (Supabase)
- Search and filter across projects and tasks
- Fully responsive UI with Tailwind CSS

## Tech Stack

- Frontend: React 18 + TypeScript
- Styling: Tailwind CSS + ShadCN UI
- State management: Zustand
- Auth & Database: Supabase
- Routing: React Router v6
- Build tool: Vite
- Deployment: Vercel

## Getting Started

### Prerequisites

- Node.js v18 or newer
- A Supabase project

### 1. Clone the repository

```bash
git clone https://github.com/vidhi3000/project-harmony-main.git
cd project-harmony-main
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root with the following values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Configure Supabase authentication

In the Supabase dashboard:

- Go to Authentication → URL Configuration
- Set `Site URL` to `http://localhost:5173`

For email confirmation, configure the email template with a callback URL that matches the route used by the app:

```html
<h1>Confirm your email</h1>
<p>
  <a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email">
    Confirm Email
  </a>
</p>
```

### 5. Run the app locally

```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

## Deployment

### Vercel

Ensure `vercel.json` exists in the project root with SPA rewrite support:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Then:

1. Push the repository to GitHub.
2. Connect the project in Vercel.
3. Add the same Supabase env vars in Vercel under Project → Settings → Environment Variables.
4. Update the Supabase site URL to your production domain once deployed.

## Author

Vidhi Maharwade
