const addNote = document.querySelector("#add-note"); //tipo o getElementById só que não apenas pra ID
const closeModal =  document.querySelector('#close-modal'); //fechar janela modal com os detalhes da nota.
const modal = document.querySelector('#modal'); //Modal para edição das notas
const modalView = document.querySelector('#modal-view'); //Modal para exibição dos detalhes da nota
const notes = document.querySelector('#notes');//Lista divs com dados das notas
const btnSaveNote = document.querySelector("#btn-save-note"); //icone para salvar nota
const btnCloseNote = document.querySelector("#btn-close-note");//icone para fechar modal de edição de nota.
const divControls = document.querySelector("#controls-note");//editar e excluir notas

//Eventos

addNote.addEventListener("click", (evt) =>{
    evt.preventDefault();
    modal.style.display = "block";
    notes.style.display = "none";
    addNote.style.display = "none";
});

closeModal.addEventListener("click",(evt) => {
    evt.preventDefault();
    modalView.style.display = "none";
    notes.style.display = "flex";
    addNote.style.display = "block";

    document.querySelector('#title-note').innerText = '';
    document.querySelector('#content-note').innerText = '';
})

btnCloseNote.addEventListener("click", (evt) => {
    evt.preventDefault();
    modal.style.display = "none";
    notes.style.display = "flex";
    addNote.style.display = "block";
    
    document.querySelector("#input-id").value = '';
    document.querySelector("#input-title").value = '';
    document.querySelector("#input-content").value = '';

    listNotes(); 
});

btnSaveNote.addEventListener("click", (evt)=> {
    evt.preventDefault();

    let data = {
        id: document.querySelector("#input-id").value,
        title: document.querySelector("#input-title").value,
        content: document.querySelector("#input-content").value,
        lastTime: new Date().getTime(),
    }

    saveNote(data);


    
});


//Funcções

const saveNote = (data) => {

    let notes = loadNotes();

    if (data.id.length < 1) {
        data.id = new Date().getTime();
        document.querySelector("#input-id").value = data.id;
        notes.push(data); 
    } else {
        console.log(data.id);
        notes.forEach((item, i) => {
            if(item.id == data.id) {
                notes[i] = data;
            }
        });
    }

    console.log(data);
    notes = JSON.stringify(notes);

    localStorage.setItem('notes', notes);
};

const listNotes = () => {
   let listNotes = loadNotes();
   notes.innerHTML = '';

    listNotes.forEach((item) => {
        let divCard = document.createElement('div');
        divCard.className = 'card';
        divCard.style.width = '25rem';

        divCard.addEventListener('click', (evt) => {
            evt.preventDefault();
            showNote(item)
        });

        let divCardBody = document.createElement('div');
        divCardBody.className = 'card-body';

        let h1 = document.createElement('h1');
        h1.innerText = item.title;

        divCardBody.appendChild(h1);
        divCard.appendChild(divCardBody); //botar uma div ou elemento dentro do outro

        notes.appendChild(divCard);

        let p = document.createElement('p');
        p.innerText = item.content;

        divCardBody.appendChild(p);

        let pLastTime = document.createElement('p');
        pLastTime.innerText = "Ultima edição: " + new Date(item.lastTime).toLocaleDateString('pt-br');

        divCardBody.appendChild(pLastTime);
    });
};

const loadNotes = () => { //ler local storage
    let notes = localStorage.getItem('notes');
    if (!notes) {
        notes = [];
    }
    else {
        notes = JSON.parse(notes); //transforma em objeto JSON
    }

    return notes;
};

const showNote = (item) => {
    console.log(item)
    notes.style.display = "none";
    addNote.style.display = "none";
    modalView.style.display = "block";
    divControls.style.display = "flex";

    document.querySelector('#title-note').innerText = item.title;

    // Limpar o conteúdo anterior antes de adicionar novos elementos
    document.querySelector('#content-note').innerHTML = '';

    let pContent = document.createElement('p');
    pContent.innerText = item.content;
    document.querySelector('#content-note').appendChild(pContent);

    let pLastTime = document.createElement('p');
    pLastTime.innerText = "Última alteração: " + new Date(item.lastTime).toLocaleDateString('pt-br');
    document.querySelector('#content-note').appendChild(pLastTime);

    divControls.innerHTML = '';
    
    divEdit = document.createElement('div');
    linkEdit = document.createElement('a');
    linkEdit.setAttribute("id", item.id);
    iconEdit = document.createElement('i');
    iconEdit.className = "bi bi-pen";
    iconEdit.style.color = "blue";
    linkEdit.appendChild(iconEdit);
    divEdit.appendChild(linkEdit);
    divControls.appendChild(divEdit);

    divDel = document.createElement('div');
    linkDel = document.createElement('a');
    linkDel.setAttribute("id", item.id);
    iconDel = document.createElement('i');
    iconDel.className = "bi bi-trash";
    iconDel.style.color = "red";
    linkDel.appendChild(iconDel);
    divDel.appendChild(linkDel);
    divControls.appendChild(divDel);


    linkDel.addEventListener("click", (evt) => {
        evt.preventDefault();
        if (confirm("Confirmar?")) {
            deleteNote (item.id);
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

    let filteredNotes = allNotes.filter(note => note.id !== id);
    localStorage.setItem('notes', JSON.stringify(filteredNotes));

    listNotes();
};

const editNote = (id) => {
    document.querySelector("#input-id").value = "";
    document.querySelector("#input-title").value = "";
    document.querySelector("#input-content").value = "";
    console.log(id);
    let notes = loadNotes();
    const noteToEdit = notes.find(note => note.id === id);

    if (noteToEdit) {
        document.querySelector("#input-id").value = noteToEdit.id;
        document.querySelector("#input-title").value = noteToEdit.title;
        document.querySelector("#input-content").value = noteToEdit.content;
    } else {
        console.log("nota não encontrada");
    }
};

listNotes();