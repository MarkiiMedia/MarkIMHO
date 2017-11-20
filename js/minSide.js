$(document).ready(() => {

    SDK.loadNav();

    const $myUserList = $("#myUserInfo");

    SDK.User.myProfile((err, user) => {
        if (err) throw err;
        console.log(user);

        user = JSON.parse(user);

        console.log (user);
        debugvar = user;
            const myUserHtml = `
        <div class="col-lg-4 book-container">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">${user.username}</h3>
                </div>
            </div>
        </div>`;

        // let myUserHtml = "<h3>test</h3>";

            $myUserList.append(myUserHtml);
    });
});
