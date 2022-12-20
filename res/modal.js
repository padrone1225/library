/**
 * Modal
 * @class
 * @property {object} mask
 */

class Modal {
  // Class Properties
  mask;

  /**
   * Constructor
   * @constructor
   * @param {string} maskID
   */
  constructor(maskID = "modal") {
    // Mask Element
    this.mask = document.getElementById(maskID);

    // Insert Close Buttons
    const modals = document.querySelectorAll(`#${maskID} > *`);
    modals.forEach((modal) => {
      if (modal.hasAttribute("id") && modal.id !== "") {
        modal.prepend(this.closeButton(modal.id));
      }
    });
  }

  /**
   * Open Modal
   * @param {string} id
   */
  open(id) {
    const modal = document.getElementById(id);
    this.mask.style.display = "flex";
    modal.style.display = "block";
    this.mask.style.opacity = "1";
    modal.style.opacity = "1";
  }

  /**
   * Close Modal
   * @param {string} id
   */
  close(id) {
    const modal = document.getElementById(id);
    modal.style.opacity = "0";
    this.mask.style.opacity = "0";
    modal.style.display = "none";
    this.mask.style.display = "none";
  }

  /**
   * Modal Close Button
   * @param {string} modalID
   * @return {object}
   */
  closeButton(modalID) {
    const a = document.createElement("a");
    a.classList.add("close_modal");
    a.dataset.id = modalID;
    a.innerHTML =
      '<svg viewBox="0 0 24 24"><path d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z" /></svg>';
    a.addEventListener("click", (e) => {
      e.preventDefault();
      this.close(e.currentTarget.dataset.id);
    });
    return a;
  }
}

export default Modal;
