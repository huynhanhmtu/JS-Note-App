import NotesAPI from "./NotesAPI.js";
import NotesView from "./NotesView.js";

export default class App {
  constructor(root) {
    this.notes = [];
    this.activeNote = null;
    this.view = new NotesView(root, this.handle());
    this.refreshNote();
  }

  refreshNote() {
    const notes = [...NotesAPI.getAllNotes()];
    this.setNotes(notes);

    if (notes.length > 0) {
      this.setActiveNote(notes[0]);
    }
  }

  setNotes(notes) {
    this.notes = notes;
    this.view.updateNotesList(notes);
    this.view.updateNotePreviewVisibility(notes.length > 0);
  }

  setActiveNote(note) {
    this.activeNote = note;
    this.view.updateActiveNode(note);
  }

  handle() {
    return {
      onNoteSelect: noteId => {
        const selectedNote = this.notes.find(note => note.id == noteId);
        this.setActiveNote(selectedNote);
      },
      onNoteAdd: () => {
        const newNote = {
          title: "Note's title...",
          body: "Enter note's content..."
        }
        NotesAPI.saveNotes(newNote);
        this.refreshNote();
      },
      onNoteEdit: (title, body) => {
        NotesAPI.saveNotes({
          id: this.activeNote.id,
          title,
          body
        });
        this.refreshNote();
      },
      onNoteDelete: noteId => {
        NotesAPI.deleteNotes(noteId);
        this.refreshNote();
      }
    }
  }
}