/**
 * Theme Manager
 * @class
 * @property {object} settings  - Array of User Settings
 * @property {array} styles     - Array of Style Keys
 * @property {object} storage   - LocalStorage
 */
console.log("THEME");
class Theme {
  // Class Properties
  settings = {};
  styles = [
    "color-accent",
    "color-text",
    "color-bg",
    "color-dark",
    "color-light",
    "color-scheme",
  ];

  /**
   * Constructor
   * @constructor
   * @param {object} modal - Modal Module
   */
  constructor(modal) {
    // Class Properties
    this.storage = window.localStorage;
    this.modal = modal;

    // Open Settings Modal
    document.getElementById("settings_link").addEventListener("click", (e) => {
      e.preventDefault();
      console.log("##^");
      this.modal.open("modal_settings");
    });
  }
}

export default Theme;
