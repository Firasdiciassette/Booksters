// public/js/search-books.js

document.addEventListener('DOMContentLoaded', () => {
    const search = document.getElementById('search-title');
    const results = document.getElementById('search-results');
  
    if (!search) return;
  
    search.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        searchBooks();
      }
    });
  
    async function searchBooks() {
        const title = search.value.trim();
        if (!title) return;
    
        try {
            const res = await fetch(`/api/books?title=${encodeURIComponent(title)}`);
            const books = await res.json();
            results.innerHTML = '';
    
            if (!books.length) {
                results.innerHTML = "<p>Wow, it's empty down here</p>";
                return;
            }
    
            const bookGrid = document.createElement('div');
            bookGrid.className = 'book-grid';
    
                books.forEach(book => {
                    const div = document.createElement('div');
                    div.className = 'book-card';
                    div.innerHTML = `
                       
                        <h3>${book.title}</h3>
                        <p><strong>Author:</strong> ${book.author}</p>
                        <p><strong>Genre:</strong> ${book.genre}</p>
                        <p>${book.description}</p>
                         <a href="/books/${book.id}">
                        <img src="${book.cover_url || '/images/default-cover.png'}" alt="Book Cover" class="book-cover">
                        </a>
                    `;
                    bookGrid.appendChild(div);
                });
    
            results.appendChild(bookGrid);
        } catch (error) {
            console.error('Search failed:', error);
            results.innerHTML = '<p>Error searching books.</p>';
        }
    }
    
  });
  