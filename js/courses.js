$(document).ready(() => {

    SDK.loadNav();

    const $courseList = $("#course-list");

    // Find alle fag metoden
    SDK.Course.findAllCourses((err, courses) => {
        if (err) throw err;
        //Smider lige en console log ud så jeg kan se hvad den får ud i loggen
        console.log(courses);
        //Laver det parset!!! DET VAR FEJLEN - Skal være sådan ellers får jeg fejl: Uncaught TypeError: courses.forEach is not a function
        courses = JSON.parse(courses);
        let coursesHtml = "";
        courses.forEach(course => {
            coursesHtml += `
        <div class="col-lg-4 book-container">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h2 class="panel-title">${course.courseTitle}</h2>
                </div>
                <div class="panel-footer">
                    <div class="row">
                        <div class="col-lg-8 text-right">
                            <button class="btn btn-success purchase-button" data-course-id="${course.courseId}">Vælg dette fag</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
            debugvar = course;


        });
        $courseList.append(coursesHtml);

        //Når der trykkes på knappen
        // 1. Jeg gemmer courseId'et som hører til den jeg trykker på i min storage
        // 2. Rykker over til quiz.html siden for at vise de quiz der hører til det valgte fag
        $(".purchase-button").click(function () {
            const thisCourseId = $(this).data("course-id");
            const course = courses.find(c => c.courseId === thisCourseId);

            SDK.Storage.persist("chosenCourse", course);
            window.location.href = "quiz.html";

        });

    });
});