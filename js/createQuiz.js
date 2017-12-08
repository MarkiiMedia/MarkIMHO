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
    })
        //På create quiz knappen sker dette. Den tager mine values og kører min createQuiz funktion
    $('#create-quiz-button').on('click', () => {
        const courseId = $('#courseDropdown').val();
        const createdBy = $('#inputCreatedBy').val();
        const quizTitle = $('#inputQuizTitle').val();
        const quizDescription = $('#inputQuizDescription').val();
        const questionCount = 0;

        SDK.Quiz.createQuiz(createdBy, quizTitle, quizDescription, courseId, questionCount, (err, quiz) => {
            console.log('Created quiz', quiz);
            window.alert("QUIZ CALLED: " + quizTitle + "created! WUHUUU")

        })
    })
});