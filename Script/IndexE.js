

    $(document).on("click", ".story", function () {
            const imageUrl = $(this).find(".story-image img").attr("src");
    const encodedImageUrl = encodeURI(imageUrl); // Encode the URL
    const overlay = $("#overlay");
    overlay.css("background-image", `url('${encodedImageUrl}')`);
    overlay.css("display", "flex"); // Changed to 'flex' for centering content
    const timeoutId = setTimeout(function () {
        overlay.css("display", "none");
            }, 5000);

    // Store timeout ID to clear it if overlay is closed manually
    overlay.data("timeoutId", timeoutId);
    const story = $(this);
    const storyId = story.data("story-id");
    const userId = localStorage.getItem("UserId");
    markStoryAsRead(storyId, userId);

        });

    $(document).on("click", "#overlay, #closeButton", function () {
            const overlay = $("#overlay");
    overlay.css("display", "none");

    // Clear the timeout if overlay is closed manually
    const timeoutId = overlay.data("timeoutId");
    if (timeoutId) {
        clearTimeout(timeoutId);
    $(".story-image").css({
        "background-color": "grey",
    "background-image": "none"
                });
            }

    // Set background color of story to grey and remove background image
    $(".story-image").css({
        "background-color": "grey",
    "background-image": "none"
            });
        });






    // Flag to track if the content has been appended
    var contentAppended = false;

    // Function to append the content only once
    function appendContentOnce() {
            // Check if the content has been appended already
            if (!contentAppended) {
        // Append the content
        $('#FollowSection').append('<div class="suggestion-follow"><p class="suggestion">---------------- Suggested for you ---------------</p></div>');

    // Set the flag to true to indicate that content has been appended
    contentAppended = true;
            }
        }

    // Call appendContentOnce() function when needed

    $('#submitCommentBtn').on('click', function () {
            // Get the value entered in the textarea
            var commentText = $('#commentTextarea').val();

    var UserId = localStorage.getItem('UserId');

    // Make AJAX call to submit the comment
    $.ajax({
        url: '/api/DefaultApi/SubmitComment', // Your API endpoint
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
        PostID: PostId, // Replace postId with the ID of the post
    UserID: UserId, // Replace userId with the ID of the current user
    commentText: commentText
                }),
    success: function (response) {
        // Handle success response if needed
        // For example, you can append the comment to the UI
        //$('#commentsContainer').append('<div class="comment">' + commentText + '</div>');
        $('#commentTextarea').val('');
    fetchAndDisplayComments(PostId);
                },
    error: function (xhr, status, error) {
        // Handle error response
        console.error('Error submitting comment:', error);
                }
            });
        });
            //$(document).on("click", ".profile-follow-content", function () {
        //    // Find the user ID from the clicked element
        //    var userId = $(this).data('user-id');

        //    // Redirect to the SearchUser page with the user ID as a query parameter
        //    window.location.href = '/Home/SearchUser/?userId=' + userId;
        //});
        //$(document).on("click", ".story", function () {
        //    const story = $(this);
        //    const imageUrl = story.find(".story-image img").attr("src");
        //    const encodedImageUrl = encodeURI(imageUrl); // Encode the URL
        //    const overlay = $("#overlay");

        //    overlay.css({
        //        "background-image": `url('${encodedImageUrl}')`,
        //        "display": "flex"
        //    });

        //    const timeoutId = setTimeout(function () {
        //        closeOverlay(story);
        //    }, 5000);

        //    // Store timeout ID to clear it if overlay is closed manually
        //    overlay.data("timeoutId", timeoutId);
        //});

        //$(document).on("click", "#overlay, #closeButton", function () {
        //    const overlay = $("#overlay");
        //    const story = $(".story:has(img[src='" + decodeURI(overlay.css("background-image").slice(5, -2)) + "'])");
        //    closeOverlay(story);
        //});

        //function closeOverlay(story) {
        //    const overlay = $("#overlay");
        //    overlay.css("display", "none");

        //    // Clear the timeout if overlay is closed manually
        //    const timeoutId = overlay.data("timeoutId");
        //    if (timeoutId) {
        //        clearTimeout(timeoutId);
        //    }

        //    // Get the user ID from local storage
        //     // Ensure the user ID is stored in local storage

        //    if (userId) {
        //        markStoryAsRead(story, userId);
        //    }
        //}

        function markStoryAsRead(storyId, userId) {
            // Assuming each story has a data attribute for its ID

            $.ajax({
                url: '/api/Story/MarkAsRead',
                type: 'POST',
                data: JSON.stringify({ StoryId: storyId, UserId: userId }),
                contentType: 'application/json',
                success: function () {

                },
                error: function (xhr, status, error) {
                    console.error('Error marking story as read:', error);
                }
            });
        }


        $('#HashSearchBtn').click(function () {
        GetHasImages();
        });

    function GetHasImages() {
            const input = $('#HashSearchInput').val();
    const hashtags = input.match(/#\w+/g); // Extract hashtags

    if (!hashtags || hashtags.length === 0) {
        console.log("No hashtags found.");
    return;
            }

    $.ajax({
        url: '/api/post/HashSearch',
    method: 'POST',

    data: {Hashtags: hashtags },
    success: function (response) {
        $('.HashImages').empty();
    response.forEach(function (post) {
                        var postImageUrl = "/" + post.MediaURL;
    var postHTML = '<div class="col-sm-12 col-md-6 col-lg-4">' +
        '<div class="view hm-black-light m-b-2" style="position: relative; width: 100%; overflow: hidden;">' +
            '<img src="' + postImageUrl + '" class="img-fluid S" style="display: block; max-width: 100%; height: 309px;" alt="">' +
                '<div class="mask flex-center" style="display: flex; align-items: center; justify-content: center;">' +
                    '<ul class="flex-menu" style="display: flex;">' +
                        '<li style="margin-right: 40px;"><p class="white-text"><i class="fa fa-comment" aria-hidden="true"></i> ' + post.CommentsCount + '</p></li>' +
                        '<li><p class="white-text"><i class="fa fa-heart" aria-hidden="true"></i> ' + post.LikesCount + '</p></li>' +
                        '</ul>' +
                    '</div>' +
                '</div>' +
            '</div>';
        $('.post-area').empty();
        $('.StorySection').empty();
        $('.HashImages').prepend(postHTML);
                    });

                   
                },



        error: function (error) {
            console.log("Error in AJAX call:", error);
                }
            });
        }

