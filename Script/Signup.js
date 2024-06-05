
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
                var emailRegex = /^[^\s@@]+@@[^\s@@]+\.[^\s@@]+$/;
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
    data: JSON.stringify({Username: username }),
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
