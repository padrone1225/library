/**
 * Books
 * @class
 * @property {object} storage       - LocalStorage
 * @property {object} modal         - Modal Module
 * @property {array} books          - Array of {Book} Objects
 * @property {object} tableBody     - Library <tbody> Element
 * @property {object} recycleBin    - Recycle Bin <select> Element
 */

import Book from "./book.js";

class Books {
  // Class Properties
  storage = {};
  modal = {};
  books = [];
  tableBody = {};
  recycleBin = {};

  /**
   * Constructor
   * @constructor
   * @param {object} modal
   */
  constructor(modal) {
    this.modal = modal;
    this.storage = window.localStorage;
    this.tableBody = document.querySelector("tbody");
    this.recycleBin = document.getElementById("deleted_books");

    // Load Books
    if (this.storage.hasOwnProperty("lib_books")) {
      // Load form LocalStorage
      this.loadBooks(JSON.parse(this.storage.getItem("lib_books")));
    } else {
      // Load from JSON File
      this.defaultBooks();
    }
    // Select/Deselect All checkox
    document.getElementById("select_all").addEventListener("input", (e) => {
      const checks = document.querySelectorAll("table input[type='checkbox']");
      for (let i of checks) {
        i.checked = e.target.checked;
      }
    });

    // Delete Group Button

    // Open Add Book Modal
  }

  /**
   * Load Books into Library form JSON
   * @param {array} json    - Parsed JSON Array of Books
   */
  loadBooks(json) {
    // Loop through JSON
    for (let i in json) {
      // Add Book to Library
      this.books[i] = new Book(
        json[i].id,
        json[i].title,
        json[i].author,
        json[i].pages,
        json[i].published,
        json[i].acquired,
        json[i].status,
        json[i].deleted
      );
    }

    // Add Books to Table
    this.buildTable();
  }

  /**
   * Build Library Table
   */
  buildTable() {
    // Clear Table Body
    this.tableBody.innerHTML = "";

    // Add Table Rows
    this.books.forEach((book) => {
      if (book.notDeleted()) {
        this.addTableRow(book);
      }
    });
  }

  /**
   * Add Book to Table
   * @param {Book} book - Book Object
   */
  addTableRow(book) {
    // Create Row
    const row = document.createElement("tr");

    // Assign ID
    row.id = book.id;

    // Add Cells to Row
    row.innerHTML = `
    <td><input type="checkbox" id="select_${
      book.id
    }" name="selected[]" value="${book.id}"></td>
    <td class="book_title">${book.getTitle()}</td>
    <td class="book_author">${book.getAuthor()}</td>
    <td class="book_pages">${book.getPages()}</td>
    <td class="book_published">${book.getPubhlised()}</td>
    <td class="book_acquired">${book.getAcquired()}</td>
    <td class="book_status"><a data-id="${
      book.id
    }" data-status="${book.status.toString()}" href="#">${book.getStatus()}</a></td>
    <td class="book_edit">
        <a data-id="${
          book.id
        }" data-action="delete" title="Delete Book"><svg viewBox="0 0 24 24">
        <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M9,8H11V17H9V8M13,8H15V17H13V8Z" />
    </svg></a>
        <a data-id="${
          book.id
        }" data-action="edit" title="Edit Book"><svg viewBox="0 0 24 24">
        <path d="M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19H5V5H12V3H5M17.78,4C17.61,4 17.43,4.07 17.3,4.2L16.08,5.41L18.58,7.91L19.8,6.7C20.06,6.44 20.06,6 19.8,5.75L18.25,4.2C18.12,4.07 17.95,4 17.78,4M15.37,6.12L8,13.5V16H10.5L17.87,8.62L15.37,6.12Z" />
    </svg></a>
    </td>`;

    // Event Listener for Read/Unread Toggle
    row.querySelector(".book_status a").addEventListener("click", (e) => {
      // Get Book Index from Book ID
      const index = this.indexFromBookID(e.target.dataset.id);

      // Toggle Book Status
      this.books[index].toggleStatus();

      // Change Link Text
      const status = parseInt(e.target.dataset.status);
      e.target.innerText = status ? "Unread" : "Read";
      e.target.dataset.status = status ? "0" : "1";

      /************** Update */
    });

    // Add Row to Table
    this.tableBody.appendChild(row);
  }

  /**
   * Loads Default Books from JSON
   */
  defaultBooks() {
    // Get Default Books from JSON
    fetch("./res/books.json")
      .then((response) => response.json())
      .then((json) => {
        // Load Books into Library
        this.loadBooks(json);
      });
  }

  /**
   * Get Book Library Index form Book ID
   * @param     {string} bookID - Book ID
   * @returns   {number}        - Book Index
   */
  indexFromBookID(bookID) {
    return this.books.findIndex((book) => book.id === bookID);
  }
}

export default Books;
