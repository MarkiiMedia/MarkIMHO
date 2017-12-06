$(document).ready(() => {

    SDK.loadNav();
    const $questionList = $("#question-list");

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
                    <h2 class="panel-title">${question.question} ${question.questionId}</h2>
                </div>
                <div class="panel-body">
                    <div class="col-lg-8">
                      <dl>          
                        <dt>Svarmulighed:</dt>
                        <dd>SVARMULIGHED</dd>
                      </dl>
                    </div>
                </div>
                <div class="panel-footer">
                    <div class="row">
                        <div class="col-lg-8 text-right">
                        </div>
                    </div>
                </div>
             </div>
       </div>
            `;

            SDK.Storage.persist("questionId", question.questionId);

            //Leg med options
            SDK.Quiz.loadOptions((err, options) => {
                if (err) throw err;
                console.log(options);
                options = JSON.parse(options);
                console.log("FUCK");

                let optionsHtml = "";
                options.forEach(option => {
                    optionsHtml +=`
                    <div class="panel-body">
                    <div class="col-lg-8">
                      <dl>          
                        <dt>Svarmulighed:</dt>
                        <dd>${option.option}</dd>
                      </dl>
                    </div>
                </div>
                    `;
                });
                $questionList.append(optionsHtml)
            });

        });
        $questionList.append(questionsHtml);
    });


    //Options




});