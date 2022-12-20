// Import Modules
import Theme from "./theme.js";
import Books from "./books.js";
import Modal from "./modal.js";

/**
 * Personal Library
 * @class
 * @property {object} modal
 * @property {object} theme
 * @property {object} books
 */

class Library {
  // Class Properties
  modal = {};
  theme = {};
  books = {};

  /**
   * Constructor
   * @Constructor
   */
  constructor() {
    console.log("@^@^@^");
    //Load Modules
    this.modal = new Modal();
    this.theme = new Theme(this.modal);
    this.books = new Books(this.modal);

    // Open History Modal
    document.getElementById("default_link").addEventListener("click", (e) => {
      e.preventDefault();
      console.log("T@@");
      this.modal.open("modal_default");
    });
  }
}

export default Library;
