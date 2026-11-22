# Aksha UI & ShelfLife — Accessible Design System & Library App

**Aksha UI** is a lightweight, WCAG 2.1 Level AA–compliant component library built with pure HTML5, CSS3 Custom Properties, and Vanilla ES6+ JavaScript. **ShelfLife** is a full book-lending web application built on top of Aksha UI to prove every component works in a real, keyboard-operable, screen-reader-friendly workflow.

**Collaborators:** Deep Aditya & Hardik Sharma (Polaris School of Technology — OJT Track: Product Development)

---

## Project Structure

```text
Aksha-UI-Shelflife/
├── ds/                     # Aksha UI Design System
│   ├── tokens.css          # Colour, typography, spacing (4px scale), & focus-ring tokens
│   ├── components.css      # Styles for all 10 accessible components + mobile reflow
│   └── js/
│       ├── dialog.js       # Focus-trapped modal dialog + Esc close + focus restoration
│       ├── tabs.js         # WAI-ARIA tabs with roving tabindex (Arrow, Home, End)
│       ├── table-sort.js   # Sortable table headers with dynamic aria-sort
│       └── toast.js        # ARIA live-region toast notifications (status / alert)
├── gallery/                # Aksha UI Documentation Gallery (Screens S1–S3)
│   ├── index.html          # S1: Overview, POUR principles, & 10-component index
│   ├── tokens.html         # S2: Colour contrast badges, spacing scale, & focus tester
│   └── components.html     # S3: Live interactive demos, ARIA notes, & copyable snippets
├── app/                    # ShelfLife Library Application (Screens S4–S10)
│   ├── index.html          # S4: Role Switcher (Member / Librarian), Simulate Date, Reset
│   ├── catalog.html        # S5 & S6: Live search/filter catalog + 14-day Checkout Modal
│   ├── loans.html          # S7: Member Current Loans / History tabs, Renew, & Return Modal
│   ├── book-form.html      # S8 & S10: Librarian Add Book (ISBN 10/13 validation) + Role Guard
│   ├── all-loans.html      # S9 & S10: Librarian All Active Loans (overdue first) + Role Guard
│   └── js/store.js         # localStorage state engine, YYYY-MM-DD UTC date math, & shared nav
├── data/
│   ├── books.json          # 30 seeded books across 6 categories
│   └── users.json          # 4 student members + 1 head librarian
├── ACCESSIBILITY_TEST_LOG.md
└── README.md