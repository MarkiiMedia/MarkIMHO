$(document).ready(() => {

    SDK.loadNav();

    $("#login-button").click(() => {
        //Test info til mig selv
        console.log("Du trykkede på login knappen, så langt så godt");

        const username = $("#inputUser").val();
        const password = $("#inputPassword").val();

        SDK.User.login(username, password, (err, data) => {
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            }
            else if (err){
                console.log("BAd stuff happened")
            } else {
                //Egen info, bare til test lige pt
                window.alert("Du har fået token, og burde rykke til MIN SIDE");
                window.location.href = "minSide.html";

            }
        });

    });

});