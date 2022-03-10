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

// Global variables
var correct_points=0;
var timer_points=0;
var username, clonedList, counter, timer, current_q;
var q_x = document.querySelector("#q_x");

// Function to check if given string is only whitespace or empty
function onlyWhiteSpace(string) {
    for (index in string) {
        if (string[index] != " ") { // If run into anything not whitespace, then return false
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
    q_y.innerHTML = clonedList.length; // Set y of 'Question x of y' to the total amount of questions
    current_q = 1
    q_x.innerHTML = current_q; // Set x to 1 and will increment each time rotateQuestion is called
}

// Shuffle wrongs, insert correct at random, and return both the list and correct answer index
function mixAnswers(correct, wrongs) {
    let wrong_clone = cloneArray(wrongs)
    shuffle(wrong_clone); // randomize question order

    let rand = Math.floor(Math.random()*(wrongs.length +1))
    wrong_clone.splice(rand, 0, correct); //randomly insert correct answer

    return [wrong_clone, rand]; // return both the full list of choices, and the index of the correct answer
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
        endQuiz();  // If amount of time left is 0 or less, immediately end the quiz
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

// Function to sort list by the score.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
function sortByScores(list) {
    let unsorted = list
    let sorted = unsorted.sort(function(x,y) {
        if (x[1] > y[1]) {
            return -1;
        } else if (x[1] == y[1]) {
            return 0;
        } else {
            return 1
        }
    })
    return sorted
}

// Function grabs all locally saved scores and returns it as a list of [username, score] in order of decending score
function getScores() {
    let list= []

    for (let index = 0; index < localStorage.length; index++) {
        let item = localStorage.key(index)
        console.log(item);
        if (item.includes("quizsave")) {
            let split_array = localStorage.getItem(item).split(",")
            split_array[1] = parseInt(split_array[1])
            list.unshift(split_array)
        }
    }

    return sortByScores(list)
}

// Function attempts to populate the highscores board with locally saved information
function populateHighscores() {
    let pulled_scores = getScores()
    if (pulled_scores.length != 0) {
        pulled_scores.forEach(item => {
            let highscores_scores = document.querySelector(".highscores_scores");
            let new_element = document.createElement("li");
            let new_username = document.createElement("span")
            let new_score = document.createElement("span")
            
            new_username.className = "score_name"
            new_username.innerHTML = item[0]+" | "
            new_element.appendChild(new_username)
            new_score.className = "score_value"
            new_score.innerHTML = item[1]
            new_element.appendChild(new_score)
            
            highscores_scores.appendChild(new_element);
        })
    }
}

// Function to tally score up between points for being correct, and points for good time and adds them to HTML
function calculateScore() {
    let end_time_points = document.querySelector(".end_time_points")
    let end_correct_points = document.querySelector(".end_correct_points")
    let end_total_points = document.querySelector(".end_total_points")
    
    end_time_points.innerHTML = timer_points;
    end_correct_points.innerHTML = correct_points;
    end_total_points.innerHTML = timer_points+correct_points;
    
    if (saveScore(username, timer_points+correct_points)) {
        logScore(username, timer_points+correct_points)
    }

    correct_points = 0;
    timer_points = 0;
}

// Function prompts the user if they wish to save the score and saves locally if desired
function saveScore(new_username, score) {
    let ask = confirm("Would you like to save your score?")
    if (ask) {
        let save = [new_username, score]
        JSON.stringify(save);
        localStorage.setItem("quizsave-"+username, save)
        return true;
    } else {
        return false;
    }
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

    // Organize scores as they are entered in
    if (highscores_scores.children[0] === undefined) {
        highscores_scores.appendChild(new_element);
    } else {
        for (index in highscores_scores.children) {
            let compare = parseInt(highscores_scores.children[index].children[1].innerHTML)
            if (score > compare) {
                highscores_scores.insertBefore(new_element, highscores_scores.children[index]) // If score is already greater than item at current index, insert before it
                break;
            } else if (score <= compare) {
                if (highscores_scores.children[index].nextSibling == undefined) {
                    highscores_scores.appendChild(new_element)
                } else {
                    continue;
                }
            } else {
                highscores_scores.appendChild(new_element);  // If nothing catches, list is empty so append to list
            }
        }
    }
}

// Function for giving the exit button on the questions card functionality
function quitButton() {
    let button = document.querySelector(".quit_button")
    let save
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

    // Iterrate through each choice and create a button that does something depending on if it's the wrong or right answer
    choices.forEach( item => {
        let clickable = document.createElement("button");
        clickable.textContent = item;
        if (choices.indexOf(item) == correct_index) {  // checks if this is the correct answer
            clickable.id = "correct"
            if (clonedList.length > 0) {  // checks if this is the last question
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
            // Make wrong choice change when clicked to indicate that it was incorrect
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
populateHighscores()