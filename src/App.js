

import React, { useState, useRef } from "react";
import Book from "./components/Book";
import data from "./data/books.json"; // adjust path if needed
import "./App.css";

function App() {
  // load books.json into state
  const [books] = useState(data);
  const dialogRef = useRef(null); // React ref for the dialog

  const handleOpenDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal(); // open the dialog
    }
  };

  const handleCloseDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.close(); // close the dialog
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Esteban's Book Catalog V3</h1>
      </header>

      <main className="content">
        <div className="add-button-column">
          <button className="add-button" onClick={handleOpenDialog}>
            + Add
          </button>
        </div>

        <div className="book-grid">
          {books.map((book) => (
            <Book key={book.isbn13} book={book} />
          ))}
        </div>
      </main>

      <footer className="footer">
        <p>© 2025 Esteban's Catalog - V3</p>
      </footer>

      {/* Dialog element */}
      <dialog ref={dialogRef} className="book-dialog">
  <h2 className="dialog-title">Add a New Book</h2>
  <form method="dialog" className="book-form">
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
      <input type="number" name="year" className="form-input" min="0" max="2100" required />
    </label>

    <label className="form-label">
      Language:
      <input type="text" name="language" className="form-input" required />
    </label>

    <label className="form-label">
      Pages:
      <input type="number" name="pages" className="form-input" min="1" required />
    </label>

    <div className="form-buttons">
      <button type="submit" className="submit-button">Add Book</button>
      <button type="button" className="close-button" onClick={handleCloseDialog}>
        Close
      </button>
    </div>
  </form>
</dialog>

    </div>
  );
}

export default App;
