let quizz;
let nQuestions = null;
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

// PASSO 4 - Inicia quizz (clicando no quizz adiciona o hidden ao section e box-user)
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

// Passo 8 - Validando as informações fornecidas pelo usuário na tela 3.1
function validationsInfo() {
    
    let quizTitle = document.querySelector('input:first-child').value;
    let URLimg = document.querySelector('input:nth-child(2)').value;
    nQuestions = document.querySelector('input:nth-child(3)').value;
    let nLevels = document.querySelector('input:nth-child(4)').value;
    
    let quiztitleOK = (quizTitle.length > 19 && quizTitle.length < 66);
    let nQuestionsOK = (nQuestions > 2);
    let nLevelsOK = (nLevels > 1);
    let URLimgOK = URLvalidation(URLimg);

    if (quiztitleOK && nQuestionsOK && nLevelsOK && URLimgOK) {
        title = quizTitle;
        image = URLimg;
        quizQuestions();
    } else {
        alert("Verifique as consições necessárias para criar o Quizz e tente novamente (:");
    }
}

// Passo 9 - Tela de criação: Perguntas do quiz (renderização)

function quizQuestions() {

    const $info = document.querySelector('.basic-info');
    const $quizzQuestions = document.querySelector('.quiz-questions');

    $info.classList.add('hidden');
    $quizzQuestions.classList.remove('hidden');

    for(let i = 1; i <= nQuestions; i++) {

        $quizzQuestions.innerHTML += `
        <form class="questions-container">
            <label for="firstquestion">Pergunta ${i} <ion-icon name="create-sharp" onclick="toggleSwap(${i})"></ion-icon></label>
            <div class="main" id="template${i}" >
                <div> 
                    <input type="text" placeholder="Texto da pergunta" id="textquestion${i}">
                    <input type="text" placeholder="Cor de fundo da pergunta" id="backgroundcolor-${i}">
                </div>
                <div>
                    <label for="correctanswer">Resposta correta</label>
                    <input type="text" placeholder="Resposta correta" id="correctanswer-${i}">
                    <input type="url" placeholder="URL da imagem" id="correctURL-${i}">
                </div>
                <div>
                    <label for="wronganswer">Respostas incorretas</label>
                    <input type="text" placeholder="Resposta incorreta 1" id="wronganswer-1-${i}">
                    <input type="url" placeholder="URL da imagem 1" id="wrongURL-1-${i}">
                    <input type="text" placeholder="Resposta incorreta 2" id="wronganswer-2-${i}">
                    <input type="url" placeholder="URL da imagem 2" id="wrongURL-2-${i}">
                    <input type="text" placeholder="Resposta incorreta 3" id="wronganswer-3-${i}">
                    <input type="url" placeholder="URL da imagem 3" id="wrongURL-3-${i}">
                </div>
            </div>
        </form>`;
    }

    $quizzQuestions.innerHTML +=    `<button id="btn-submit" onclick="validationsQuest()">
                                        Prosseguir para criar níveis
                                    </button>`
}

function toggleSwap(i) {
    document.getElementById(`template${i}`).classList.toggle('swap');
}

// Passo 10 - Validando as informações fornecidas pelo usuário na tela 3.2

function validationsQuest() {

    let validate = true;
    let currentValidate;

    for(let i = 1; i <= nQuestions; i++) {

        let textQuest = document.getElementById(`textquestion${i}`).value;
        let colorQuest  = document.getElementById(`backgroundcolor-${i}`).value;
        let correctAnswer = document.getElementById(`correctanswer-${i}`).value;
        let wrongAnswer1 = document.getElementById(`wronganswer-1-${i}`).value;
        let wrongAnswer2 = document.getElementById(`wronganswer-2-${i}`).value;
        let wrongAnswer3 = document.getElementById(`wronganswer-3-${i}`).value;
        let URL1 = document.getElementById(`wrongURL-1-${i}`).value;
        let URL2 = document.getElementById(`wrongURL-2-${i}`).value;
        let URL3 = document.getElementById(`wrongURL-3-${i}`).value;

        let textQuestOK = (textQuest.length > 19 && textQuest.length !== "");
        let colorQuestOK = colorValidation(colorQuest);
        let correctAnswerOK = (correctAnswer !== "");
        let wrongAnswerOK = (wrongAnswer1 !== "" || wrongAnswer2 !== "" || wrongAnswer3 !== "");
        let URL1OK = URLvalidation(URL1);
        let URL2OK = URLvalidation(URL2);
        let URL3OK = URLvalidation(URL3);
        let URLOK = (URL1OK && URL2OK && URL3OK);
        
        if (textQuestOK && colorQuestOK && correctAnswerOK && URLOK && wrongAnswerOK && URLOK){
            
            currentValidate = true;

        }else {

            currentValidate = false;
        }

        validate = (validate && currentValidate);
    }

    if (validate) {
        quizzLevel();
    } else {
        alert("Verifique as consições necessárias para criar o Quizz e tente novamente (:");
    }

}

function quizzLevel() {

    $quizzQuestions.classList.add('hidden');
    $quizzLevel.classList.remove('hidden');
    
}

function quizzReady() {
    
        $quizzLevel.classList.add('hidden');
        $quizzSuccess.classList.remove('hidden');
        
}


function quizzHome() {

    $quizzLevel.classList.add('hidden');
    $info.classList.add('hidden');
    $quizzSuccess.classList.add('hidden');
    $initialScreen.classList.remove('hidden');
    
}

/* Validações */

/* Validações da URL de imagens */
function URLvalidation(str){
    if (str != null && str != '') {
        let regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
        return regex.test(str);
    }else{
        return false;
    }
};

/* Validação de cor */
function colorValidation(str){
    const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i;
        return regex.test(str);
};