
    $(document).ready(function () {
        $('#otpForm').on('submit', function (event) {
            event.preventDefault();
            otpbtn();
        });
        });

    function otpbtn() {
            var otp = $('#otp1').val() + $('#otp2').val() + $('#otp3').val() + $('#otp4').val();
    var email = getParameterByName('email');

    $.ajax({
        type: 'POST',
    url: '/api/DefaultApi/VerifyOTP',
    contentType: 'application/json',
    data: JSON.stringify({Email: email, OTP: otp }),
    success: function (data) {
                    if (data.isMatched) {
        Swal.fire({
            title: 'Success',
            text: 'OTP verified successfully.',
            icon: 'success'
        }).then(() => {
            window.location.href = '/Home/LogIn';
        });
                    } else {
        Swal.fire({
            title: 'Error',
            text: data.message || 'Invalid OTP. Please try again.',
            icon: 'error'
        });
                    }
                },
    error: function (xhr, status, error) {
        console.error(xhr.responseText);
    Swal.fire({
        title: 'Error',
    text: 'OTP verification failed. Please try again.',
    icon: 'error'
                    });
                }
            });
        }

    function getParameterByName(name) {
            var url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    var results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
        }
