# Local Development Setup — Museum Visitor Experience Platform

This guide gets the database running locally, exactly as it runs for
the rest of the team, using Docker. Anyone following these steps on
their own machine should end up with an identical local copy —
same 22 tables, same security rules, same test data.

---

## Prerequisites

You need two things installed before anything else works:

1. **Docker Desktop** — download from [docker.com](https://www.docker.com/products/docker-desktop/)
2. **Supabase CLI**

### Installing the Supabase CLI

**Windows** (via [Scoop](https://scoop.sh)):
```powershell
irm get.scoop.sh | iex
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**macOS / Linux** (via Homebrew):
```bash
brew install supabase/tap/supabase
```

Verify either install worked:
```
supabase --version
```

---

## Windows-specific: enabling virtualization

Docker Desktop requires virtualization support. If Docker Desktop
shows **"Virtualization support not detected"** on first launch:

1. Open **Task Manager → Performance → CPU** and check whether
   "Virtualization" says Enabled or Disabled.

2. **If Disabled** — it must be turned on in your PC's BIOS/UEFI
   (restart → press F2/F10/Del/Esc during boot, varies by
   manufacturer → find "Intel VT-x" / "Virtualization Technology" /
   "SVM Mode" → enable → save and restart).

3. **If already Enabled** — the required Windows features are
   probably just switched off. Open **PowerShell as Administrator**
   (right-click PowerShell → Run as administrator) and run:
   ```powershell
   dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
   dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
   ```
   Then **restart your computer** and open Docker Desktop again.

---

## Setting up the project

1. **Clone the repository** and open a terminal in the project folder.
   (The `supabase/` folder — containing `config.toml`, `migrations/`,
   and `seed.sql` — is already part of the repo. There's no need to
   run `supabase init`; that step is only for starting a brand new
   project from scratch.)

2. **Make sure Docker Desktop is open and running** — look for the
   whale icon in your system tray/menu bar.

3. **Start the local stack:**
   ```
   supabase start
   ```
   The first run downloads several Docker images (Postgres, Auth,
   Storage, Studio, etc.) — this can take a few minutes. It will
   then automatically run all migration files in `supabase/migrations/`
   in order, and load `supabase/seed.sql`.

4. When it finishes, it prints a block of URLs and keys. The one you
   want first is:
   ```
   Studio: http://127.0.0.1:54323
   ```
   Open that in a browser — you should see all 22 tables under
   **Table Editor**.

> `127.0.0.1` only ever works on the machine it was started on.
> Every teammate gets their own local copy at their own
> `127.0.0.1` address — that's expected, not a bug.

---

## Creating test accounts locally

The local database starts with **no users** (Supabase Auth users
aren't part of the SQL migrations — they're created through the
Auth system itself). To get a staff test account and a visitor test
account:

1. In Studio, go to **Authentication → Users → Add user**, and
   create two accounts (any email/password), e.g.
   `staff-test@museum.local` and `visitor-test@museum.local`.
   A matching row in `profiles` is created automatically.

2. Promote the staff one — open **SQL Editor** and run:
   ```sql
   update profiles
   set role = 'staff'
   where id = (select id from auth.users where email = 'staff-test@museum.local');
   ```

---

## Stopping and restarting

- **Stop the stack** (e.g. at the end of a work session):
  ```
  supabase stop
  ```
  Your data is preserved — this just shuts the containers down.

- **Start it again later** (after a reboot, or opening the project
  on a different day):
  ```
  supabase start
  ```
  Same data as before, nothing lost.

- **Full reset** (wipes local data and rebuilds from migrations +
  seed.sql from scratch — useful if the schema changed):
  ```
  supabase db reset
  ```

---

## Default / test accounts

| Role     | Email                        | Notes                          |
|----------|-------------------------------|----------------------------------|
| Staff    | staff-test@museum.local       | Created manually per machine — see above |
| Visitor  | visitor-test@museum.local     | Created manually per machine — see above |

There are no seeded accounts baked into the migrations themselves —
Supabase Auth users must be created per-environment as shown above.
