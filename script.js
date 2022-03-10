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
    },
    kelly_q = { // Question designed by Kelly
        question: "Where should your styling be completed for your page?",
        answer: "CSS file",
        wrong:["javascript file", "secondary html", "styling.js"]
    }
]

var correct_points=0;
var timer_points=0;
var username, clonedList, counter, timer, current_q;
var q_x = document.querySelector("#q_x");

// Function to check if given string is only whitespace or empty
function onlyWhiteSpace(string) {
    for (index in string) {
        if (string[index] != " ") {
            return false
        }
    }
    return true
}

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
    let q_y = document.querySelector("#q_y");
    clonedList = shuffle(cloneArray(questionsList));
    q_y.innerHTML = clonedList.length;
    current_q = 1
    q_x.innerHTML = current_q;
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
function displayBlock(tag) {
    let blocks = document.querySelectorAll(".block")

    blocks.forEach( item => {
        if (item.className == (tag+" block")) {
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

// Rotates next question and resets clock. Adds 20 to points, and timer to points
function nextQuestion() {
    current_q++
    q_x.innerHTML = current_q;
    correct_points += 20;
    timer_points += counter;
    clearInterval(timer);
    rotateQuestion();
}

// Ends Quiz and tallys score. Does not add current timer to points
function endQuiz() {
    clearInterval(timer)
    document.querySelector(".username").innerHTML = username
    displayBlock("end");
    calculateScore();
}

// Function sets timer for the 
function setTimer(tick) {
    if (tick <= 0) {
        endQuiz();
    }
    let question_timer = document.querySelector(".question_timer")
    counter = tick
    question_timer.textContent = "Time Remaining: "+tick
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

function calculateScore() {
    let end_time_points = document.querySelector(".end_time_points")
    let end_correct_points = document.querySelector(".end_correct_points")
    let end_total_points = document.querySelector(".end_total_points")

    end_time_points.innerHTML = timer_points;
    end_correct_points.innerHTML = correct_points;
    end_total_points.innerHTML = timer_points+correct_points;

    logScore(username, timer_points+correct_points)
    correct_points = 0;
    timer_points = 0;
}

function logScore(username, score) {
    let highscores_scores = document.querySelector(".highscores_scores");
    let new_element = document.createElement("li");
    let new_username = document.createElement("span")
    let new_score = document.createElement("span")

    new_username.className = "score_name"
    new_username.innerHTML = username+" | "
    new_element.appendChild(new_username)
    new_score.className = "score_value"
    new_score.innerHTML = score
    new_element.appendChild(new_score)

    if (highscores_scores.children[0] === undefined) {
        highscores_scores.appendChild(new_element);
    } else {
        for (index in highscores_scores.children) {
            let compare = parseInt(highscores_scores.children[index].children[1].innerHTML)
            if (score > compare) {
                highscores_scores.insertBefore(new_element, highscores_scores.children[index])
                break;
            } else if (score <= compare) {
                highscores_scores.insertBefore(new_element, highscores_scores.children[index].nextSibling)
                break;
            } else if (highscores_scores.children[index+1] !== undefined) {
                continue
            } else {
                highscores_scores.appendChild(new_element);
            }
        }
    }
}

function quitButton() {
    let button = document.querySelector(".quit_button")
    button.addEventListener("click", event => {
        endQuiz()
    })
}

// Function that rotates questions from the cloned/shuffled list and gives answer options events
function rotateQuestion() {
    let question_current = document.querySelector(".question_current");
    let question_choices = document.querySelector(".question_choices");
    let question = clonedList.pop();
    let mixed_answers = mixAnswers(question.answer, question.wrong);
    let choices = mixed_answers[0];
    let correct_index = mixed_answers[1];
    setTimer(choices.length*5);
    removeChildren(question_choices);

    question_current.textContent = question.question;

    choices.forEach( item => {
        let clickable = document.createElement("button");
        clickable.textContent = item;
        if (choices.indexOf(item) == correct_index) {
            clickable.id = "correct"
            if (clonedList.length > 0) {
                clickable.addEventListener("click", event => {
                    nextQuestion();
                })
            } else {
                clickable.addEventListener("click", event => {
                    timer_points += counter;
                    endQuiz()
                })
            }
        } else {
            clickable.id = "wrong"
            clickable.addEventListener("click", event => {
                clickable.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--color_accent_2");
                clickable.style.color = getComputedStyle(document.documentElement).getPropertyValue("--color_accent_2");
                clickable.style.cursor = "not-allowed";
                clickable.setAttribute("disabled", "disabled");
                clearInterval(timer);
                setTimer(counter-2);
            })
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
                item.addEventListener("click", event => {
                    username = prompt("What is your Username?\n(Please keep it clean)")
                    if (username == null) {                  // Check if clicked 'cancel'
                        username = "Anon"
                    } else if (onlyWhiteSpace(username)) {   // Check if submitted empty
                        username = "Anon"
                    }
                    displayBlock(selector);
                    setClone();
                    rotateQuestion();
                }, )
            } else {
                item.addEventListener("click", event => {
                    displayBlock(selector)
                })
            }
        })
    })
    quitButton();
}
setButtons()