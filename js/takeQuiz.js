$(document).ready(() => {

    SDK.loadNav();
    const $questionList = $("#question-list");
    const $optionsList = $("#options-list");

    //Vis quiz metoden
    SDK.Quiz.loadQuestions((err, questions) => {
        if (err) throw err;

        //Smider lige en console log ud så jeg kan se hvad den får ud i loggen
        console.log(questions);

        //Loader mit valgte fag, og viser de relevante quizzes
        const quiz = SDK.Storage.load("chosenQuiz");

        //Laver det parset!!! DET VAR FEJLEN - Skal være sådan ellers får jeg fejl: Uncaught TypeError: courses.forEach is not a function
        questions = JSON.parse(questions);
        let questionsHtml = "";
        questions.forEach(question => {
            questionsHtml += `
        <div class="col-lg-4 book-container">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h2 class="panel-title">${question.question} </h2>
                    <div id="option-list${question.questionId}"></div>
                </div>
            </div>
        </div>`;

            SDK.Storage.persist("questionId", question.questionId);
            //Leg med options
            SDK.Quiz.loadOptions((err, options) => {
                if (err) throw err;
                console.log(options);
                options = JSON.parse(options);

                const $optionList = $('#option-list' + question.questionId);

                //For hver opting laver jeg en radio button med isCorrect og questionId
                options.forEach(option => {
                    console.log("Option: " + option.option + " Korrekt? " + option.isCorrect);
                    $optionList.append(`<input type="radio" class="correct-wrong-radio" name="options${question.questionId}" value="${option.isCorrect}"> ${option.option}<br>`);
                });

        });

    });
        $questionList.append(questionsHtml);

    //TEST TIL KNAP LISTENERS
    //Lytter til tilbage knap
    $("#backToQuizBtn").on("click", () => {
        window.location.href = "Quiz.html";
    });

    //Lytter til gem knap
    $("#saveAnswersBtn").on("click", () => {
        let totalQuestions = 0;
        let correctAnswers = 0;

        //Tæller om radio button er checked, hvis tæller en op
        $(".correct-wrong-radio").each(function () {
            if ($(this).is(":checked")) {
                totalQuestions++;
                //Hvis this er 1, altså korrekt, tæller en op
                if ($(this).val() == 1) {
                    correctAnswers++;
                }
            }
        });

    //Procent af korrekte ud af totale questions
    const quizWidth = correctAnswers/totalQuestions*100;

    //Modal vis
    $('#submitModal').modal('show');
    // Modal vindue, med progress bar + score
    $("#result").append(`
                    <div><div class="progress">
                    <div class="progress-bar progress-bar-info progress-bar-striped" style="width:${quizWidth}%"></div></div>
                    <p>You got <b>${correctAnswers}</b> out of <b>${totalQuestions}</b> questions correct.</p>
                    <p> Click "CLOSE" to try again, or click "TRY ANOTHER QUIZ" to choose a new quiz!</p>`);



    //Lytter på close knap
    $("#closeBtn").on("click", () => {
        //Clearer result (ellers står det dobbelt hvis der svares igen og trykker submit answers)
        $("#result").html("");
        $('#submitModal').modal('hide');
    });

    //Lytter til tag en anden quiz knap
        $("#tryNewQuiz").on("click", () => {
            //Going back to quiz site
            window.location.href= "Quiz.html";
        });
    });
    });
});

