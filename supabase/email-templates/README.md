# Supabase email templates

These templates are meant to be pasted into **Supabase Dashboard → Authentication → Email Templates**.

The app code cannot send custom email bodies through Supabase Auth, so the HTML lives here for manual copy/paste.

## What to update in Supabase

1. **Enable email confirmations**  
   Authentication → Sign Up / Sign In → toggle **Confirm email** on.

2. **Add redirect URLs**  
   Authentication → URL Configuration → add the production/preview domains plus local dev origins, ending in `/reset-password` and `/auth`:
   ```
   http://localhost:8081/reset-password
   http://localhost:8081/auth
   https://your-production-domain.com/reset-password
   https://your-production-domain.com/auth
   https://project-razor-*.vercel.app/reset-password
   https://project-razor-*.vercel.app/auth
   ```

3. **Paste the templates**
   - Copy `confirm-signup.html` into the **Confirm signup** template body.
   - Copy `recovery.html` into the **Reset password** template body.

## Template variables

Supabase uses Go-style variables. If your project sends the built-in confirmation URL, use `{{ .ConfirmationURL }}`. If you need to construct the URL manually, the typical shape is:

```
{{ .SiteURL }}/auth/v1/verify?token={{ .TokenHash }}&type=signup&redirect_to={{ .RedirectTo }}
```

For recovery:

```
{{ .SiteURL }}/auth/v1/verify?token={{ .TokenHash }}&type=recovery&redirect_to={{ .RedirectTo }}
```

Use the button link in the provided templates and check the preview in Supabase before saving.
