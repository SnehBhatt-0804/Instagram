
    $('#resetPasswordBtn').on('click', function () {
            var userId = localStorage.getItem('UserId');

    var email = $('#email').val();
    var requestData = {
        Email: email,
    UserId: userId
            };


    $.ajax({
        url: '/api/DefaultApi/OtpVerify',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(requestData),

    success: function (response) {
        Swal.fire({
            title: 'Success',
            text: 'OTP Send successfully.',
            icon: 'success'
        }).then(() => {
            window.location.href = '/Home/OtpPage?email=' + encodeURIComponent(email);
        });
                },
    error: function (xhr, status, error) {
        Swal.fire('Failed OTP :', error);
                    // Handle error response here, e.g., show an error message to the user
                }
            });
        });
