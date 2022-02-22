export default class NotesAPI {
  static getAllNotes() {
    const notes = JSON.parse(localStorage.getItem("notes-data")) || [{
      title: "Description",
      id: 99999,
      body: "- Notes App using only JavaScript and Local Storage.\n- The code for this makes use of the following HTML, CSS, JS features: Local Storage, ES6 Import/Export Syntax, Classes, Arrow Functions, Static Methods, Callback Functions, Event Listeners, QuerySelector, GetElementById, Template Strings, Class List, CSS Psuedo-Classes, Flexbox and HTML5 Data Attributes.\n\nYouTube video tutorial at: https://youtu.be/01YKQmia2Jw",
      timeUpdated: "2022-02-22T07:29:41.796Z",
    }];
    return notes.sort((a, b) => {
      return new Date(b.timeUpdated) - new Date(a.timeUpdated);
    });
  }

  static saveNotes(note) {
    const notes = [...NotesAPI.getAllNotes()];
    const existingNote = notes.find(item => item.id === note.id);

    // Edit/Update
    if (existingNote) {
      existingNote.title = note.title;
      existingNote.body = note.body;
      existingNote.timeUpdated = new Date().toISOString();
    } else {
      // New note
      note.id = Math.floor(Math.random() * 100000);
      note.timeUpdated = new Date().toISOString();
      notes.push(note);
    }
    localStorage.setItem("notes-data", JSON.stringify(notes));
  }

  static deleteNotes(id) {
    const notes = [...NotesAPI.getAllNotes()];
    const newNotes = notes.filter(item => item.id != id);
    localStorage.setItem("notes-data", JSON.stringify(newNotes));
  }
}