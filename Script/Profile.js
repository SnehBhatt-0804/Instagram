
    $(document).ready(function () {

        AppendProfile();

        });
    function AppendProfile() {

            var loggedInUserId = localStorage.getItem('UserId');
    $.ajax({
        url: '/api/post/GetUserProfileAndPosts',
    type: 'GET',
    data: {userId: loggedInUserId },
    success: function (response) {


                    // Construct the HTML for the profile section
                    var profileHTML = '<div class="row m-b-r m-t-3">' +
        '<div class="col-md-2 offset-md-1">' +
            '<div class="profile-img">' +
                '<img src="' + " /" + response.UserProfile[0].ProfilePictureURL + '" alt="" class="img-circle img-fluid" id="ProfilePicture">' +
                '</div>' +
            '</div>' +
        '<div class="col-md-9 p-t-2">' +
            '<h2 class="h2-responsive" id="username">' + response.UserProfile[0].Username + '</h2>' +
            '<p id="fullname">' + response.UserProfile[0].FullName + '</p>' +
            '<ul class="flex-menu" id="userstats">' +
                '<li><strong id="postcount">' + response.UserProfile[0].PostCount + '</strong> posts</li>' +
                '<li><strong id="followercount" data-user-id="' + loggedInUserId + '">' + response.UserProfile[0].FollowerCount + '</strong> followers</li>' +
                '<li><strong id="followingcount" data-user-id="' + loggedInUserId + '">' + response.UserProfile[0].FollowingCount + '</strong> following</li>' +
                /**/
                '<li><a href="#" class="btn btn-info-outline waves-effect" id="EditProfileBtn">Edit Profile</a></li>' +
                '<li><a href="/Home/Archieve" class="btn btn-info-outline waves-effect" id="EditProfileBtn">Archieve Posts</a></li>' +
                '</ul>' +
            '</div>' +
        '</div>';

    // Append the profile HTML to the container
    $('.container').prepend(profileHTML);

    // Process user posts
    response.UserPosts.forEach(function (post) {
                        var postImageUrl = "/" + post.MediaURL;
    var postHTML = '<div class="col-sm-12 col-md-6 col-lg-4" data-post-id="' + post.PostID + '">' +
        '<div class="view overlay hm-black-light m-b-2">' +
            '<img src="' + postImageUrl + '" class="img-fluid S" alt="">' +
                '<div class="mask flex-center">' +
                    '<ul class="flex-menu">' +
                        '<li><p class="white-text"><i class="fa fa-comment" aria-hidden="true"></i> ' + post.CommentsCount + '</p></li>' +
                        '<li><p class="white-text"><i class="fa fa-heart" aria-hidden="true"></i> ' + post.LikesCount + '</p></li>' +
                        '<li><p class="white-text"><i class="fa fa-archive" aria-hidden="true" data-post-id="' + post.PostID + '"></i></p></li>' +
                        '<li><p class="white-text"><i class="fa fa-trash" aria-hidden="true" data-post-id="' + post.PostID + '"></i></p></li>' +
                        '</ul>' +
                    '</div>' +
                '</div>' +
            '</div>';

        $('#userposts').append(postHTML);
                    });
                },
        error: function (xhr, status, error) {
            console.error('Error fetching user profile and posts:', error);
                }
            });
        }
   

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

            $('#ProfilePicturePreview').change(function () {
                var file = this.files[0];
                var reader = new FileReader();
                reader.onload = function (event) {
                    $('#ProfilePicturePreview1').attr('src', event.target.result);
                }
                reader.readAsDataURL(file);
            });




        // Open the modal when "Edit Profile" is clicked
        $(document).on("click", "#EditProfileBtn", function () {

            $('#EditProfileModal').modal('show');
        fetchdata();
            });

        // Function to fetch user data and populate form fields
        function fetchdata() {
                var loggedInUserId = localStorage.getItem('UserId');
        // Fetch user data and populate form
        $.ajax({
            url: '/api/post/GetUserProfileData',
        type: 'GET',
        data: {userId: loggedInUserId },
        success: function (data) {
            // Populate form fields with user data
            $('#username').val(data.Username);
        $('#email').val(data.Email);
        $('#fullusername').val(data.FullName);
        $('#bio').val(data.Bio);
        $('#website').val(data.Website);
        $('#gender').val(data.Gender);
        $('#dob').val(data.DateOfBirth);
        $('#phone').val(data.PhoneNumber);
        $('#ProfilePicturePreview1').attr('src', "/" + data.ProfilePictureURL);
                    },
        error: function (xhr, status, error) {
            console.error('Error fetching user data:', error);
                    }
                });
            }






        //////////
        //ARCHEVE
        /////
        $(document).on('click', '.fa-archive', function () {
                var $this = $(this);
        var PostId = $this.data('post-id');
        var UserId = localStorage.getItem('UserId');

        $.ajax({
            url: '/api/post/ArchivePost',
        method: 'POST',
        data: {PostID: PostId, UserID: UserId },
        success: function (response) {
                        if (response.success) {

        } else {
            console.log('Archive failed');
                        }
        $('#userposts').empty();
        var loggedInUserId = localStorage.getItem('UserId');
        $.ajax({
            url: '/api/post/GetUserProfileAndPosts',
        type: 'GET',
        data: {userId: loggedInUserId },
        success: function (response) {
                                var pic = response.UserProfile[0].ProfilePictureURL;
        var picc = "/" + pic;
        $('#ProfilePicture').attr('src', picc);
        $('#username').text(response.UserProfile[0].Username);
        $('#fullname').text(response.UserProfile[0].FullName);
        $('#postcount').text(response.UserProfile[0].PostCount);
        $('#followercount').text(response.UserProfile[0].FollowerCount);
        $('#followingcount').text(response.UserProfile[0].FollowingCount);


        response.UserPosts.forEach(function (post) {
                                    var postImageUrl = "/" + post.MediaURL;
        var postHTML = '<div class="col-sm-12 col-md-6 col-lg-4" data-post-id="' + post.PostID + '">' +
            '<div class="view overlay hm-black-light m-b-2">' +
                '<img src="' + postImageUrl + '" class="img-fluid S" alt="">' +
                    '<div class="mask flex-center">' +
                        '<ul class="flex-menu">' +
                            '<li><p class="white-text"><i class="fa fa-comment" aria-hidden="true"></i> ' + post.CommentsCount + '</p></li>' +
                            '<li><p class="white-text"><i class="fa fa-heart" aria-hidden="true"></i> ' + post.LikesCount + '</p></li>' +
                            '<li><p class="white-text"><i class="fa fa-archive" aria-hidden="true" data-post-id="' + post.PostID + '"></i></p></li>' +
                            '<li><p class="white-text"><i class="fa fa-trash" aria-hidden="true" data-post-id="' + post.PostID + '"></i></p></li>' +
                            '</ul>' +
                        '</div>' +
                    '</div>' +
                '</div>';


            $('#userposts').append(postHTML);
                                });
                            },
            error: function (xhr, status, error) {
                console.error('Error fetching user profile and posts:', error);
                            }
                        });
            $('#userposts').empty();
            var loggedInUserId = localStorage.getItem('UserId');
            $.ajax({
                url: '/api/post/GetUserProfileAndPosts',
            type: 'GET',
            data: {userId: loggedInUserId },
            success: function (response) {
                                var pic = response.UserProfile[0].ProfilePictureURL;
            var picc = "/" + pic;
            $('#ProfilePicture').attr('src', picc);
            $('#username').text(response.UserProfile[0].Username);
            $('#fullname').text(response.UserProfile[0].FullName);
            $('#postcount').text(response.UserProfile[0].PostCount);
            $('#followercount').text(response.UserProfile[0].FollowerCount);
            $('#followingcount').text(response.UserProfile[0].FollowingCount);


            response.UserPosts.forEach(function (post) {
                                    var postImageUrl = "/" + post.MediaURL;
            var postHTML = '<div class="col-sm-12 col-md-6 col-lg-4" data-post-id="' + post.PostID + '">' +
                '<div class="view overlay hm-black-light m-b-2">' +
                    '<img src="' + postImageUrl + '" class="img-fluid S" alt="">' +
                        '<div class="mask flex-center">' +
                            '<ul class="flex-menu">' +
                                '<li><p class="white-text"><i class="fa fa-comment" aria-hidden="true"></i> ' + post.CommentsCount + '</p></li>' +
                                '<li><p class="white-text"><i class="fa fa-heart" aria-hidden="true"></i> ' + post.LikesCount + '</p></li>' +
                                '<li><p class="white-text"><i class="fa fa-archive" aria-hidden="true" data-post-id="' + post.PostID + '"></i></p></li>' +
                                '<li><p class="white-text"><i class="fa fa-trash" aria-hidden="true" data-post-id="' + post.PostID + '"></i></p></li>' +
                                '</ul>' +
                            '</div>' +
                        '</div>' +
                    '</div>';


                $('#userposts').append(postHTML);
                                });
                            },
                error: function (xhr, status, error) {
                    console.error('Error fetching user profile and posts:', error);
                            }
                        });
                    },
                error: function (error) {
                    console.log(error);
                    }
                });
            });

                // Assuming this code is within a $(document).ready() function or equivalent
                $(document).on('click', '.fa-trash', function () {
                var postId = $(this).data('post-id');

                // Send AJAX request to delete the post
                $.ajax({
                    url: '/api/post/DeletePost', // Replace with the actual endpoint URL
                type: 'DELETE', // Assuming you're using HTTP DELETE method for deletion
                data: {PostID: postId }, // Send the PostID as data
                success: function (response) {
                    $('#userposts').empty();
                var loggedInUserId = localStorage.getItem('UserId');
                $.ajax({
                    url: '/api/post/GetUserProfileAndPosts',
                type: 'GET',
                data: {userId: loggedInUserId },
                success: function (response) {
                                var pic = response.UserProfile[0].ProfilePictureURL;
                var picc = "/" + pic;
                $('#ProfilePicture').attr('src', picc);
                $('#username').text(response.UserProfile[0].Username);
                $('#fullname').text(response.UserProfile[0].FullName);
                $('#postcount').text(response.UserProfile[0].PostCount);
                $('#followercount').text(response.UserProfile[0].FollowerCount);
                $('#followingcount').text(response.UserProfile[0].FollowingCount);


                response.UserPosts.forEach(function (post) {
                                    var postImageUrl = "/" + post.MediaURL;
                var postHTML = '<div class="col-sm-12 col-md-6 col-lg-4" data-post-id="' + post.PostID + '">' +
                    '<div class="view overlay hm-black-light m-b-2">' +
                        '<img src="' + postImageUrl + '" class="img-fluid S" alt="">' +
                            '<div class="mask flex-center">' +
                                '<ul class="flex-menu">' +
                                    '<li><p class="white-text"><i class="fa fa-comment" aria-hidden="true"></i> ' + post.CommentsCount + '</p></li>' +
                                    '<li><p class="white-text"><i class="fa fa-heart" aria-hidden="true"></i> ' + post.LikesCount + '</p></li>' +
                                    '<li><p class="white-text"><i class="fa fa-archive" aria-hidden="true" data-post-id="' + post.PostID + '"></i></p></li>' +
                                    '<li><p class="white-text"><i class="fa fa-trash" aria-hidden="true" data-post-id="' + post.PostID + '"></i></p></li>' +
                                    '</ul>' +
                                '</div>' +
                            '</div>' +
                        '</div>';


                    $('#userposts').append(postHTML);
                                });
                            },
                    error: function (xhr, status, error) {
                        console.error('Error fetching user profile and posts:', error);
                            }
                        });

                    },
                    error: function (xhr, status, error) {
                        // Handle error response
                        console.error('Error deleting post:', error);
                    }
                });
            });









        });
   
                    $(document).ready(function () {
                        // Function to validate and update input border color
                        function validateAndUpdateInput(inputElement, regex) {
                            var value = inputElement.val().trim();
                            var isValid = value === '' || regex.test(value);
                            inputElement.css('border-color', isValid ? 'green' : 'red');
                            return isValid;
                        }

            // Function to sanitize input to prevent HTML/JS injection
            function sanitizeInput(value) {
                return $('<div>').text(value).html();
            }

                        // Function to validate email format
                        function validateEmail() {
                var emailRegex = /^[^\s@@]+@@[^\s@@]+\.[^\s@@]+$/;
                        return validateAndUpdateInput($('#email'), emailRegex);
            }

                        // Function to validate full name format
                        function validateFullName() {
                var fullNameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/; // Allow only alphabets with one space
                        return validateAndUpdateInput($('#fullusername'), fullNameRegex);
            }

                        // Function to validate date of birth
                        function validateDateOfBirth() {
                var today = new Date();
                        var selectedDate = new Date($('#dob').val());
                        var isValid = $('#dob').val().trim() === '' || selectedDate <= today;
                        $('#dob').css('border-color', isValid ? 'green' : 'red');
                        return isValid;
            }

                        // Function to validate phone number format
                        function validatePhone() {
                var phoneRegex = /^\d{10}$/;
                        return validateAndUpdateInput($('#phone'), phoneRegex);
            }

                        // Function to validate website URL format
                        function validateWebsite() {
                var websiteRegex = /^(https?:\/\/)?([\w\d\-]+\.)+\w{2,}(\/.+)*\/?$/;
                        return validateAndUpdateInput($('#website'), websiteRegex);
            }

                        // Function to validate image upload
                        function validateImage() {
                var fileInput = $('#ProfilePicturePreview')[0];
                if (fileInput.files.length > 0) {
                    var file = fileInput.files[0];
                        var validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
                        var isValid = validImageTypes.includes(file.type);
                        $('#ProfilePicturePreview').css('border-color', isValid ? 'green' : 'red');
                        if (!isValid) {
                            Swal.fire('Please select a valid image file (JPEG, PNG, GIF).');
                        fileInput.value = ''; // Clear the input
                    }
                        return isValid;
                }
                        return true; // No file selected is valid
            }

                        // Function to validate all input fields
                        function validateForm() {
                var emailValid = validateEmail();
                        var fullNameValid = validateFullName();
                        var dobValid = validateDateOfBirth();
                        var phoneValid = validatePhone();
                        var websiteValid = validateWebsite();
                        var imageValid = validateImage();

                        return emailValid && fullNameValid && dobValid && phoneValid && websiteValid && imageValid;
            }

                        // Update input border color on input change
                        $('input').on('input', function () {
                var regex = /.*/; // Default regex to accept any input
                        switch ($(this).attr('id')) {
                    case 'email':
                        regex = /^[^\s@@]+@@[^\s@@]+\.[^\s@@]+$/;
                        break;
                        case 'fullusername':
                        regex = /^[a-zA-Z]+ [a-zA-Z]+$/;
                        break;
                        case 'phone':
                        regex = /^\d{10}$/;
                        break;
                        case 'website':
                        regex = /^(https?:\/\/)?([\w\d\-]+\.)+\w{2,}(\/.+)*\/?$/;
                        break;
                }
                        validateAndUpdateInput($(this), regex);
            });

                        // Handle form submission
                        $('#UpdateData').click(function (event) {
                            event.preventDefault(); // Prevent form submission

                        // Validate inputs
                        var allInputsValid = validateForm();

                        // Submit form if all inputs are valid
                        if (allInputsValid) {
                    // Your existing AJAX code for updating the user profile
                    var UserID = localStorage.getItem('UserId');
                        var email = sanitizeInput($('#email').val().trim());
                        var fullname = sanitizeInput($('#fullusername').val().trim());
                        var bio = sanitizeInput($('#bio').val().trim());
                        var website = sanitizeInput($('#website').val().trim());
                        var gender = $('#gender').val();
                        var dob = $('#dob').val().trim();
                        var phone = sanitizeInput($('#phone').val().trim());

                        var formData = new FormData();
                        formData.append('UserID', UserID);
                        formData.append('Email', email);
                        formData.append('FullName', fullname);
                        formData.append('Bio', bio);
                        formData.append('Website', website);
                        formData.append('Gender', gender);
                        formData.append('DateOfBirth', dob);
                        formData.append('PhoneNumber', phone);

                        var fileInput = $('#ProfilePicturePreview')[0];
                    if (fileInput.files.length > 0) {
                            formData.append('ProfilePicture', fileInput.files[0]);
                    }

                        $.ajax({
                            url: '/api/post/UpdateUserProfile',
                        type: 'POST',
                        data: formData,
                        contentType: false,
                        processData: false,
                        success: function (response) {
                            $('#EditProfileModal').modal('hide');
                        $('#userposts').empty();
                        var loggedInUserId = localStorage.getItem('UserId');
                        $.ajax({
                            url: '/api/post/GetUserProfileAndPosts',
                        type: 'GET',
                        data: {userId: loggedInUserId },
                        success: function (response) {
                                    var pic = response.UserProfile[0].ProfilePictureURL;
                        var picc = "/" + pic;
                        $('#ProfilePicture').attr('src', picc);
                        $('#username').text(response.UserProfile[0].Username);
                        $('#fullname').text(response.UserProfile[0].FullName);
                        $('#postcount').text(response.UserProfile[0].PostCount);
                        $('#followercount').text(response.UserProfile[0].FollowerCount);
                        $('#followingcount').text(response.UserProfile[0].FollowingCount);


                        response.UserPosts.forEach(function (post) {
                                        var postImageUrl = "/" + post.MediaURL;
                        var postHTML = '<div class="col-sm-12 col-md-6 col-lg-4" data-post-id="' + post.PostID + '">' +
                            '<div class="view overlay hm-black-light m-b-2">' +
                                '<img src="' + postImageUrl + '" class="img-fluid S" alt="">' +
                                    '<div class="mask flex-center">' +
                                        '<ul class="flex-menu">' +
                                            '<li><p class="white-text"><i class="fa fa-comment" aria-hidden="true"></i> ' + post.CommentsCount + '</p></li>' +
                                            '<li><p class="white-text"><i class="fa fa-heart" aria-hidden="true"></i> ' + post.LikesCount + '</p></li>' +
                                            '<li><p class="white-text"><i class="fa fa-archive" aria-hidden="true" data-post-id="' + post.PostID + '"></i></p></li>' +
                                            '<li><p class="white-text"><i class="fa fa-trash" aria-hidden="true" data-post-id="' + post.PostID + '"></i></p></li>' +
                                            '</ul>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>';


                            $('#userposts').append(postHTML);
                                    });
                                },
                            error: function (xhr, status, error) {
                                console.error('Error fetching user profile and posts:', error);
                                }
                            });
                        },
                            error: function (xhr, status, error) {
                                // Handle error response
                                console.error('Error updating user profile:', error);
                        }
                    });
                } else {
                                // Display error message or take any other action as needed
                                Swal.fire('Please fill in all required fields correctly.');
                }
            });
        });

