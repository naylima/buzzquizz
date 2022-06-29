let quizz;
let object;

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

// PASSO 4 - Inicia quizz (clicando no quizz adiciona o hidden ao section e box-user)
function startQuizz(selectedQuizz) {

    const $quizz = document.querySelector('section');
    const $boxUser = document.querySelector('.box-user');
    const $container = document.querySelector('.container')
    const $quizPage = document.querySelector('.quiz-page')

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
    

    for (let i = 0; i < questions.length; i ++) {

        quizPage.innerHTML+= ` <div class="question-box">
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
            questionBox[questionBox.length-1].innerHTML += `
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
    const $info = document.querySelector('.basic-info');

    $container.classList.add('hidden');
    $info.classList.remove('hidden');

}