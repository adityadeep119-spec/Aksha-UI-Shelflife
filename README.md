# Aksha UI & ShelfLife Library System 📚♿

> An accessibility-first design system (`Aksha UI`) and a fully compliant real-world library management application (`ShelfLife`) built for the PST Product Development OJT program.

---

## 👥 Team & Metadata
* **Project ID / Track:** PST_PD_111 (Product Development)[cite: 7]
* **Team Members:** Deep Aditya, Hardik Sharma[cite: 18]
* **Mentor:** Divyashant Kumar[cite: 18]
* **Status:** Active Development / Week 1 Milestone[cite: 7]

---

## 🎯 Project Overview
Developers frequently build web apps from scratch with unlabelled buttons, missing focus states, and broken dialog keyboards that lock out users with visual impairments. 

**Aksha UI + ShelfLife** solves this by providing:
1. **Aksha UI:** 10 core accessible components and semantic CSS design tokens built on HTML5, CSS3, and vanilla JavaScript[cite: 7, 11].
2. **ShelfLife:** A complete library management workflow (catalog browsing, 14-day checkouts, due-date badges, returns, and librarian inventory controls) that guarantees a keyboard-only user can complete a checkout in under 30 seconds[cite: 7, 8, 9].

---

## 🛠️ Tech Stack
* **Base Layer:** HTML5, CSS3 (Custom Properties), Bootstrap 5.3 Grid/Reboot[cite: 15]
* **Interactivity:** Modular Vanilla JavaScript[cite: 11, 15]
* **State & Persistence:** Client-side `localStorage` seeded from static JSON datasets (`data/books.json`)[cite: 12, 15]
* **Accessibility Standards:** WCAG 2.1 AA Compliant, tested with Deque axe DevTools, Chrome Lighthouse (Target $\ge 95$), and NVDA/VoiceOver screen readers[cite: 15].

---

## 📂 Repository Architecture
```text
Aksha-UI-Shelflife/
├── README.md
├── LICENSE
├── css/
│   └── tokens.css         # Design tokens, spacing, and contrast-checked focus rings
├── js/
│   └── dialog.js          # Accessible modal focus management script
├── app/
│   └── index.html         # ShelfLife application entry point
└── data/
    └── books.json         # Seeded catalog library database (30+ books)
