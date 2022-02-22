export default class NotesView {
  constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}) {
    this.root = root;
    this.onNoteSelect = onNoteSelect;
    this.onNoteAdd = onNoteAdd;
    this.onNoteEdit = onNoteEdit;
    this.onNoteDelete = onNoteDelete;
    this.root.innerHTML = `
      <div class="sidebar">
        <button class="sidebar__btn" type="button">Add Notes</button>
        <div class="sidebar__list"></div>
      </div>
      <div class="preview">
        <input class="preview__title" type="text" placeholder="New Note...">
        <textarea class="preview__body">New note content...</textarea>
        <button class="preview__btn" type="button">Delete Note</button>
      </div>
    `;

    const btnAddNote = this.root.querySelector(".sidebar__btn");
    const btnDeleteNote = this.root.querySelector(".preview__btn");
    const inpTitle = this.root.querySelector(".preview__title");
    const inpBody = this.root.querySelector(".preview__body");

    btnAddNote.addEventListener("click", () => {
      this.onNoteAdd();
    });

    btnDeleteNote.addEventListener("click", () => {
      const doDelete = confirm("Are you sure you want to delete this note?");
      if (doDelete) this.onNoteDelete(btnDeleteNote.dataset.noteId);
    });

    const inpContent = [inpTitle, inpBody];
    inpContent.forEach(inpField => {
      inpField.addEventListener("blur", () => {
        const updatedTitle = inpTitle.value.trim();
        const updatedBody = inpBody.value.trim();
        this.onNoteEdit(updatedTitle, updatedBody);
      });
    });
    this.updateNotePreviewVisibility(false);
  }

  createListItemHTML(id, title, body, timeUpdated) {
    const MAX_BODY_LENGTH = 60;
    return `
      <div class="sidebar__item" data-note-id="${id}">
        <div class="sidebar__title">${title}</div>
        <div class="sidebar__body">
          ${body.substring(0, MAX_BODY_LENGTH)}
          ${body.length > MAX_BODY_LENGTH ? "..." : ""}
        </div>
        <div class="sidebar__updated">
          Last updated: ${timeUpdated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
        </div>
      </div>
    `
  }

  updateNotesList(notes) {
    const notesListContainer = this.root.querySelector(".sidebar__list");
    // Empty list
    notesListContainer.innerHTML = "";

    for (const note of notes) {
      const html = this.createListItemHTML(note.id, note.title, note.body, new Date(note.timeUpdated));
      notesListContainer.insertAdjacentHTML("beforeend", html)
    }

    // Add select/delete events for each list item
    notesListContainer.querySelectorAll(".sidebar__item").forEach(item => {
      item.addEventListener("click", () => {
        this.onNoteSelect(item.dataset.noteId);
      });
      // Double click note item to delete
      // item.addEventListener("dblclick", () => {
      //   const doDelete = confirm("Are you sure you want to delete this note?");
      //   if (doDelete) this.onNoteDelete(item.dataset.noteId);
      // });
    });
  }

  updateActiveNode(note) {
    this.root.querySelector(".preview__title").value = note.title;
    this.root.querySelector(".preview__body").value = note.body;
    this.root.querySelector(".preview__btn").dataset.noteId = note.id;

    this.root.querySelectorAll(".sidebar__item").forEach(note => {
      note.classList.remove("sidebar__selected");
    });
    this.root.querySelector(`.sidebar__item[data-note-id="${note.id}"]`).classList.add("sidebar__selected");
  }

  updateNotePreviewVisibility(visible) {
    this.root.querySelector(".preview").style.visibility = visible ? "visible" : "hidden";
  }

}