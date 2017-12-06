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
    //Loader min menu
    loadNav: () => {
        $("#nav-container").load("nav.html");
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
                console.log("login",data);
                // data = JSON.parse (data);
                // SDK.Storage.persist("tokenId", data.username);
                // SDK.Storage.persist("userId", data.userId);
                // SDK.Storage.persist("user", data.username);
                SDK.Storage.persist("token", data.token);
                cb(null, data);
            });

        },
        //Se egen info (Skal nu også bruge persist her til at gemme userId, da jeg KUN tager token ved login
        myProfile: (cb) => {
            SDK.request({
                method: "GET",
                url: "/user/myuser",
                //loader token gemt under login
                headers: {Authorization: SDK.Storage.load("token")}
            }, cb);
        }, logOut: (cb) => {
            // Her skal jeg også huske faktisk at trække metoden fra SERVEREN så token også bliver slettet i DB (lige pt slettes den bare i localstorage)
            SDK.Storage.remove("token");
            SDK.Storage.remove("chosenCourse");
            SDK.Storage.remove("chosenQuiz");
        }
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
    //Her skal quiz delen være
    //Jeg får mine quiz ud (hardcoded url f.eks quiz tilhørende fag 2)
    //Istedet for hardcoded skal selvfølgelig tages det fag jeg trykkede på, på fag siden og vise quiz ud fra det fag
    //
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
        }

    },

    //Storage som jeg bruger til:
    // 1 (persist) gemme min token (og senere userId)
    // 2 (load) loade min token (og senere userId)
    // 3 (remove) slette mine gemte værdier (som lige nu er token, og senere også bliver userId)
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

