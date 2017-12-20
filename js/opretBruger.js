$(document).ready(() => {

    // Loading navigation
    SDK.loadNav();

    // When button clicked
    $("#createUser-button").click(() => {
        //Simpel log, brugt for at tjekke om den registerer at jeg trykker på knappen
        console.log("Du trykkede på create user knappen, så langt så godt");

        //values from these two fields
        const username = $("#inputCreateUserName").val();
        const password = $("#inputCreateUserPassword").val();

        // SDK request create new user
        // If username and password not filled, alert
        // else go to login and info message
        SDK.User.createNewUser(username, password, (err, data) => {
            if(!username || !password) {
                alert("Du mangler vist at udfylde lidt");
            }
            else if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            }
            else if (err){
                console.log("BAd stuff happened")
            } else {
                window.location.href = "login.html";
                //NOTE: Skal ligge lidt anderledes i koden så den vises EFTER vi er rykket til login siden
                window.alert("Du kan nu logge ind med din oprettede bruger")
            }

        });

    });

    //On click go back to index.html
    $("#cancel-button").click(() => {
        window.location.href = "index.html";
    });

});
