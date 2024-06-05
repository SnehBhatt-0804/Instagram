
                
                   
    //                    // Function to validate and update input border color
    //                    function validateAndUpdateInput(inputElement, regex) {
    //                        var value = inputElement.val().trim();
    //                        var isValid = value === '' || regex.test(value); // Allow empty values
    //                        inputElement.css('border-color', isValid ? 'green' : 'red');
    //                        return isValid;
    //                    }

    //// Function to validate full name format
    //function validateFullName() {
    //    var fullNameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/; // Allow only alphabets with one space
    //                return validateAndUpdateInput($('#fullusername'), fullNameRegex);
    //}

    //                // Function to validate date of birth
    //                function validateDateOfBirth() {
    //    var value = $('#dob').val().trim();
    //                if (value === '') {
    //                    $('#dob').css('border-color', 'green');
    //                return true; // Allow empty value
    //    }
    //                var today = new Date();
    //                var selectedDate = new Date(value);
    //                var isValid = selectedDate <= today;
    //                $('#dob').css('border-color', isValid ? 'green' : 'red');
    //                return isValid;
    //}

    //                // Function to validate email format
    //                function validateEmail() {
    //    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //                return validateAndUpdateInput($('#email'), emailRegex);
    //}

    //                // Function to validate phone number
    //                function validatePhone() {
    //    var phoneRegex = /^\d{10}$/;
    //                return validateAndUpdateInput($('#phone'), phoneRegex);
    //}

    //                // Function to validate all input fields
    //                function validateForm() {
    //    var emailValid = validateEmail();
    //                var fullNameValid = validateFullName();
    //                var dobValid = validateDateOfBirth();
    //                var phoneValid = validatePhone();

    //                return emailValid && fullNameValid && dobValid && phoneValid;
    //}

    //                // Update input border color on input change
    //                $('#email').on('input', validateEmail);
    //                $('#fullusername').on('input', validateFullName);
    //                $('#dob').on('input', validateDateOfBirth);
    //                $('#phone').on('input', validatePhone);

    //                // Handle form submission
    //                $('#UpdateData').click(function (event) {
    //                    event.preventDefault(); // Prevent form submission

    //                // Validate inputs
    //                var allInputsValid = validateForm();

    //                // Submit form if all inputs are valid
    //                if (allInputsValid) {
    //        // Your existing AJAX code for updating the user profile
    //        var UserID = localStorage.getItem('UserId');
    //                var email = $('#email').val();
    //                var fullname = $('#fullusername').val();
    //                var bio = $('#bio').val();
    //                var website = $('#website').val();
    //                var gender = $('#gender').val();
    //                var dob = $('#dob').val();
    //                var phone = $('#phone').val();

    //                var formData = new FormData();
    //                formData.append('UserID', UserID);
    //                formData.append('Email', email);
    //                formData.append('FullName', fullname);
    //                formData.append('Bio', bio);
    //                formData.append('Website', website);
    //                formData.append('Gender', gender);
    //                formData.append('DateOfBirth', dob);
    //                formData.append('PhoneNumber', phone);

    //                var fileInput = $('#ProfilePicturePreview')[0];
    //        if (fileInput.files.length > 0) {
    //                    formData.append('ProfilePicture', fileInput.files[0]);
    //        }

    //                $.ajax({
    //                    url: '/api/post/UpdateUserProfile',
    //                type: 'POST',
    //                data: formData,
    //                contentType: false,
    //                processData: false,
    //                success: function (response) {
    //                    alert('User profile updated successfully!');
    //            },
    //                error: function (xhr, status, error) {
    //                    console.error('Error updating user profile:', error);
    //                alert('An error occurred while updating the profile. Please try again later.');
    //            }
    //        });
    //    } else {
    //                    alert('Please fill in all required fields correctly.');
    //    }
    //});

 
        $(document).ready(function() {
            // Function to validate and update input border color
            function validateAndUpdateInput(inputElement, regex) {
                var value = inputElement.val().trim();
                var isValid = value === '' || regex.test(value); // Allow empty values
                inputElement.css('border-color', isValid ? 'green' : 'red');
                return isValid;
            }

            // Function to validate full name format
            function validateFullName() {
                var fullNameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/; // Allow only alphabets with one space
                return validateAndUpdateInput($('#fullusername'), fullNameRegex);
            }

            // Function to validate date of birth
            function validateDateOfBirth() {
                var value = $('#dob').val().trim();
                if (value === '') {
                    $('#dob').css('border-color', 'green');
                    return true; // Allow empty value
                }
                var today = new Date();
                var selectedDate = new Date(value);
                var isValid = selectedDate <= today;
                $('#dob').css('border-color', isValid ? 'green' : 'red');
                return isValid;
            }

            // Function to validate email format
            function validateEmail() {
                var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return validateAndUpdateInput($('#email'), emailRegex);
            }

            // Function to validate phone number
            function validatePhone() {
                var phoneRegex = /^\d{10}$/;
                return validateAndUpdateInput($('#phone'), phoneRegex);
            }

            // Function to validate image file
            function validateImage() {
                var fileInput = $('#ProfilePicturePreview')[0];
                if (fileInput.files.length === 0) {
                    return true; // No file selected, validation passed
                }
                var allowedExtensions = ['jpg', 'jpeg', 'png']; // Add more extensions if needed
                var fileName = fileInput.files[0].name;
                var fileExtension = fileName.split('.').pop().toLowerCase();
                if (allowedExtensions.indexOf(fileExtension) === -1) {
                    $('#ProfilePicturePreview').css('border-color', 'red');
                    return false; // Invalid file type
                }
                $('#ProfilePicturePreview').css('border-color', 'green');
                return true; // Valid image file
            }

            // Function to validate all input fields
            function validateForm() {
                var emailValid = validateEmail();
                var fullNameValid = validateFullName();
                var dobValid = validateDateOfBirth();
                var phoneValid = validatePhone();
                var imageValid = validateImage();

                return emailValid && fullNameValid && dobValid && phoneValid && imageValid;
            }

            // Update input border color on input change
            $('#email, #fullusername, #dob, #phone, #ProfilePicturePreview').on('input', function() {
                validateForm();
            });

            // Handle form submission
            $('#profileUpdateForm').submit(function(event) {
                event.preventDefault(); // Prevent form submission

                // Validate inputs
                var allInputsValid = validateForm();

                // Submit form if all inputs are valid
                if (allInputsValid) {
                    // Your existing AJAX code for updating the user profile
                    var UserID = localStorage.getItem('UserId');
                    var email = $('#email').val();
                    var fullname = $('#fullusername').val();
                    var bio = $('#bio').val();
                    var website = $('#website').val();
                    var gender = $('#gender').val();
                    var dob = $('#dob').val();
                    var phone = $('#phone').val();

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
                        success: function(response) {
                            Swal.fire('User profile updated successfully!');
                        },
                        error: function(xhr, status, error) {
                            console.error('Error updating user profile:', error);
                            Swal.fire('An error occurred while updating the profile. Please try again later.');
                        }
                    });
                } else {
                    Swal.fire('Please fill in all required fields correctly.');
                }
            });
        });
    