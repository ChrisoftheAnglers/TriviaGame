$(document).ready(function() {
    var gamestart = false; //Variable to check if game has been started or if stopped (reset)
    var score = 0;
    var timer; //This will be assigned to the timeout
    var inputAccept = true; //This will be used to block input at certain points, such as when the time is up or an answer has been chosen
    var countRunning = false; //This will be used to prevent multiple Interval instances from occurring
    var wait; //This is used so we can clear the waiting period on reset
    var waiting = false; //An extra precaution to prevent an extra waiting period from occurring

    function triviaRound(limit, newQuestion, correct, answer1, answer2, answer3, answer4) {  //Create an object constructor for each question
        this.timeLimit = limit; //Can set time limit for each question (in seconds)
        this.initialTime = limit; //Is untouched and will not be changed
        this.countDown = function() {
            index[current].timeLimit--;
            $("#questionTimer").text("Time Left: " + index[current].timeLimit + " second(s)");
            if (index[current].timeLimit === 0)
                index[current].timeUp();
        }
        this.question = newQuestion;
        this.correctAnswer = correct;
        this.answerList = [answer1, answer2, answer3, answer4];
        this.checkAnswer = function(answer) {
            clearInterval(timer); //Will clear the timer BEFORE checking if the answer is correct (so it can't time out during the check)
            countRunning = false; //Set to false every time the interval is cleared
            inputAccept = false; //Prevent inputs during answer check
            if (answer === this.correctAnswer) {
                score++;
                $("#scoreboard").text("Score: " + score);
                $("#isCorrect").text("That is the right answer!");
                current++; //This line is used to move on to the next question after the answer has been checked
                nextQuestion(); 
            }
            else
            {
                $("#isCorrect").text("That is incorrect");
                current++;
                nextQuestion();
            }
        }
        this.timeUp = function() {
            clearInterval(timer); //Clear the interval and stop the counting
            countRunning = false; //Set to false every time the interval is cleared
            inputAccept = false; //Prevent inputs after time out
            current++;
            $("#isCorrect").text("Time's Up!");
            setTimeout(nextQuestion, 3000);
            nextQuestion();
        }
    };

    var index = []; //This index will be used to access our questions and move along them as the game continues
    index.push(question1 = new triviaRound(10, "What is my favorite color?", "blue", "red", "magenta", "blue", "green"));
    index.push(question2 = new triviaRound(20, "What is my cat's name?", "Greystar", "Greystar", "Bunghole", "Lucifur (so edgy)", "Pinot"));
    index.push(question3 = new triviaRound(60, "What is the meaning of life? (I have given you a minute to think about it)", "Whatever you want it to be", "Whatever you are told", "To serve your country", "To serve a deity or other being beyond perception", "Whatever you want it to be"));
    index.push(question4 = new triviaRound(10, "Who is the main protagonist of Metroid?", "Samus", "Metroid", "Peppy Hare", "Samus", "Ridley"));
    index.push(question5 = new triviaRound(15, "What is my name?", "Christian", "Pennywise", "Christian", "Not Important", "Ricky Bobby"));
    var current = 0; //This variable will be used to start at the first indexed question

    function initialize() {
        clearTimeout(wait); //Clears the waiting period before the next question when reset occurs
        clearInterval(timer);
        countRunning = false; //Set to false every time the interval is cleared
        current = 0; //Set current question back to beginning
        timer = undefined; //Completely reinitialize variable assigned to Interval
        wait = undefined;
        waiting = false; //Allows Timeout 'wait' to work correctly after a reset
        for (i=0; i<index.length; i++) { //Will initialize each object's timeLimit back to its initial value
            index[i].timeLimit = index[i].initialTime;
        }
        $("#Answer1").empty(); //Remove question and answer content from the screen
        $("#Answer2").empty();
        $("#Answer3").empty();
        $("#Answer4").empty();
        $("#questionTimer").text("Time Left: ");
        $("#currentQuestion").empty();
        $("#isCorrect").empty();
        gamestart = false; //Set state back to before the game started
        inputAccept = true; //Allow input after the game has been reset
    }

    function nextQuestion() {
        if (current >= index.length) {
            alert("The Quiz is Over!");
            if (score === index.length)
                alert("Wow, you got all of the questions right!\nGood job!");
            initialize();
        }
        else if(current === 0) {
            $("#questionTimer").text("Time Left: " + index[current].timeLimit + " second(s)"); //Show time left at question beginning before first count
            $("#scoreboard").text("Score: " + score); //Set the scoreboard when the game is started and
            $("#currentQuestion").text(index[current].question);
            $("#Answer1").text(index[current].answerList[0]);
            $("#Answer2").text(index[current].answerList[1]);
            $("#Answer3").text(index[current].answerList[2]);
            $("#Answer4").text(index[current].answerList[3]);
            if (!countRunning) { //Checks to make sure the timer is not running before setting an interval
                timer = setInterval(index[current].countDown, 1000);
                countRunning = true; //Specifies that the timer is running
            }
            inputAccept = true; //Re-allow inputs after the next question has loaded in
        }
        else {
            if (!waiting)
                waiting = true; //Set waiting to true
                wait = setTimeout(function() {
                    clearInterval(timer);
                    countRunning = false; //Set to false every time the interval is cleared
                    $("#isCorrect").empty();
                    $("#questionTimer").text("Time Left: " + index[current].timeLimit + " second(s)"); //Show time left at question beginning before first count
                    $("#scoreboard").text("Score: " + score); //Set the scoreboard when the game is started and
                    $("#currentQuestion").text(index[current].question);
                    $("#Answer1").text(index[current].answerList[0]);
                    $("#Answer2").text(index[current].answerList[1]);
                    $("#Answer3").text(index[current].answerList[2]);
                    $("#Answer4").text(index[current].answerList[3]);
                    if (!countRunning) { //Checks to make sure the timer is not running before setting an interval
                        timer = setInterval(index[current].countDown, 1000);
                        countRunning = true; //Specifies that the timer is running
                    }
                    inputAccept = true; //Put after everything else to prevent the rest of the function from being interrupted
                    waiting = false; //Turn back to false when finished
            }, 5000) //Will wait before the text question, but will not wait when the game is over
        }
    }

    $("#startButton").click(function() {
        if(!gamestart && inputAccept) {
            gamestart = true; //Change our state to specify that the game has begun
            score = 0; //Score is initialized here instead of at game reset so that it can be checked before starting a new game
            nextQuestion();
        }
    });

    $("#resetButton").click(function() {
        if (gamestart) { //Will not add inputAccept since reset should almost never be blocked
            initialize(); //Call function to initialize
        }
    })

    $("#Answer1").click(function() {
        if (gamestart && inputAccept)
            index[current].checkAnswer(index[current].answerList[0]);
    })

    $("#Answer2").click(function() {
        if (gamestart && inputAccept)
            index[current].checkAnswer(index[current].answerList[1]);
    })

    $("#Answer3").click(function() {
        if (gamestart && inputAccept)
            index[current].checkAnswer(index[current].answerList[2]);
    })

    $("#Answer4").click(function() {
        if (gamestart && inputAccept)
            index[current].checkAnswer(index[current].answerList[3]);
    })
})