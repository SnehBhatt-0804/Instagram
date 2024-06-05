$(document).ready(function () {
    var userId = localStorage.getItem('UserId');
    $.ajax({
        url: '/api/post/GetUserArchievedPosts?userId=' + userId,
        type: 'GET',
        success: function (response) {

            response.UserPosts.forEach(function (post) {
                var postImageUrl = "/" + post.MediaURL;
                var postHTML = '<div class="col-sm-12 col-md-6 col-lg-4" data-post-id="' + post.PostID + '">' +
                    '<div class="view overlay hm-black-light m-b-2">' +
                    '<img src="' + postImageUrl + '" class="img-fluid S" alt="">' +
                    '<div class="mask flex-center">' +
                    '<ul class="flex-menu">' +
                    //'<li><p class="white-text"><i class="fa fa-comment" aria-hidden="true"></i> ' + post.CommentsCount + '</p></li>' +
                    //'<li><p class="white-text"><i class="fa fa-heart" aria-hidden="true"></i> ' + post.LikesCount + '</p></li>' +

                    '<li><p class="white-text"><i class="fa fa-share-square-o" aria-hidden="true" data-post-id="' + post.PostID + '"></i></p></li>' +
                    '<li><p class="white-text"><i class="fa fa-trash" aria-hidden="true"></i></p></li>' +
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
});



$(document).on('click', '.fa-share-square-o', function () {
    var $this = $(this);
    var PostId = $this.data('post-id');
    var UserId = localStorage.getItem('UserId');

    $.ajax({
        url: '/api/post/UnArchivePost',
        method: 'POST',
        data: { PostID: PostId, UserID: UserId },
        success: function (response) {
            if (response.success) {

            } else {
                console.log('Archive failed');
            }
            $('#userposts').empty();
            var userId = localStorage.getItem('UserId');
            $.ajax({
                url: '/api/post/GetUserArchievedPosts?userId=' + userId,
                type: 'GET',
                success: function (response) {

                    response.UserPosts.forEach(function (post) {
                        var postImageUrl = "/" + post.MediaURL;
                        var postHTML = '<div class="col-sm-12 col-md-6 col-lg-4" data-post-id="' + post.PostID + '">' +
                            '<div class="view overlay hm-black-light m-b-2">' +
                            '<img src="' + postImageUrl + '" class="img-fluid S" alt="">' +
                            '<div class="mask flex-center">' +
                            '<ul class="flex-menu">' +
                            //'<li><p class="white-text"><i class="fa fa-comment" aria-hidden="true"></i> ' + post.CommentsCount + '</p></li>' +
                            //'<li><p class="white-text"><i class="fa fa-heart" aria-hidden="true"></i> ' + post.LikesCount + '</p></li>' +

                            '<li><p class="white-text"><i class="fa fa-share-square-o" aria-hidden="true" data-post-id="' + post.PostID + '"></i></p></li>' +
                            '<li><p class="white-text"><i class="fa fa-trash" aria-hidden="true"></i></p></li>' +
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