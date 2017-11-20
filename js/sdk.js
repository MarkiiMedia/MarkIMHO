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
                    url: "/user/login"
                }, (err, data) => {

                //On login error
                if (err) return cb(err);

                SDK.Storage.persist("tokenId", data.id);
                SDK.Storage.persist("userId", data.userId);
                SDK.Storage.persist("user", data.user);

                cb(null, data);
            });

        },
        //Se egen info (med hardcoded token fra DB, skal ændres så det selvølgelig følger den loggede ind bruger)
        myProfile: (cb) => {
            SDK.request({
                method: "GET",
                url: "/user/myuser",
                headers: SDK.Storage.load("tokenId")
                //headers: {Authorization: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJVc2VyIjoidGVzdDIiLCJpc3MiOiJJTUhPIiwiZXhwIjoxNTEwOTM5NTYzMTAzfQ.zqs-yCjRrVeQGevmEXyE-mMr114gyBqhZG85-fKn7cw"}
            }, cb);
        }
    },

    //Course delen
    Course: {
        //Find alle courses (fag) CORS FEJL!!
        findAllCourses: (cb) => {
            SDK.request({
                method: "GET",
                url: "/course",
                headers: {Authorization: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJVc2VyIjoidGVzdDIiLCJpc3MiOiJJTUhPIiwiZXhwIjoxNTEwOTM5NTYzMTAzfQ.zqs-yCjRrVeQGevmEXyE-mMr114gyBqhZG85-fKn7cw"}
            }, cb);


        }
    },
    //Sat ind 20/11 kl 18.43 for at teste om jeg kan bruge det samme som javaclient eksempel
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

