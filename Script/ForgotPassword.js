$('#resetPasswordBtn').on('click', function () {
    var userId = localStorage.getItem('UserId');

    var email = $('#email').val();
    var requestData = {
        Email: email,
        UserId: userId
    };


    $.ajax({
        url: '/api/DefaultApi/ForgotPassword',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(requestData),

        success: function (response) {
            alert('Password reset email sent successfully');
            // Handle success response here, e.g., display a success message to the user
        },
        error: function (xhr, status, error) {
            console.error('Failed to send password reset email:', error);
            // Handle error response here, e.g., show an error message to the user
        }
    });
});