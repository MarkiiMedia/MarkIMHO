$(document).ready(() => {

    //Loading navigation
    SDK.loadNav();

    const $questionList = $("#question-list");
    const $optionsList = $("#options-list");

    //SDK request load questions
    SDK.Quiz.loadQuestions((err, questions) => {
        if (err) throw err;

        //Console log (testing)
        console.log(questions);


        //Loading chosenQuiz from storage
        const quiz = SDK.Storage.load("chosenQuiz");


        questions = JSON.parse(questions);
        let questionsHtml = "";

        //For each questing, doing this
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

            //Persisting questionid
            SDK.Storage.persist("questionId", question.questionId);
            //SDK request to get options
            SDK.Quiz.loadOptions((err, options) => {
                if (err) throw err;
                console.log(options);
                options = JSON.parse(options);

                const $optionList = $('#option-list' + question.questionId);

                //For each option, creating radiobutton with question id and isCorrect
                options.forEach(option => {
                    console.log("Option: " + option.option + " Korrekt? " + option.isCorrect);
                    $optionList.append(`<input type="radio" class="correct-wrong-radio" name="options${question.questionId}" value="${option.isCorrect}"> ${option.option}<br>`);
                });

        });

    });
        //Appending
        $questionList.append(questionsHtml);


    // on click back to quiz.html
    $("#backToQuizBtn").on("click", () => {
        window.location.href = "Quiz.html";
    });

    //on click
    $("#saveAnswersBtn").on("click", () => {
        let totalQuestions = 0;
        let correctAnswers = 0;

        //Tæller om radio button er checked, hvis tæller en op
        //Checking if radio buttin is checked, if yes ++
        $(".correct-wrong-radio").each(function () {
            if ($(this).is(":checked")) {
                totalQuestions++;
                //Checking if value is 1, meaning correct answer, if yes ++
                if ($(this).val() == 1) {
                    correctAnswers++;
                }
            }
        });

    //Procent of correct out of total questions
    const quizWidth = correctAnswers/totalQuestions*100;

    //showing submit modal
    $('#submitModal').modal('show');
    // showing resultmodal with result and progress bar
    $("#result").append(`
                    <div><div class="progress">
                    <div class="progress-bar progress-bar-info progress-bar-striped" style="width:${quizWidth}%"></div></div>
                    <p>Du fik <b>${correctAnswers}</b> ud af <b>${totalQuestions}</b> spørgsmål korrekt</p>
                    <p> Tryk på close for at prøve igen eller tryk på try another quiz for at prøve kræfter med en anden quiz!</p>`);



    //on click
    $("#closeBtn").on("click", () => {
        //Clearering result
        //if not, it would display double upon pressing submit again
        //Hiding submitmodal
        $("#result").html("");
        $('#submitModal').modal('hide');
    });

    //Lytter til tag en anden quiz knap
        //on click
        $("#tryNewQuiz").on("click", () => {
            //Going back to quiz site
            window.location.href= "Quiz.html";
        });
    });
    });
});

