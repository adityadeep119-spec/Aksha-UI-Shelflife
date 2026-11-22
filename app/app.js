// app/app.js
let booksData = [];
let selectedBookId = null;

const fallbackBooks = [
  { id: 1, title: "Clean Code", author: "Robert C. Martin", category: "Technology", status: "Available" },
  { id: 2, title: "The Pragmatic Programmer", author: "Andrew Hunt", category: "Technology", status: "Available" },
  { id: 3, title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", category: "Technology", status: "Checked Out" },
  { id: 4, title: "The Metamorphosis", author: "Franz Kafka", category: "Fiction", status: "Available" }
];

const fallbackUsers = [
  { id: 1, name: "Aditya", email: "aditya@library.edu" },
  { id: 2, name: "Hardik", email: "hardik@library.edu" }
];

async function loadLibraryData() {
  try {
    const res = await fetch('/data/books.json');
    const data = await res.json();
    booksData = Array.isArray(data) && data.length ? data : fallbackBooks;
  } catch (e) {
    booksData = fallbackBooks;
  }
  renderBooks(booksData);

  try {
    const resUsers = await fetch('/data/users.json');
    const uData = await resUsers.json();
    renderUsers(Array.isArray(uData) && uData.length ? uData : fallbackUsers);
  } catch (e) {
    renderUsers(fallbackUsers);
  }
}

function renderBooks(books) {
  const tbody = document.getElementById('booksList');
  tbody.innerHTML = '';

  books.forEach(book => {
    const tr = document.createElement('tr');
    const isAvailable = (book.status || 'Available') === 'Available';

    tr.innerHTML = `
      <td>${book.title || 'Untitled'}</td>
      <td>${book.author || 'Unknown'}</td>
      <td>${book.category || book.genre || 'General'}</td>
      <td>${isAvailable ? 'Available' : 'Checked Out'}</td>
      <td>
        ${isAvailable 
          ? `<button class="ak-button primary" onclick="openCheckoutModal(${book.id})">Borrow</button>` 
          : `<button class="ak-button secondary" onclick="returnBook(${book.id})">Return</button>`}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderUsers(users) {
  const tbody = document.getElementById('usersList');
  tbody.innerHTML = '';
  users.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${u.name || u.username || 'Member'}</td>
      <td>${u.email || u.role || 'Active Member'}</td>
    `;
    tbody.appendChild(tr);
  });
}

function openCheckoutModal(bookId) {
  const book = booksData.find(b => b.id === bookId);
  if (!book) return;
  selectedBookId = bookId;

  document.getElementById('modalBookTitle').textContent = `Borrow "${book.title}"?`;
  document.getElementById('modalBookAuthor').textContent = `Author: ${book.author}`;
  document.getElementById('checkoutModal').removeAttribute('hidden');
}

document.getElementById('confirmCheckoutBtn').addEventListener('click', () => {
  const book = booksData.find(b => b.id === selectedBookId);
  if (book) {
    book.status = 'Checked Out';
    renderBooks(booksData);
    document.getElementById('checkoutModal').setAttribute('hidden', 'true');
    if (typeof showToast === 'function') {
      showToast(`Checked out "${book.title}"!`, 'success');
    }
  }
});

function returnBook(bookId) {
  const book = booksData.find(b => b.id === bookId);
  if (book) {
    book.status = 'Available';
    renderBooks(booksData);
    if (typeof showToast === 'function') {
      showToast(`Returned "${book.title}"!`, 'info');
    }
  }
}

document.getElementById('searchInput').addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  const filtered = booksData.filter(b => 
    (b.title && b.title.toLowerCase().includes(q)) || 
    (b.author && b.author.toLowerCase().includes(q))
  );
  renderBooks(filtered);
});

document.addEventListener('DOMContentLoaded', loadLibraryData);