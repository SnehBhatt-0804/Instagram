

        // Redirect to the followers page with user ID when clicking on follower count
    $(document).on("click", "#followercount", function () {
            var userId = $(this).data("user-id");
    window.location.href = '/Home/followers/?userId=' + userId;
        });

    // Redirect to the followings page with user ID when clicking on following count
    $(document).on("click", "#followingcount", function () {
            var userId = $(this).data("user-id");
    window.location.href = '/Home/followings/?userId=' + userId;
        });

    $(document).ready(function () {
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

            // Get the user ID from the URL
            const userId = getUserIdFromUrl();

    // Now you can use the userId as needed
    console.log("User ID:", userId);


    $.ajax({
        url: '/api/post/GetUserProfileAndPosts',
    type: 'GET',
    data: {userId: userId },
    success: function (response) {
                    var userProfile = response.UserProfile[0];
    var pic = userProfile.ProfilePictureURL;
    var picc = "/" + pic;

    // Create HTML block
    var htmlBlock = '<div class="container">' +
        '<div class="row m-b-r m-t-3">' +
            '<div class="col-md-2 offset-md-1">' +
                '<div class="profile-img">' +
                    '<img src="' + picc + '" alt="" class="img-circle img-fluid" id="ProfilePicture">' +
                        '</div>' +
                    '</div>' +
                '<div class="col-md-9 p-t-2">' +
                    '<h2 class="h2-responsive" id="username">' + userProfile.Username + '</h2>' +
                    '<p id="fullname">' + userProfile.FullName + '</p>' +
                    '<ul class="flex-menu" id="userstats">' +
                        '<li><strong id="postcount">' + userProfile.PostCount + '</strong> posts</li>' +
                        '<li><strong data-user-id="' + userId + '" id="followercount">' + userProfile.FollowerCount + '</strong> followers</li>' +
                        '<li><strong data-user-id="' + userId + '" id="followingcount">' + userProfile.FollowingCount + '</strong> following</li>' +
                        '</ul>' +
                    '</div>' +
                '</div>' +
            '<div class="row" id="userposts">';

                // Append user posts
                response.UserPosts.forEach(function (post) {
                        var postImageUrl = "/" + post.MediaURL;
                htmlBlock += '<div class="col-sm-12 col-md-6 col-lg-4">' +
                    '<div class="view overlay hm-black-light m-b-2">' +
                        '<img src="' + postImageUrl + '" class="img-fluid S" alt="">' +
                            '<div class="mask flex-center">' +
                                '<ul class="flex-menu">' +
                                    '<li><p class="white-text"><i class="fa fa-comment" aria-hidden="true"></i> ' + post.CommentsCount + '</p></li>' +
                                    '<li><p class="white-text"><i class="fa fa-heart" aria-hidden="true"></i> ' + post.LikesCount + '</p></li>' +
                                    '</ul>' +
                                '</div>' +
                            '</div>' +
                        '</div>';
                    });

                    // Close the HTML block
                    htmlBlock += '</div></div>';

            // Append the HTML block to the main element
            $('main').append(htmlBlock);
                },
            error: function (xhr, status, error) {
                console.error('Error fetching user profile and posts:', error);
                }
            });

        });

