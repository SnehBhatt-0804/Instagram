
    $(document).ready(function () {
        function usernameRegex(value) {
            return /^[a-zA-Z0-9_\.]+$/.test(value);
        }

            $('#loginForm').on('submit', function (event) {
        event.preventDefault();

    var username = $('#loginUsername').val().trim();
    var password = $('#loginPassword').val().trim();

    if (!username) {
        Swal.fire("Please Enter Your Username..");
    return;
                }
    if (username.length < 3) {
        Swal.fire("Username must be at least 3 characters long");
    return;
                }
    if (!usernameRegex(username)) {
        Swal.fire("Username must contain only letters, numbers, underscores, and dots");
    return;
                }
    if (!password) {
        Swal.fire("Please enter your password");
    return;
                }
    if (password.length < 6) {
        Swal.fire("Password must be at least 6 characters long");
    return;
                }

    $.ajax({
        type: 'POST',
    url: '/Home/LogIn',
    contentType: 'application/json',
    data: JSON.stringify({username: username, password: password }),
    success: function (response) {
                        if (!response.Verified) {
        Swal.fire({
            title: "Account Not Verified",
            text: "Your account is not verified. Please verify your account.",
            icon: "warning",
            confirmButtonText: "OK"
        }).then(() => {
            window.location.href = '/Home/VerifyAccount'; // Redirect to verification page
        });
                        } else {
        localStorage.setItem('UserId', response.UserId);
    localStorage.setItem('Username', response.Username);

    Swal.fire({
        position: "center",
    icon: "success",
    title: "Logged In",
    showConfirmButton: false,
    timer: 1500,
                                willClose: () => {
        window.location.href = '/Home/Index';
                                }
                            });
                        }
                    },
    error: function (xhr, status, error) {
        Swal.fire("Username OR Password Is Wrong..");
    console.error(xhr.responseText);
                    }
                });
            });
        });
