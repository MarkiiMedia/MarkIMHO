$(document).ready(() => {

    //Loading navigation
    SDK.loadNav();

    const $courseList = $("#course-list");

    // Finding all courses
    SDK.Course.findAllCourses((err, courses) => {
        if (err) throw err;
        //Console (debug)
        console.log(courses);

        courses = JSON.parse(courses);
        let coursesHtml = "";

        //For each course, do this
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
        //Append
        $courseList.append(coursesHtml);

        //When pressing button
        // 1. Saving course id for the selected course
        // 2. Persisting the above ID
        // 3. Moving to quiz.html
        $(".purchase-button").click(function () {
            const thisCourseId = $(this).data("course-id");
            const course = courses.find(c => c.courseId === thisCourseId);

            SDK.Storage.persist("chosenCourse", course);
            window.location.href = "quiz.html";

        });

    });
});