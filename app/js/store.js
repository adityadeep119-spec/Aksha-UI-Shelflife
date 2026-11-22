// app/js/store.js — Shared ShelfLife state & PRD business rules

const SL_KEYS = {
  SESSION: 'sl_session',
  BOOKS: 'sl_books',
  LOANS: 'sl_loans',
  USERS: 'sl_users',
  SIM_DATE: 'sl_sim_date',
  THEME: 'sl_theme'
};

// Date helpers (YYYY-MM-DD strings to prevent timezone bugs — PRD Section 18)
function getRealToday() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getToday() {
  return localStorage.getItem(SL_KEYS.SIM_DATE) || getRealToday();
}

function addDays(dateStr, days) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

function diffDays(fromStr, toStr) {
  const [y1, m1, d1] = fromStr.split('-').map(Number);
  const [y2, m2, d2] = toStr.split('-').map(Number);
  const ms = Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1);
  return Math.round(ms / 86400000);
}

// Formats "2026-08-28" -> "28 Aug 2026" (PRD Section 13 UX copy rule)
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${d} ${months[m - 1]} ${y}`;
}

// Derived due status (PRD Section 10 & 13)
function getDueStatus(dueOn) {
  const today = getToday();
  const daysLeft = diffDays(today, dueOn);

  if (daysLeft < 0) {
    const overdue = Math.abs(daysLeft);
    return {
      text: `Overdue by ${overdue} ${overdue === 1 ? 'day' : 'days'}`,
      tone: 'danger',
      daysLeft,
      isOverdue: true
    };
  }
  if (daysLeft === 0) {
    return { text: 'Due today', tone: 'warning', daysLeft: 0, isOverdue: false };
  }
  if (daysLeft <= 3) {
    return {
      text: `Due in ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}`,
      tone: 'warning',
      daysLeft,
      isOverdue: false
    };
  }
  return { text: `Due in ${daysLeft} days`, tone: 'info', daysLeft, isOverdue: false };
}

// Seed localStorage from /data/*.json if empty
async function initStore() {
  applyTheme(localStorage.getItem(SL_KEYS.THEME) || 'light');

  if (!localStorage.getItem(SL_KEYS.BOOKS)) {
    const res = await fetch('/data/books.json');
    const books = await res.json();
    localStorage.setItem(SL_KEYS.BOOKS, JSON.stringify(books));
  }

  if (!localStorage.getItem(SL_KEYS.USERS)) {
    const res = await fetch('/data/users.json');
    const users = await res.json();
    localStorage.setItem(SL_KEYS.USERS, JSON.stringify(users));
  }

  if (!localStorage.getItem(SL_KEYS.LOANS)) {
    const today = getRealToday();
    const sampleLoans = [
      {
        id: 'l_101',
        bookId: 'b_002',
        userId: 'u_aditya',
        checkedOutOn: addDays(today, -11),
        dueOn: addDays(today, 3), // Due in 3 days
        returnedOn: null,
        renewed: false
      },
      {
        id: 'l_102',
        bookId: 'b_003',
        userId: 'u_sneha',
        checkedOutOn: addDays(today, -16),
        dueOn: addDays(today, -2), // Overdue by 2 days
        returnedOn: null,
        renewed: false
      },
      {
        id: 'l_103',
        bookId: 'b_004',
        userId: 'u_farhan',
        checkedOutOn: addDays(today, -14),
        dueOn: today, // Due today
        returnedOn: null,
        renewed: false
      },
      {
        id: 'l_104',
        bookId: 'b_001',
        userId: 'u_aditya',
        checkedOutOn: addDays(today, -30),
        dueOn: addDays(today, -16),
        returnedOn: addDays(today, -18), // Returned history
        renewed: false
      }
    ];
    localStorage.setItem(SL_KEYS.LOANS, JSON.stringify(sampleLoans));
  }
}

async function resetDemoData() {
  Object.values(SL_KEYS).forEach(k => localStorage.removeItem(k));
  await initStore();
}

// Getters & Setters
function getBooks() { return JSON.parse(localStorage.getItem(SL_KEYS.BOOKS) || '[]'); }
function saveBooks(books) { localStorage.setItem(SL_KEYS.BOOKS, JSON.stringify(books)); }

function getUsers() { return JSON.parse(localStorage.getItem(SL_KEYS.USERS) || '[]'); }

function getLoans() { return JSON.parse(localStorage.getItem(SL_KEYS.LOANS) || '[]'); }
function saveLoans(loans) { localStorage.setItem(SL_KEYS.LOANS, JSON.stringify(loans)); }

function getSession() {
  const raw = localStorage.getItem(SL_KEYS.SESSION);
  return raw ? JSON.parse(raw) : null;
}
function setSession(user) {
  localStorage.setItem(SL_KEYS.SESSION, JSON.stringify({ userId: user.id, name: user.name, role: user.role }));
}

function getAvailableCopies(bookId) {
  const book = getBooks().find(b => b.id === bookId);
  if (!book) return 0;
  const activeCount = getLoans().filter(l => l.bookId === bookId && !l.returnedOn).length;
  return Math.max(0, Number(book.copies) - activeCount);
}

// Theme helper (Good-to-have Dark Theme)
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(SL_KEYS.THEME, theme);
}
function toggleTheme() {
  const current = localStorage.getItem(SL_KEYS.THEME) || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

// Shared Header & Role Guard for all ShelfLife pages
function renderAppHeader(activePage) {
  const session = getSession();
  const header = document.getElementById('appHeader');
  if (!header) return;

  const simDate = localStorage.getItem(SL_KEYS.SIM_DATE);
  const dateBanner = simDate
    ? `<span class="ak-badge warning">Simulated date: ${formatDate(simDate)}</span>`
    : `<span class="ak-badge info">Today: ${formatDate(getToday())}</span>`;

  const isLibrarian = session && session.role === 'librarian';

  header.innerHTML = `
    <div class="container py-3 border-bottom mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
      <div>
        <a href="/app/index.html" style="text-decoration:none; color:var(--ak-color-text); font-weight:700; font-size:1.4rem;">ShelfLife Library</a>
        <div class="d-flex gap-2 align-items-center mt-1 flex-wrap">
          ${session ? `<span class="ak-badge success">${session.name} (${session.role})</span>` : `<span class="ak-badge warning">Not signed in</span>`}
          ${dateBanner}
        </div>
      </div>
      <nav aria-label="ShelfLife Navigation" class="d-flex gap-2 flex-wrap align-items-center">
        <a href="/app/catalog.html" class="ak-button sm ${activePage === 'catalog' ? 'primary' : 'secondary'}">Catalog</a>
        ${session && !isLibrarian ? `<a href="/app/loans.html" class="ak-button sm ${activePage === 'loans' ? 'primary' : 'secondary'}">My Loans</a>` : ''}
        ${isLibrarian ? `
          <a href="/app/book-form.html" class="ak-button sm ${activePage === 'book-form' ? 'primary' : 'secondary'}">Add Book</a>
          <a href="/app/all-loans.html" class="ak-button sm ${activePage === 'all-loans' ? 'primary' : 'secondary'}">All Loans</a>
        ` : ''}
        <a href="/app/index.html" class="ak-button sm ${activePage === 'login' ? 'primary' : 'secondary'}">Switch Role / Demo</a>
        <button type="button" class="ak-button sm secondary" onclick="toggleTheme()" aria-label="Toggle dark theme">Theme</button>
        <a href="/gallery/index.html" class="ak-button sm secondary">Aksha UI Docs</a>
      </nav>
    </div>
  `;
}

// Screen S10: Access Denied guard (PRD Section 8 & 17 #8)
function requireLibrarian(mainId = 'main-content') {
  const session = getSession();
  if (!session || session.role !== 'librarian') {
    const main = document.getElementById(mainId);
    if (main) {
      main.innerHTML = `
        <div class="ak-alert danger" role="alert">
          <h1 style="margin-top:0; font-size:1.5rem;">Access Denied</h1>
          <p>This page is restricted to librarians. You are currently signed in as <strong>${session ? session.name + ' (Member)' : 'Guest'}</strong>.</p>
          <div class="d-flex gap-2 mt-3">
            <a href="/app/catalog.html" class="ak-button primary">Back to Catalog</a>
            <a href="/app/index.html" class="ak-button secondary">Switch Role</a>
          </div>
        </div>
      `;
    }
    return false;
  }
  return true;
}