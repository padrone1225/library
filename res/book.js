/**
 * Book Class for Library
 * @class
 * @property {string} id        - Book ID
 * @property {string} title     - Book Title
 * @property {string} author    - Book Author
 * @property {number} pages     - Book pages
 * @property {string} published - Book Published Date
 * @property {string} acquired  - Book Acquired Date
 * @property {number} status    - Book Read/Unread States
 * @property {number} deleted   - Book Deleted Status
 */

class Book {
  // Class Properties
  id;
  title;
  author;
  pages;
  published;
  acquired;
  status;
  deleted;

  /**
   * Constructor
   * @constructor
   */
  constructor(id, title, author, pages, published, acquired, status, deleted) {
    this.id = id;
    this.title = title.trim();
    this.author = author.trim();
    this.pages = parseInt(pages);
    this.published = published;
    this.acquired = acquired;
    this.status = parseInt(status);
    this.deleted = parseInt(deleted);
  }

  /**
   * Delete Book
   */
  delete() {
    this.deleted = 1;
  }

  /**
   * Restore Book
   */
  restore() {
    this.deleted = 0;
  }

  /**
   * Is Deleted
   * @returns {boolean}
   */
  isDeleted() {
    return this.deleted === 1;
  }

  /**
   * Not Deleted
   * @return {boolean}  - T/F
   */
  notDeleted() {
    return this.deleted === 0;
  }

  /**
   * Toggle Book Read/Unread Status
   */
  toggleStatus() {
    this.status = this.status ? 0 : 1;
  }

  /**
   * Get human-readable Read/Unread Status
   * @returns {string}
   */
  getStatus() {
    return this.status ? "Read" : "Unread";
  }

  /**
   * Get Formatted Book Title
   * @return {string}   - Formatted Title
   */
  getTitle() {
    // Title Case
    let str = Book.#formatText(this.title);

    // Return Formatted Title
    return str;
  }

  /**
   * Get Formatted Author Name
   * @returns {string}  - Formatted Author
   */
  getAuthor() {
    return Book.#formatText(this.author);
  }

  /**
   * Get Page Count as Local String
   * @returns {string}  - Pages String
   */
  getPages() {
    return this.pages.toLocaleString();
  }

  /**
   * Get Formatted Published Date
   * @returns {string}  - Published Date
   */
  getPublished() {
    return Book.#formatDate(this.published);
  }

  /**
   * Get Formatted Acquired Date
   * @returns {string}  - Acquired Date
   */
  getAcquired() {
    return Book.#formatDate(this.acquired);
  }

  /**
   * Format Text to Title Case
   * @param     {string} str    - Raw Text
   * @returns   {string}        - Formatted Text
   */
  static #formatText(str) {
    return str.toLowerCase().replace(/\b(\w)/g, (s) => s.toUpperCase());
  }

  /**
   * Format Date to Local String
   * @param     {string} str    - Raw Date
   * @returns   {string}        - Formatted Date
   */
  static #formatDate(str) {
    return new Date(str + " 12:00:00").toLocaleDateString();
  }
}

export default Book;
