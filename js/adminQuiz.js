$(document).ready(() => {

    SDK.loadNav();

    //Serveren tjekker for om jeg er current user og om denne current user også er admin
    //Er det ikk tilfældet kan man ikke slette en quiz
    const currentUser = SDK.User.myCurrent("User");

    const $quizList = $("#quiz-list");

    //Vis quiz metoden
    SDK.Quiz.showQuiz((err, quizzes) => {
        if (err) throw err;

        //Smider lige en console log ud så jeg kan se hvad den får ud i loggen
        console.log(quizzes);

        //Loader mit valgte fag, og viser de relevante quizzes
        const course = SDK.Storage.load("chosenCourse");

        //Laver det parset!!! DET VAR FEJLEN - Skal være sådan ellers får jeg fejl: Uncaught TypeError: courses.forEach is not a function
        quizzes = JSON.parse(quizzes);
        let quizzesHtml = "";
        quizzes.forEach(quiz => {
            quizzesHtml += `
        <div class="col-lg-4 book-container">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h2 class="panel-title">${quiz.quizTitle}</h2>
                </div>             
                <div class="panel-body">
                    <div class="col-lg-8">
                      <dl>
                        <dt>Created by:</dt>
                        <dd>${quiz.createdBy}</dd>
                        <dt>Antal spørgsmål:</dt>
                        <dd>${quiz.questionCount}</dd>
                        <dt>Quiz beskrivelse:</dt>
                        <dd>${quiz.quizDescription}</dd>
                      </dl>
                    </div>
                </div>
                <div class="panel-footer">
                    <div class="row">
                        <div class="col-lg-8 text-right">
                            <button class="btn btn-primary delete-button" data-delete-quiz-id=${quiz.quizId}> Delete quiz</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
            debugvar = quiz;
            // $courseList.append(courseHtml);

        });
        $quizList.append(quizzesHtml);

        $(".delete-button").click(function () {
            //Test - når jeg hertil
            window.alert("Slette quiz, nået hertil?");
            const thisQuizId = $(this).data("delete-quiz-id");
            const quiz = quizzes.find(q => q.quizId === thisQuizId);
            SDK.Storage.persist("quizToDelete", quiz);

            if (window.confirm("Are you sure u want to delete " + quiz.quizTitle + " ?") === true) {
                SDK.Quiz.deleteQuiz((e, data) => {
                });
                window.alert(quiz.quizTitle + " er nu slettet!");
                location.reload();
            } else {
                window.alert("ERROR")
            }


        });

    });


});