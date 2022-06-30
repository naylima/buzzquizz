let quizz;
let object = {
    title: '',
    image: '',
    questions: [],
    levels: []
}

const $info = document.querySelector('.basic-info');
const $quizzLevel = document.querySelector('.quizz-level');
const $quizzSuccess = document.querySelector('.quizz-success');
const $initialScreen = document.querySelector('.initial-screen');

const urlApi = 'https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes';

searchQuizz();

// PASSO 1 - Faz requisição dos quizzes
function searchQuizz() {
    const promise = axios.get(urlApi);
    promise.then(processQuizz);
}

// PASSO 2 - Processa requisição dos quizzes
function processQuizz(response) {
    quizz = response.data;
    renderQuizz();
}

// PASSO 3 - Renderiza quizzes na tela


function renderQuizz() {

    const quizzElement = document.querySelector('.box-quizz');

    let template;

    quizzElement.innerHTML = '';

    quizz.forEach(item => {

        template = /* html */`
            <div class="quizz" id="${item.id}" onclick="startQuizz(this) ">
                <img src="${item.image}" alt="">
                <div class="title-quizz">
                    ${item.title}
                </div>
            </div>
        `;

        quizzElement.innerHTML += template;
    })
}

// PASSO 4 - Inicia quizz 
const $quizz = document.querySelector('section');
const $boxUser = document.querySelector('.box-user');
const $container = document.querySelector('.container');
const $quizPage = document.querySelector('.quiz-page');

function startQuizz(selectedQuizz) {

    $quizzSuccess.classList.add('hidden');
    $quizz.classList.add('hidden');
    $boxUser.classList.add('hidden');
    $container.classList.add('hidden');
    $quizPage.classList.remove('hidden');

    console.log(selectedQuizz.id);

    searchIndividualQuizz(selectedQuizz.id);
}

// PASSO 5 -  Faz requisição do quizz individual
function searchIndividualQuizz(id) {

    const promise = axios.get(`${urlApi}/${id}`);
    promise.then(processIndividualQuizz);
}

function processIndividualQuizz(response) {
    object = response.data;
    console.log(object);

    renderIndividualQuizz()
}

// Passo 6 - Renderiza as tela do quiz individual com as respectivas perguntas
function renderIndividualQuizz() {

    const quizPage = document.querySelector(".quiz-page");

    quizPage.innerHTML += `<div class="quiz-head" 
                            style="background: linear-gradient(0deg, rgba(0, 0, 0, 0.57), rgba(0, 0, 0, 0.57)), 
                            url(${object.image}) no-repeat; 
                            background-size: cover">
                            <h1>${object.title}</h1>
                            </div>`;

    let questions = object.questions;


    for (let i = 0; i < questions.length; i++) {

        quizPage.innerHTML += ` <div class="question-box">
                                    <div class="question"
                                    style="background-color: ${questions[i].color} ">
                                        <h2>${questions[i].title}</h2>
                                    </div>
                                    <div class="alternatives">
                                    </div>
                                            `;

        let answers = questions[i].answers;
        answers.sort(comparador);
        function comparador() {
            return Math.random() - 0.5;
        }
        for (let j = 0; j < answers.length; j++) {

            const questionBox = document.querySelectorAll(".question-box .alternatives");
            questionBox[questionBox.length - 1].innerHTML += `
                                    <div >
                                        <img src="${answers[j].image}">
                                        <p>${answers[j].text}</p>
                                    </div>
                                            `;
        };
    };

}

// Passo 7 - Tela de criação: Informações básicas do quiz

function quizBasicInfo() {

    const $container = document.querySelector('.container');

    $container.classList.add('hidden');
    $info.classList.remove('hidden');
}

function validations() {

    let quizTitle = document.querySelector('input:first-child').value;
    let URLimg = document.querySelector('input:nth-child(2)').value;
    let nQuestions = document.querySelector('input:nth-child(3)').value;
    let nLevels = document.querySelector('input:nth-child(4)').value;

    let quiztitleOK = (quizTitle.length > 19 && quizTitle.length < 66);
    let nQuestionsOK = (nQuestions > 4);
    let nLevelsOK = (nLevels > 1);
    let URLimgOK = ((URLimg) => {
        if (URLimg != null && URLimg != '') {
            let regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
            return regex.test(str);
        } else {
            return false;
        };
    });

    if (quiztitleOK && nQuestionsOK && nLevelsOK && URLimgOK) {
        title = quizTitle;
        image = URLimg;
    } else {
        alert("Verifique as condições necessárias para criar o Quizz e tente novamente (:");
    }

}

function validationLevel() {

    let valid = false;
    let regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

    const $inputTitle = document.querySelector('.quizz-form [data-title]');
    const $inputNumber = document.querySelector('.quizz-form [data-number]');
    const $inputUrl = document.querySelector('.quizz-form [data-url]');
    const $inputDescription = document.querySelector('.quizz-form [data-description]');

    if ($inputTitle.value.length >= 10 &&
        Number($inputNumber.value) <= 100 &&
        Number($inputNumber.value) > 0 &&
        regex.test($inputUrl.value) === true &&
        $inputDescription.value.length >= 30) {

        valid = true;
    }

    return valid;
}

function quizzLevel() {

    $info.classList.add('hidden');
    $quizzLevel.classList.remove('hidden');

}

function quizzReady() {
    
    if (validationLevel() === true) {
        
        $quizzLevel.classList.add('hidden');
        $quizzSuccess.classList.remove('hidden');

    } else {
        alert('Verifique as condições necessárias para criar o Quizz e tente novamente (:')
    }
}

function quizzHome() {
    
    $quizzLevel.classList.add('hidden');
    $info.classList.add('hidden');
    $quizzSuccess.classList.add('hidden');
    $initialScreen.classList.remove('hidden');
    
}

//Habilita botão do form da tela 3.3
const $button = document.querySelector('.quizz-button');

document.querySelectorAll('.quizz-form input').forEach(input => {
        
    input.addEventListener('input', () => {
        
        if (validationLevel() === true) {
            $button.classList.remove('disabled');

        } else {
            $button.classList.add('disabled');
        }
    })
})

