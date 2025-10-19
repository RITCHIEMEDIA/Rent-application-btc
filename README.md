# Welcome to your Lovable project

## ⚠️ Migrating from Lovable?

If you've exceeded your Lovable limits or want to use your own Supabase account:

👉 **See [SUPABASE_MIGRATION_CHECKLIST.md](./SUPABASE_MIGRATION_CHECKLIST.md)** for step-by-step migration guide

Complete migration package includes:
- **[schema/complete-database-setup.sql](./schema/complete-database-setup.sql)** - Full database schema
- **[.env.template](./.env.template)** - Environment variables template
- All Edge Functions ready to deploy

---

## Project info

**URL**: https://lovable.dev/projects/82daa713-8625-4671-9e0a-700f3759d721

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/82daa713-8625-4671-9e0a-700f3759d721) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/82daa713-8625-4671-9e0a-700f3759d721) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## BTCPay Payment Configuration

This project uses BTCPay Server for Bitcoin payments. To configure:

### Option 1: Supabase Dashboard (Easiest)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/tcffrkyefxblgeubssdm)
2. Navigate to **Edge Functions** → **Manage secrets**
3. Add these secrets:
   - `BTCPAY_API_KEY`
   - `BTCPAY_STORE_ID`
   - `BTCPAY_URL`

### Option 2: Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Run the setup script (PowerShell)
.\setup-btcpay.ps1

# Or manually:
supabase login
supabase link --project-ref tcffrkyefxblgeubssdm
supabase secrets set BTCPAY_API_KEY=your_key_here
supabase secrets set BTCPAY_STORE_ID=your_store_id_here
supabase secrets set BTCPAY_URL=https://btcpay.coincharge.io
```

For detailed setup instructions, see [BTCPAY_SETUP.md](./BTCPAY_SETUP.md)
