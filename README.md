# AutoStock — Car Parts E-Commerce

Full flow: Brand → Model → Parts → Cart → Checkout (Paystack or pay-on-delivery).
Separate admin dashboard for uploading car/part images and managing orders.

## Stack
- **Frontend:** React + Vite + Tailwind (black/orange dealership theme)
- **Backend:** Supabase (Postgres database, Auth, Storage, Edge Functions)
- **Payments:** Paystack
- **Hosting:** Render

---

## 1. Set up Supabase

1. Create a project at https://supabase.com
2. Go to **SQL Editor** → paste the contents of `supabase/schema.sql` → Run.
3. Go to **Storage** → **New bucket** → name it `part-images` → make it **public**.
4. Go to **Project Settings > API** → copy your **Project URL** and **anon public key**.
5. Create your first admin account:
   - Go to **Authentication > Users** → **Add user** → enter your admin email/password.
   - Copy that user's UUID.
   - In **SQL Editor**, run:
     ```sql
     insert into admin_users (id, full_name) values ('paste-the-uuid-here', 'Your Name');
     ```
   - This user can now log in at `/admin/login`. Regular signups (via `/signup`) are never admins unless added here.

## 2. Set up Paystack

1. Create an account at https://paystack.com
2. Go to **Settings > API Keys & Webhooks** → copy your **Public Key** and **Secret Key**.
3. Set the secret key on your Supabase Edge Function (never in frontend code):
   ```
   supabase secrets set PAYSTACK_SECRET_KEY=sk_live_or_test_xxx
   ```
4. Deploy the verification function:
   ```
   supabase functions deploy verify-payment
   ```

## 3. Configure the frontend

```
cd frontend
cp .env.example .env
```
Fill in `.env` with your Supabase URL/anon key and Paystack public key.

```
npm install
npm run dev
```

## 4. Deploy to Render

**Frontend (Static Site):**
- New → Static Site → connect this repo
- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Add the same environment variables from `.env` in Render's dashboard

**Supabase Edge Functions** run on Supabase's own infrastructure, not Render — no separate backend server is needed.

---

## How restocking works

When a part sells out, admin doesn't need to create a new listing — in **Admin → Parts & Images**, they:
1. Update the **stock** field, and/or
2. Click **Replace Image** and upload the new photo.

The new image overwrites the old one at the same storage path automatically, and the part is marked available again once stock > 0.

## Project structure

```
car-parts-ecommerce/
├── frontend/               React app (customer site + admin dashboard)
│   └── src/
│       ├── pages/          Home, Brands, BrandModels, ModelParts, Cart, Checkout...
│       └── pages/admin/    AdminLogin, ManageBrands, ManageModels, ManageParts, Orders...
└── supabase/
    ├── schema.sql           Database tables + row-level security policies
    └── functions/
        └── verify-payment/  Edge Function that confirms Paystack payments server-side
```
