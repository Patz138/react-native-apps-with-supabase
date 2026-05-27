---
name: supabase-auth-ui
description: Workflow for structuring and wiring HTML auth forms for Supabase Auth (signUp, signInWithPassword, signInWithOAuth)
metadata:
  type: skill
---

# Skill: Supabase Auth UI Preparation

## Purpose
Build HTML/JS auth views (Register, Login) that are structurally ready for Supabase Auth SDK drop-in — no SDK required to render and test the UI, but all hook points are clearly marked.

## Config Block (top of `<script>`)
Always declare config constants first, with a TODO comment for SDK initialization:

```js
// ── SUPABASE CONFIG ──────────────────────────────────
// npm install @supabase/supabase-js, then:
// import { createClient } from '@supabase/supabase-js'
// const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
const SUPABASE_URL = 'https://<project-ref>.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_...';
```

## Register Form Structure

**HTML requirements:**
```html
<form id="registerForm" novalidate>
  <!-- name fields (stored in user_metadata) -->
  <input name="firstname" autocomplete="given-name" required>
  <input name="lastname" autocomplete="family-name">
  <!-- auth credentials -->
  <input type="email" name="email" autocomplete="email" required>
  <input type="password" name="password" autocomplete="new-password" required minlength="8">
  <input type="password" name="confirm" autocomplete="new-password" required>
  <!-- consent -->
  <input type="checkbox" name="terms" required>
  <!-- feedback slot -->
  <div id="reg-feedback" class="form-feedback hidden"></div>
  <button type="submit">Account erstellen</button>
</form>
```

**JS handler — Supabase signUp:**
```js
document.getElementById('registerForm').addEventListener('submit', async e => {
  e.preventDefault();
  const fd = new FormData(e.target);

  // client-side validation
  if (fd.get('password') !== fd.get('confirm')) {
    showFeedback(feedback, 'Passwörter stimmen nicht überein.', 'error');
    return;
  }

  showFeedback(feedback, 'Account wird erstellt…', 'loading');

  // TODO: Activate when @supabase/supabase-js is installed:
  // const { data, error } = await supabase.auth.signUp({
  //   email: fd.get('email'),
  //   password: fd.get('password'),
  //   options: {
  //     data: { full_name: `${fd.get('firstname')} ${fd.get('lastname')}` }
  //   }
  // });
  // if (error) { showFeedback(feedback, error.message, 'error'); return; }
  // showFeedback(feedback, 'Bitte bestätige deine E-Mail.', 'success');
});
```

## Login Form Structure

**HTML requirements:**
```html
<form id="loginForm" novalidate>
  <input type="email" name="email" autocomplete="email" required>
  <input type="password" name="password" autocomplete="current-password" required>
  <div id="login-feedback" class="form-feedback hidden"></div>
  <button type="submit">Anmelden</button>
</form>
<!-- OAuth provider buttons below the divider -->
<button id="googleSignIn">Mit Google anmelden</button>
```

**JS handler — signInWithPassword:**
```js
document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  showFeedback(feedback, 'Anmeldung läuft…', 'loading');

  // TODO: Activate when SDK is installed:
  // const { data, error } = await supabase.auth.signInWithPassword({
  //   email: fd.get('email'),
  //   password: fd.get('password'),
  // });
  // if (error) { showFeedback(feedback, error.message, 'error'); return; }
  // navigate('exercises'); // redirect after login
});
```

**JS handler — signInWithOAuth:**
```js
document.getElementById('googleSignIn').addEventListener('click', async () => {
  // TODO: await supabase.auth.signInWithOAuth({ provider: 'google' });
});
```

## Session Management Hooks
Add at app init to redirect already-authenticated users:

```js
// TODO: Check existing session on load
// const { data: { session } } = await supabase.auth.getSession();
// if (session) navigate('exercises');
//
// Listen for auth state changes:
// supabase.auth.onAuthStateChange((event, session) => {
//   if (event === 'SIGNED_IN') navigate('exercises');
//   if (event === 'SIGNED_OUT') navigate('login');
// });
```

## UX Requirements
| Element | Requirement |
|---------|-------------|
| Password input | Toggle visibility button (👁/🙈) |
| Submit button | Show loading state while awaiting async |
| Feedback slot | Three states: `loading`, `success`, `error` — different colors |
| Email | `autocomplete="email"` for password manager support |
| Form | `novalidate` + JS validation (not browser native) |
| Password strength | Hint text: "Min. 8 Zeichen" |

## Feedback Helper (reusable)
```js
function showFeedback(el, message, type) {
  el.textContent = message;
  el.className = `form-feedback form-feedback--${type}`;
  // CSS classes: form-feedback--error, --success, --loading
}
```

## Security Notes
- Never log or display raw passwords
- Use `SUPABASE_PUBLISHABLE_KEY` (safe for client) — never the `service_role` key
- Password fields use `autocomplete="new-password"` (register) / `"current-password"` (login)
- Add PKCE flow for OAuth by setting `flowType: 'pkce'` in `createClient` options
