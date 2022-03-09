questionsList = [
    q0 = {
        question: "What doesn't belong?",
        answer: "C#",
        wrong: ["HTML", "Javascript", "CSS"]
    },
    q1 = {
        question: "What does CSS stand for?",
        answer: "Cascading Style Sheets",
        wrong: ["Cooperative Server Signal", "Cascading Server Sheet", "Calibrate Single Sheet"]
    },
    q2 = {
        question: "What is Javascript?",
        answer: "An object oriented language",
        wrong: ["A Database", "Styling sheet", "Application Program Interface"]
    },
    q3 = {
        question: "What is the DOM?",
        answer: "Document Object Model",
        wrong:["Document Objective Mode", "Depreciated Occurance Mold"]
    }
]

var correct_points=0;
var timer_points=0;
var clonedList;
var counter;
var timer;

// Clone array so that it doesn't refrence original
function cloneArray(array) {
    let x = [...array];
    return x;
}

// Function shuffles given array. Pulled from
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    while (currentIndex != 0) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

// clones original questionList and shuffles the content for reusability
function setClone() {
    clonedList = shuffle(cloneArray(questionsList));
}

// Shuffle wrongs, insert correct at random, and return both the list and correct answer index
function mixAnswers(correct, wrongs) {
    let wrong_clone = cloneArray(wrongs)
    shuffle(wrong_clone);

    let rand = Math.floor(Math.random()*(wrongs.length +1))
    wrong_clone.splice(rand, 0, correct);

    return [wrong_clone, rand];
}


// Function to display given block and hide others
function displayBlock(name) {
    let blocks = document.querySelectorAll(".block")

    blocks.forEach( item => {
        if (item.className == (name+" block")) {
            item.style.visibility = "visible"
        } else {
            item.style.visibility = "hidden"
        }
    })
}


// Function to remove all child elements within the given parent
function removeChildren(parent_element) {
    while (parent_element.firstChild) {
        parent_element.removeChild(parent_element.firstChild)
    }
}

function nextQuestion() {
    clearInterval(timer)
    rotateQuestion()
}

function endQuiz() {
    clearInterval(timer)
    displayBlock("end");
    calculateScore();
}

// Function sets timer for the 
function setTimer(choices) {
    let question_timer = document.querySelector(".question_timer")
    counter = choices.length*5
    question_timer.textContent = "Time Remaining: "+counter
    timer = setInterval(function() {
        if (counter > 0) {
            question_timer.textContent = "Time Remaining: "+counter
            counter--
        } else {
            clearInterval(timer)
            endQuiz()
        }
    }, 1000)
}

// Function that rotates questions from the cloned/shuffled list and gives answer options events
function rotateQuestion() {
    let question_current = document.querySelector(".question_current");
    let question_choices = document.querySelector(".question_choices");
    let question = clonedList.pop();
    let mixed_answers = mixAnswers(question.answer, question.wrong);
    let choices = mixed_answers[0];
    let correct_index = mixed_answers[1];
    setTimer(choices);
    removeChildren(question_choices);

    question_current.textContent = question.question;

    choices.forEach( item => {
        let clickable = document.createElement("button");
        clickable.textContent = item;
        if (choices.indexOf(item) == correct_index) {
            clickable.id = "correct"
            correct_points += 20 // add timer points here... somehow
            if (clonedList.length > 0) {
                clickable.addEventListener("click", event => {
                    nextQuestion();
                })
            } else {
                clickable.addEventListener("click", event => {
                    endQuiz()
                })
            }
    
        } else {
            clickable.id = "wrong"
            // do something with the timer
        }
        question_choices.appendChild(clickable);
    })
}

// Sets up all menu buttons except for the quit button
function setButtons() {
    let tags = ["start","highscores","question"]
    tags.forEach( selector => {
        let buttons = document.querySelectorAll("."+selector+"_button")
        buttons.forEach( item => {
            if (selector == "question") {
                console.log("this is the start button")
                item.addEventListener("click", event => {
                    displayBlock(selector);
                    setClone();
                    rotateQuestion();
                }, )
            } else {
                console.log("this is NOT the start button")
                item.addEventListener("click", event => {
                    displayBlock(selector)
                })
            }
        })
    })
}

// Main function called when script is loaded
function init() {
    setButtons()
}

init();