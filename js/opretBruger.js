$(document).ready(() => {

    SDK.loadNav();

    //Når der klikkes på knappen
    $("#createUser-button").click(() => {
        //Simpel log, brugt for at tjekke om den registerer at jeg trykker på knappen
        console.log("Du trykkede på create user knappen, så langt så godt");

        //Tager værdien fra disse 2 bokse, altså brugernavn og kodeord
        const username = $("#inputCreateUserName").val();
        const password = $("#inputCreateUserPassword").val();

        // Bruger metoden i SDK filen og hvis fejl så dette, og hvis succes (else) redirect til login
        SDK.User.createNewUser(username, password, (err, data) => {
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            }
            else if (err){
                console.log("BAd stuff happened")
            } else {
                window.location.href = "login.html";
                //NOTE: Skal ligge lidt anderledes i koden så den vises EFTER vi er rykket til login siden
                window.alert("Du kam nu logge ind med din oprettede bruger")
            }

        });

    });

});
