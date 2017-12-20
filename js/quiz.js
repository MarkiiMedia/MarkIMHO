$(document).ready(() => {

    //Loading navigation
    SDK.loadNav();

    const $quizList = $("#quiz-list");

    //SDK request show quiz
    SDK.Quiz.showQuiz((err, quizzes) => {
        if (err) throw err;

        //Console log (testing)
        console.log(quizzes);

        //Loading my choosenCourse from storage
        const course = SDK.Storage.load("chosenCourse");


        quizzes = JSON.parse(quizzes);
        let quizzesHtml = "";

        //For each quiz, do this
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
                            <button class="btn btn-success takeQuiz-Button" data-quiz-id="${quiz.quizId}">Tag denne quiz</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
            debugvar = quiz;


        });
        //Appending
        $quizList.append(quizzesHtml);

        //On click
        // Find quizID,
        //Persist quiz id, now named quiz
        //Move to takeQuiz.html
        $(".takeQuiz-Button").click(function () {
            //Test - når jeg hertil
            window.alert("Du valgte en quiz og vil nu se spørgsmål og svarmuligheder til valgte");
            const thisQuizId = $(this).data("quiz-id");
            const quiz = quizzes.find(q => q.quizId === thisQuizId);

            SDK.Storage.persist("chosenQuiz", quiz);
            window.location.href = "takeQuiz.html";
        });

    });

});