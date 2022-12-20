"use strict";

// Import Module
import Book from "./book.js";

/**
 * Library Books
 * @class
 * @property {object} storage    - LocalStorage
 * @property {object} modal      - Modal Module
 * @property {array}  books      - Array of {Book} Objects
 * @property {object} tableBody  - Library <tbody> Element
 * @property {object} recycleBin - Recycle Bin <select> Element
 * @author Dean Wagner <info@deanwagner.net>
 */
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
   * @param {object} modal - Modal Module
   */
  constructor(modal) {
    // Class Properties
    this.modal = modal;
    this.storage = window.localStorage;
    this.tableBody = document.querySelector("tbody");
    this.recycleBin = document.getElementById("deleted_books");

    // Load Books
    if (this.storage.hasOwnProperty("lib_books")) {
      // Load from LocalStorage
      this.loadBooks(JSON.parse(this.storage.getItem("lib_books")));
    } else {
      // Load from JSON File
      this.defaultBooks();
    }

    // Select/Deselect All Checkbox
    document.getElementById("select_all").addEventListener("input", (e) => {
      const checks = document.querySelectorAll("table input[type='checkbox']");
      for (let i = 0; i < checks.length; i++) {
        checks[i].checked = e.target.checked;
      }
    });

    // Delete Group Button
    document.getElementById("delete_group").addEventListener("click", (e) => {
      e.preventDefault();
      const selected = this.tableBody.querySelectorAll(
        "input[type='checkbox']:checked"
      );
      for (let i = 0; i < selected.length; i++) {
        this.deleteBook(selected[i].value);
      }
      document.getElementById("select_all").checked = false;
    });

    // Open Add Book Modal
    document.getElementById("add_link").addEventListener("click", (e) => {
      e.preventDefault();

      document.querySelector("#modal_edit h3").innerText = "Add New Book";
      document.querySelector("#new_book button").innerText = "Add Book";
      document.getElementById("new_title").value = "";
      document.getElementById("new_author").value = "";
      document.getElementById("new_pages").value = "";
      document.getElementById("new_published").value = "";
      document.getElementById("new_acquired").valueAsDate = new Date();
      document.getElementById("new_status").value = "0";
      document.getElementById("new_id").value = "";

      this.modal.open("modal_edit");
    });

    // Add Book Form Submit
    document.getElementById("new_book").addEventListener("submit", (e) => {
      e.preventDefault();
      this.addBook();
      this.modal.close("modal_edit");
      return false;
    });

    // Open Recycle Bin Modal
    document.getElementById("recycle_link").addEventListener("click", (e) => {
      e.preventDefault();
      this.modal.open("modal_recycle");
    });

    // Recycle Bin Restore Button
    document
      .getElementById("deleted_restore")
      .addEventListener("click", (e) => {
        e.preventDefault();

        const selected = this.recycleBin.querySelectorAll("option:checked");
        for (let i = 0; i < selected.length; i++) {
          this.restoreBook(selected[i].value);
        }

        this.modal.close("modal_recycle");
      });

    // Recycle Bin Erase Button
    document.getElementById("deleted_erase").addEventListener("click", (e) => {
      e.preventDefault();

      const selected = this.recycleBin.querySelectorAll("option:checked");
      for (let i = 0; i < selected.length; i++) {
        this.eraseBook(selected[i].value);
      }
    });

    // Table Header Sort Links
    const tableHeaders = document.querySelectorAll("th a");
    for (let i = 0; i < tableHeaders.length; i++) {
      tableHeaders[i].addEventListener("click", (e) => {
        e.preventDefault();
        const prop = e.target.id.replace("head_", "");
        this.sortBooks(e, prop);
      });
    }
  }

  /**
   * Load Books into Library from JSON
   * @param {array} json - Parsed JSON Array of Books
   */
  loadBooks(json) {
    // Loop through JSON
    for (let i = 0; i < json.length; i++) {
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

    // Add Trash to Recycle Bin
    this.buildTrash();

    // Update Summary Stats
    this.updateStats();
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
   * Updates Library Stats in Summary
   */
  updateStats() {
    const auth = [];
    let total = 0;
    let pages = 0;
    let read = 0;
    let unread = 0;
    let deleted = 0;

    // Loop through Books
    this.books.forEach((book) => {
      if (book.notDeleted()) {
        // Total Books
        total++;

        // Total Pages
        pages += book.pages;

        // Unique Authors
        if (!auth.includes(book.author.toLowerCase())) {
          auth.push(book.author.toLowerCase());
        }

        if (book.status) {
          // Read Books
          read++;
        } else {
          // Unread Books
          unread++;
        }
      } else {
        // Deleted Books
        deleted++;
      }
    });

    // Display Stats
    document.getElementById("total_books").innerText = total.toLocaleString();
    document.getElementById("total_pages").innerText = pages.toLocaleString();
    document.getElementById("total_authors").innerText =
      auth.length.toLocaleString();
    document.getElementById("total_read").innerText = read.toLocaleString();
    document.getElementById("total_unread").innerText = unread.toLocaleString();
    document.getElementById("total_trash").innerText = deleted.toLocaleString();
  }

  /**
   * Sort Table by Heading
   * @param {object} e    - Event Object
   * @param {string} prop - Property to Sort By
   */
  sortBooks(e, prop) {
    // Sort Library
    this.books.sort((a, b) => (a[prop] > b[prop] ? 1 : -1));

    // Toggle Ascending/Descending
    const link = e.target;
    if (link.classList.contains("asc")) {
      // From Ascending to Descending
      link.classList.remove("asc");
      link.classList.add("dec");
      this.books.reverse();
    } else if (link.classList.contains("dec")) {
      // From Descending to Ascending
      link.classList.remove("dec");
      link.classList.add("asc");
    } else {
      // From No Sort to Ascending
      const links = document.querySelectorAll("th a");
      for (let i = 0; i < links.length; i++) {
        links[i].classList.remove(...links[i].classList);
      }
      link.classList.add("asc");
    }

    // Rebuild Table
    this.buildTable();
  }

  /**
   * Add/Edit Book in Library
   */
  addBook() {
    // Get Book ID from Hidden Form Value
    const bookID = document.getElementById("new_id").value;

    if (bookID !== "") {
      /* * * * * * * * * * * *\
             * Edit Existing Book  *
            \* * * * * * * * * * * */

      // Get Book Index from Book ID
      const index = this.indexFromBookID(bookID);

      // Update Library from Form
      this.books[index].title = document.getElementById("new_title").value;
      this.books[index].author = document.getElementById("new_author").value;
      this.books[index].pages = parseInt(
        document.getElementById("new_pages").value
      );
      this.books[index].published =
        document.getElementById("new_published").value;
      this.books[index].acquired =
        document.getElementById("new_acquired").value;
      this.books[index].status = parseInt(
        document.getElementById("new_status").value
      );

      // Update Table from Library
      const row = document.getElementById(bookID);
      row.querySelector(".book_title").innerText = this.books[index].getTitle();
      row.querySelector(".book_author").innerText =
        this.books[index].getAuthor();
      row.querySelector(".book_pages").innerText = this.books[index].getPages();
      row.querySelector(".book_published").innerText =
        this.books[index].getPublished();
      row.querySelector(".book_acquired").innerText =
        this.books[index].getAcquired();
      row.querySelector(".book_status").innerText =
        this.books[index].getStatus();
    } else {
      /* * * * * * * * * * * *\
             *    Add New Book     *
            \* * * * * * * * * * * */

      // Create New Book from Form
      const newBook = new Book(
        this.generateId(),
        document.getElementById("new_title").value,
        document.getElementById("new_author").value,
        document.getElementById("new_pages").value,
        document.getElementById("new_published").value,
        document.getElementById("new_acquired").value,
        document.getElementById("new_status").value,
        0
      );

      // Add Book to Library
      this.books.push(newBook);

      // Add Book to Table
      this.addTableRow(newBook);
    }

    // Update Summary Stats
    this.updateStats();

    // Update Storage
    this.storage.setItem("lib_books", JSON.stringify(this.books));
  }

  /**
   * Open Edit Modal or Delete Book
   * @param {object} e - Event Object
   */
  editEntry(e) {
    e.preventDefault();

    // Get Data from Element
    const bookID = e.currentTarget.dataset.id;
    const action = e.currentTarget.dataset.action;

    if (action === "delete") {
      // Delete Entry
      this.deleteBook(bookID);
    } else {
      // Edit Entry
      const index = this.indexFromBookID(bookID);

      // Populate Form with Existing Values
      document.querySelector("#modal_edit h3").innerText = "Edit Book";
      document.querySelector("#new_book button").innerText = "Update Book";
      document.getElementById("new_title").value = this.books[index].title;
      document.getElementById("new_author").value = this.books[index].author;
      document.getElementById("new_pages").value = this.books[index].pages;
      document.getElementById("new_published").value =
        this.books[index].published;
      document.getElementById("new_acquired").value =
        this.books[index].acquired;
      document.getElementById("new_status").value = this.books[index].status;
      document.getElementById("new_id").value = this.books[index].id;

      // Open Modal
      this.modal.open("modal_edit");
    }
  }

  /**
   * Move Book from Library to Trash
   * @param {string} bookID - Book ID
   */
  deleteBook(bookID) {
    // Get Book Index from Book ID
    const index = this.indexFromBookID(bookID);

    // Delete Book
    this.books[index].delete();

    // Add Book to Recycle Bin
    this.addTrashOption(this.books[index]);

    // Remove Book from Table
    this.removeTableRow(bookID);

    // Update Summary Stats
    this.updateStats();

    // Update Storage
    this.storage.setItem("lib_books", JSON.stringify(this.books));
  }

  /**
   * Move Book from Trash to Library
   * @param {string} bookID - Book ID
   */
  restoreBook(bookID) {
    // Get Book Index from Book ID
    const index = this.indexFromBookID(bookID);

    // Restore Book
    this.books[index].restore();

    // Add Book to Table
    this.addTableRow(this.books[index]);

    // Remove Book from Recycle Bin
    this.removeTrashOption(bookID);

    // Update Summary Stats
    this.updateStats();

    // Update Storage
    this.storage.setItem("lib_books", JSON.stringify(this.books));
  }

  /**
   * Permanently Erase Book from Memory
   * @param {string} bookID - Book ID
   */
  eraseBook(bookID) {
    // Remove Book from Library
    this.books = this.books.filter((b) => b.id !== bookID);

    // Remove Book from Recycle Bin
    this.removeTrashOption(bookID);

    // Update Summary Stats
    this.updateStats();

    // Update Storage
    this.storage.setItem("lib_books", JSON.stringify(this.books));
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
            <td class="book_published">${book.getPublished()}</td>
            <td class="book_acquired">${book.getAcquired()}</td>
            <td class="book_status"><a data-id="${
              book.id
            }" data-status="${book.status.toString()}" href="#">${book.getStatus()}</a></td>
            <td class="book_edit">
                <a data-id="${
                  book.id
                }" data-action="delete" title="Delete Book" href="#"><svg viewBox="0 0 24 24">
                    <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M9,8H11V17H9V8M13,8H15V17H13V8Z" />
                </svg></a>
                <a data-id="${
                  book.id
                }" data-action="edit" title="Edit Book" href="#"><svg viewBox="0 0 24 24">
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

      // Update Summary Stats
      this.updateStats();

      // Update Storage
      this.storage.setItem("lib_books", JSON.stringify(this.books));
    });

    // Add Event Listeners for Edit Buttons
    const a = row.querySelectorAll(".book_edit a");
    for (let i = 0; i < a.length; i++) {
      a[i].addEventListener("click", (e) => {
        this.editEntry(e);
      });
    }

    // Add Row to Table
    this.tableBody.appendChild(row);
  }

  /**
   * Remove Book from Table
   * @param {string} bookID - Book ID
   */
  removeTableRow(bookID) {
    document.getElementById(bookID).remove();
  }

  /**
   * Build Recycle Bin
   */
  buildTrash() {
    // Empty Recycle Bin
    this.recycleBin.innerHTML = "";

    // Add Books to Recycle Bin from Trash
    this.books.forEach((book) => {
      if (book.isDeleted()) {
        this.addTrashOption(book);
      }
    });
  }

  /**
   * Add Option to Recycle Bin
   * @param {Book} book - Book Object
   */
  addTrashOption(book) {
    // Create Option
    const option = document.createElement("option");
    option.value = book.id;
    option.innerText = `"${book.getTitle()}" - ${book.getAuthor()}`;

    // Add Option to Recycle Bin
    this.recycleBin.appendChild(option);
  }

  /**
   * Remove Option from Recycle Bin
   * @param {string} bookID - Book ID
   */
  removeTrashOption(bookID) {
    // Loop through Options
    const options = this.recycleBin.getElementsByTagName("option");
    for (let i = 0; i < options.length; i++) {
      if (options[i].value === bookID) {
        // Remove Option
        options[i].remove();
        i = options.length;
      }
    }
  }

  /**
   * Get Book Library Index from Book ID
   * @param   {string} bookID - Book ID
   * @returns {number} - Book Index
   */
  indexFromBookID(bookID) {
    return this.books.findIndex((book) => book.id === bookID);
  }

  /**
   * Generate Random Unique ID
   * @returns {string} - Unique ID
   */
  generateId() {
    return Math.round(Date.now()).toString(36);
  }

  /**
   * Purge All User Data
   */
  purge() {
    this.storage.removeItem("lib_books");
  }
}

export default Books;
