 questionsList = [
    q1 = {
        question: "What doesn't belong?",
        answer: "C#",
        wrong: ["HTML", "Javascript", "CSS"]
    },
    q2 = {
        question: "What does CSS stand for?",
        answer: "Cascading Style Sheets",
        wrong: ["Cooperative Server Signal", "Cascading Server Sheet", "Calibrate Single Sheet"]
    },
    q3 = {
        question: "What is Javascript?",
        answer: "An object oriented language",
        wrong: ["A Database", "Styling sheet", "Application Program Interface"]
    },
    q4 = {
        question: "What is the DOM?",
        answer: "Document Object Model",
        wrong:["Document Objective Mode", "Depreciated Occurance Mold"]
    }
]

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