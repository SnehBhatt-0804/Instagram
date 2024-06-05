// Function to redirect to login if session is null
function redirectToLoginOrRegistrationIfSessionIsNull() {
    var userId = localStorage.getItem('UserId');
    if (userId === null) {
        // If session ID is null, redirect to login or registration page
        var currentPage = window.location.pathname; // Get the current page path
        if (currentPage !== '/Home/LogIn' && currentPage !== '/Home/SignUp') {
            // Redirect to login page if not already on login or registration page
            window.location.href = '/Home/Login ';
        }
    }
}
////////////////////////////////
////$(document).on("click", ".profile-follow-content", function () {
////    // Find the user ID from the clicked element
////    var userId = $(this).data('user-id');

////    // Redirect to the SearchUser page with the user ID as a query parameter
////    window.location.href = '/Home/SearchUser/?userId=' + userId;
////});

$(document).on("click", "#followercount", function () {
    var userId = $(this).data("user-id");
    window.location.href = '/Home/followers/?userId=' + userId;
});

// Redirect to the followings page with user ID when clicking on following count
$(document).on("click", "#followingcount", function () {
    var userId = $(this).data("user-id");
    window.location.href = '/Home/followings/?userId=' + userId;
});
////////////////////////////////// 
$(document).ready(function () {
    redirectToLoginOrRegistrationIfSessionIsNull();
    FetchPostDataAndAppend2();
    FetchAllStoryDataAndAppend();
    fetchUsersAndAppend();
    fetchNotifications();
    likeunlikeallpost();
});
setInterval(function () {
    fetchNotifications();
}, 30000);

// Function to transfer UserId from one tab to another
var userIdTransfer = function (event) {
    if (!event) { event = window.event; } // for IE support
    if (event.key === 'getUserId' && event.newValue === 'request') {
        // Another tab requested the UserId -> send it
        var userId = localStorage.getItem('UserId');
        if (userId) {
            localStorage.setItem('userId', userId);
            localStorage.setItem('UserId', userId);
            localStorage.setItem('userIdReceived', 'true');
        }
    } else if (event.key === 'userId' && event.newValue !== null && event.newValue !== 'true') {
        // Another tab sent the UserId -> receive it
        localStorage.setItem('UserId', event.newValue);
        localStorage.setItem('userIdReceived', 'true');
    }
};

// Listen for changes to localStorage
if (window.addEventListener) {
    window.addEventListener("storage", userIdTransfer, false);
} else {
    window.attachEvent("onstorage", userIdTransfer);
}

// Ask other tabs for UserId (this is ONLY to trigger the event)
if (!localStorage.getItem('UserId')) {
    localStorage.setItem('getUserId', 'request');
}



//$('.FollowSection').click(function () {
//    var userId = $(this).find('.add-friend-btn').data('user-id');
//    redirectToUser(userId);
//});
//function redirectToUser(userId) {
//    // Redirect to the Searchuser view with the user's ID
//    window.location.href = '/Home/SearchUser/' + userId;
//    getUserIdFromUrl(userId);
//}
////////////////////
//////follow&folllowing in profile
///////

$('#followercount').click(function () {
    var userId = $(this).find('.add-friend-btn').data('user-id');
    redirectToUser(userId);
});
function redirectToUser(userId) {
    // Redirect to the Searchuser view with the user's ID
    window.location.href = '/Home/followers/' + userId;
    getUserIdFromUrl(userId);
}


///////
///DARK MODE
///////
$(document).ready(function () {
    $("#clicked").click(function () {
        $("body").toggleClass("dark-mode");
        if ($("body").hasClass("dark-mode")) {
            $("#WhiteColor, #white-2color").css("filter", "brightness(5)");
        } else {
            $("#WhiteColor, #white-2color").css("filter", "none");
        }
    });
});

//////
////Notification
//////


$('#notification').click(function (event) {
    event.stopPropagation(); // Prevent event bubbling

    // Toggle sidebar
    $('#sidebar2').toggleClass('open');

    
});

// Click event handler for closing the sidebar when clicking outside of it
$(document).click(function (event) {
    if (!$(event.target).closest('#sidebar2').length && $('#sidebar2').hasClass('open')) {
        $('#sidebar2').removeClass('open');
    }
});

// Prevent closing the sidebar when clicking inside it
$('#sidebar2').click(function (event) {
    event.stopPropagation();
});

/////////////
////SIGN UP
///////

$(document).ready(function () {
    // Function to validate and update input border color
    function validateAndUpdateInput(inputElement, regex) {
        var value = inputElement.val().trim();
        var isValid = regex.test(value);
        inputElement.css('border-color', isValid ? 'green' : 'red');
        return isValid;
    }

    // Function to validate full name format
    function validateFullName() {
        var fullNameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/; // Allow only alphabets with one space
        return validateAndUpdateInput($('#fullname'), fullNameRegex);
    }

    // Function to validate date of birth
    function validateDateOfBirth() {
        var today = new Date();
        var selectedDate = new Date($('#dob').val());
        var isValid = selectedDate <= today;
        $('#dob').css('border-color', isValid ? 'green' : 'red');
        return isValid;
    }

    // Function to validate all input fields
    function validateInputs() {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        var phoneRegex = /^\d{10}$/;

        var emailValid = validateAndUpdateInput($('#email'), emailRegex);
        var passwordValid = validateAndUpdateInput($('#password'), passwordRegex);
        var phoneValid = validateAndUpdateInput($('#phoneNumber'), phoneRegex);
        var username = $('#username').val().trim();
        var usernameValid = username !== '';
        var fullNameValid = validateFullName();
        var dobValid = validateDateOfBirth();

        if (!usernameValid) {
            $('#username').css('border-color', 'red');
        }

        return emailValid && passwordValid && phoneValid && usernameValid && fullNameValid && dobValid;
    }

    // Update input border color on input change
    $('input').on('input', function () {
        validateAndUpdateInput($(this), /.*/); // Use any non-empty regex for visual validation
    });

    // Handle form submission
    $('#signupForm').submit(function (event) {
        event.preventDefault(); // Prevent form submission

        // Validate inputs
        var allInputsValid = validateInputs();

        // Submit form if all inputs are valid
        if (allInputsValid) {
            var username = $('#username').val().trim();
            // Validate username existence in the database
            $.ajax({
                type: 'POST',
                url: '/api/LogInApi/CheckUsernameExists',
                contentType: 'application/json',
                data: JSON.stringify({ Username: username }),
                success: function (response) {
                    if (response.exists) {
                        // Show error message for username
                        $('#username').css('border-color', 'red');
                        Swal.fire("Username already exists. Please choose another.");
                    } else {
                        // If all fields are valid, submit the form
                        registerUser();
                    }
                },
                error: function () {
                    // Handle error
                    Swal.fire("Error checking username existence. Please try again.");
                }
            });
        } else {
            // Scroll to the first invalid input
            $('input:invalid').first().focus();
            // Show error message or take any other action as needed
        }
    });
});

function registerUser() {
    var email = $('#email').val();
    var fullname = $('#fullname').val();
    var username = $('#username').val();
    var password = $('#password').val();
    var mobileNumber = $('#phoneNumber').val();
    var DateOfBirth = $('#dob').val();

    $.ajax({
        type: 'POST',
        url: '/api/LogInApi/Register',
        contentType: 'application/json',
        data: JSON.stringify({
            DateOfBirth: DateOfBirth,
            phoneNumber: mobileNumber,
            email: email,
            fullname: fullname,
            username: username,
            password: password
        }),
        success: function (response) {
            Swal.fire("Registration successful.");
            window.location.href = '/Home/LogIn';
        },
        error: function (xhr, status, error) {
            console.error(xhr.responseText);
            Swal.fire('Registration failed. Please try again.');
        }
    });
}

///////////////////////////////
////// Click event handler for the search button
///////
$('#searchBtn').click(function (event) {
    event.stopPropagation(); // Prevent event bubbling

    // Toggle sidebar
    $('#sidebar').toggleClass('open');

    // Focus on the search input when sidebar opens
    $('#searchInput').focus();
});

// Click event handler for closing the sidebar when clicking outside of it
$(document).click(function (event) {
    if (!$(event.target).closest('#sidebar').length && $('#sidebar').hasClass('open')) {
        $('#sidebar').removeClass('open');
    }
});

// Prevent closing the sidebar when clicking inside it
$('#sidebar').click(function (event) {
    event.stopPropagation();
});

// Click event handler for the search button inside the sidebar
$('#sidebarSearchBtn').click(function () {
    var searchQuery = $('#searchInput').val();
    searchUsers(searchQuery);
});

 //Function to handle search
function handleSearch() {
   
    const searchInput = $('#searchInput').val();

    // Check if searchInput is null or empty
    if (searchInput === '' || searchInput === null) {
        return; // Do nothing if searchInput is null or empty
    }
    
    // Make an AJAX call to fetch data
    $.ajax({
        url: '/api/DefaultApi/SearchUsers',
        method: 'GET',
        data: { query: searchInput },
        success: function (data) {
            
            // Clear the user list
            $('#userList').empty();
            // Append matching users to the sidebar
            $.each(data, function (index, user) {
                
                
                
                    var postImageUrl = "/" + user.ProfilePictureURL;
                    var userHTML = '<div class="FollowSection">' +
                        '<div class="profile-follow profile-foolow-hovering">' +
                        '<div class="profile-follow-left">' +
                        '<div class="profile-follow-image">' +
                        '<img src="' + postImageUrl + '" alt="">' +
                        '</div>' +
                        '<div class="profile-follow-content"  data-user-id="' + user.UserID + '">' +
                        '<p class="profile-id">' + user.Username + '</p>' +
                        '</div>' +
                        '</div>' +

                        '<div style="display: inline;">';

                //if (user.IsFriend == 1) {
                //    userHTML += `<a href="#" class="remove-friend-btn" data-user-id="${user.UserID}">Following</a>`;
                //} else if (user.IsFriend == 1 && user.FollowerUserID == loggedInUserId) {
                //    userHTML += `<a href="#" class="remove-friend-btn" data-user-id="${user.UserID}">Following</a>`;
                //}
                //else {
                //    userHTML += `<a href="#" class="add-friend-btn" data-user-id="${user.UserID}">Follow</a>`;
                //}

                    userHTML += `</div></div></div>`;
                
                $('#userList').append(userHTML);
                
            });
            /*$(document).on("click", ".profile-follow-content", function () {*/
            $(".profile-follow-content").click(function () {
                // Find the user ID from the clicked element
                var userId = $(this).data('user-id');

                // Redirect to the SearchUser page with the user ID as a query parameter
                window.location.href = '/Home/SearchUser/?userId=' + userId;
            });
           /* attachEventHandlers();*/

           
        },
        error: function (xhr, status, error) {
            console.error('Error fetching data:', error);
        }
    });
}

// Add event listener to the search input field for keyup event
$('#searchInput').on('keyup', function () {
    handleSearch();
});

// Optionally, you can add an event listener to trigger the search on pressing Enter key
$('#searchInput').on('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission
        handleSearch();
    }
});


//////////////////
// Show create post popup when the "Create" button is clicked
///////
$(document).ready(function () {
$('#hidden1').click(function () {
    $('#createPostPopup').show();
});

// Close the popup when the close button is clicked
$('.close').click(function () {
    $('#createPostPopup').hide();
    $('#postImageInput').val(''); // Clear the file input
    $('#selectedImagePreview').attr('src', ''); // Clear the preview image
    $('#captionInput').val('');
});

// Handle file input change event to preview selected image
$('#postImageInput').change(function () {
    var file = this.files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
        $('#selectedImagePreview').html('<img src="' + event.target.result + '" alt="Selected Image">');
    }
    reader.readAsDataURL(file);
});

// Handle the "Share" button click event to save the post and append it to UI
    //$('#shareButton').click(function () {
    //    var userId = localStorage.getItem('UserId');
    //    var files = $('#postImageInput')[0].files;
    //    var caption = $('#captionInput').val();

    //    if (files.length === 0) {
    //        alert('Please select an image to share.');
    //        return;
    //    }

        
    //    var data = new FormData();
    //    data.append('userId', userId);
    //    data.append('caption', caption);
    //    for (var i = 0; i < files.length; i++) {
    //        data.append('images', file);
    //    }
    //    uploadFormData(data);
        

    //    function uploadFormData(data) {
    //        $.ajax({
    //            url: '/api/post/CreatePost',
    //            method: 'POST',
    //            data: formData,
    //            contentType: false,
    //            processData: false,
    //            success: function (data) {
    //                console.log('Post created successfully:', data);
    //                $('#createPostPopup').hide();
    //                $('#postImageInput, #selectedImagePreview, #captionInput').val('');
    //                FetchPostDataAndAppend();
    //                FetchPostDataAndAppend2();
    //            },
    //            error: function (xhr, status, error) {
    //                console.error('Error sharing post:', error);
    //            }
    //        });
    //    }
    //});
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    $('#shareButton').click(function () {
        var userId = localStorage.getItem('UserId');
        var files = $('#postImageInput')[0].files;
        var caption = escapeHtml($('#captionInput').val().trim()); // Escape HTML entities and trim leading/trailing spaces

        // Validate if an image is selected
        if (files.length === 0) {
            Swal.fire('Please select an image to share.');
            return;
        }

        var data = new FormData();
        data.append('userId', userId);
        data.append('caption', caption);

        var fileType = files[0].type.toLowerCase();
        var validImageTypes = ['image/jpeg', 'image/png', 'image/gif']; // Add more if needed
        if (!validImageTypes.includes(fileType)) {
            Swal.fire('Please select a valid image file (JPEG, PNG, GIF).');
            return;
        }
        // Validate image type
        //for (var i = 0; i < files.length; i++) {
        //    var file = files[i];
        //    var validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        //    if (!validImageTypes.includes(file.type)) {
        //        Swal.fire('Please select a valid image file (JPEG, PNG, GIF).');
        //        return;
        //    }
        //}

        // Append selected images to FormData
        for (var i = 0; i < files.length; i++) {
            data.append('images', files[i]);
        }

        // Call the function to upload form data
        uploadFormData(data);
    });

    function uploadFormData(formData) {
        $.ajax({
            url: '/api/post/CreatePost',
            method: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                console.log('Post created successfully:', data);
                $('#createPostPopup').hide();
                $('#postImageInput, #selectedImagePreview, #captionInput').val('');
                FetchPostDataAndAppend();
                FetchPostDataAndAppend2();
            },
            error: function (xhr, status, error) {
                console.error('Error sharing post:', error);
            }
        });
    }




    
    function FetchPostDataAndAppend() {
    var userId = localStorage.getItem('UserId');
    $.ajax({
        url: '/api/post/GetLastStoredImage',
        type: 'GET',
        success: function (response) {
            
            response.forEach(function (post) {
                var postImageUrl = "/" + post.MediaURL; // URL of the post image
                var userProfileImageUrl = "/" + post.ProfilePictureURL; // URL of the user's profile image
                var username = post.Username; // Username
                var likesCount = post.LikesCount; // Number of likes
                var commentsCount = post.CommentsCount; // Number of comments
                var datetimeString = post.PostCreationTimestamp;
                var postCreationDateTime = new Date(datetimeString);
                var formattedTimestamp = postCreationDateTime.toLocaleTimeString('en-US', { hour12: true }) + ' ' + postCreationDateTime.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
                var commentIconHtml = '';
                if (commentsCount > 0) {
                    commentIconHtml = '<span class="comment-icon title" data-post-id="' + post.PostID + '">' + 'View All ' + commentsCount + ' Comments' + '</span>';
                }
                if (post.Caption.length > 0) {
                    userIconHtml = '<p class="title"><span>' + username + '</span> &nbsp;:&nbsp;' + post.Caption + '</p>';
                }
                var htmlBlock = '<div class="post-main">' +
                    '<div class="post-header">' +
                    '<div class="post-left-header">' +
                    '<div class="post-image">' +
                    '<img src="' + userProfileImageUrl + '" alt="">' + // User's profile picture
                    '</div>' +
                    '<p class="post-username">' + username + '</p>' +
                    /*'<i class="fa-solid fa-certificate"></i>' +*/
                    /* '<span class="one-day">' + formattedTimestamp + '</span>' +*/
                    '</div>' +
                    /*'<i class="fa-solid fa-grip-lines"></i>' +*/
                    '<span class="one-day">' + formattedTimestamp + '</span>' +
                    '</div>' +
                    '<div class="post-main-image">' +
                    '<img src="' + postImageUrl + '" alt="">' + // Post image
                    '</div>' +
                    '<div class="post-fotter">' +
                    '<div class="post-fotter-left">' +
                    '<span><i id= heart class="like-icon fa-regular fa-heart" aria-hidden="true" data-post-id="' + post.PostID + '"></i></span>' +
                    '<span class="like-count" style="font-style:bold;">' + likesCount + ' Likes' + '</span>' +
                    '<i class="comment-icon fa-solid fa-message" data-post-id="' + post.PostID + '"></i>' +
                    '<span class="like-count" style="font-style:bold;">' + commentsCount + ' Comments' + '</span>' +
                    /* '<i class="fa-regular fa-paper-plane"></i>' +*/
                    '</div>' +
                    /*'<i class="fa-regular fa-bookmark"></i>' +*/
                    '</div>' +
                    /* '&nbsp;<span class="like-count" style="font-style:bold;margin-left:6px;margin-top:2px;">' + likesCount +'  Likes' +'</span>' +*/
                    '<p class="post-liked">' + '</p>' +
                    userIconHtml+
                    /* '<p class="comments"> view all comments</p>' +*/
                    '</div>' +
                    '</div>' +
                    commentIconHtml +

                    '<div class="comment-container" style="display:flex;flex-direction:column;margin-top:5px" >' +
                    '<div style="display:flex;">' +
                    '<textarea maxlength="100" id="commentTextarea" placeholder="Enter your comment..." style=" border: none;width:585px; height:30px;border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; display: inline-block;"></textarea>' +
                    '<i id="submitCommentBtn" data-post-id="' + post.PostID + '" class="fa-regular fa-paper-plane title" style="font-size: 25px;margin-left:10px;"></i>' +

                    '</div>' +
                    '</div>' +
                    '<div class="comment-container" style="display:flex;flex-direction:column;margin-top:5px" data-post-id="' + post.PostID + '">' +
                    '</div>' +

                    '<hr>';

                // Append the HTML block to the screen
                $('#AppendPost').prepend(htmlBlock);




            });
        },
        error: function (xhr, status, error) {
            console.error('Error fetching data:', error);
        }
    });
}
});




function FetchPostDataAndAppend2() {
    var userId = localStorage.getItem('UserId');
    $.ajax({
        url: '/api/post/GetAllPosts?userId=' + userId,
        type: 'GET',
        success: function (response) {
            $('#AppendPost').empty();
            response.forEach(function (post) {
                var postImageUrl = "/" + post.MediaURL; // URL of the post image
                var userProfileImageUrl = "/" + post.ProfilePictureURL; // URL of the user's profile image
                var username = post.Username; // Username
                var likesCount = post.LikesCount; // Number of likes
                var commentsCount = post.CommentsCount; // Number of comments
                var datetimeString = post.PostCreationTimestamp;
                var postCreationDateTime = new Date(datetimeString);
                var formattedTimestamp = postCreationDateTime.toLocaleTimeString('en-US', { hour12: true }) + ' ' + postCreationDateTime.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
                var commentIconHtml = '';
                if (commentsCount > 0) {
                    commentIconHtml = '<span class="comment-icon title" data-post-id="' + post.PostID + '">' + 'View All ' + commentsCount + ' Comments' + '</span>';
                }
                if (post.Caption && post.Caption.trim().length > 0) {
                    userIconHtml = '<p class="title"><span>' + username + '</span> &nbsp;:&nbsp;' + post.Caption + '</p>';
                } else {
                    userIconHtml = ''; // Clear the userIconHtml if caption is null or empty
                }
                var htmlBlock = '<div class="post-main">' +
                    '<div class="post-header">' +
                    '<div class="post-left-header">' +
                    '<div class="post-image">' +
                    '<img src="' + userProfileImageUrl + '" alt="">' + // User's profile picture
                    '</div>' +
                    '<p class="post-username" data-user-id="' + post.UserID + '">' + username + '</p>' +
                    /*'<i class="fa-solid fa-certificate"></i>' +*/
                    /* '<span class="one-day">' + formattedTimestamp + '</span>' +*/
                    '</div>' +
                    /*'<i class="fa-solid fa-grip-lines"></i>' +*/
                    '<span class="one-day">' + formattedTimestamp + '</span>' +
                    '</div>' +
                    '<div class="post-main-image">' +
                    '<img src="' + postImageUrl + '" alt="">' + // Post image
                    '</div>' +
                    '<div class="post-fotter">' +
                    '<div class="post-fotter-left">' +
                    '<span><i id= heart class="like-icon fa-regular fa-heart" aria-hidden="true" data-post-id="' + post.PostID + '"></i></span>' +
                    '<span class="like-count" style="font-style:bold;">' + likesCount + ' Likes' + '</span>' +
                    '<i class="comment-icon fa-solid fa-message" data-post-id="' + post.PostID + '"></i>' +
                    '<span class="like-count" style="font-style:bold;">' + commentsCount + ' Comments' + '</span>' +
                    /* '<i class="fa-regular fa-paper-plane"></i>' +*/
                    '</div>' +
                    /*'<i class="fa-regular fa-bookmark"></i>' +*/
                    '</div>' +
                    /* '&nbsp;<span class="like-count" style="font-style:bold;margin-left:6px;margin-top:2px;">' + likesCount +'  Likes' +'</span>' +*/
                    '<p class="post-liked">' + '</p>' +
                    userIconHtml +
                    /* '<p class="comments"> view all comments</p>' +*/
                    '</div>' +
                    '</div>' +
                    commentIconHtml +
                    
                    '<div class="comment-container" style="display:flex;flex-direction:column;margin-top:5px" >' +
                    '<div style="display:flex;">'+
                    '<textarea id="commentTextarea" placeholder="Enter your comment..." style=" border: none;width:585px; height:30px;border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; display: inline-block;"></textarea>' +
                    '<i id="submitCommentBtn" data-post-id="' + post.PostID + '" class="fa-regular fa-paper-plane title" style="font-size: 25px;margin-left:10px;"></i>' +
                    
                    '</div>' +
                    '</div>' +
                    '<div class="comment-container" style="display:flex;flex-direction:column;margin-top:5px" data-post-id="' + post.PostID + '">' +
                    '</div>'+
                   
                    '<hr>';

                // Append the HTML block to the screen
                $('#AppendPost').prepend(htmlBlock);



                
            });
            $(".post-username").click(function () {
                // Find the user ID from the clicked element
                var userId = $(this).data('user-id');

                // Redirect to the SearchUser page with the user ID as a query parameter
                window.location.href = '/Home/SearchUser/?userId=' + userId;
            });
            likeunlikeallpost();
        },
        error: function (xhr, status, error) {
            console.error('Error fetching data:', error);
        }
    });
}



$(document).ready(function () {
    $("#heart").click(function () {
        // Retrieve the post ID
        const postId = $(this).data("post-id");

        // Log the post ID (for debugging purposes)
        console.log("Post ID:", postId);

        // Find the <i> element inside the clicked #heart
        const icon = $(this).find('i');

        // Check if the heart icon currently has the 'fa-solid' class
        if (icon.hasClass('fa-solid')) {
            // Change to regular heart
            icon.removeClass('fa-solid').addClass('fa-regular');
        } else {
            // Change to solid heart
            icon.removeClass('fa-regular').addClass('fa-solid');
        }
    });
});

///////////////////
////LOGOUT
//////////
// Function to clear localStorage when the browser is closed or the application is stopped
//window.addEventListener('beforeunload', function () {
//    localStorage.clear(); // Clear localStorage
//});

// Function to handle more link click event
$("#moreLink").click(function (event) {
    event.preventDefault(); // Prevent default behavior of link
    $("#menu").toggle(); // Toggle menu visibility
});

// Function to handle logout button click event
$("#logoutButton").click(function () {
    localStorage.clear(); // Clear localStorage
    window.location.href = '/Home/LogIn'; // Redirect to login page
});



////////////////////////
//Story Upload
///////////////////////
$(document).ready(function () {
    // Event listener for clicking "Create Story" link
    $('#createStoryLink').on('click', function (e) {
        e.preventDefault(); // Prevent default link behavior
        $('#storyPopup').css('display', 'block'); // Show the popup
    });

    // Event listener for clicking the close button
    $('.close').on('click', function () {
        $('#storyPopup').css('display', 'none'); // Hide the popup
        $('#storyImageInput').val(''); // Clear the file input
        $('#previewImage').attr('src', ''); // Clear the preview image
        $('#imagePreview').css('display', 'none');
    });

    // Event listener for image selection
    $('#storyImageInput').on('change', function () {
        $('#imagePreview').css('display', 'block');
        var input = this;
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#previewImage').attr('src', e.target.result); // Set the src attribute of the preview image
            }
            reader.readAsDataURL(input.files[0]);
        }
    });

    // Event listener for clicking "Post Story" button
    $('#postStoryBtn').on('click', function () {
        // Check if any file is selected
        var files = $('#storyImageInput').get(0).files;
        if (files.length === 0) {
            Swal.fire('Please select an image to post a story.');
            return; 
        }

        // Check if the selected file is an image
        var fileType = files[0].type.toLowerCase();
        var validImageTypes = ['image/jpeg', 'image/png', 'image/gif']; // Add more if needed
        if (!validImageTypes.includes(fileType)) {
            Swal.fire('Please select a valid image file (JPEG, PNG, GIF).');
            return;
        }

        // Upload the selected image and post the story
        var userId = localStorage.getItem('UserId');
        var formData = new FormData();
        formData.append('storyImage', files[0]);

        var url = '/api/story/CreateStory?userId=' + userId;
        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                // If image upload and story post are successful, hide the popup
                $('#storyPopup').css('display', 'none');
                $('#storyImageInput').val(''); // Clear the file input
                $('#previewImage').attr('src', ''); // Clear the preview image
                $('#imagePreview').css('display', 'none');
                FetchLastStoredStory();
            },
            error: function (xhr, status, error) {
                console.error('Error uploading image:', error);
                // Optionally, show an error message or handle the error in other ways
            }
        });
    });
});



    function FetchLastStoredStory() {
        $.ajax({
            url: '/api/Story/GetLastStoredStory',
            type: 'GET',
            success: function (response) {
                var storyMediaURL = "/" + response.MediaURL;


                // Construct the story HTML block
                var storyHTML = '<div class="story" id="last-story">' +
                    '<div class="story-image">' +
                    '<img src="' + storyMediaURL + '" alt="">' +
                    '</div>' +

                    '</div>';

                // Append the story HTML block to the UI
                $('#StorySection').prepend(storyHTML);
            },
            error: function (xhr, status, error) {
                console.error('Error fetching last stored story:', error);
            }
        });
    }



    function FetchAllStoryDataAndAppend() {
        $.ajax({
            url: '/api/Story/GetAllStories',
            type: 'GET',
            success: function (response) {
                response.forEach(function (story) {
                    var storyMediaURL = "/" + story.MediaURL;


                    // Construct the story HTML block
                    var storyHTML = '<div class="story" data-story-id="' + story.StoryID + '">' +
                        '<div class="story-image">' +
                        '<img src="' + storyMediaURL + '" alt="">' +
                        '</div>' +
                        '</div>';

                    // Append the story HTML block to the UI
                    $('#StorySection').append(storyHTML);
                });
            },
            error: function (xhr, status, error) {
                console.error('Error fetching story data:', error);
            }
        });
    }
//function FetchAllStoryDataAndAppend() {
//    $.ajax({
//        url: '/api/Story/GetAllStories',
//        type: 'GET',
//        success: function (response) {
//            $('#StorySection').empty(); // Clear the current stories

//            const unreadStories = [];
//            const readStories = [];

//            response.forEach(function (story) {
//                var storyMediaURL = "/" + story.MediaURL;
//                var storyHTML = '<div class="story" data-story-id="' + story.StoryID + '">' +
//                    '<div class="story-image">' +
//                    '<img src="' + storyMediaURL + '" alt="">' +
//                    '</div>' +
//                    '</div>';

//                if (story.StoryStatus === 'read') {
//                    // Append to read stories array
//                    readStories.push(storyHTML);
//                } else {
//                    // Append to unread stories array
//                    unreadStories.push(storyHTML);
//                }
//            });

//            // Append unread stories first
//            unreadStories.forEach(function (storyHTML) {
//                $('#StorySection').append(storyHTML);
//            });

//            // Append read stories last and remove border color
//            readStories.forEach(function (storyHTML) {
//                const $story = $(storyHTML);
//                $story.find(".story-image").css({
//                    "border-color": "none",
//                    "background-image": "none"
//                });
//                $('#StorySection').append($story);
//            });
//        },
//        error: function (xhr, status, error) {
//            console.error('Error fetching story data:', error);
//        }
//    });
//}

    // Call FetchStoryDataAndAppend() function on page load
  


    // Update event handler for "Follow" button
    $('.add-friend-btn').on('click', function () {
        var $this = $(this);
        var UserId = $this.data('user-id');

        if ($this.text() === 'Follow') {
            addFriend(UserId, function () {
                $this.text('Following');
            });
        } else {
            removeFriend(UserId, function () {
                $this.text('Follow');
            });
        }
    });

    // Function to fetch users and append them to the UI
    function fetchUsersAndAppend() {
        var loggedInUserId = localStorage.getItem('UserId');

        $.ajax({
            url: '/api/DefaultApi/GetAllUsersExceptLoggedInUser',
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
                        '<div class="profile-follow-content" data-user-id="'+ user.UserID + '">' +
                        '<p class="profile-id">' + user.Username + '</p>' +
                        '</div>' +
                        '</div>' +

                        '<div style="display: inline;">'+
                        '<a href="#" class="add-friend-btn" data-user-id="' + user.UserID + '">Follow</a>';

                    //if (user.IsFriend == 1) {
                    //  userHTML += `<a href="#" class="remove-friend-btn" data-user-id="${user.UserID}">Following</a>`;
                    //}
                    //else if(user.FollowerUserID == loggedInUserId) {
                    //    userHTML += `<a href="#" class="remove-friend-btn" data-user-id="${user.UserID}">Following</a>`;
                    //}else {
                    //    userHTML += `<a href="#" class="add-friend-btn" data-user-id="${user.UserID}">Follow</a>`;
                    //}


                    userHTML += `</div></div></div>`;

                    $('#FollowSection').append(userHTML);
                });
               
                attachEventHandlers();
                $(".profile-follow-content .post-username").click(function () {
                    // Find the user ID from the clicked element
                    var userId = $(this).data('user-id');

                    // Redirect to the SearchUser page with the user ID as a query parameter
                    window.location.href = '/Home/SearchUser/?userId=' + userId;
                });
            },
            error: function (xhr, status, error) {
                console.error('Error fetching users:', error);
            }
        });
    }

    // Function to attach event handlers
        function attachEventHandlers() {
            $('.add-friend-btn').on('click', function () {
                var $this = $(this);
                var UserId = $this.data('user-id');

                addFriend(UserId, function () {
                    $this.text('Following');
                    fetchUsersAndAppend(); // Update UI after adding friend
                });
            });

            //$('.remove-friend-btn').on('click', function () {
            //    var $this = $(this);
            //    var UserId = $this.data('user-id');

            //    removeFriend(UserId, function () {
            //        $this.text('Follow');
            //        fetchUsersAndAppend(); // Update UI after removing friend
            //    });
            //});
        }

    // Function to add a friend
    function addFriend(UserId, successCallback) {
        var currentUserId = localStorage.getItem('UserId');
        $.ajax({
            url: '/api/DefaultApi/AddFriend',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                FollowerUserID: currentUserId,
                FollowingUserID: UserId
            }),
            success: function (data) {
                console.log('Friend added successfully');
                successCallback(); // Call successCallback to update button text
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    // Function to remove a friend
    //function removeFriend(UserId, successCallback) {
    //    const userId = localStorage.getItem('UserId');
    //    $.ajax({
    //        url: '/api/DefaultApi/RemoveFriend',
    //        method: 'POST',
    //        contentType: 'application/json',
    //        data: JSON.stringify({
    //            FollowerUserID: userId,
    //            FollowingUserID: UserId
    //        }),
    //        success: function (response) {
    //            console.log('Friend removed successfully');
    //            successCallback(); // Call successCallback to update button text
    //        },
    //        error: function (error) {
    //            console.log(error);
    //        }
    //    });
    //}



    //////////////////////////////////////////////////////////////////////////////////////////////////////////

   
    ////////
    //LIKE
    //////
    $(document).on('click', '.like-icon', function () {
        var $this = $(this);
        var PostId = $this.data('post-id');
        var UserId = localStorage.getItem('UserId');
        $.ajax({
            url: '/api/post/LikePost',
            method: 'POST',
            data: { PostID: PostId, UserID: UserId },
            success: function (data) {
                FetchPostDataAndAppend2();
                likeunlikeallpost();
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

$(document).on('click', '.like-comment', function () {
    var $this = $(this);
    var CommentID = $this.data('comment-id');
    var postId = $this.data('post-id');
    var UserId = localStorage.getItem('UserId');
    $.ajax({
        url: '/api/post/LikeComment',
        method: 'POST',
        data: { CommentID: CommentID, UserID: UserId },
        success: function (data) {
            fetchAndDisplayCommentsWithReplies(postId);
            console.log(data.likeCount);
            // Update the like count value
            $this.find('.Like-Count').text(data.likeCount);
            if (data.likeCount > 0) {
                $this.find('i').removeClass('fa-regular fa-heart').addClass('fa-solid fa-heart');
            } else {
                $this.find('i').removeClass('fa-solid fa-heart').addClass('fa-regular fa-heart');
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
});







    // Add click event listener to the comment icon
    $(document).on('click', '.allcomments', function () {
        // Show the modal
        var $this = $(this);
        var PostId = $this.data('post-id');

        fetchAndDisplayCommentsWithReplies(PostId);

    });
    $(document).on('click', '.comment-icon', function () {
        // Show the modal
        var $this = $(this);
        var PostId = $this.data('post-id');
        fetchAndDisplayCommentsWithReplies(PostId);
        console.log(PostId);


    });


function fetchAndDisplayCommentsWithReplies(PostId) {
    var loggedInUserId = localStorage.getItem('UserId');
    $.ajax({
        url: '/api/DefaultApi/GetCommentsForPostWithReplies?PostId=' + PostId,
        type: 'GET',
        success: function (response) {
            $('.comment-container[data-post-id="' + PostId + '"]').empty(); // Clear existing comments

            response.forEach(function (comment) {
                var userProfileImageUrl = "/" + comment.ProfilePic;
                var likeCount = comment.TotalLikesCount; // Get the total likes count for the comment
                var deleteOption = (comment.UserId == loggedInUserId) ? '<span class="Delete-comment-btn" data-post-id="' + PostId + '" data-comment-id="' + comment.CommentID + '" style="font-size:13px;">Delete</span>' : '';
                var commentHtml = '<div class="FollowSectionn" data-comment-id="' + comment.CommentID + '">' +
                    '<div class="profile-follow profile-foolow-hovering">' +
                    '<div class="profile-follow-left">' +
                    '<div class="profile-follow-image">' +
                    '<img src="' + userProfileImageUrl + '" alt="">' +
                    '</div>' +
                    '<div class="profile-follow-content">' +
                    '<p class="profile-id">' + comment.Username + '</p>' +
                    '<div class="post-fotter-left">' +
                    '<span style="font-size:13px;">' + likeCount + ' Likes</span>' + // Append the total likes count dynamically
                    '<span class="reply-comment-btn" data-post-id="' + PostId + '" data-comment-id="' + comment.CommentID + '" style="font-size:13px;">Reply</span>' +
                    deleteOption +
                    '</div>' +
                    '<p class="profile-name">' + comment.Text + '</p>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<span><i id="heart" class="like-comment fa-solid fa-heart " aria-hidden="true" data-comment-id="' + comment.CommentID + '" data-post-id="' + PostId + '"></i></span>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

                // Append comment to the appropriate container
                var $container = $('.comment-container[data-post-id="' + PostId + '"]');
                if (comment.ParentCommentId === null) {
                    $container.append(commentHtml); // Main comment
                } else {
                    var $parentComment = $container.find('.FollowSectionn[data-comment-id="' + comment.ParentCommentId + '"]');
                    var $replyHtml = $(commentHtml).addClass('reply'); // Add the reply class
                    $parentComment.after($replyHtml); // Append reply comment
                }
            });

            // Open the comment modal
            $('#commentModal').css('display', 'block');
        },
        error: function (xhr, status, error) {
            console.error('Error fetching comments:', error);
        }
    });
}





$(document).on("click", ".Delete-comment-btn", function () {
    var commentId = $(this).data('comment-id');
    var postId = $(this).data('post-id');
    

    // Send AJAX request to delete the comment
    $.ajax({
        url: '/api/post/DeleteComment', // Assuming this is the correct endpoint
        type: 'DELETE',

        data: { CommentID: commentId, PostID: postId}, // Convert data object to JSON string
        success: function (response) {
            fetchAndDisplayCommentsWithReplies(postId);
            FetchPostDataAndAppend2();
            
        },
        error: function (xhr, status, error) {
            // Handle error response
            console.error('Error deleting comment:', error);
        }
    });
   
});

    $(document).on("click", ".reply-comment-btn", function () {
        var commentId = $(this).data('comment-id');
        var postId = $(this).data('post-id');

        // Store the comment ID and post ID in data attributes of the send reply button
        $('#sendReplyBtn').attr('data-comment-id', commentId);
        $('#sendReplyBtn').attr('data-post-id', postId);

        // Show the reply modal
        $('#replyModal').css('display', 'block');
    });


    // Close reply modal
    $('.close').click(function () {
        $('#replyModal').css('display', 'none');
        $('#replyText').val('');
    });

    // Close modal if user clicks outside of it
    $(window).click(function (event) {
        if (event.target == document.getElementById('replyModal')) {
            $('#replyModal').css('display', 'none');
        }
    });

    // Function to handle the "Send Reply" button click
    $(document).on("click", "#sendReplyBtn", function () {
        var UserId = localStorage.getItem('UserId');
        // Extract the comment text from the textarea
        var commentText = $('#replyText').val().trim(); // Trim to remove leading and trailing spaces
        if (commentText !== "") { // Check if commentText is not empty
            var $this = $(this);
            var postId = $this.data('post-id');
            // Get the parent comment ID from the reply modal
            var ParentCommentId = $this.data('comment-id');
            console.log($this.data('comment-id'));

            // Send an AJAX request to store the reply in the database
            $.ajax({
                url: '/api/DefaultApi/AddComment',
                type: 'POST',
                data: { ParentCommentId: ParentCommentId, comment: commentText, UserID: UserId, PostID: postId, },
                success: function (response) {
                    fetchAndDisplayCommentsWithReplies(postId);
                    $('#replyModal').css('display', 'none');
                    $('#replyText').val('');
                },
                error: function (xhr, status, error) {
                    console.error('Error adding reply:', error);
                }
            });
        } else {
            // Handle the case when comment text is empty
            Swal.fire('Comment text is empty or contains only spaces.');
        }
    });


$(document).on('click', '#submitCommentBtn', function () {
    var $this = $(this);
    var postId = $this.data('post-id');
    var commentTextarea = $this.closest('.comment-container').find('#commentTextarea');
    var commentText = commentTextarea.val().trim(); // Trim to remove leading and trailing spaces
    var userId = localStorage.getItem('UserId');

    if (commentText !== "") { // Check if commentText is not empty
        // Escape the user input
        var escapedCommentText = escapeHtml(commentText);

        // Make AJAX call to submit the comment
        $.ajax({
            url: '/api/DefaultApi/SubmitComment',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                PostID: postId,
                UserID: userId,
                commentText: escapedCommentText
            }),
            success: function (response) {
                commentTextarea.val('');
                fetchAndDisplayCommentsWithReplies(postId);
                FetchPostDataAndAppend2();
            },
            error: function (xhr, status, error) {
                console.error('Error submitting comment:', error);
            }
        });
    } else {
        // Handle the case when comment text is empty
        Swal.fire('Comment text is empty or contains only spaces.');
    }
});

// Function to escape HTML characters
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}



    //////
    ///LIKECOMMENT
    /////
    //$(document).on('click', '.like-Comment', function () {
    //    var commentId = $(this).data('comment-id');
    //    var userId = localStorage.getItem('UserId'); // Retrieve user ID from session
    //    var action = $(this).hasClass('liked') ? 'unlike' : 'like'; // Check if the comment is already liked

    //    likeComment(commentId, userId, action);
    //});

    //function likeComment(commentId, userId, action) {
    //    $.ajax({
    //        url: '/api/post/like?commentId=' + commentId + '&userId=' + userId + '&action=' + action,
    //        type: 'POST',

    //        data: { commentId: commentId, userId: userId, action: action },
    //        success: function (data) {
    //            console.log('Like count:', data.LikeCount);
    //            console.log('Liked:', data.Liked);
    //            // Update UI with new like count and liked status
    //            if (data.Liked) {

    //                $('.FollowSectionn[data-comment-id="' + commentId + '"]').addClass('liked');
    //            } else {
    //                $('.FollowSectionn[data-comment-id="' + commentId + '"]').removeClass('liked');
    //            }
    //        },
    //        error: function (xhr, status, error) {
    //            console.error('Error liking comment:', error);
    //        }
    //    });
    //}


    ///////////////////
    //////////
    /// 
    /////////
    /////



function fetchNotifications() {
    var userId = localStorage.getItem('UserId');
    var url = '/api/DefaultApi/notifications?userId=' + userId;

    $.ajax({
        url: url, // Endpoint to fetch notifications
        type: 'GET',
        success: function (notifications) {
            // Clear existing notifications
            $('.notification-list').empty();

            // Append new notifications
            notifications.forEach(function (notification) {
                // Check if notification is not empty or null before appending
                if (notification.trim() !== "") {
                    $('.notification-list').prepend('<li class="notification" >' + notification + '</li>');
                }
            });
        },
        error: function (xhr, status, error) {
            console.error('Error fetching notifications:', error);
        }
    });
}


   




function likeunlikeallpost() {

    // Retrieve the logged-in user ID from local storage
    var userId = localStorage.getItem('UserId');

    if (!userId) {
        console.error('User ID is not found in local storage');
        return;
    }

    // AJAX request to fetch post IDs and their like status
    $.ajax({
        url: '/api/post/likeStatus?userId=' + userId,
        method: 'GET',
        success: function (data) {
            // Iterate through the received data and update UI for each post
            data.forEach(function (post) {
                // Get the heart icon element
                var $heartIcon = $('[data-post-id="' + post.PostId + '"].like-icon');

                // Change the color of the heart icon based on like status
                if (post.IsLiked) {
                    $heartIcon
                        .removeClass('fa-regular fa-heart')
                        .addClass('fa-solid fa-heart')
                        .css('color', 'red');
                } else {
                    $heartIcon
                        .removeClass('fa-solid fa-heart')
                        .addClass('fa-regular fa-heart')
                        .css('color', 'black');
                }

            });
        },
        error: function (xhr, status, error) {
            console.error('Error fetching post like status:', error);
        }
    });


};
   

