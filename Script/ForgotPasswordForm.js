$(document).ready(function () {
    var token = getParameterByName('token');
    if (token) {
        // AJAX call to check token expiration
        $.ajax({
            url: '/api/DefaultApi/CheckTokenExpiration',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ token: token }),
            success: function (response) {
                sessionStorage.setItem('token', token);

                if (response.isExpired) {
                    window.location.href = '/Home/ForgotPasswordExpired';
                    //Swal.fire('Password reset link has Used Or expired.');
                }


            },
            error: function (xhr, status, error) {
                // Handle AJAX error
                console.error('Failed to check token:', error);
                Swal.fire('Failed to check token: ' + error);
            }
        });
    }
});

// Event handler for submit button click
//$('#submitButton').on('click', function () {
//    var token = sessionStorage.getItem('token');
//    var newPassword = $('#password').val();
//    var requestData = {
//        Token: token,
//        NewPassword: newPassword
//    };

//    // AJAX call to reset password
//    $.ajax({
//        url: '/api/DefaultApi/ResetPasswordByEmail',
//        method: 'POST',
//        contentType: 'application/json',
//        data: JSON.stringify(requestData),
//        success: function (response) {

//            if (response.result == 0) {
//                // Password update successful
//                Swal.fire('Password updated successfully. You can now log in with your new password.');
//                // Redirect the user to the login page or any other appropriate page
//                window.location.href = '/Home/LogIn';
//                sessionStorage.clear();
//            } else if (response.result === 1) {
//                // Invalid token or email
//                Swal.fire('Invalid token or email.');
//            } else if (response.result === 2) {
//                // Invalid token
//                Swal.fire('Invalid token.');
//            } else if (response.result == 3) {
//                // Password matches one of the last three passwords
//                Swal.fire('You cannot reuse any of your last three passwords.');
//            } else if (response == 3) {
//                // Password matches one of the last three passwords
//                Swal.fire('You cannot reuse any of your last three passwords.');
//            } else {
//                // Handle other possible response codes or errors
//                Swal.fire('An error occurred while updating the password.');
//            }
//        },
//        error: function (xhr, status, error) {
//            // Handle error response here
//            Swal.fire('Failed to update password. Please try again later.');
//        }
//    });
//});

$('#submitButton').on('click', function () {
    var token = sessionStorage.getItem('token');
    var newPassword = $('#password').val();
    var requestData = {
        Token: token,
        NewPassword: newPassword
    };

    // AJAX call to reset password
    $.ajax({
        url: '/api/DefaultApi/ResetPasswordByEmail',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        success: function (response) {
            // Check the response object properties
            if (response.success) {
                // Password update successful
                Swal.fire('Password updated successfully. You can now log in with your new password.');
                // Redirect the user to the login page or any other appropriate page
                window.location.href = '/Home/LogIn';
                sessionStorage.clear();
            } else {
                // Display error message from the response
                Swal.fire(response.ErrorMessage || 'An error occurred while updating the password.');
            }
        },
        error: function (xhr, status, error) {
            // Handle error response here
            Swal.fire('Failed to update password. Please try again later.');
        }
    });
});


// Function to extract query parameter from URL
function getParameterByName(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}