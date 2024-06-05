$(document).ready(function () {
    getUserIdFromUrl();
    getfollower();
});
function getUserIdFromUrl() {
    // Get the current URL
    var url = window.location.href;

    // Extract the query string part of the URL
    var queryString = url.split('?')[1];

    // Split the query string into key-value pairs
    var queryParams = queryString.split('&');

    // Loop through the key-value pairs to find the userId parameter
    for (var i = 0; i < queryParams.length; i++) {
        var pair = queryParams[i].split('=');
        if (pair[0] === 'userId') {
            // Return the value of the userId parameter
            return parseInt(pair[1]); // Convert to integer
        }
    }

    // Return null if userId parameter is not found
    return null;
}
function getfollower() {
    var loggedInUserId = getUserIdFromUrl();

    $.ajax({
        url: '/api/DefaultApi/GetAllfollowers',
        type: 'GET',
        data: { loggedInUserId: loggedInUserId },
        success: function (response) {
            var peopleList = $('#FollowSection');
            peopleList.empty();

            response.forEach(function (user) {
                var postImageUrl = "/" + user.ProfilePictureURL;
                var userHTML = '<div class="FollowSection" data-post-id="' + user.PostID + '">' +
                    '<div class="profile-follow profile-foolow-hovering">' +
                    '<div class="profile-follow-left">' +
                    '<div class="profile-follow-image">' +
                    '<img src="' + postImageUrl + '" alt="">' +
                    '</div>' +
                    '<div class="profile-follow-content" data-user-id="' + user.UserID + '">' +
                    '<p class="profile-id">' + user.Username + '</p>' +
                    '</div>' +
                    '</div>' +

                    '<div style="display: inline;">';

                //if (user.IsFriend == 1) {
                //    userHTML += `<a href="#" class="remove-friend-btn" data-user-id="${user.UserID}">Following</a>`;
                //} else {
                //    userHTML += `<a href="#" class="add-friend-btn" data-user-id="${user.UserID}">Follow</a>`;
                //}

                userHTML += `</div></div></div>`;

                peopleList.append(userHTML);
            });

            // Attach event handlers after adding followers to the DOM
            attachEventHandlers();
        },
        error: function (xhr, status, error) {
            console.error('Error fetching followers:', error);
        }
    });
}
$(document).on("click", ".profile-follow-content", function () {
    // Find the user ID from the clicked element
    var userId = $(this).data('user-id');

    // Redirect to the SearchUser page with the user ID as a query parameter
    window.location.href = '/Home/SearchUser/?userId=' + userId;
});


