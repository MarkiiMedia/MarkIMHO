const SDK = {
    serverURL: "http://localhost:8080/api",
    request: (options, cb) => {

        let headers = {};
        if (options.headers) {
            Object.keys(options.headers).forEach((h) => {
                headers[h] = (typeof options.headers[h] === 'object') ? JSON.stringify(options.headers[h]) : options.headers[h];
            });
        }

        $.ajax({
            url: SDK.serverURL + options.url,
            method: options.method,
            headers: headers,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(options.data),
            success: (data, status, xhr) => {
                cb(null, data, status, xhr);
            },
            error: (xhr, status, errorThrown) => {
                cb({xhr: xhr, status: status, error: errorThrown});
            }
        });

    },
    //User delen
    User: {
        //Opret bruger
        createNewUser: (username, password, cb) => {
            SDK.request({
                    data: {
                        username: username,
                        password: password,
                    },
                    method: "POST",
                    url: "/user/signup"
                },
                cb);
        },
        //Login
        login: (username, password, cb) => {
            SDK.request({
                    data: {
                        username: username,
                        password: password
                    },
                    method: "POST",
                    url: "/user/login?include=user"
                }, (err, data) => {

                //On login error
                if (err) return cb(err);
                console.log("login", data);
                SDK.Storage.persist("token", data.token);
                cb(null, data);
            });

        },
        loadCurrentUser: (cb) => {
            SDK.request({
                method: "GET",
                url: "/user/myuser",
                headers: {Authorization: SDK.Storage.load("token")
                },
            }, (err, user) => {
                SDK.Storage.persist("User", user);
            },
                cb)
        },
        myCurrent: () => {
            return SDK.User.loadCurrentUser("User");
        },
        //Se egen info (Persister userId og type til at logge ud og vise bestemt menu alt efter type
        myProfile: (cb) => {
            SDK.request({
                method: "GET",
                url: "/user/myuser",
                //loader token gemt under login
                headers: {Authorization: SDK.Storage.load("token")
                },
            },(err, data) => {
                if (err) return cb(err);

                let altdata = JSON.parse(data);
                SDK.Storage.persist("userId", altdata.userId);
                SDK.Storage.persist("type", altdata.type);
                cb(null, data);

            });
        },
        logOut: (cb) => {
            var userId = SDK.Storage.load("userId");
            window.alert("Bruger med userID " + userId + " blev logget ud!");
            SDK.request({
                method: 'POST',
                url: '/user/logout',
                data: userId,
            }, (err, data) => {
                if (err) return cb(err);
                cb(null, data);
            });
            // Sletter alt der er blevet persistet
            SDK.Storage.remove("token");
            SDK.Storage.remove("chosenCourse");
            SDK.Storage.remove("chosenQuiz");
            SDK.Storage.remove("questionId");
            SDK.Storage.remove("User");
            SDK.Storage.remove("type");
            SDK.Storage.remove("userId");
            SDK.Storage.remove("quizToDelete");
        }
    },

    //Loader min menu
    //KOMMER DOG FØRST FREM VED F5 eller ny side! KOMMER IKKE PÅ MINSIDE.html ved første load...
    loadNav: (cb) => {
        $("#nav-container").load("nav.html", () => {
            const type = SDK.Storage.load("type");
            if (type === 1) {
                $(".navbar-right").html(`
            <li><a href="createQuiz.html">Opret Quiz</a></li>
            <li><a href="adminCourse.html">Slet Quiz</a></li>
          `);
            } else if (type === 2){
                $(".navbar-right").html(`
            <li><a href="#"><span class="sr-only">(type)</span></a></li>
          `);
            }
            $("#logout-link").click(() => SDK.User.logOut());
            cb && cb();
        });
    },
    //Course delen
    Course: {
        //Find alle courses (fag)
        findAllCourses: (cb) => {
            SDK.request({
                method: "GET",
                url: "/course",
                headers: {Authorization: SDK.Storage.load("token")}
            }, cb);


        }
    },
    //Quiz delen
    Quiz: {
        //Vis quizzer
        showQuiz: (cb) => {
            const chosenCourse = SDK.Storage.load("chosenCourse");
            const courseId = chosenCourse.courseId;
            SDK.request({
                method: "GET",
                url: "/quiz/" + courseId,
                headers: {Authorization: SDK.Storage.load("token")}
            }, cb);
        },
        //Vis spørgsmål
        loadQuestions: (cb) => {
            //loader først vores gemte quiz id
            const chosenQuiz = SDK.Storage.load("chosenQuiz");
            const quizId = chosenQuiz.quizId;
            SDK.request({
                method: "GET",
                url: "/question/" + quizId,
                headers: {Authorization: SDK.Storage.load("token")}
            }, cb);
        },
        loadOptions: (cb) => {
            const questionId = SDK.Storage.load("questionId");
            SDK.request({
                method: "GET",
                url: "/option/" + questionId,
                headers: {Authorization: SDK.Storage.load("token")}
            }, cb);
        },
        deleteQuiz: (cb) => {
            const quizToDelete = SDK.Storage.load("quizToDelete");
            const quizId = quizToDelete.quizId;

            SDK.request({
                method: "DELETE",
                url: "/quiz/" + quizId,
                headers: {
                    Authorization: SDK.Storage.load("token")
                },
            }, (e, data) => {
                if (e) return cb(e);
                cb(null, data)
            });
        },
        //create a quiz
        createQuiz: (createdBy, quizTitle, quizDescription, courseId, questionCount, cb) => {
            SDK.request({
                data: {
                    createdBy: createdBy,
                    quizTitle: quizTitle,
                    quizDescription: quizDescription,
                    courseId: courseId,
                    questionCount: questionCount,
                },
                url: "/quiz/",
                method: "POST",
                headers: {
                    authorization: SDK.Storage.load("token"),
                }
            }, (err, data) => {
                if (err) return cb(err);
                cb(null, data);
            });
        },
    },
    // Create questions
    createQuestion: (question, quizId, callback) => {
        SDK.request({
            data: {
                question: question,
                questionToQuizId: quizId
            },
            method: "POST",
            url: "/question",
            headers: {
                //Header for authorization in server
                authorization: SDK.Storage.load("token"),
            }
        }, (err, data) => {
            if (err) return callback(err);
            callback(null, data);
        })
    },

    // Creating option
    createOption: (option, optionToQuestionId, isCorrect, callback) => {
        SDK.request({
            data: {
                option: option,
                optionToQuestionId: optionToQuestionId,
                isCorrect: isCorrect
            },
            method: "POST",
            url: "/option",
            headers: {
                //Header for authorization in server
                authorization: SDK.Storage.load("token"),
            }
        }, (err, data) => {
            if (err) return callback(err);
            callback(null, data);
        })
    },


    //Storage som jeg bruger til:
    // 1 (persist) gemme min token
    // 2 (load) loade min token
    // 3 (remove) slette mine gemte værdier
    Storage: {
        prefix: "QuizSDK",
        persist: (key, value) => {
            window.localStorage.setItem(SDK.Storage.prefix + key, (typeof value === 'object') ? JSON.stringify(value) : value)
        },
        load: (key) => {
            const val = window.localStorage.getItem(SDK.Storage.prefix + key);
            try {
                return JSON.parse(val);
            }
            catch (e) {
                return val;
            }
        },
        remove: (key) => {
            window.localStorage.removeItem(SDK.Storage.prefix + key);
        }
    }
};

