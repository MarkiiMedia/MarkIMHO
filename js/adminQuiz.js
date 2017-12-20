$(document).ready(() => {

    //Loading navigation
    SDK.loadNav();

    //Current user, used for checking for admin status
    const currentUser = SDK.User.myCurrent("User");

    const $quizList = $("#quiz-list");

    //Show quiz
    SDK.Quiz.showQuiz((err, quizzes) => {
        if (err) throw err;

        //Console log (debug)
        console.log(quizzes);

        //Loading choosen course
        const course = SDK.Storage.load("chosenCourse");

        //For each quiz create this content
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
                            <button class="btn btn-danger delete-button" data-delete-quiz-id=${quiz.quizId}> Delete quiz</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
            debugvar = quiz;
            // $courseList.append(courseHtml);

        });
        //Appending
        $quizList.append(quizzesHtml);

        //On delete button click
        //Getting quizId on selected, and persist
        // Delete and reload
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