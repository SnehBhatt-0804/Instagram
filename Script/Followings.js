$(document).ready(function () {
    getUserIdFromUrl();
    getfollowings();
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



function getfollowings() {
    var loggedInUserId = getUserIdFromUrl();
    var UuserID = localStorage.getItem('UserId');

    $.ajax({
        url: '/api/DefaultApi/GetAllfollowings',
        type: 'GET',
        data: { loggedInUserId: loggedInUserId },
        success: function (response) {
            var peopleList = $('#FollowSection');
            peopleList.empty();

            response.forEach(function (user) {
                var postImageUrl = "/" + user.ProfilePictureURL;
                var userHTML = '<div class="FollowSection">' +
                    '<div class="profile-follow profile-foolow-hovering">' +
                    '<div class="profile-follow-left">' +
                    '<div class="profile-follow-image">' +
                    '<img src="' + postImageUrl + '" alt="">' +
                    '</div>' +
                    '<div class="profile-follow-content" data-user-id="' + user.UserID + '">' +
                    '<p class="profile-id">' + user.Username + '</p>' +
                    '</div>' +
                    '</div>';

                userHTML += (UuserID == loggedInUserId) ? '<a href="#" class="remove-friend-btn" data-user-id="' + user.UserID + '">UnFollow</a>' : '';

                userHTML += `</div>`;

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
function attachEventHandlers() {


    $('.remove-friend-btn').on('click', function () {
        var $this = $(this);
        var UserId = $this.data('user-id');

        removeFriend(UserId, function () {
            $this.text('Follow');
            getfollowings(); // Update UI after removing friend
        });
    });
}


// Function to remove a friend
function removeFriend(UserId, successCallback) {
    const userId = localStorage.getItem('UserId');
    $.ajax({
        url: '/api/DefaultApi/RemoveFriend',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            FollowerUserID: userId,
            FollowingUserID: UserId
        }),
        success: function (response) {
            console.log('Friend removed successfully');
            successCallback(); // Call successCallback to update button text
        },
        error: function (error) {
            console.log(error);
        }
    });
}

