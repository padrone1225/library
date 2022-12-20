/**
 * Theme Manager
 * @class
 * @property {object} settings  - Array of User Settings
 * @property {array} styles     - Array of Style Keys
 * @property {object} storage   - LocalStorage
 */

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

    // Load Settings
    if (this.storage.hasOwnProperty("lib_settings")) {
      // Load from LocalStorage
      this.settings = JSON.parse(this.storage.getItem("lib_settings"));
      this.styles.forEach((style) => {
        // Set Value in Stylesheet
        this.setStyleProperty(style, this.settings[style]);
      });
    } else {
      // Build {settings} from [styles] and css
      this.styles.forEach((index) => {
        // Get Value form Stylesheet
        this.settings[index] = this.getStyleProperty(index);
      });
    }

    // Enable Transitions
    this.setStyleProperty(
      "transition-all",
      this.getStyleProperty("enable-all")
    );

    // Populate Settings Modal Form
    for (let index in this.settings) {
      // Get Matching Input
      const input = document.getElementById(index);

      // Update Input Value from {settings}
      input.value = this.settings[index];

      // Add Event Listener to Settings Form
      input.addEventListener("input", (e) => {
        this.setStyleProperty(index, e.target.value);
      });
    }

    // Open Settings Modal
    document.getElementById("settings_link").addEventListener("click", (e) => {
      e.preventDefault();
      this.modal.open("modal_settings");
    });

    // Settings Reset Button
    document.getElementById("settings-reset").addEventListener("click", (e) => {
      e.preventDefault();
      this.resetSettings();
    });

    // Settings Save Button
    document.getElementById("settings-save").addEventListener("click", (e) => {
      e.preventDefault();

      // Update Settings
      for (let index in this.settins) {
        // Get Matching Input
        const input = document.getElementById(index);

        // Update {settings} form Input value
        this.settings[index] = input.value;
      }

      this.storage.setItem("lib_settings", JSON.stringify(this.settings));
      this.modal.close("modal_settings");
    });
  }

  /**
   * Get CSS Property
   * @param     {string} prop   - Property
   * @returns   {string}        - Value
   */
  getStyleProperty(prop) {
    const property = prop === "color-scheme" ? prop : "--" + prop;
    return getComputedStyle(document.documentElement)
      .getPropertyValue(property)
      .trim();
  }

  /**
   * Set CSS Property
   * @param {string} prop   - Property
   * @param {string} value  - Value
   */
  setStyleProperty(prop, value) {
    const property = prop === "color-scheme" ? prop : "--" + prop;
    document.documentElement.style.setProperty(property, value);
  }

  /**
   * Reset Settings to Last Save
   */
  resetSettings() {
    this.styles.forEach((style) => {
      this.setStyleProperty(style, this.settings[style]);
      document.getElementById(style).value = this.settings[style];
    });
  }

  /**
   * Purge All User Data
   */
  purge() {
    this.storage.removeItem("lib_settings");
  }
}

export default Theme;
