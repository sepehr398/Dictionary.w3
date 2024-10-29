const rowsPerPage = 10;
let currentPage = 1;

function displayRows() {
    const formRows = document.getElementById('form-rows').children;
    const totalRows = formRows.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    for (let i = 0; i < totalRows; i++) {
        formRows[i].style.display = 'none';
    }

    const start = (currentPage - 1) * rowsPerPage;
    const end = Math.min(start + rowsPerPage, totalRows);
    for (let i = start; i < end; i++) {
        formRows[i].style.display = 'flex';
    }

    updatePagination(totalPages);
}

function updatePagination(totalPages) {
    const paginationNumbers = document.getElementById('pagination-numbers');
    paginationNumbers.innerHTML = '';

    if (totalPages <= 1) return;

    addPaginationButton(1);
    if (currentPage > 3) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        paginationNumbers.appendChild(ellipsis);
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        addPaginationButton(i);
    }

    if (currentPage < totalPages - 2) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        paginationNumbers.appendChild(ellipsis);
    }

    addPaginationButton(totalPages);
}

function addPaginationButton(pageNumber) {
    const paginationNumbers = document.getElementById('pagination-numbers');
    const button = document.createElement('span');
    button.classList.add('pagination-number');
    
    if (pageNumber === currentPage) {
        button.classList.add('active');
    }

    button.textContent = pageNumber;
    button.addEventListener('click', () => {
        currentPage = pageNumber;
        displayRows();
        updatePagination(Math.ceil(document.getElementById('form-rows').children.length / rowsPerPage)); 
    });

    paginationNumbers.appendChild(button);
}

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayRows();
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    const formRows = document.getElementById('form-rows').children;
    const totalRows = formRows.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayRows();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    loadState();
    displayRows(); 
});

document.getElementById('save-btn').addEventListener('click', function () {
    saveState(); 
    showSaveNotification(); 
});

document.getElementById('shuffle-btn').addEventListener('click', shuffleRows);

function shuffleRows() {
    const formRows = document.getElementById('form-rows');
    const rowsArray = Array.from(formRows.children);

    for (let i = rowsArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rowsArray[i], rowsArray[j]] = [rowsArray[j], rowsArray[i]];
    }

    formRows.innerHTML = '';
    rowsArray.forEach(row => formRows.appendChild(row));

    saveState();
    displayRows();
}

document.getElementById('add-row-btn').addEventListener('click', function () {
    const formRows = document.getElementById('form-rows');
    const newRow = document.createElement('div');
    newRow.className = 'row';

    const input1Container = document.createElement('div');
    input1Container.className = `input-container`;
    const dictionaryButton = createButton('📖', 'dictionary-button circle-button');

    const input1 = document.createElement('textarea');
    input1.name = `input${formRows.children.length + 1}-1`;
    input1.placeholder = `Input ${formRows.children.length + 1}-1`;

    const input2 = document.createElement('input');
    input2.type = 'text';
    input2.name = `input${formRows.children.length + 1}-2`;
    input2.placeholder = `Input ${formRows.children.length + 1}-2`;

    input1Container.appendChild(input1);
    input1Container.appendChild(dictionaryButton);
  
    newRow.appendChild(input1Container);
    newRow.appendChild(input2);

    formRows.appendChild(newRow);
    addDictionaryClickHandler(dictionaryButton, input1);
    saveState();
});

function createButton(innerHTML, className, onClick) {
    const button = document.createElement('button');
    button.className = className;
    button.innerHTML = innerHTML;
    if (onClick) {
        button.addEventListener('click', onClick);
    }
    return button;
}

document.getElementById('remove-row-btn').addEventListener('click', function () {
    const formRows = document.getElementById('form-rows');
    if (formRows.children.length > 0) {
        formRows.removeChild(formRows.lastElementChild);
    }
    saveState();
});
document.getElementById('clear-btn').addEventListener('click', function () {
    clearAllRows();
});

function clearAllRows() {
    const formRows = document.getElementById('form-rows');
    formRows.innerHTML = '';
    localStorage.removeItem('formData');
    currentPage = 1;
    displayRows();
}

document.getElementById('form-rows').addEventListener('input', function () {
    saveState(); 
});

function saveState() {
    const formRows = document.getElementById('form-rows');
    const data = [];

    for (let row of formRows.children) {
        const inputContainer = row.querySelector('.input-container');
        const textarea = inputContainer ? inputContainer.querySelector('textarea') : null;
        const input2 = row.querySelector('input[type="text"]:not(.dictionary-input)');

        if (textarea && input2) {
            data.push({
                column1: textarea.value,
                column2: input2.value
            });
        }
    }

    localStorage.setItem('formData', JSON.stringify(data));
}

function loadState() {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
        const data = JSON.parse(savedData);
        const formRows = document.getElementById('form-rows');
        formRows.innerHTML = ''; 

        data.forEach((row, index) => {
            const newRow = document.createElement('div');
            newRow.className = 'row';
            const input1Container = document.createElement('div');
            input1Container.className = 'input-container';
            const dictionaryButton = createButton('📖', 'dictionary-button circle-button');
            const input1 = document.createElement('textarea');
            input1.name = `input${index + 1}-1`;
            input1.value = row.column1;
            input1Container.appendChild(input1);
            input1Container.appendChild(dictionaryButton);
            const input2 = document.createElement('input');
            input2.type = 'text';
            input2.name = `input${index + 1}-2`;
            input2.value = row.column2;
            newRow.appendChild(input1Container);
            newRow.appendChild(input2);
            formRows.appendChild(newRow);
            addDictionaryClickHandler(dictionaryButton, input1);
        });

        displayRows();
    }
}

function clearState() {
    localStorage.removeItem('formData');
    location.reload(); 
}

function showSaveNotification() {
    const notification = document.getElementById('save-notification');
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000); 
}

function addDictionaryClickHandler(button, input) {
    button.addEventListener('click', () => {
        const word = input.value.trim();
        if (word) {
            fetchDefinition(word, input);
        } else {
            alert('Please enter a word to look up.');
        }
    });
}

function displayDefinition(word, meanings, phonetics) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    const popup = document.createElement('div');
    popup.className = 'definition-popup';
    let content = `<h2>${word}</h2>`;
    if (phonetics && phonetics.length > 0) {
        const firstPhonetic = phonetics.find(p => p.text || p.audio) || {};
        content += `<div class="phonetics">`;
        if (firstPhonetic.text) {
            content += `<span>${firstPhonetic.text}</span>`;
        }
        if (firstPhonetic.audio) {
            content += `
                <button class="audio-button" onclick="playAudio('${firstPhonetic.audio}')">
                    🔊
                </button>`;
        }
        content += `</div>`;
    }

    meanings.forEach((meaning, index) => {
        content += `<h3>${index + 1}. ${meaning.partOfSpeech}</h3>`;
        content += `<p><strong>Definition:</strong> ${meaning.definitions[0].definition}</p>`;
        if (meaning.definitions[0].example) {
            content += `<p><strong>Example:</strong> "${meaning.definitions[0].example}"</p>`;
        }
    });

    const exitButton = document.createElement('button');
    exitButton.textContent = 'X';
    exitButton.className = 'exit-button';
    exitButton.onclick = () => {
        document.body.removeChild(overlay);
    };

    popup.innerHTML = content;
    popup.appendChild(exitButton);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}

function playAudio(audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play();
}

function fetchDefinition(word, input) {
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Word not found');
            }
            return response.json();
        })
        .then(data => {
            const phonetics = data[0].phonetics;
            const meanings = data[0].meanings.slice(0, 3);
            displayDefinition(word, meanings, phonetics);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Word not found or an error occurred.');
        });
}
