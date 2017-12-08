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

                options.forEach(option => {
                    console.log("Option: " + option.option + " Korrekt? " + option.isCorrect);
                    $optionList.append(`<input type="radio" class="correct-or-wrong-radio" name="options${question.questionId}" value="${option.isCorrect}"> ${option.option}<br>`);
                });

            });
            $questionList.append(questionsHtml);
        });
    });
});