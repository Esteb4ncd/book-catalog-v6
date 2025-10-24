

// import React, { useState, useRef } from "react";
// import Book from "./components/Book";
// import data from "./data/books.json"; // adjust path if needed
// import "./App.css";

// function App() {
//   // load books.json into state
//   const [books] = useState(data);
//   const dialogRef = useRef(null); // React ref for the dialog

//   const handleOpenDialog = () => {
//     if (dialogRef.current) {
//       dialogRef.current.showModal(); // open the dialog
//     }
//   };

//   const handleCloseDialog = () => {
//     if (dialogRef.current) {
//       dialogRef.current.close(); // close the dialog
//     }
//   };

//   return (
//     <div className="app">
//       <header className="header">
//         <h1>Esteban's Book Catalog V5</h1>
//       </header>

//       <main className="content">
//         <div className="add-button-column">
//           <button className="add-button" onClick={handleOpenDialog}>
//             + Add
//           </button>
//         </div>

//         <div className="book-grid">
//           {books.map((book) => (
//             <Book key={book.isbn13} book={book} />
//           ))}
//         </div>
//       </main>

//       <footer className="footer">
//         <p>© 2025 Esteban's Catalog - V3</p>
//       </footer>

//       {/* Dialog element */}
//       <dialog ref={dialogRef} className="book-dialog">
//   <h2 className="dialog-title">Add a New Book</h2>
//   <form method="dialog" className="book-form">
//     <label className="form-label">
//       Title:
//       <input type="text" name="title" className="form-input" required />
//     </label>

//     <label className="form-label">
//       Author:
//       <input type="text" name="author" className="form-input" required />
//     </label>

//     <label className="form-label">
//       Publisher:
//       <input type="text" name="publisher" className="form-input" required />
//     </label>

//     <label className="form-label">
//       Publication Year:
//       <input type="number" name="year" className="form-input" min="0" max="2100" required />
//     </label>

//     <label className="form-label">
//       Language:
//       <input type="text" name="language" className="form-input" required />
//     </label>

//     <label className="form-label">
//       Pages:
//       <input type="number" name="pages" className="form-input" min="1" required />
//     </label>

//     <div className="form-buttons">
//       <button type="submit" className="submit-button">Add Book</button>
//       <button type="button" className="close-button" onClick={handleCloseDialog}>
//         Close
//       </button>
//     </div>
//   </form>
// </dialog>

//     </div>
//   );
// }

// export default App;

import React, { useState, useRef, useEffect } from "react";
import Book from "./components/Book";
import data from "./data/books.json";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]); 
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [filters, setFilters] = useState({
    title: '',
    yearSort: 'none', // 'none', 'oldest', 'newest'
    pagesSort: 'none' // 'none', 'asc', 'desc'
  });
  const addDialogRef = useRef(null);
  const updateDialogRef = useRef(null);

  const [currentBook, setCurrentBook] = useState(null);

  // Load books from local storage and merge with initial data
  useEffect(() => {
    const savedBooks = localStorage.getItem('bookCatalog');
    let initialBooks = [];
    
    if (savedBooks) {
      initialBooks = JSON.parse(savedBooks);
    } else {
      // If no saved books, use the initial data from books.json
      initialBooks = data.map(book => ({
        ...book,
        authors: book.authors || 'Unknown Author',
        publisher: book.publisher || 'Unknown Publisher',
        year: book.year || new Date().getFullYear(),
        language: book.language || 'English',
        pages: book.pages || Math.floor(Math.random() * 500) + 100,
        selected: false
      }));
    }
    
    setBooks(initialBooks);
    setFilteredBooks(initialBooks);
  }, []);

  // Save books to local storage whenever books change
  useEffect(() => {
    if (books.length > 0) {
      localStorage.setItem('bookCatalog', JSON.stringify(books));
    }
  }, [books]);

  // Apply filters whenever books or filters change
  useEffect(() => {
    let filtered = [...books];

    // Filter by title
    if (filters.title) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }

    // Sort by publication year
    if (filters.yearSort === 'oldest') {
      filtered.sort((a, b) => (a.year || 0) - (b.year || 0));
    } else if (filters.yearSort === 'newest') {
      filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
    }

    // Sort by pages
    if (filters.pagesSort === 'asc') {
      filtered.sort((a, b) => (a.pages || 0) - (b.pages || 0));
    } else if (filters.pagesSort === 'desc') {
      filtered.sort((a, b) => (b.pages || 0) - (a.pages || 0));
    }

    setFilteredBooks(filtered);
  }, [books, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleOpenAddDialog = () => {
    if (addDialogRef.current) addDialogRef.current.showModal();
  };

  const handleCloseAddDialog = () => {
    if (addDialogRef.current) addDialogRef.current.close();
  };

  const handleOpenUpdateDialog = () => {
    const selectedBook = books.find((book) => book.selected);
    if (!selectedBook) {
      alert("Please select a book to update.");
      return;
    }
    setCurrentBook(selectedBook);
    if (updateDialogRef.current) updateDialogRef.current.showModal();
  };

  const handleCloseUpdateDialog = () => {
    if (updateDialogRef.current) updateDialogRef.current.close();
  };

  const handleAddBook = (event) => {
    event.preventDefault();
    const form = event.target;

    const newBook = {
      title: form.title.value,
      authors: form.author.value,
      publisher: form.publisher.value,
      year: form.year.value,
      language: form.language.value,
      pages: form.pages.value,
      image: form.image?.value || "https://via.placeholder.com/150",
      url: form.url?.value || "#",
      selected: false,
      isbn13: Date.now().toString(), // unique id
      price: "$0.00",
    };

    setBooks([...books, newBook]);
    form.reset();
    handleCloseAddDialog();
  };

  const handleUpdateBook = (event) => {
    event.preventDefault();
    if (!currentBook) return;

    const form = event.target;
    const updatedBook = {
      ...currentBook,
      title: form.title.value,
      authors: form.author.value,
      publisher: form.publisher.value,
      year: form.year.value,
      language: form.language.value,
      pages: form.pages.value,
      image: form.image?.value || "https://via.placeholder.com/150",
      url: form.url?.value || "#",
    };

    setBooks(
      books.map((book) => (book.isbn13 === currentBook.isbn13 ? updatedBook : book))
    );

    handleCloseUpdateDialog();
  };

  const handleSelectBook = (isbn13) => {
    setBooks(
      books.map((book) => ({
        ...book,
        selected: book.isbn13 === isbn13 ? !book.selected : false,
      }))
    );
  };

  const handleDeleteSelected = () => {
    setBooks(books.filter((book) => !book.selected));
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Esteban's Book Catalog V5</h1>
      </header>

      <main className="content">
        <div className="add-button-column">
          <button className="add-button" onClick={handleOpenAddDialog}>
            + Add
          </button>
          <button className="update-button" onClick={handleOpenUpdateDialog}>
            Update
          </button>
          <button className="delete-button" onClick={handleDeleteSelected}>
            Delete
          </button>

          {/* Filter Controls */}
          <div className="filter-controls">
            <div className="filter-group">
              <label htmlFor="title-filter">Filter by Title:</label>
              <input
                id="title-filter"
                type="text"
                placeholder="Search books by title..."
                value={filters.title}
                onChange={(e) => handleFilterChange('title', e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="year-sort">Sort by Publication Year:</label>
              <select
                id="year-sort"
                value={filters.yearSort}
                onChange={(e) => handleFilterChange('yearSort', e.target.value)}
                className="filter-select"
              >
                <option value="none">No sorting</option>
                <option value="oldest">Oldest first</option>
                <option value="newest">Newest first</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="pages-sort">Sort by Pages:</label>
              <select
                id="pages-sort"
                value={filters.pagesSort}
                onChange={(e) => handleFilterChange('pagesSort', e.target.value)}
                className="filter-select"
              >
                <option value="none">No sorting</option>
                <option value="asc">Fewest pages first</option>
                <option value="desc">Most pages first</option>
              </select>
            </div>

            <div className="filter-group">
              <button 
                onClick={() => setFilters({ title: '', yearSort: 'none', pagesSort: 'none' })}
                className="clear-filters-button"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <div className="book-grid">
          {filteredBooks.length === 0 ? (
            <p style={{ textAlign: "center", width: "100%", marginTop: "2rem" }}>
              {books.length === 0 
                ? "No books yet. Click 'Add' to create a new book."
                : "No books match your current filters. Try adjusting your search criteria."
              }
            </p>
          ) : (
            filteredBooks.map((book) => (
              <Book
                key={book.isbn13}
                book={book}
                onSelect={() => handleSelectBook(book.isbn13)}
              />
            ))
          )}
        </div>
      </main>

      <footer className="footer">
        <p>© 2025 Esteban's Catalog - V5</p>
      </footer>

      {/* Add Book Dialog */}
      <dialog ref={addDialogRef} className="book-dialog">
        <h2 className="dialog-title">Add a New Book</h2>
        <form className="book-form" onSubmit={handleAddBook}>
          <label className="form-label">
            Title:
            <input type="text" name="title" className="form-input" required />
          </label>

          <label className="form-label">
            Author:
            <input type="text" name="author" className="form-input" required />
          </label>

          <label className="form-label">
            Publisher:
            <input type="text" name="publisher" className="form-input" required />
          </label>

          <label className="form-label">
            Publication Year:
            <input
              type="number"
              name="year"
              className="form-input"
              min="0"
              max="2100"
              required
            />
          </label>

          <label className="form-label">
            Language:
            <input type="text" name="language" className="form-input" required />
          </label>

          <label className="form-label">
            Pages:
            <input type="number" name="pages" className="form-input" min="1" required />
          </label>

          <label className="form-label">
            Cover Image URL:
            <input type="url" name="image" className="form-input" />
          </label>

          <label className="form-label">
            Book URL:
            <input type="url" name="url" className="form-input" />
          </label>

          <div className="form-buttons">
            <button type="submit" className="submit-button">Add Book</button>
            <button type="button" className="close-button" onClick={handleCloseAddDialog}>
              Close
            </button>
          </div>
        </form>
      </dialog>

      {/* Update Book Dialog */}
      <dialog ref={updateDialogRef} className="update-book-dialogue">
        <h2 className="dialog-title">Update Book</h2>
        {currentBook && (
          <form className="book-form" onSubmit={handleUpdateBook}>
            <label className="form-label">
              Title:
              <input
                type="text"
                name="title"
                className="form-input"
                defaultValue={currentBook.title}
                required
              />
            </label>

            <label className="form-label">
              Author:
              <input
                type="text"
                name="author"
                className="form-input"
                defaultValue={currentBook.authors}
                required
              />
            </label>

            <label className="form-label">
              Publisher:
              <input
                type="text"
                name="publisher"
                className="form-input"
                defaultValue={currentBook.publisher}
                required
              />
            </label>

            <label className="form-label">
              Publication Year:
              <input
                type="number"
                name="year"
                className="form-input"
                min="0"
                max="2100"
                defaultValue={currentBook.year}
                required
              />
            </label>

            <label className="form-label">
              Language:
              <input
                type="text"
                name="language"
                className="form-input"
                defaultValue={currentBook.language}
                required
              />
            </label>

            <label className="form-label">
              Pages:
              <input
                type="number"
                name="pages"
                className="form-input"
                min="1"
                defaultValue={currentBook.pages}
                required
              />
            </label>

            <label className="form-label">
              Cover Image URL:
              <input
                type="url"
                name="image"
                className="form-input"
                defaultValue={currentBook.image}
              />
            </label>

            <label className="form-label">
              Book URL:
              <input
                type="url"
                name="url"
                className="form-input"
                defaultValue={currentBook.url}
              />
            </label>

            <div className="form-buttons">
              <button type="submit" className="submit-button">Update Book</button>
              <button type="button" className="close-button" onClick={handleCloseUpdateDialog}>
                Close
              </button>
            </div>
          </form>
        )}
      </dialog>
    </div>
  );
}

export default App;
