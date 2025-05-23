// Banco de preguntas para la trivia
const questions = [
    {
        question: "¿Cuál es el planeta más grande del sistema solar?",
        options: ["Tierra", "Marte", "Júpiter", "Saturno"],
        correctAnswer: 2 // Júpiter (índice 2)
    },
    {
        question: "¿Quién pintó La Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Miguel Ángel"],
        correctAnswer: 2 // Leonardo da Vinci
    },
    {
        question: "¿Cuál es el elemento químico más abundante en el universo?",
        options: ["Oxígeno", "Hidrógeno", "Carbono", "Helio"],
        correctAnswer: 1 // Hidrógeno
    },
    {
        question: "¿En qué año comenzó la Primera Guerra Mundial?",
        options: ["1914", "1918", "1939", "1945"],
        correctAnswer: 0 // 1914
    },
    {
        question: "¿Cuál es el hueso más largo del cuerpo humano?",
        options: ["Húmero", "Fémur", "Tibia", "Radio"],
        correctAnswer: 1 // Fémur
    },
    {
        question: "¿Qué científico propuso la teoría de la relatividad?",
        options: ["Isaac Newton", "Galileo Galilei", "Albert Einstein", "Stephen Hawking"],
        correctAnswer: 2 // Albert Einstein
    },
    {
        question: "¿Cuál es el océano más grande del mundo?",
        options: ["Atlántico", "Índico", "Pacífico", "Ártico"],
        correctAnswer: 2 // Pacífico
    },
    {
        question: "¿Cuál es la capital de Australia?",
        options: ["Sídney", "Melbourne", "Canberra", "Brisbane"],
        correctAnswer: 2 // Canberra
    }
];

// Variables globales
let currentQuestionIndex = 0;
let selectedQuestions = [];
let score = 0;
let selectedOption = null;
const totalQuestions = 5; // Número de preguntas por juego

// Elementos del DOM
const quizContainer = document.getElementById('quiz-container');
const resultsContainer = document.getElementById('results-container');

// Iniciar la trivia cuando cargue la página
document.addEventListener('DOMContentLoaded', startTrivia);

/**
 * Inicia la trivia seleccionando preguntas aleatorias y mostrando la primera
 */
function startTrivia() {
    // Reiniciar variables
    currentQuestionIndex = 0;
    score = 0;
    selectedOption = null;
    
    // Seleccionar preguntas aleatorias sin repetir
    selectedQuestions = getRandomQuestions(questions, totalQuestions);
    
    // Mostrar la primera pregunta
    showQuestion();
    
    // Ocultar resultados si estaban visibles
    resultsContainer.classList.add('hidden');
    quizContainer.classList.remove('hidden');
}

/**
 * Selecciona un número específico de preguntas aleatorias sin repetir
 * @param {Array} questionPool - Array con todas las preguntas disponibles
 * @param {Number} count - Número de preguntas a seleccionar
 * @returns {Array} Array con las preguntas seleccionadas
 */
function getRandomQuestions(questionPool, count) {
    // Crear una copia del array original para no modificarlo
    const shuffled = [...questionPool];
    
    // Mezclar el array usando el algoritmo Fisher-Yates
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Devolver solo el número de preguntas solicitado
    return shuffled.slice(0, count);
}

/**
 * Muestra la pregunta actual en el contenedor
 */
function showQuestion() {
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    
    // Crear estructura HTML para la pregunta
    const questionHTML = `
        <div class="question-counter fade-in">Pregunta ${currentQuestionIndex + 1} de ${totalQuestions}</div>
        <div class="question fade-in">${currentQuestion.question}</div>
        <div class="options">
            ${currentQuestion.options.map((option, index) => `
                <div class="option fade-in" data-index="${index}" onclick="selectOption(${index})">
                    ${option}
                </div>
            `).join('')}
        </div>
        <button id="next-btn" class="btn" disabled onclick="handleNextQuestion()">Siguiente pregunta</button>
    `;
    
    // Insertar HTML en el contenedor
    quizContainer.innerHTML = questionHTML;
    
    // Reiniciar la opción seleccionada
    selectedOption = null;
}

/**
 * Maneja la selección de una opción
 * @param {Number} index - Índice de la opción seleccionada
 */
function selectOption(index) {
    // Si ya se seleccionó una opción, no hacer nada
    if (selectedOption !== null) return;
    
    selectedOption = index;
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    const options = document.querySelectorAll('.option');
    
    // Marcar todas las opciones como deshabilitadas
    options.forEach(option => {
        option.classList.add('disabled');
    });
    
    // Marcar la opción seleccionada
    options[index].classList.add('selected');
    
    // Mostrar si la respuesta es correcta o incorrecta
    if (index === currentQuestion.correctAnswer) {
        options[index].classList.add('correct');
        score++;
    } else {
        options[index].classList.add('incorrect');
        // Mostrar cuál era la respuesta correcta
        options[currentQuestion.correctAnswer].classList.add('correct');
    }
    
    // Habilitar el botón para continuar
    document.getElementById('next-btn').disabled = false;
    
    // Pequeña pausa antes de permitir avanzar (opcional)
    setTimeout(() => {
        document.getElementById('next-btn').focus();
    }, 500);
}

/**
 * Maneja el paso a la siguiente pregunta o finaliza la trivia
 */
function handleNextQuestion() {
    currentQuestionIndex++;
    
    // Verificar si se han respondido todas las preguntas
    if (currentQuestionIndex >= totalQuestions) {
        showResults();
    } else {
        showQuestion();
    }
}

/**
 * Muestra los resultados finales de la trivia
 */
function showResults() {
    // Ocultar el contenedor de preguntas
    quizContainer.classList.add('hidden');
    
    // Determinar mensaje según el puntaje
    let message = '';
    const percentage = (score / totalQuestions) * 100;
    
    if (percentage >= 80) {
        message = '¡Excelente! Tienes un gran conocimiento.';
    } else if (percentage >= 60) {
        message = '¡Muy bien! Tienes buen conocimiento.';
    } else if (percentage >= 40) {
        message = 'Buen intento. Puedes mejorar.';
    } else {
        message = 'Sigue intentando. La práctica hace al maestro.';
    }
    
    // Crear HTML para los resultados
    const resultsHTML = `
        <div class="result-title fade-in">¡Trivia completada!</div>
        <div class="score fade-in">${score} de ${totalQuestions}</div>
        <div class="message fade-in">${message}</div>
        <button class="btn fade-in" onclick="startTrivia()">Volver a intentarlo</button>
    `;
    
    // Mostrar resultados
    resultsContainer.innerHTML = resultsHTML;
    resultsContainer.classList.remove('hidden');
}

// Iniciar la trivia al cargar la página
startTrivia();
