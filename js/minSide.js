$(document).ready(() => {

    SDK.loadNav();

    const $myUserList = $("#myUserInfo");

    SDK.User.myProfile((err, user) => {
        if (err) throw err;


        user = JSON.parse(user);
        // console.log (user);
        //debugvar = user;
            const myUserHtml = `
        <div class="col-lg-4 book-container">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">Velkommen, <strong>${user.username}</strong></h3>
                </div>
                               <div class="panel-body">
                    <div class="col-lg-4">
                    </div>
                    <div class="col-lg-8">
                      <dl>
                        <dt>Type - 1 Admin, 2 Bruger</dt>
                        <dd>${user.type}</dd>
                        <dt>Bruger id</dt>
                        <dd>${user.userId}</dd>
                        <dt>Time created</dt>
                        <dd>${user.timeCreated}</dd>
                      </dl>
                    </div>
                </div>
            </div>
        </div>`;

        // let myUserHtml = "<h3>test</h3>";

            $myUserList.append(myUserHtml);
    });
});
