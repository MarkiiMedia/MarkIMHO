$(document).ready(() => {

    //CurrentUser har adgang til at oprette en quiz. Fordi current er admin
    const currentUser = SDK.User.myCurrent();

    SDK.Course.findAllCourses((err, courses) => {
        courses = JSON.parse(courses);
        //console.log('courses:', courses);
        // let optionMenu = `<option> Select Course </option>`;
       //  optionMenu += `<option value="+${courses[0].courseId}+"> ${courses[0].courseTitle} </option>`;
       //  $('#courseDropdown').innerHTML = optionMenu;

        //Dropdown til at vise course og så derudfra course id
        $.each(courses, (key, value) => {
            $('#courseDropdown').append('<option value='+ value.courseId + '>'+ value.courseTitle +'</option>')
        })
    });
        //På create quiz knappen sker dette. Den tager mine values og kører min createQuiz funktion
    $('#create-quiz-button').on('click', () => {
        const courseId = $('#courseDropdown').val();
        const createdBy = $('#inputCreatedBy').val();
        const quizTitle = $('#inputQuizTitle').val();
        const quizDescription = $('#inputQuizDescription').val();
        const questionCount = 0;

        if(!quizTitle || !quizDescription || !createdBy) {
            alert("Du mangler vist at udfylde lidt");
        } else {
            //SDK request create quiz
            SDK.Quiz.createQuiz(createdBy, quizTitle, quizDescription, courseId, questionCount, (err, data) => {
                console.log('Created quiz', data);
                window.alert("QUIZ CALLED: " + quizTitle + "created! WUHUUU");

                //Upon created quiz, shows my modal from my HTML - hiding the saveButton
                $('#questionModal').modal('show');
                $("#save-Button").hide();

                //Saving the quiz id of the quiz as a const
                var createdQuiz = JSON.parse(data);
                const quizId = createdQuiz.quizId;

                //Modal title
                var i = 1;
                $(".modal-title").html(`<h1>${i}. Question</h1>`);

                //Listener on add question button
                $("#addQuestion-Button").on("click", () => {
                    //Saving question and option values as const
                    const createdQuestion = $("#question").val();
                    const correct = $("#correct").val();
                    const wrong1 = $("#wrong1").val();
                    const wrong2 = $("#wrong2").val();
                    const wrong3 = $("#wrong3").val();

                    //Verifying that all the info has been filled
                    if (!createdQuestion || !correct || !wrong1 || !wrong2 || !wrong3) {
                        alert("Information missing - Please try again");
                        //Clearing all the text boxes
                        $("#question").val("");
                        $("#correct").val("");
                        $("#wrong1").val("");
                        $("#wrong2").val("");
                        $("#wrong3").val("");
                    } else {
                        //SDK request for creating a question
                        SDK.createQuestion(createdQuestion, quizId, (err, data) => {
                            if (err && err.xhr.status == 400) {
                                window.alert("An error has occurred. Please try again");
                                console.log("Failed creating question");
                            } else if (err) {
                                window.alert("An error has occurred. Please try again");
                            } else {
                                $("#save-Button").show();
                                //Clearing the question text box
                                $("#question").val("");

                                //Saving questionId as const
                                const newQuestion = JSON.parse(data);
                                const optionToQuestionId = newQuestion.questionId;

                                $(".modal-title").html(`<h1>${++i}. question</h1>`);

                                //SDK request for creating the correct option (isCorrect = 1)
                                var isCorrect = 1;
                                SDK.createOption(correct, optionToQuestionId, isCorrect, (err, data) => {
                                    if (err && err.xhr.status == 400) {
                                        window.alert("An error has occurred. Please try again");
                                        console.log("Failed creating question");
                                    } else if (err) {
                                        window.alert("An error has occurred. Please try again");
                                    } else {
                                        $("#correct").val("")
                                    }
                                });

                                //SDK request for creating option (isCorrect = 0)
                                SDK.createOption(wrong1, optionToQuestionId, isCorrect = 0, (err, data) => {
                                    if (err && err.xhr.status == 400) {
                                        window.alert("An error has occurred. Please try again");
                                        console.log("Failed creating question");
                                    } else if (err) {
                                        window.alert("An error has occurred. Please try again");
                                    } else {
                                        $("#wrong1").val("");
                                    }
                                });

                                //SDK request for creating option (isCorrect = 0)
                                SDK.createOption(wrong2, optionToQuestionId, isCorrect = 0, (err, data) => {
                                    if (err && err.xhr.status == 400) {
                                        window.alert("An error has occurred. Please try again");
                                        console.log("Failed creating question");
                                    } else if (err) {
                                        window.alert("An error has occurred. Please try again");
                                    } else {
                                        $("#wrong2").val("");
                                    }
                                });

                                //SDK request for creating option (isCorrect = 0)
                                SDK.createOption(wrong3, optionToQuestionId, isCorrect = 0, (err, data) => {
                                    if (err && err.xhr.status == 400) {
                                        window.alert("An error has occurred. Please try again");
                                        console.log("Failed creating question");
                                    } else if (err) {
                                        window.alert("An error has occurred. Please try again");
                                    } else {
                                        $("#wrong3").val("");
                                    }
                                });
                            }
                        });
                    }
                });
                //Listener on save quiz button
                $("#save-Button").on("click", () => {
                    //window to confirm saving the quiz
                    if (window.confirm("Are you done with the quiz?")) {
                        window.location.href = "minSide.html"
                    }
                });
            })
        };
    })
});
