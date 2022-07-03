let quizz;
let nQuestions = null;
let nLevels;
let object = {
    title: '',
    image: '',
    questions: [],
    levels: []
}

const $info = document.querySelector('.basic-info');
const $quizzQuestions = document.querySelector('.quiz-questions');
const $quizzLevelBox = document.querySelector('.quizz-level .title-level');
const $quizzLevel = document.querySelector('.quizz-level');
const $quizzSuccess = document.querySelector('.quizz-success');
const $initialScreen = document.querySelector('.initial-screen');

const urlApi = 'https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes';

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


    $quizPage.innerHTML += `<div class="quiz-head" 
                            style="background: linear-gradient(0deg, rgba(0, 0, 0, 0.57), rgba(0, 0, 0, 0.57)), 
                            url(${object.image}) no-repeat; 
                            background-size: cover;
                            background-position-y: -100px;">
                            <h1>${object.title}</h1>
                            </div>`;

    let questions = object.questions;
    nQuestions = questions.length;

    for (let i = 0; i < questions.length; i++) {

        $quizPage.innerHTML += /* html */` 
                                <div class="question-box">
                                    <div class="question"
                                    style="background-color: ${questions[i].color} ">
                                        <h2>${questions[i].title}</h2>
                                    </div>
                                    <div class="alternatives"></div>
                                </div>`;

        let answers = questions[i].answers;
        answers.sort(comparador);
        function comparador() {
            return Math.random() - 0.5;
        }
        for (let j = 0; j < answers.length; j++) {

            const questionBox = document.querySelectorAll(".alternatives");
            questionBox[questionBox.length - 1].innerHTML += `
                                    <div class="alternative ${answers[j].isCorrectAnswer}" onClick="selectedAnswer(this)" >
                                        <img src="${answers[j].image}">
                                        <p>${answers[j].text}</p>
                                    </div>
                                            `;
        };
    };

}

// Comportamento de respostas

let rightAnswers = 0;
let checkAnswer = 0;

function selectedAnswer(answer) {

    checkAnswer++;

    answer.classList.add('selected');

    if (answer.classList.contains('true')) {
        rightAnswers++;
    }

    // add efeito esbranquiçado
    let alternatives = answer.parentNode.querySelectorAll('.alternative');

    for (let i = 0; i < alternatives.length; i++) {
        alternatives[i].classList.add('non-selected');
        if (alternatives[i].classList.contains('true')) {
            alternatives[i].classList.add('correct');

        }
        if (alternatives[i].classList.contains('false')) {
            alternatives[i].classList.add('wrong');

        }
    }
    answer.classList.remove('non-selected');

    // scrollar para a próxima pergunta - NÃO TÁ FUNCIONANDO ***
    /*let currentQuestion = answer.parentNode;
    let nextQuestion = currentQuestion.parentNode.nextSibling;
    setTimeout( () => {
        nextQuestion.scrollIntoView({
            behavior: 'smooth'
          });
    },2000);*/

    if (checkAnswer === nQuestions) {
        quizResults();
    }
}

// Resultado do Quiz - Renderização dos Níveis 

function quizResults() {

    let result = Math.round((rightAnswers / nQuestions) * 100);
    console.log(result);

    let levels = object.levels;
    levels.sort(function (a, b) {
        return (a.minValue > b.minValue) ? 1 : ((b.minValue > a.minValue) ? -1 : 0);
    });

    for (let i = 0; i < levels.length; i++) {

        if (levels[i].minValue !== levels[levels.length - 1].minValue) {

            if (result >= levels[i].minValue && result < levels[i + 1].minValue) {

                $quizPage.innerHTML += `<div class="question-box level">
                                            <div class="question"
                                            style="background-color: #EC362D ">
                                                <h2>${levels[i].title}</h2>
                                            </div>
                                            <div class="levels-container">
                                                <img src="${levels[i].image}">
                                                <span>${levels[i].text}</span>
                                            </div>
                                        </div>
                                        <button id="btn-submit" onClick="reloadQuiz()">
                                            Reiniciar Quizz
                                        </button>
                                        <p class="backToHome" onClick="backToHome()">Voltar pra home</p>
                                                                     `;
            }
        }

        if (levels[i].minValue == levels[levels.length - 1].minValue) {

            if (result >= levels[levels.length - 1].minValue) {
                $quizPage.innerHTML += `<div class="question-box level">
                                            <div class="question"
                                            style="background-color: #EC362D ">
                                                <h2>${levels[levels.length - 1].title}</h2>
                                            </div>
                                            <div class="levels-container">
                                                <img src="${levels[levels.length - 1].image}">
                                                <span>${levels[levels.length - 1].text}</span>
                                            </div>
                                        </div>
                                        <button id="btn-submit" onClick="reloadQuiz()">
                                            Reiniciar Quizz
                                        </button>
                                        <p class="backToHome" onClick="backToHome()">Voltar pra home</p>
                                                                `;
            }
        }
    }

    // scrollando para o resultado do quiz
    let levelResult = document.querySelector('.level');
    setTimeout(() => {
        levelResult.scrollIntoView({
            behavior: 'smooth',
            block: "center",
            inline: "center"
        });
    }, 2000);
}

// Navegação pós Quiz

function reloadQuiz() {

    const alternative = document.querySelectorAll('.alternative');

    for (let i = 0; i < alternative.length; i++) {

        alternative[i].classList.remove('non-selected');
        alternative[i].classList.remove('correct');
        alternative[i].classList.remove('wrong');
    }

    let quizlevel = document.querySelector('.level');
    let button = document.getElementById('btn-submit');
    let location = document.querySelector('.backToHome');

    quizlevel.remove();
    button.remove();
    location.remove();

    rightAnswers = 0;
    checkAnswer = 0;

    window.scrollTo(0, 0);
}

function backToHome() {

    window.location.reload();
    window.scrollTo(0, 0);

    $quizPage.innerHTML = '';
    nQuestions = 0;
    if (result >= levels[i].minValue && result < levels[i + 1].minValue) {

        $quizPage.innerHTML += `<div class="question-box">
                                <div class="question"
                                style="background-color: #EC362D ">
                                    <h2>${levels[i].title}</h2>
                                </div>
                                <div class="levels-container">
                                    <img src="${levels[i].image}">
                                    <span>${levels[i].text}</span>
                                </div>
                            </div>`;
    }

    if (result >= levels[levels.length - 1].minValue) {

        $quizPage.innerHTML += `<div class="question-box">
                                        <div class="question"
                                        style="background-color: #EC362D ">
                                            <h2>${levels[levels.length - 1].title}</h2>
                                        </div>
                                        <div class="levels-container">
                                            <img src="${levels[levels.length - 1].image}">
                                            <span>${levels[levels.length - 1].text}</span>
                                        </div>
                                    </div>`;
    }
}


// Passo 7 - Tela de criação: Informações básicas do quiz

function quizBasicInfo() {

    const $info = document.querySelector('.basic-info');

    $container.classList.add('hidden');
    $info.classList.remove('hidden');

}

// Passo 8 - Validando as informações fornecidas pelo usuário na tela 3.1
function validationsInfo() {

    let quizTitle = document.querySelector('input:first-child').value;
    let URLimg = document.querySelector('input:nth-child(2)').value;
    nQuestions = document.querySelector('input:nth-child(3)').value;
    nLevels = document.querySelector('input:nth-child(4)').value;

    let quiztitleOK = (quizTitle.length > 19 && quizTitle.length < 66);
    let nQuestionsOK = (nQuestions > 2);
    let nLevelsOK = (nLevels > 1);
    let URLimgOK = URLvalidation(URLimg);

    if (quiztitleOK && nQuestionsOK && nLevelsOK && URLimgOK) {
        title = quizTitle;
        image = URLimg;

        object.title = title;
        object.image = image;

        quizQuestions();
    } else {
        alert("Verifique as consições necessárias para criar o Quizz e tente novamente (:");
    }
}

// Passo 9 - Tela de criação: Perguntas do quiz (renderização)

function quizQuestions() {

    $info.classList.add('hidden');
    $quizzQuestions.classList.remove('hidden');

    for (let i = 1; i <= nQuestions; i++) {

        $quizzQuestions.innerHTML += /* html */`
        <form class="questions-container">
            <label for="firstquestion">Pergunta ${i} <ion-icon name="create-sharp" onclick="toggleSwap(${i})"></ion-icon></label>
            <div class="main" id="template${i}" >
                <div> 
                    <input type="text" placeholder="Texto da pergunta" id="textquestion${i}">
                    <input type="color" placeholder="Cor de fundo da pergunta" id="backgroundcolor-${i}">
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

    $quizzQuestions.innerHTML += `<button id="btn-submit" onclick="validateQuestions()">
                                        Prosseguir para criar níveis
                                    </button>`


}

function toggleSwap(i) {
    document.getElementById(`template${i}`).classList.toggle('swap');
}

// Passo 10 - Validando as informações fornecidas pelo usuário na tela 3.2

function validateQuestions() {

    let currentValidate;
    let validate = true;

    addQuestions();

    console.log('object: ', object);

    for (let i = 0; i < nQuestions; i++) {

        const currentQuestion = object.questions[i];

        let textQuestion = currentQuestion.title;
        let colorQuestion = currentQuestion.color;

        let textQuestionOK = (textQuestion.length > 19 && textQuestion !== '');
        let colorQuestionOK = colorValidation(colorQuestion);


        if (textQuestionOK && colorQuestionOK) {

            console.log('object: ', object);

            for (let i = 0; i < nQuestions; i++) {

                const currentQuestion = object.questions[i];

                let textQuestion = currentQuestion.title;
                let colorQuestion = currentQuestion.color;

                let textQuestionOK = (textQuestion.length > 19 && textQuestion !== '');
                let colorQuestionOK = colorValidation(colorQuestion);


                if (textQuestionOK && colorQuestionOK) {

                    currentValidate = true;

                } else {

                    currentValidate = false;
                }

                validate = (validate && currentValidate);
            }

            if (validate) {
                validateAnswers();
            } else {
                alert("Verifique as condições necessárias para criar o Quizz e tente novamente (:");
            }

        }
    }
}

function validateAnswers() {
    let currentValidate;
    let validate = true;

    addAnswersToQuestions();

    console.log('object: ', object);

    for (let i = 0; i < nQuestions; i++) {

        const currentQuestion = object.questions[i];

        for (let item of currentQuestion.answers) {
            let validWrongAnswer = false;

            if (item.isCorrectAnswer === false) {
                if (item.text !== '') {
                    validWrongAnswer = true;
                }
                else {
                    validWrongAnswer = false;
                    break;
                }
            }

            correctAnswerOK = (item.text !== '')
            URLOK = URLvalidation(item.image);
            wrongAnswersOK = validWrongAnswer;
        }
    }


    if (correctAnswerOK && URLOK && wrongAnswersOK) {

        currentValidate = true;

    } else {

        currentValidate = false;
    }

    validate = (validate && currentValidate);


    if (validate) {
        quizzLevel();
    } else {
        alert("Verifique as condições necessárias para criar o Quizz e tente novamente (:");
    }
}

function addQuestions() {
    let tempQuestions = [];

    for (let i = 1; i <= nQuestions; i++) {
        let question = {}

        question.title = document.getElementById(`textquestion${i}`).value;
        question.color = document.getElementById(`backgroundcolor-${i}`).value;

        tempQuestions.push(question);
    }

    object.questions = tempQuestions;
}

function addAnswersToQuestions() {

    for (let i = 1; i <= nQuestions; i++) {

        let tempAnswers = []

        tempAnswers.push({
            text: document.querySelector(`#correctanswer-${i}`).value,
            image: document.querySelector(`#correctURL-${i}`).value,
            isCorrectAnswer: true
        })

        for (let incorrectAnswerIndex = 1; incorrectAnswerIndex <= 3; incorrectAnswerIndex++) {
            tempAnswers.push({
                text: document.querySelector(`#wronganswer-${incorrectAnswerIndex}-${i}`).value,
                image: document.querySelector(`#wrongURL-${incorrectAnswerIndex}-${i}`).value,
                isCorrectAnswer: false
            })
        }

        object.questions[i - 1].answers = tempAnswers;

    }

}

function addLevels() {
    let tempLevels = [];

    for (let i = 1; i <= nLevels; i++) {
        let level = {}

        level.title = document.querySelector('[data-title]')
        level.image = document.querySelector('[data-image]'),
        level.text = document.querySelector('[data-description]'),
        level.minValue = document.querySelector('[data-number]')

        tempLevels.push(level);
    }

    object.levels = tempLevels;
}

function quizzLevel() {
    const levels = document.querySelector('[data-level]').value;  // Número de níveis a ser criado

    for (let i = 0; i < levels; i++) {

        $quizzQuestions.classList.add('hidden');
        $quizzLevel.classList.remove('hidden');

        let template = /* html */`
        <div class="quizz-form">
            <form>
                <div onclick="toggleSwap(${i})"> 
                    <h2>Nível ${[i + 1]} <span>
                            <ion-icon name="create-sharp" ></ion-icon>
                        </span></h2>
                </div>
                <div class="form" id="template${i}">
                    <div>
                        <input data-title type="text" minlength="10" required placeholder="Título do nível">
                        <label>Mínimo 10 caracteres</label>
                    </div>
                    <div>
                        <input value="0" data-number type="number" min="0" max="100" required
                            placeholder="% de acerto mínimo">
                        <label>1 a 100</label>
                    </div>
                    <div>
                        <input data-url type="url" required placeholder="URL da imagem">
                        <label>Ex.: https://www.google.com/</label>
                    </div>
                    <div>
                        <input data-description type="text" required placeholder="Descrição do nível">
                        <label>Mínimo 30 caracteres</label>
                    </div>
                </div>
            </form>
        </div>
        `;

        $quizzLevelBox.innerHTML += template;

    }

    attachEvent();
}


function validationLevel() {

    let valid = false;
    let regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

    const $inputs = document.querySelectorAll('.quizz-form input');

    for (input of $inputs) {
        if (input.hasAttribute('data-title') ||
            input.hasAttribute('data-number') ||
            input.hasAttribute('data-url') ||
            input.hasAttribute('data-description')) {

            if (input.value.length >= 10 ||
                Number(input.value) <= 100 && Number(input.value) > 0 ||
                regex.test(input.value) === true ||
                input.value.length >= 30) {

                valid = true;

            } else {
                valid = false;
                break;
            }
        }
    }

    return valid;
}

function quizzReady() {
    
    addLevels();

    if (validationLevel() === true) {

        $quizzLevel.classList.add('hidden');
        $quizzSuccess.classList.remove('hidden');

        const $title = document.querySelector('.form-container input').value;
        const $urlImage = document.querySelector('.form-container input:nth-child(2)').value;

        $quizzSuccess.innerHTML = '';

        let template = /* html */`
        <div class="title-page">Seu quizz está pronto!</div>
            <div>
                <div class="quizz-ready">
                    <img class="" src="${$urlImage}" alt="">
                    <div class="title-quizz">
                        ${$title}
                    </div>
                </div>
            </div>
        <div>
        <div>
            <button class="quizz-button" type="submit" onclick="startQuizz(this)">Acessar Quizz</button>
            <button class="home-button" type="submit" onclick="quizzHome();">Voltar para Home</button>
        </div>
        `
        $quizzSuccess.innerHTML += template;

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

/* Validações */

/* Validações da URL de imagens */
function URLvalidation(str) {
    if (str != null && str != '') {
        let regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
        return regex.test(str);
    } else {
        return false;
    }
};

/* Validação de cor */
function colorValidation(str) {
    const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i;
    return regex.test(str);
};

//Habilita botão do form da tela 3.3

function attachEvent() {

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
}

