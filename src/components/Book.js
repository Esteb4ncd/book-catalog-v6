
// import React, { useState } from "react";

// export default function Book({ book }) {
//   const [isSelected, setIsSelected] = useState(false);
//   const [isVisible, setIsVisible] = useState(true); // new state to track visibility

//   const handleClick = () => {
//     setIsSelected(!isSelected); // toggle selection
//   };

//   const handleDelete = () => {
//     setIsVisible(false); // hide the book
//   };

//   if (!isVisible) return null; // don't render anything if hidden

//   return (
//     <div
//       className={`book-card ${isSelected ? "selected" : ""}`}
//       onClick={handleClick}
//     >
//       <img src={book.image} alt={book.title} />
//       <h3>{book.title}</h3>
//       <p>{book.authors}</p>
//       <p className="book-price">{book.price}</p>
//       <a
//         href={book.url}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="book-link"
//       >
//         View Details
//       </a>
//       <button onClick={handleDelete} className="delete-btn">
//         X
//       </button>
//     </div>
//   );
// }

import React from "react";

export default function Book({ book, onSelect, isOnLoan }) {
  const handleClick = () => {
    if (isOnLoan) {
      return;
    }
    if (onSelect) {
      onSelect();
    }
  };

  return (
    <div
      className={`book-card ${book.selected ? "selected" : ""} ${isOnLoan ? "on-loan" : ""}`}
      onClick={handleClick}
      role="button"
      aria-disabled={isOnLoan}
      tabIndex={isOnLoan ? -1 : 0}
      style={{
        cursor: isOnLoan ? "not-allowed" : "pointer",
        opacity: isOnLoan ? 0.7 : 1
      }}
    >
      <img src={book.image} alt={book.title} />
      <h3>
        {book.title}
        {isOnLoan && (
          <span style={{ marginLeft: 8, color: "#b00020", fontSize: "0.9em" }}>(On loan)</span>
        )}
      </h3>
      <p className="book-author">{book.authors}</p>
      <p className="book-details">
        {book.year && `Published: ${book.year}`}
        {book.pages && ` • ${book.pages} pages`}
      </p>
      <p className="book-price">{book.price}</p>
      <a
        href={book.url}
        target="_blank"
        rel="noopener noreferrer"
        className="book-link"
      >
        View Details
      </a>
    </div>
  );
}

