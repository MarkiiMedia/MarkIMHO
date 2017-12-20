$(document).ready(() => {

    //Loading navigation
    SDK.loadNav();

    //On loginbutton click
    $("#login-button").click(() => {
        //Console log (testing)
        console.log("Du trykkede på login knappen, så langt så godt");

        //Inputfields username and password const
        const username = $("#inputUser").val();
        const password = $("#inputPassword").val();

        //SDK login request
        SDK.User.login(username, password, (err, data) => {
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
                window.alert("Forkert brugernavn eller kodeord");
            }
            else if (err){
                console.log("BAd stuff happened")
            } else {
                SDK.User.loadCurrentUser();

                //testing purposes
                //Moving to minSide.html
                window.alert("Du har fået token, og burde rykke til MIN SIDE");
                window.location.href = "minSide.html";

            }
        });

    });

    //Moving back to index.html
    $("#cancel-button").click(() => {
        window.location.href = "index.html";
    });

});