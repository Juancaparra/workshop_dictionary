import { dictionary } from './dictionary.js';

// Elementos del DOM para interactuar con la interfaz
const inputWord = document.getElementById('input-word');
const buttonTranslate = document.getElementById('translatebtn');
const answer = document.getElementById('answer');
const categoryRadios = document.querySelectorAll('input[name="categorie"]');
const answer2 = document.getElementById('answer2');
const diccionarioContainer = document.getElementById('diccionarioContainer');
const orderLanguageRadios = document.querySelectorAll('input[name="orderLanguage"]');
const inputNewWordEnglish = document.getElementById('input-new-word');
const inputNewWordSpanish = document.getElementById('input-new-word-spanish');
const inputExample = document.getElementById('example-input');
const categoryRadiosForm = document.querySelectorAll('input[name="categorie-form"]');
const buttonAddWord = document.querySelector('.button');

// Traducción de palabras entre inglés y español según el idioma seleccionado
buttonTranslate.addEventListener('click', () => {
    const word = inputWord.value.trim();
    const selectedIdiom = document.querySelector('input[name="idiom"]:checked').value;

    answer.value = word ? translateWord(word, selectedIdiom) : 'Por favor, ingresa una palabra';
});

// Función para traducir una palabra buscando en el diccionario
function translateWord(word, language) {
    for (let category in dictionary.categories) {
        const words = dictionary.categories[category];
        const foundWord = words.find(entry =>
            language === 'ingles'
                ? entry.spanish.toLowerCase() === word.toLowerCase()
                : entry.english.toLowerCase() === word.toLowerCase()
        );
        if (foundWord) return language === 'ingles' ? foundWord.english : foundWord.spanish;
    }
    return 'No encontrado';
}

// Visualización de palabras por categoría seleccionada
categoryRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        const selectedCategory = document.querySelector('input[name="categorie"]:checked').value;
        showCategoryWords(selectedCategory);
    });
});

function showCategoryWords(category) {
    const words = dictionary.categories[category];
    answer2.value = words
        ? words.map(word => word.spanish).join(', ')
        : 'Categoría no encontrada';
}

// Renderización dinámica del diccionario, con soporte para ordenación por idioma
function renderDictionary(isSorted = false) {
    const selectedOrderLanguage = document.querySelector('input[name="orderLanguage"]:checked')?.value;

    while (diccionarioContainer.firstChild) {
        diccionarioContainer.removeChild(diccionarioContainer.firstChild);
    }

    const ul = document.createElement('ul');
    ul.style.listStyleType = 'none';

    let allWords = Object.values(dictionary.categories).flat();
    if (isSorted && selectedOrderLanguage) {
        allWords.sort((a, b) => {
            return a[selectedOrderLanguage].toLowerCase().localeCompare(b[selectedOrderLanguage].toLowerCase());
        });
    }

    allWords.forEach(word => {
        const li = document.createElement('li');
        li.textContent = `${word.english} -> ${word.spanish} (Ejemplo: ${word.example})`;
        ul.appendChild(li);
    });

    diccionarioContainer.appendChild(ul);
}

orderLanguageRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        renderDictionary(true);
    });
});

// Renderización inicial del diccionario
renderDictionary();

// Agregar nuevas palabras al diccionario, validando los datos y actualizando la interfaz
buttonAddWord.addEventListener('click', () => {
    const englishWord = inputNewWordEnglish.value.trim();
    const spanishWord = inputNewWordSpanish.value.trim();
    const example = inputExample.value.trim();

    if (!englishWord || !spanishWord || !example) {
        alert('Por favor, completa todos los campos');
        return;
    }

    let selectedCategory;
    categoryRadiosForm.forEach(radio => {
        if (radio.checked) {
            selectedCategory = radio.value;
        }
    });

    if (!selectedCategory) {
        alert('Por favor, selecciona una categoría');
        return;
    }

    const newId = generateUniqueId(selectedCategory);
    const newWord = { id: newId, english: englishWord, spanish: spanishWord, example: example };

    dictionary.categories[selectedCategory].push(newWord);
    inputNewWordEnglish.value = '';
    inputNewWordSpanish.value = '';
    inputExample.value = '';
    alert('Nueva palabra agregada con éxito');
    renderDictionary();
});

// Función para generar IDs únicos para nuevas palabras
function generateUniqueId(category) {
    const categoryWords = dictionary.categories[category];
    return categoryWords && categoryWords.length > 0
        ? Math.max(...categoryWords.map(word => word.id)) + 1
        : 1;
}
