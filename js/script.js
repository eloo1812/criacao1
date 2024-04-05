const addNote = document.querySelector("#add-note");
const closeModal = document.querySelector("#close-modal");
const modal = document.querySelector("#modal");
const modalView = document.querySelector("#modal-view");
const notes = document.querySelector("#notes");
const btnSaveNote = document.querySelector("#btn-save-note");
const btnCloseNote = document.querySelector("#btn-close-note");
const divControls = document.querySelector("#controls-note");

addNote.addEventListener("click", (event) => {
    event.preventDefault();
    modal.style.display = "block";
    notes.style.display = "none";
    addNote.style.display = "none";
});

closeModal.addEventListener("click", (event) => {
    event.preventDefault();
    modalView.style.display = "none";
    notes.style.display = "flex";
    addNote.style.display = "block";
    clearNoteView();
});

btnCloseNote.addEventListener("click", (event) => {
    event.preventDefault();
    modal.style.display = "none";
    notes.style.display = "flex";
    addNote.style.display = "block";
    clearInputs();
    listNotes();
});

btnSaveNote.addEventListener("click", (event) => {
    event.preventDefault();
    const id = document.querySelector("#input-id").value;
    const title = document.querySelector("#input-title").value;
    const content = document.querySelector("#input-content").value;

    if (title.trim() === "" || content.trim() === "") {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const data = {
        id: id.length < 1 ? new Date().getTime() : id,
        title: title,
        content: content,
        lastTime: new Date().getTime(),
    };
    saveNote(data);
});

const saveNote = (data) => {
    let notesArray = loadNotes();
    if (data.id.length < 1) {
        data.id = new Date().getTime();
        document.querySelector("#input-id").value = data.id;
    } else {
        notesArray = notesArray.filter((item) => item.id !== data.id);
    }
    notesArray.unshift(data);
    localStorage.setItem("notes", JSON.stringify(notesArray));
    listNotes();
};

const listNotes = () => {
    let listNotesArray = loadNotes();
    notes.innerHTML = "";
    listNotesArray.forEach((item) => {
        let divCard = createCard(item);
        notes.appendChild(divCard);
    });
};

const createCard = (item) => {
    let divCard = document.createElement("div");
    divCard.className = "card";
    divCard.style.width = "25rem";
    divCard.addEventListener("click", (event) => {
        event.preventDefault();
        showNoteView(item);
    });

    let divCardBody = document.createElement("div");
    divCardBody.className = "card-body";

    let h1 = document.createElement("h1");
    h1.innerText = item.title;
    divCardBody.appendChild(h1);

    let p = document.createElement("p");
    p.innerText = item.content;
    divCardBody.appendChild(p);

    let pLastTime = document.createElement("p");
    pLastTime.innerText =
        "Ultima edição: " + new Date(item.lastTime).toLocaleDateString("pt-br");
    divCardBody.appendChild(pLastTime);

    divCard.appendChild(divCardBody);
    return divCard;
};

const showNoteView = (item) => {
    notes.style.display = "none";
    addNote.style.display = "none";
    modalView.style.display = "block";
    divControls.style.display = "flex";
    document.querySelector("#title-note").innerText = item.title;
    let pContent = document.createElement("p");
    pContent.innerText = item.content;
    document.querySelector("#content-note").innerHTML = "";
    document.querySelector("#content-note").appendChild(pContent);
    let pLastTime = document.createElement("p");
    pLastTime.innerText =
        "Última alteração: " + new Date(item.lastTime).toLocaleDateString("pt-br");
    document.querySelector("#content-note").appendChild(pLastTime);
    divControls.innerHTML = "";

    let divEdit = document.createElement("div");
    let linkEdit = document.createElement("a");
    linkEdit.setAttribute("id", item.id);
    let iconEdit = document.createElement("i");
    iconEdit.className = "bi bi-pencil-square";
    iconEdit.style.color = "green";
    linkEdit.appendChild(iconEdit);
    divEdit.appendChild(linkEdit);
    divControls.appendChild(divEdit);

    let divDel = document.createElement("div");
    let linkDel = document.createElement("a");
    linkDel.setAttribute("id", item.id);
    let iconDel = document.createElement("i");
    iconDel.className = "bi bi-trash";
    iconDel.style.color = "purple";
    linkDel.appendChild(iconDel);
    divDel.appendChild(linkDel);
    divControls.appendChild(divDel);

    linkDel.addEventListener("click", (event) => {
        event.preventDefault();
        if (confirm("Confirmar?")) {
            deleteNote(item.id);
        }
    });

    linkEdit.addEventListener("click", (event) => {
        event.preventDefault();
        modal.style.display = "block";
        notes.style.display = "none";
        addNote.style.display = "none";
        modalView.style.display = "none";
        divControls.style.display = "none";
        editNote(item.id);
    });
};

const deleteNote = (id) => {
    let allNotes = loadNotes();
    let filteredNotes = allNotes.filter((note) => note.id !== id);
    localStorage.setItem("notes", JSON.stringify(filteredNotes));
    listNotes();
};

const editNote = (id) => {
    let notesArray = loadNotes();
    const noteToEdit = notesArray.find((note) => note.id === id);
    clearInputs();
    if (noteToEdit) {
        document.querySelector("#input-id").value = noteToEdit.id;
        document.querySelector("#input-title").value = noteToEdit.title;
        document.querySelector("#input-content").value = noteToEdit.content;
    } else {
        console.log("Nota não encontrada");
    }
};

const loadNotes = () => {
    let notes = localStorage.getItem("notes");
    try {
        return notes ? JSON.parse(notes) : [];
    } catch (error) {
        console.error("Erro ao carregar notas do armazenamento local:", error);
        return [];
    }
};

const clearInputs = () => {
    document.querySelector("#input-id").value = "";
    document.querySelector("#input-title").value = "";
    document.querySelector("#input-content").value = "";
};

const clearNoteView = () => {
    document.querySelector("#title-note").innerText = "";
    document.querySelector("#content-note").innerText = "";
    divControls.innerHTML = "";
};

listNotes();
