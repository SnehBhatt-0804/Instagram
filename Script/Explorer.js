function FetchPostDataAndAppend() {
    $.ajax({
        url: '/api/post/GetAllPostsExplorer',
        type: 'GET',
        success: function (response) {
            response.forEach(function (post) {
                var postImageUrl = "/" + post.MediaURL;
                var postHTML = '<div class="col-sm-12 col-md-6 col-lg-4">' +
                    '<div class="view overlay hm-black-light m-b-2">' +
                    '<img src="' + postImageUrl + '" class="img-fluid S" alt="">' +
                    '<div class="mask flex-center">' +
                    '<ul class="flex-menu">' +
                    '<li><p class="white-text"><i class="fa fa-comment" aria-hidden="true"></i> ' + post.CommentsCount + '</p></li>' +
                    '<li><p class="white-text"><i class="fa fa-heart" aria-hidden="true"></i> ' + post.LikesCount + '</p></li>' +
                    '</ul>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                $('#userposts').prepend(postHTML);
            });
        },
        error: function (xhr, status, error) {
            console.error('Error fetching data:', error);
        }
    });
}

// Call FetchPostDataAndAppend() function on page load
$(document).ready(function () {
    FetchPostDataAndAppend();
});

$(document).on("click", ".col-sm-12.col-md-6.col-lg-4", function () {
    const imageUrl = $(this).find(".view.overlay .img-fluid.S").attr("src");
    if (!imageUrl) return;
    const encodedImageUrl = encodeURI(imageUrl);
    $('#imageContainer').html('<img src="' + encodedImageUrl + '" alt="" style="height:400px;width:400px;"/>');
    $("#overlay").addClass("active");
});

// Event handler for clicking on the overlay or close button
$(document).on("click", "#overlay, #closeButton", function () {
    $("#overlay").removeClass("active");
});