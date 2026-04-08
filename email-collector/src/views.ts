import type { EmailEntry } from "./kv";

const FAVICON_DATA_URI = `data:image/svg+xml,%3Csvg%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2048%2048%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M24%2046C36.1503%2046%2046%2036.1503%2046%2024C46%2011.8497%2036.1503%202%2024%202C11.8497%202%202%2011.8497%202%2024C2%2036.1503%2011.8497%2046%2024%2046Z%22%20fill%3D%22%23686868%22%2F%3E%3Cpath%20d%3D%22M15.9519%2022.5198C19.6279%2021.9132%2022.5098%2018.8699%2023.1134%2015.1879L23.316%2013.4181C23.3661%2013.1369%2023.1756%2012.7452%2022.8206%2012.7733C20.0431%2012.9903%2017.4219%2013.9083%2015.9639%2014.5049C15.24%2014.8022%2014.7687%2015.5052%2014.7687%2016.2887V22.0618C14.7687%2022.4033%2015.0755%2022.6645%2015.4124%2022.6102L15.9519%2022.5218V22.5198Z%22%20fill%3D%22%23D7D7D7%22%2F%3E%3Cpath%20d%3D%22M24.8866%2015.188C25.4922%2018.87%2028.3741%2021.9133%2032.0481%2022.52L32.5876%2022.6083C32.9245%2022.6646%2033.2313%2022.4034%2033.2313%2022.06V16.2868C33.2313%2015.5034%2032.7601%2014.8003%2032.0361%2014.503C30.5761%2013.9044%2027.957%2012.9884%2025.1794%2012.7714C24.8224%2012.7433%2024.6399%2013.139%2024.682%2013.4163L24.8846%2015.186L24.8866%2015.188Z%22%20fill%3D%22%23D7D7D7%22%2F%3E%3Cpath%20d%3D%22M32.0453%2024.1371C27.0216%2025.1294%2024.6892%2028.474%2024.6892%2034.8056C24.6892%2035.123%2025.0041%2035.344%2025.2688%2035.1672C27.5791%2033.6064%2032.663%2029.5326%2033.1864%2024.4364C33.2065%2023.7956%2032.4063%2024.0969%2032.0453%2024.1371Z%22%20fill%3D%22%23D7D7D7%22%2F%3E%3Cpath%20d%3D%22M15.9538%2024.1371C20.9775%2025.1294%2023.3098%2028.474%2023.3098%2034.8056C23.3098%2035.123%2022.995%2035.344%2022.7302%2035.1672C20.4199%2033.6064%2015.3361%2029.5326%2014.8126%2024.4364C14.7926%2023.7956%2015.5928%2024.0969%2015.9538%2024.1371Z%22%20fill%3D%22%23D7D7D7%22%2F%3E%3C%2Fsvg%3E`;

// Auth0 Shield Lockup logo — Snow (#FFFEFA) fill for dark backgrounds
const AUTH0_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3040.68 1184.71" class="auth0-logo"><g fill="#FFFEFA"><path d="M1048.41,690.3c0-82.24,68.23-113.31,154.12-113.31h83.46c6.09,0,9.14-3.05,9.14-9.14v-12.79c0-44.47-33.5-65.79-82.85-65.79-38.38,0-64.57,12.8-78.59,40.21-4.87,9.75-9.14,13.4-19.49,13.4h-35.94c-11.57,0-17.06-6.09-17.06-15.23,0-4.27,1.22-10.36,6.09-20.71,23.15-48.12,68.23-79.19,152.3-79.19,93.81,0,149.25,41.43,149.25,132.19v150.47c0,15.23,5.48,18.89,18.27,18.89h.61c12.18,0,18.27,6.09,18.27,18.27v30.46c0,12.18-6.09,18.27-18.27,18.27h-21.32c-34.73,0-52.39-9.14-63.36-32.9-1.83-4.27-3.05-5.48-5.48-5.48s-4.27,1.22-9.14,5.48c-27.41,24.37-61.53,37.16-107.22,37.16-69.45,0-132.8-32.29-132.8-110.26ZM1295.13,648.87v-6.09c0-6.09-3.05-9.14-9.14-9.14h-91.38c-42.64,0-72.49,15.84-72.49,53.61s30.46,53.61,67.01,53.61c56.66,0,106-35.34,106-91.99Z"/><path d="M1436.46,637.3v-187.02c0-12.18,6.09-18.27,18.27-18.27h37.16c12.18,0,18.27,6.09,18.27,18.27v180.32c0,58.48,21.32,101.73,82.24,101.73,64.58,0,95.03-51.17,95.03-110.26v-171.8c0-12.18,6.09-18.27,18.27-18.27h37.16c12.18,0,18.27,6.09,18.27,18.27v327.75c0,12.18-6.09,18.27-18.27,18.27h-33.5c-10.97,0-17.06-5.48-18.89-16.45l-3.05-16.45c-.61-3.66-2.44-5.48-5.48-5.48-2.43,0-4.26,1.22-7.3,4.27-24.98,22.54-55.44,38.38-100.52,38.38-95.64,0-137.68-68.84-137.68-163.26Z"/><path d="M1829.39,697v-369.17c0-12.18,6.09-18.27,18.27-18.27h37.16c12.18,0,18.27,6.09,18.27,18.27v95.03c0,6.09,3.05,9.14,9.14,9.14h107.83c12.18,0,18.27,6.09,18.27,18.27v30.46c0,12.18-6.09,18.28-18.27,18.28h-107.83c-6.09,0-9.14,3.05-9.14,9.14v182.15c0,26.8,12.18,38.99,39.59,38.99h84.68c12.18,0,18.27,6.09,18.27,18.27v30.46c0,12.18-6.09,18.27-18.27,18.27h-88.33c-76.15,0-109.65-30.46-109.65-99.3Z"/><path d="M2096.21,778.02v-450.19c0-12.18,6.09-18.27,18.27-18.27h37.16c12.18,0,18.27,6.09,18.27,18.27v141.94c0,3.66,2.43,6.09,5.48,6.09,1.83,0,3.65-.61,9.14-5.48,26.8-24.37,56.04-42.64,105.39-42.64,95.03,0,137.68,67.01,137.68,165.7v184.59c0,12.18-6.09,18.27-18.27,18.27h-37.16c-12.18,0-18.27-6.09-18.27-18.27v-180.93c0-56.66-21.93-101.13-81.63-101.13-63.97,0-102.34,51.78-102.34,124.89v157.17c0,12.18-6.09,18.27-18.27,18.27h-37.16c-12.18,0-18.27-6.09-18.27-18.27Z"/><path d="M2473.9,553.23c0-165.09,63.96-247.94,178.49-247.94s178.48,82.85,178.48,247.94-63.96,247.33-178.48,247.33-178.49-82.85-178.49-247.33ZM2563.45,608.67l161.44-179.1c2.44-3.05,3.65-4.87,3.65-9.14,0-3.05-.61-6.7-4.87-12.19-16.45-20.1-39.59-34.72-71.27-34.72-67.01,0-104.78,60.92-104.78,180.32,0,17.05.61,32.29,3.05,53,.61,3.66,2.43,6.09,5.48,6.09,1.83,0,4.27-.61,7.31-4.26ZM2757.17,552.01c0-17.06-.61-32.29-3.05-53-.61-3.66-2.43-6.09-5.48-6.09-1.83,0-4.27.61-7.31,4.27l-161.44,179.1c-2.43,3.05-3.65,4.87-3.65,9.14,0,3.05.61,6.7,4.87,12.18,16.45,20.1,39.59,34.72,71.28,34.72,67.01,0,104.77-60.92,104.77-180.32Z"/></g><g fill="#FFFEFA"><path d="M250.19,536.56c125.44-20.65,223.75-118.97,244.41-244.41l10.05-61c1.93-11.8-7.76-22.21-19.69-21.3-95.51,7.39-185.52,39.01-235.23,59.39-24.14,9.91-39.93,33.37-39.93,59.48v192.82c0,11.34,10.14,19.97,21.34,18.13,0,0,19.05-3.12,19.05-3.12Z"/><path d="M555.1,292.16c20.65,125.44,118.97,223.75,244.41,244.41l19.05,3.12c11.2,1.84,21.34-6.79,21.34-18.13v-192.82c0-26.12-15.79-49.57-39.93-59.48-49.71-20.42-139.76-52-235.23-59.39-11.93-.92-21.66,9.46-19.69,21.3l10.05,61Z"/><path d="M799.5,597.01c-125.44,20.65-223.75,118.97-244.41,244.41l-12.53,119.06c-1.15,10.74,10.79,18.31,19.78,12.3.09-.05.14-.09.23-.14,78.67-53.06,258.13-191.95,275.89-365.44.87-8.54-6.7-15.51-15.15-14.14l-23.78,3.9-.05.05Z"/><path d="M494.6,841.42c-20.65-125.44-118.97-223.75-244.41-244.41l-25.57-4.22c-7.53-1.24-14.27,5-13.54,12.62,16.84,174.46,198.78,314.22,278.14,367.37h0c8.22,5.46,19.09-1.1,18.04-10.92l-12.67-120.44Z"/></g></svg>`;

const COMMON_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #191919;
    --surface: #222222;
    --surface-hover: #2a2a2a;
    --border: #333333;
    --border-focus: #3F59E4;
    --text: #FFFEFA;
    --text-muted: #999999;
    --accent: #3F59E4;
    --accent-glow: rgba(63, 89, 228, 0.25);
    --success: #4CB7A3;
    --success-bg: rgba(76, 183, 163, 0.1);
    --error: #E27133;
    --error-bg: rgba(226, 113, 51, 0.1);
    --radius: 10px;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .noise {
    position: fixed;
    inset: 0;
    z-index: 0;
    opacity: 0.03;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 256px 256px;
  }

  .container {
    position: relative;
    z-index: 1;
    max-width: 520px;
    margin: 0 auto;
    padding: 80px 24px 48px;
  }

  .auth0-logo {
    display: block;
    width: 160px;
    height: auto;
    margin-bottom: 32px;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--accent);
    background: var(--accent-glow);
    border: 1px solid rgba(63, 89, 228, 0.2);
    padding: 6px 12px;
    border-radius: 100px;
    margin-bottom: 24px;
  }

  .badge .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  h1 {
    font-family: 'DM Sans', sans-serif;
    font-size: 32px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin-bottom: 12px;
  }

  .subtitle {
    font-size: 15px;
    color: var(--text-muted);
    line-height: 1.6;
    margin-bottom: 36px;
  }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 28px;
  }

  label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-muted);
    margin-bottom: 8px;
    letter-spacing: 0.01em;
  }

  input[type="email"] {
    width: 100%;
    padding: 12px 16px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    color: var(--text);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  input[type="email"]::placeholder {
    color: var(--text-muted);
    opacity: 0.5;
  }

  input[type="email"]:focus {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }

  button[type="submit"], .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 12px 20px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    background: var(--accent);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    margin-top: 16px;
  }

  button[type="submit"]:hover, .btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 20px var(--accent-glow);
  }

  button[type="submit"]:active, .btn:active {
    transform: translateY(0);
  }

  button[type="submit"]:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .message {
    margin-top: 16px;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    display: none;
  }

  .message.success {
    display: block;
    background: var(--success-bg);
    color: var(--success);
    border: 1px solid rgba(76, 183, 163, 0.2);
  }

  .message.error {
    display: block;
    background: var(--error-bg);
    color: var(--error);
    border: 1px solid rgba(226, 113, 51, 0.2);
  }

  .footer {
    text-align: center;
    margin-top: 36px;
    font-size: 12px;
    color: var(--text-muted);
    opacity: 0.6;
  }

  .footer a {
    color: var(--text-muted);
    text-decoration: none;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-in {
    animation: fadeUp 0.5s ease-out both;
  }

  .animate-in:nth-child(2) { animation-delay: 0.08s; }
  .animate-in:nth-child(3) { animation-delay: 0.16s; }
  .animate-in:nth-child(4) { animation-delay: 0.24s; }
  .animate-in:nth-child(5) { animation-delay: 0.32s; }
`;

export function renderForm(count?: number): string {
  const countDisplay =
    count !== undefined && count > 0
      ? `<span class="dot"></span>${count} registered`
      : `<span class="dot"></span>Collecting emails`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Workshop Registration — Gmail</title>
  <link rel="icon" type="image/svg+xml" href="${FAVICON_DATA_URI}">
  <style>${COMMON_STYLES}</style>
</head>
<body>
  <div class="noise"></div>
  <div class="container">
    <div class="animate-in">${AUTH0_LOGO_SVG}</div>
    <div class="badge animate-in" id="badge">${countDisplay}</div>
    <h1 class="animate-in">Register your Gmail</h1>
    <p class="subtitle animate-in">
      Submit your Gmail address to be added as a test user for the
      <strong>Flip, Match, &amp; Secure</strong> workshop.
      This is required for the Google OAuth integration to work.
    </p>
    <div class="card animate-in">
      <form id="email-form">
        <label for="email">Gmail address</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="you@gmail.com"
          pattern="[a-zA-Z0-9._%+\\-]+@gmail\\.com$"
          required
          autocomplete="email"
          spellcheck="false"
        />
        <button type="submit" id="submit-btn">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2L2 8.5l4.5 2L10 6l-3.5 4.5L9 14z"/></svg>
          Submit
        </button>
        <div id="message" class="message"></div>
      </form>
    </div>
    <p class="footer">Auth0 Workshop &middot; Google OAuth Test Users</p>
  </div>
  <script>
    const form = document.getElementById('email-form');
    const emailInput = document.getElementById('email');
    const submitBtn = document.getElementById('submit-btn');
    const messageEl = document.getElementById('message');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();

      if (!email.match(/^[a-zA-Z0-9._%+\\-]+@gmail\\.com$/i)) {
        showMessage('Please enter a valid @gmail.com address.', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting…';

      try {
        const res = await fetch('/api/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();

        if (data.success) {
          showMessage('You\\'re registered! Your email has been added.', 'success');
          emailInput.value = '';
          if (data.count !== undefined) {
            document.getElementById('badge').innerHTML =
              '<span class="dot"></span>' + data.count + ' registered';
          }
        } else if (data.duplicate) {
          showMessage('This email is already registered.', 'error');
        } else {
          showMessage(data.error || 'Something went wrong.', 'error');
        }
      } catch {
        showMessage('Network error. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2L2 8.5l4.5 2L10 6l-3.5 4.5L9 14z"/></svg> Submit';
      }
    });

    function showMessage(text, type) {
      messageEl.textContent = text;
      messageEl.className = 'message ' + type;
    }
  </script>
</body>
</html>`;
}

export function renderAdmin(emails: EmailEntry[]): string {
  const csvList = emails.map((e) => e.email).join(", ");
  const rows = emails
    .map(
      (e, i) => `
    <tr>
      <td class="row-num">${i + 1}</td>
      <td class="row-email">${escapeHtml(e.email)}</td>
      <td class="row-date">${new Date(e.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin — Email Collector</title>
  <link rel="icon" type="image/svg+xml" href="${FAVICON_DATA_URI}">
  <style>
    ${COMMON_STYLES}

    .container { max-width: 680px; }

    .stats {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
    }

    .stat {
      flex: 1;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 20px;
    }

    .stat-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 28px;
      font-weight: 700;
      color: var(--accent);
    }

    .stat-label {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .actions {
      display: flex;
      gap: 10px;
      margin-bottom: 24px;
    }

    .actions .btn {
      margin-top: 0;
      width: auto;
      flex: 1;
    }

    .btn-outline {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text);
    }

    .btn-outline:hover {
      background: var(--surface-hover);
      box-shadow: none;
      transform: none;
    }

    .btn-danger {
      background: transparent;
      border: 1px solid var(--error);
      color: var(--error);
    }

    .btn-danger:hover {
      background: var(--error);
      color: #fff;
      box-shadow: none;
      transform: none;
    }

    .csv-box {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: var(--text-muted);
      line-height: 1.7;
      word-break: break-all;
      max-height: 120px;
      overflow-y: auto;
      display: none;
    }

    .csv-box.visible { display: block; }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead th {
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 12px 16px;
      border-bottom: 1px solid var(--border);
    }

    tbody td {
      padding: 10px 16px;
      font-size: 13px;
      border-bottom: 1px solid var(--border);
    }

    tbody tr:last-child td { border-bottom: none; }

    tbody tr:hover { background: var(--surface-hover); }

    .row-num {
      font-family: 'JetBrains Mono', monospace;
      color: var(--text-muted);
      width: 48px;
      font-size: 12px;
    }

    .row-email {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
    }

    .row-date {
      color: var(--text-muted);
      font-size: 12px;
      text-align: right;
      white-space: nowrap;
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
      color: var(--text-muted);
    }

    .empty-state p { font-size: 14px; }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 36px;
    }

    .topbar a {
      font-size: 13px;
      color: var(--text-muted);
      text-decoration: none;
      transition: color 0.15s;
    }

    .topbar a:hover { color: var(--text); }

    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(80px);
      background: var(--success);
      color: var(--bg);
      font-size: 13px;
      font-weight: 600;
      padding: 10px 20px;
      border-radius: 100px;
      opacity: 0;
      transition: transform 0.3s ease, opacity 0.3s ease;
      pointer-events: none;
      z-index: 100;
    }

    .toast.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  </style>
</head>
<body>
  <div class="noise"></div>
  <div class="container">
    <div class="animate-in">${AUTH0_LOGO_SVG}</div>
    <div class="topbar animate-in">
      <div class="badge"><span class="dot"></span>Admin</div>
      <a href="/logout">Logout</a>
    </div>

    <h1 class="animate-in">Registered Emails</h1>
    <p class="subtitle animate-in">
      Collected Gmail addresses for Google Cloud Console test users.
    </p>

    <div class="stats animate-in">
      <div class="stat">
        <div class="stat-value">${emails.length}</div>
        <div class="stat-label">Total Emails</div>
      </div>
    </div>

    <div class="actions animate-in">
      <button class="btn" onclick="copyCSV()">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="5" width="9" height="9" rx="1.5"/><path d="M2 10V2.5A.5.5 0 012.5 2H10"/></svg>
        Copy as CSV
      </button>
      <button class="btn btn-outline" onclick="toggleRaw()">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 6 1 8 4 10"/><polyline points="12 6 15 8 12 10"/><line x1="9.5" y1="3" x2="6.5" y2="13"/></svg>
        Toggle Raw
      </button>
      <button class="btn btn-danger" onclick="clearAll()">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 13 6"/><path d="M5 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/><path d="M12 6v7a1 1 0 01-1 1H5a1 1 0 01-1-1V6"/></svg>
        Clear All
      </button>
    </div>

    <div id="csv-box" class="csv-box animate-in">${escapeHtml(csvList)}</div>

    <div class="card animate-in">
      ${
        emails.length > 0
          ? `<table>
        <thead>
          <tr>
            <th>#</th>
            <th>Email</th>
            <th style="text-align:right">Submitted</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`
          : `<div class="empty-state"><p>No emails collected yet.</p></div>`
      }
    </div>

    <p class="footer">Auth0 Workshop &middot; Email Collector Admin</p>
  </div>
  <div id="toast" class="toast">Copied to clipboard!</div>
  <script>
    const csvText = ${JSON.stringify(csvList)};

    function copyCSV() {
      navigator.clipboard.writeText(csvText).then(() => {
        const toast = document.getElementById('toast');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
      });
    }

    function toggleRaw() {
      document.getElementById('csv-box').classList.toggle('visible');
    }

    async function clearAll() {
      if (!confirm('Are you sure you want to clear all emails? This cannot be undone.')) return;
      await fetch('/admin/api/emails', { method: 'DELETE' });
      location.reload();
    }
  </script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
