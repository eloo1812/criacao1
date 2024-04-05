const addNote = document.querySelector("#add-note");
const closeModal = document.querySelector("#close-modal");
const modal = document.querySelector("#modal");
const modalView = document.querySelector("#modal-view");
const notes = document.querySelector("#notes");
const btnSaveNote = document.querySelector("#btn-save-note");
const btnCloseNote = document.querySelector("#btn-close-note");
const divControls = document.querySelector("#controls-note");

addNote.addEventListener("click", (evt) => {
    evt.preventDefault();
    modal.style.display = "block";
    notes.style.display = "none";
    addNote.style.display = "none";
});

closeModal.addEventListener("click", (evt) => {
    evt.preventDefault();
    modalView.style.display = "none";
    notes.style.display = "flex";
    addNote.style.display = "block";

    document.querySelector("#title-note").innerText = "";
    document.querySelector("#content-note").innerText = "";
});

btnCloseNote.addEventListener("click", (evt) => {
    evt.preventDefault();
    modal.style.display = "none";
    notes.style.display = "flex";
    addNote.style.display = "block";

    document.querySelector("#input-id").value = "";
    document.querySelector("#input-title").value = "";
    document.querySelector("#input-content").value = "";

    listNotes();
});

btnSaveNote.addEventListener("click", (evt) => {
    evt.preventDefault();

    let data = {
        id: document.querySelector("#input-id").value,
        title: document.querySelector("#input-title").value,
        content: document.querySelector("#input-content").value,
        lastTime: new Date().getTime(),
    };
    saveNote(data);
});

const saveNote = (data) => {
    let notesArray = loadNotes();

    if (data.id.length < 1) {
        data.id = new Date().getTime();
        document.querySelector("#input-id").value = data.id;
        // Adiciona a nova nota no início do array
        notesArray.unshift(data);
    } else {
        console.log(data.id);
        notesArray.forEach((item, i) => {
            if (item.id == data.id) {
                notesArray[i] = data;
            }
        });
    }

    console.log(data);
    notesArray = JSON.stringify(notesArray);

    localStorage.setItem("notes", notesArray);
    listNotes();
};

const listNotes = () => {
    let listNotesArray = loadNotes();
    notes.innerHTML = "";

    listNotesArray.forEach((item) => {
        let divCard = document.createElement("div");
        divCard.className = "card";
        divCard.style.width = "25rem";

        divCard.addEventListener("click", (evt) => {
            evt.preventDefault();
            showNoteView(item);
        });

        let divCardBody = document.createElement("div");
        divCardBody.className = "card-body";

        let h1 = document.createElement("h1");
        h1.innerText = item.title;

        divCardBody.appendChild(h1);
        divCard.appendChild(divCardBody);

        notes.appendChild(divCard);

        let p = document.createElement("p");
        p.innerText = item.content;

        divCardBody.appendChild(p);

        let pLastTime = document.createElement("p");
        pLastTime.innerText =
            "Ultima edição: " +
            new Date(item.lastTime).toLocaleDateString("pt-br");

        divCardBody.appendChild(pLastTime);
    });
};

const loadNotes = () => {
    let notes = localStorage.getItem("notes");
    if (!notes) {
        notes = [];
    } else {
        notes = JSON.parse(notes);
    }

    return notes;
};

const showNoteView = (item) => {
    console.log(item);
    notes.style.display = "none";
    addNote.style.display = "none";
    modalView.style.display = "block";
    divControls.style.display = "flex";

    document.querySelector("#title-note").innerText = item.title;

    let pContent = document.createElement("p");
    pContent.innerText = item.content;
    document.querySelector("#content-note").appendChild(pContent);

    let pLastTime = document.createElement("p");
    pLastTime.innerText =
        "Última alteração: " +
        new Date(item.lastTime).toLocaleDateString("pt-br");
    document.querySelector("#content-note").appendChild(pLastTime);

    divControls.innerHTML = "";

    divEdit = document.createElement("div");
    linkEdit = document.createElement("a");
    linkEdit.setAttribute("id", item.id);
    iconEdit = document.createElement("i");
    iconEdit.className = "bi bi-pencil-square";
    iconEdit.style.color = "green";
    linkEdit.appendChild(iconEdit);
    divEdit.appendChild(linkEdit);
    divControls.appendChild(divEdit);

    divDel = document.createElement("div");
    linkDel = document.createElement("a");
    linkDel.setAttribute("id", item.id);
    iconDel = document.createElement("i");
    iconDel.className = "bi bi-trash";
    iconDel.style.color = "purple";
    linkDel.appendChild(iconDel);
    divDel.appendChild(linkDel);
    divControls.appendChild(divDel);

    linkDel.addEventListener("click", (evt) => {
        evt.preventDefault();
        if (confirm("Confirmar?")) {
            deleteNote(item.id);
        }
    });

    linkEdit.addEventListener("click", (evt) => {
        evt.preventDefault();
        modal.style.display = "block";
        notes.style.display = "none";
        addNote.style.display = "none";
        modalView.style.display = "none";
        divControls.style.display = "none";
        editNote(item.id);
    });
};

const deleteNote = (id) => {
    console.log(id);
    let allNotes = loadNotes();

    let filteredNotes = allNotes.filter((note) => note.id !== id);
    localStorage.setItem("notes", JSON.stringify(filteredNotes));

    listNotes();
};

const editNote = (id) => {
    document.querySelector("#input-id").value = "";
    document.querySelector("#input-title").value = "";
    document.querySelector("#input-content").value = "";
    console.log(id);
    let notesArray = loadNotes();
    const noteToEdit = notesArray.find((note) => note.id === id);

    if (noteToEdit) {
        document.querySelector("#input-id").value = noteToEdit.id;
        document.querySelector("#input-title").value = noteToEdit.title;
        document.querySelector("#input-content").value = noteToEdit.content;
    } else {
        console.log("Nota não encontrada");
    }
};

listNotes();
