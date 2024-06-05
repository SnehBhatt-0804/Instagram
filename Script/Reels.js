
    $(document).ready(function () {
        $('#postReelLink').on('click', function (event) {
            event.preventDefault();
            $('#postReelPopup').fadeIn();
        });

    $('#closePopup').on('click', function () {
        $('#postReelPopup').fadeOut();
            });

    $('#reelVideoInput').on('change', function () {
                const file = this.files[0];
    if (file) {
                    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!validVideoTypes.includes(file.type)) {
        Swal.fire('Please select a valid video file (MP4, WebM, Ogg).');
    $('#reelVideoInput').val('');  // Clear the input
    return;
                    }

    const reader = new FileReader();
    reader.onload = function (e) {
        $('#selectedVideoPreview').html(`<video controls src="${e.target.result}" alt="Selected Video"></video>`);
                    }
    reader.readAsDataURL(file);
                }
            });

    $(window).on('click', function (event) {
                if ($(event.target).is('#postReelPopup')) {
        $('#postReelPopup').fadeOut();
                }
            });

    $('#shareButton').on('click', async function (event) {
        event.preventDefault();

    const videoFile = $('#reelVideoInput')[0].files[0];
    const userId = localStorage.getItem('UserId');
    let caption = $('#captionInput').val();

    if (!videoFile) {
        Swal.fire('Please select a video to upload.');
    return;
                }

    if (!userId) {
        Swal.fire('User not logged in. Please log in to upload the reel.');
    return;
                }

    // Sanitize caption to prevent HTML/JS injection
    if (caption) {
        caption = $('<div>').text(caption).html();
                }

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('userId', userId);
    formData.append('caption', caption);

    uploadFormData(formData);
            });

    function uploadFormData(formData) {
        $.ajax({
            url: '/api/DefaultApi/CreateReel',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                Swal.fire('Reel posted successfully!');
                $('#postReelPopup').fadeOut();
                $('#reelVideoInput').val('');
                $('#captionInput').val('');
                $('#selectedVideoPreview').empty();
                fetchAndAppendReels();
            },
            error: function (error) {
                Swal.fire('Failed to post reel. Please try again.');
            }
        });
            }


        });


    $(document).ready(function () {
        fetchAndAppendReels();
        });
    // Function to fetch and append reels
    function fetchAndAppendReels() {
        $.ajax({
            url: '/api/post/GetAllReels', // Assuming this is your API endpoint to fetch all reels
            type: 'GET',
            dataType: 'json',
            success: function (response) {

                // Clear existing reels
                $('#reelsContainer').empty();



                $.each(response, function (index, reel) {
                    var likesCount = reel.LikesCount;
                    // Construct HTML for each reel
                    var reelHtml = '<section>' +
                        '<div class="reel__container">' +
                        '<video autoplay muted loop class="reel__background-video">' +
                        '<source src="/' + reel.MediaURL + '" type="video/mp4">' +
                        'Your browser does not support the video tag.' +
                        '</video>' +
                        '<div class="reel__title">' +
                        '<div class="reel__back-button">' +
                        //'<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-narrow-left" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
                        //'<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>' +
                        //'<line x1="5" y1="12" x2="19" y2="12"></line>' +
                        //'<line x1="5" y1="12" x2="9" y2="16"></line>' +
                        //'<line x1="5" y1="12" x2="9" y2="8"></line>' +
                        //'</svg>' +
                        '<p>Reels</p>' +
                        '</div>' +
                        //'<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-camera" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
                        //'<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>' +
                        //'<path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2"></path>' +
                        //'<circle cx="12" cy="13" r="3"></circle>' +
                        //'</svg>' +
                        '</div>' +
                        '<div class="reel__content">' +
                        '<div class="reel__desc">' +
                        '<div class="reel__user">' +
                        '<img src="/' + reel.ProfilePictureURL + '" class="reel__avatar"/>' +
                        '<p class="reel__username">' + reel.Username + '</p>' +
                        /*'<button>Follow</button>' +*/
                        '</div>' +
                        '<p class="reel__caption">Caption : &nbsp;' + reel.Caption + '</p>' +
                        //'<p class="reel__audio">' +
                        //'<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-tallymark-3" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
                        //'<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>' +
                        //'<line x1="8" y1="7" x2="8" y2="17"></line>' +
                        //'<line x1="12" y1="5" x2="12" y2="19"></line>' +
                        //'<line x1="16" y1="7" x2="16" y2="17"></line>' +
                        //'</svg>' +
                        //'AJR • The Good Part' +
                        //'</p>' +
                        '</div>' +
                        '<div class="reel__options">' +
                        '<svg xmlns="http://www.w3.org/2000/svg" class="like-reel icon icon-tabler icon-tabler-heart" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" data-reel-id="' + reel.ReelId + '">' +
                        '<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>' +
                        '<path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path>' +
                        '</svg>' +

                        /*'<span class="like-count" style="font-style:bold;">' + likesCount + ' Likes' + '</span>' +*/
                        '<p class="reel__likes" style="font-style:bold;" >' + likesCount + ' Likes' + '</p>' +
                        /*'<p class="reel__likes">' + reel.LikesCount + '</p>' +*/
                        //'<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-message-circle" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
                        //'<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>' +
                        //'<path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1"></path>' +
                        //'</svg>' +
                        //'<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-send" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
                        //'<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>' +
                        //'<line x1="10" y1="14" x2="21" y2="3"></line>' +
                        //'<path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5"></path>' +
                        //'</svg>' +
                        //'<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-dots-vertical" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
                        //'<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>' +
                        //'<circle cx="12" cy="12" r="1"></circle>' +
                        //'<circle cx="12" cy="19" r="1"></circle>' +
                        //'<circle cx="12" cy="5" r="1"></circle>' +
                        //'</svg>' +
                        //'<img src="' + reel.AudioCoverUrl + '" class="reel__audio-cover"/>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</section><br>';

                    // Append the constructed HTML block to the container
                    $('#reelsContainer').prepend(reelHtml);
                });
            },
            error: function (xhr, status, error) {
                console.error('Error fetching reels:', error);
                $('#reelsContainer').empty().append('<p>Error fetching reels. Please try again later.</p>');
            }
        });
        }

    $(document).on('click', '.like-reel', function () {
            var $this = $(this);
    var ReelId = $this.data('reel-id');
    var UserId = localStorage.getItem('UserId');
    $.ajax({
        url: '/api/post/LikeReel',
    method: 'POST',
    data: {ReelID: ReelId, UserID: UserId },
    success: function (data) {
        fetchAndAppendReels();
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
