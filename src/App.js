

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
//         <h1>Esteban's Book Catalog V4</h1>
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

import React, { useState, useRef } from "react";
import Book from "./components/Book";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]); // start with no books
  const addDialogRef = useRef(null);
  const updateDialogRef = useRef(null);

  const [currentBook, setCurrentBook] = useState(null);

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
        <h1>Esteban's Book Catalog V4</h1>
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
        </div>

        <div className="book-grid">
          {books.length === 0 ? (
            <p style={{ textAlign: "center", width: "100%", marginTop: "2rem" }}>
              No books yet. Click "Add" to create a new book.
            </p>
          ) : (
            books.map((book) => (
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
        <p>© 2025 Esteban's Catalog - V3</p>
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
