// public/js/search.js

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
            results.innerHTML = ''; // Clear previous results
    
            if (!books.length) {
                results.innerHTML = '<p>No books found.</p>';
                return;
            }
    
            // Create a container for the book grid
            const bookGrid = document.createElement('div');
            bookGrid.className = 'book-grid';  // This will apply the grid layout
    
                books.forEach(book => {
                    const div = document.createElement('div');
                    div.className = 'book-card'; // This applies card styles
                    div.innerHTML = `
                        <h3>${book.title}</h3>
                        <p><strong>Author:</strong> ${book.author}</p>
                        <p><strong>Genre:</strong> ${book.genre}</p>
                        <p>${book.description}</p>
                        <img src="${book.cover_url || '../images/default-cover.jpg'}" alt="Book Cover" class="book-cover">
                    `;
                    bookGrid.appendChild(div);
                });
    
            // Append the grid container to the results div
            results.appendChild(bookGrid);
        } catch (error) {
            console.error('Search failed:', error);
            results.innerHTML = '<p>Error searching books.</p>';
        }
    }
    
  });
  