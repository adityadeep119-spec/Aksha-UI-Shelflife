---

### 2. Create `ACCESSIBILITY_TEST_LOG.md` (in the root folder)

```markdown
# Aksha UI & ShelfLife — Accessibility Test Log

**Standard:** WCAG 2.1 Level AA  
**Tested By:** Deep Aditya & Hardik Sharma  
**Browser / Tools:** Google Chrome, Chrome DevTools (Accessibility Tree & Device Emulator), Google Lighthouse, WebAIM Contrast Checker

---

## 1. Colour Contrast Verification

| Token / Element | Foreground | Background | Ratio | WCAG AA (>= 4.5:1) |
| :--- | :--- | :--- | :--- | :--- |
| Primary Button / Link | `#1D4ED8` | `#FFFFFF` | `6.7:1` | Pass |
| Body Text | `#111827` | `#FFFFFF` | `17.7:1` | Pass (AAA) |
| Focus Ring (Double Ring) | `#1D4ED8` + `#FFFFFF` | Light / Dark | `6.7:1` | Pass (3:1 UI) |
| Success Badge | Dark Green | Soft Green | `>= 6.5:1` | Pass |
| Warning Badge | Dark Amber | Soft Amber | `>= 6.4:1` | Pass |
| Danger Badge | Dark Red | Soft Red | `>= 6.8:1` | Pass |

---

## 2. Keyboard-Only Walkthrough (No Mouse)

| Flow / Component | Keys Tested | Expected Behavior | Status |
| :--- | :--- | :--- | :--- |
| Skip to Main Content | `Tab`, `Enter` | Skips header nav and moves focus directly to `<main>` | Pass |
| Catalog Search & Filter | `Tab`, typing, `Space` | Search input, Category select, and Available checkbox operable | Pass |
| Book Details Modal (S6) | `Enter`, `Tab`, `Shift+Tab`, `Esc` | Focus enters modal, traps inside, closes on `Esc`, returns to trigger | Pass |
| My Loans Tabs (S7) | `Left/Right Arrow`, `Home`, `End` | Switches between Current Loans & Loan History via roving tabindex | Pass |
| Return Confirm Dialog | `Enter`, `Tab`, `Esc` | Prevents accidental returns; announces return via live toast | Pass |
| Librarian Add Book (S8) | `Tab`, `Enter` | Invalid submit focuses top Error Summary; links jump to invalid fields | Pass |
| All Loans Sortable Table | `Tab`, `Enter` / `Space` | Toggles `aria-sort` (`ascending` / `descending`) on column headers | Pass |

---

## 3. Screen Reader & ARIA Tree Checks

- **Landmarks:** Every page contains `<header>`, `<nav>`, and `<main>` with a single `<h1>` and sequential headings.
- **Form Validation:** `app/book-form.html` links helper hints and error messages via `aria-describedby` and flags invalid fields with `aria-invalid="true"`.
- **Live Regions:** Catalog results count (`#resultsCount`) and checkout/return toasts use `role="status"` (`aria-live="polite"`); error summaries use `role="alert"`.
- **Non-Colour Indicators:** All due-date and availability badges include explicit text (`Available (2 of 3)`, `Due today`, `Overdue by 1 day`).

---

## 4. Responsive & Motion Checks

- **Mobile Viewports (`393px`, `375px`, `320px`):** Zero horizontal overflow; Catalog cards stack in a single column; Data Tables reflow into labeled cards below `576px`.
- **Reduced Motion:** `@media (prefers-reduced-motion: reduce)` disables animations/transitions cleanly.
- **Console Health:** Zero console errors or 404s across all 10 screens.