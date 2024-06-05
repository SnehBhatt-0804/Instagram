using SMWebApplication.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace SMWebApplication.Controllers
{
    public class postController : ApiController
    {
        private string connectionString = ConfigurationManager.ConnectionStrings["MyConnectionString"].ConnectionString;

        [HttpPost]
        [Route("api/post/CreatePost")]
        public IHttpActionResult CreatePost()
        {
            try
            {
                var httpRequest = HttpContext.Current.Request;

                // Get userId and caption from form data
                int userId = int.Parse(httpRequest.Form["userId"]);
                string caption = httpRequest.Form["caption"];

                var imageFiles = httpRequest.Files;

                if (imageFiles.Count < 1)
                {
                    return BadRequest("No image file found.");
                }

                List<string> imagePaths = new List<string>();
                foreach (string fileName in imageFiles)
                {
                    HttpPostedFile postedFile = imageFiles[fileName];
                    string imagePath = SaveImage(postedFile);
                    imagePaths.Add(imagePath);
                }

                string mediaType = "image";
                string location = "Unknown";
                DateTime postCreationTimestamp = DateTime.Now;
                string postStatus = "published";
                int likesCount = 0;
                int commentsCount = 0;
                int sharesCount = 0;
                string visibility = "public";

                foreach (string imagePath in imagePaths)
                {
                    SavePostToDatabase(userId, caption, mediaType, imagePath, location, postCreationTimestamp, postStatus, likesCount, commentsCount, sharesCount, visibility);
                }

                return Ok("Post created successfully.");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        private string SaveImage(HttpPostedFile postedFile)
        {
            try
            {
                // Save the file to a folder on the server
                var fileName = Path.GetFileName(postedFile.FileName);
                var folderName = "Uploads";
                var relativeFilePath = Path.Combine(folderName, fileName);
                var absoluteFilePath = HttpContext.Current.Server.MapPath("~/" + relativeFilePath);
                postedFile.SaveAs(absoluteFilePath);
                return relativeFilePath;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to save image file.", ex);
            }
        }

        private void SavePostToDatabase(int userId, string caption, string mediaType, string imagePath, string location, DateTime postCreationTimestamp, string postStatus, int likesCount, int commentsCount, int sharesCount, string visibility)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    var command = new SqlCommand("InsertPost", connection);
                    command.CommandType = CommandType.StoredProcedure;

                    // Add parameters
                    command.Parameters.AddWithValue("@UserId", userId);
                    command.Parameters.AddWithValue("@Caption", caption);
                    command.Parameters.AddWithValue("@MediaType", mediaType);
                    command.Parameters.AddWithValue("@MediaURL", imagePath);
                    command.Parameters.AddWithValue("@Location", location);
                    command.Parameters.AddWithValue("@PostCreationTimestamp", postCreationTimestamp);
                    command.Parameters.AddWithValue("@PostStatus", postStatus);
                    command.Parameters.AddWithValue("@LikesCount", likesCount);
                    command.Parameters.AddWithValue("@CommentsCount", commentsCount);
                    command.Parameters.AddWithValue("@SharesCount", sharesCount);
                    command.Parameters.AddWithValue("@Visibility", visibility);

                    connection.Open();
                    command.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to save post to database.", ex);
            }
        }

        [HttpGet]
        [Route("api/post/GetLastStoredImage")]
        public IHttpActionResult GetLastStoredImage()
        {
            
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("GetLastStoredImage", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var imageUrl = reader["PostImageUrl"].ToString();
                            var userProfileImageUrl = reader["UserProfileImageUrl"].ToString();
                            var username = reader["Username"].ToString();
                            var likesCount = (int)reader["LikesCount"];
                            var commentsCount = (int)reader["CommentsCount"];
                            var timestamp = (DateTime)reader["Timestamp"];

                            var responseData = new
                            {
                                PostImageUrl = imageUrl,
                                UserProfileImageUrl = userProfileImageUrl,
                                Username = username,
                                LikesCount = likesCount,
                                CommentsCount = commentsCount,
                                Timestamp = timestamp
                            };

                            return Ok(responseData);
                        }
                        else
                        {
                            return NotFound();
                        }
                    }
                }
            }
        }

        // GET api/post
        [HttpGet]
        [Route("api/post/GetAllPosts")]
        public IHttpActionResult GetAllPosts(int userId)
        {
            List<Post> posts = new List<Post>();

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    using (SqlCommand command = new SqlCommand("GetAllPosts", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@YourUserID", userId);
                        connection.Open();

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                Post post = new Post
                                {
                                    Username = reader["UserName"].ToString(),
                                    PostID = Convert.ToInt32(reader["PostID"]),
                                    UserID = Convert.ToInt32(reader["UserID"]),
                                    Caption = reader["Caption"].ToString(),
                                    MediaType = reader["MediaType"].ToString(),
                                    MediaURL = reader["MediaURL"].ToString(),
                                    ProfilePictureURL = reader["ProfilePictureURL"].ToString(),
                                    Location = reader["Location"].ToString(),
                                    PostCreationTimestamp = Convert.ToDateTime(reader["PostCreationTimestamp"]),
                                    PostStatus = reader["PostStatus"].ToString(),
                                    LikesCount = Convert.ToInt32(reader["LikesCount"]),
                                    CommentsCount = Convert.ToInt32(reader["CommentsCount"]),
                                    SharesCount = Convert.ToInt32(reader["SharesCount"]),
                                    Visibility = reader["Visibility"].ToString()
                                };

                                posts.Add(post);
                            }
                        }
                    }
                }

                return Ok(posts);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("api/post/GetAllPostsExplorer")]
        public IHttpActionResult GetAllPostsExplorer()
        {
            List<Post> posts = new List<Post>();

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    using (SqlCommand command = new SqlCommand("GetAllPostsExplorer", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        
                        connection.Open();

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                Post post = new Post
                                {
                                    Username = reader["UserName"].ToString(),
                                    PostID = Convert.ToInt32(reader["PostID"]),
                                    UserID = Convert.ToInt32(reader["UserID"]),
                                    Caption = reader["Caption"].ToString(),
                                    MediaType = reader["MediaType"].ToString(),
                                    MediaURL = reader["MediaURL"].ToString(),
                                    ProfilePictureURL = reader["ProfilePictureURL"].ToString(),
                                    Location = reader["Location"].ToString(),
                                    PostCreationTimestamp = Convert.ToDateTime(reader["PostCreationTimestamp"]),
                                    PostStatus = reader["PostStatus"].ToString(),
                                    LikesCount = Convert.ToInt32(reader["LikesCount"]),
                                    CommentsCount = Convert.ToInt32(reader["CommentsCount"]),
                                    SharesCount = Convert.ToInt32(reader["SharesCount"]),
                                    Visibility = reader["Visibility"].ToString()
                                };

                                posts.Add(post);
                            }
                        }
                    }
                }

                return Ok(posts);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }








        [HttpGet]
        [Route("api/post/GetUserProfileAndPosts")]
        public IHttpActionResult GetUserProfileAndPosts(int userId)
        {
           
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("GetUserProfileAndPosts", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    // Add parameters
                    command.Parameters.AddWithValue("@UserId", userId);

                    // Create datasets to hold results
                    DataSet dataSet = new DataSet();

                    // Open connection
                    connection.Open();

                    // Execute command and fill datasets
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);

                    // Convert datasets to JSON
                    var userProfile = dataSet.Tables[0];
                    var userPosts = dataSet.Tables[1];

                    // Create an anonymous object to hold both user profile and posts data
                    var userData = new
                    {
                        UserProfile = userProfile,
                        UserPosts = userPosts
                    };

                    // Return JSON data
                    return Ok(userData);
                }
            }
        }


        [HttpGet]
        [Route("api/post/GetUserProfileData")]
        public HttpResponseMessage GetUserProfileData(int UserID)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    using (SqlCommand command = new SqlCommand("GetUserProfileViewData", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@UserID", UserID);
                        connection.Open();

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                var userProfileData = new
                                {
                                    Username = reader["Username"].ToString(),
                                    Email = reader["Email"].ToString(),
                                    FullName = reader["FullName"].ToString(),
                                    Bio = reader["Bio"].ToString(),
                                    Website = reader["Website"].ToString(),
                                    Gender = reader["Gender"].ToString(),
                                    DateOfBirth = reader["DateOfBirth"].ToString(),
                                    PhoneNumber = reader["PhoneNumber"].ToString(),
                                    ProfilePictureURL = reader["ProfilePictureURL"].ToString()
                                };

                                return Request.CreateResponse(HttpStatusCode.OK, userProfileData);
                            }
                            else
                            {
                                return Request.CreateResponse(HttpStatusCode.NotFound, "User not found");
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }


        [HttpPost]
        [Route("api/post/UpdateUserProfile")]
        public HttpResponseMessage UpdateUserProfile()
        {
            try
            {
                var httpRequest = HttpContext.Current.Request;
                int userId = int.Parse(httpRequest.Form["UserID"]);
                string email = httpRequest.Form["Email"];
                string fullName = httpRequest.Form["FullName"];
                string bio = httpRequest.Form["Bio"];
                string website = httpRequest.Form["Website"];
                string gender = httpRequest.Form["Gender"];
                DateTime dateOfBirth = DateTime.Parse(httpRequest.Form["DateOfBirth"]);
                string phoneNumber = httpRequest.Form["PhoneNumber"];
                string profilePictureURL = null;

                var imageFiles = httpRequest.Files;

                if (imageFiles.Count > 0)
                {
                    var postedFile = imageFiles[0];
                    profilePictureURL = SaveImage1(postedFile);
                }

                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    using (SqlCommand command = new SqlCommand("UpdateUserProfile", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@UserID", userId);
                        command.Parameters.AddWithValue("@Email", email);
                        command.Parameters.AddWithValue("@FullName", fullName);
                        command.Parameters.AddWithValue("@Bio", bio);
                        command.Parameters.AddWithValue("@Website", website);
                        command.Parameters.AddWithValue("@Gender", gender);
                        command.Parameters.AddWithValue("@DateOfBirth", dateOfBirth);
                        command.Parameters.AddWithValue("@PhoneNumber", phoneNumber);

                        if (!string.IsNullOrEmpty(profilePictureURL))
                        {
                            command.Parameters.AddWithValue("@ProfilePictureURL", profilePictureURL);
                        }
                        else
                        {
                            command.Parameters.AddWithValue("@ProfilePictureURL", DBNull.Value);
                        }

                        connection.Open();
                        command.ExecuteNonQuery();
                        return Request.CreateResponse(HttpStatusCode.OK, "Profile updated successfully");
                    }
                }
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        private string SaveImage1(HttpPostedFile postedFile)
        {
            try
            {
                // Save the file to a folder on the server
                var fileName = Path.GetFileName(postedFile.FileName);
                var folderName = "Uploads";
                var relativeFilePath = Path.Combine(folderName, fileName);
                var absoluteFilePath = HttpContext.Current.Server.MapPath("~/" + relativeFilePath);
                postedFile.SaveAs(absoluteFilePath);
                return relativeFilePath;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to save image file.", ex);
            }
        }






        [HttpPost]
    [Route("api/post/LikePost")]
    public IHttpActionResult LikePost([FromBody]Like request)
    {
        using (SqlConnection connection = new SqlConnection(connectionString))
        {
            connection.Open();

            SqlCommand command = new SqlCommand("PostLikeDisLike", connection);
            command.CommandType = CommandType.StoredProcedure;

            command.Parameters.AddWithValue("@PostID", request.PostID);
            command.Parameters.AddWithValue("@UserID", request.UserID);

            SqlParameter likeCountParameter = new SqlParameter("@LikeCount", SqlDbType.Int);
            likeCountParameter.Direction = ParameterDirection.Output;
            command.Parameters.Add(likeCountParameter);

            command.ExecuteNonQuery();

            int likeCount = (int)likeCountParameter.Value;

            return Ok(new { likeCount });
        }
    }

        [HttpPost]
        [Route("api/post/LikeComment")]
        public IHttpActionResult LikeComment([FromBody] Like request)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                SqlCommand command = new SqlCommand("CommentLikeDisLike", connection);
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.AddWithValue("@CommentID", request.CommentID);
                command.Parameters.AddWithValue("@UserID", request.UserID);

                SqlParameter likeCountParameter = new SqlParameter("@LikeCount", SqlDbType.Int);
                likeCountParameter.Direction = ParameterDirection.Output;
                command.Parameters.Add(likeCountParameter);

                command.ExecuteNonQuery();

                int likeCount = (int)likeCountParameter.Value;

                return Ok(new { likeCount });
            }
        }

        [HttpPost]
        [Route("api/post/LikeReel")]
        public IHttpActionResult LikeReel([FromBody] Like request)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                SqlCommand command = new SqlCommand("ReelLikeDisLike", connection);
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.AddWithValue("@ReelID", request.ReelID);
                command.Parameters.AddWithValue("@UserID", request.UserID);

                SqlParameter likeCountParameter = new SqlParameter("@LikeCount", SqlDbType.Int);
                likeCountParameter.Direction = ParameterDirection.Output;
                command.Parameters.Add(likeCountParameter);

                command.ExecuteNonQuery();

                int likeCount = (int)likeCountParameter.Value;

                return Ok(new { likeCount });
            }
        }

        [HttpPost]
        [Route("api/post/ArchivePost")]
        public IHttpActionResult ArchivePost([FromBody] Post request)
        {
            try
            {
                
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    // Open the connection
                    connection.Open();

                    // Create a command to execute the stored procedure
                    using (SqlCommand command = new SqlCommand("ArchivePostProcedure", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        // Add parameters
                        command.Parameters.AddWithValue("@PostID", request.PostID);
                        command.Parameters.AddWithValue("@UserID", request.UserID);

                        // Execute the stored procedure
                        command.ExecuteNonQuery();
                    }
                }

                // Return a success response
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                
                return InternalServerError(ex);
            }
        }



        [HttpGet]
        [Route("api/post/GetUserArchievedPosts")]
        public IHttpActionResult GetUserArchievedPosts(int userId)
        {

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("GetUserArchievedPosts", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    // Add parameters
                    command.Parameters.AddWithValue("@UserId",userId);

                    // Create datasets to hold results
                    DataSet dataSet = new DataSet();

                    // Open connection
                    connection.Open();

                    // Execute command and fill datasets
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);

                    // Convert datasets to JSON
                    var userProfile = dataSet.Tables[0];
                    var userPosts = dataSet.Tables[1];

                    // Create an anonymous object to hold both user profile and posts data
                    var userData = new
                    {
                        UserProfile = userProfile,
                        UserPosts = userPosts
                    };

                    // Return JSON data
                    return Ok(userData);
                }
            }
        }


        [HttpPost]
        [Route("api/post/UnArchivePost")]
        public IHttpActionResult UnArchivePost([FromBody] Post request)
        {
            try
            {

                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    // Open the connection
                    connection.Open();

                    // Create a command to execute the stored procedure
                    using (SqlCommand command = new SqlCommand("UnArchivePostProcedure", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        // Add parameters
                        command.Parameters.AddWithValue("@PostID", request.PostID);
                        command.Parameters.AddWithValue("@UserID", request.UserID);

                        // Execute the stored procedure
                        command.ExecuteNonQuery();
                    }
                }

                // Return a success response
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {

                return InternalServerError(ex);
            }
        }


        [HttpDelete]
        [Route("api/post/DeletePost")]
        public IHttpActionResult DeletePost([FromBody] Post request)
        {
            
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("DeletePostProcedure", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@PostID", request.PostID);

                    connection.Open();
                    command.ExecuteNonQuery();
                }
            }

            return Ok("Post deleted successfully");
        }


        [HttpPost]
        [Route("api/post/like")]
        public IHttpActionResult LikeComment(int commentId, int userId, string action)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    var command = new SqlCommand("ManageCommentLike", connection);
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    // Add parameters
                    command.Parameters.AddWithValue("@CommentID", commentId);
                    command.Parameters.AddWithValue("@UserID", userId);
                    command.Parameters.AddWithValue("@Action", action);

                    connection.Open();
                    var reader = command.ExecuteReader();

                    if (reader.HasRows)
                    {
                        reader.Read();
                        int likeCount = Convert.ToInt32(reader["LikeCount"]);
                        int liked = Convert.ToInt32(reader["Liked"]);
                        return Ok(new { LikeCount = likeCount, Liked = liked });
                    }
                    else
                    {
                        return NotFound();
                    }
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("api/DefaultApi/CreateReel")]
        public IHttpActionResult CreateReel()
        {
            try
            {
                var httpRequest = HttpContext.Current.Request;

                // Get userId and caption from form data
                int userId = int.Parse(httpRequest.Form["userId"]);
                string caption = httpRequest.Form["caption"];

                var videoFiles = httpRequest.Files;

                if (videoFiles.Count < 1)
                {
                    return BadRequest("No video file found.");
                }

                List<string> videoPaths = new List<string>();
                foreach (string fileName in videoFiles)
                {
                    HttpPostedFile postedFile = videoFiles[fileName];
                    string videoPath = SaveVideo(postedFile);
                    videoPaths.Add(videoPath);
                }

                foreach (string videoPath in videoPaths)
                {
                    int reelId = SaveReelToDatabase(userId, caption, "video", videoPath);
                    if (reelId != -1)
                    {
                        return Ok($"Reel {reelId} created successfully.");

                    }
                }

                return BadRequest("Failed to create reel.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("GetReel/{reelId}")]
        public IHttpActionResult GetReel(int reelId)
        {
            try
            {
                string videoPath = GetReelFromDatabase(reelId);
                if (!string.IsNullOrEmpty(videoPath))
                {
                    return Ok(videoPath);
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        private string SaveVideo(HttpPostedFile postedFile)
        {
            try
            {
                // Save the file to a folder on the server
                var fileName = Path.GetFileName(postedFile.FileName);
                var folderName = "Uploads";
                var relativeFilePath = Path.Combine(folderName, fileName);
                var absoluteFilePath = HttpContext.Current.Server.MapPath("~/" + relativeFilePath);
                postedFile.SaveAs(absoluteFilePath);
                return relativeFilePath;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to save video file.", ex);
            }
        }

        private int SaveReelToDatabase(int userId, string caption, string mediaType, string videoPath)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    var command = new SqlCommand("AddReel", connection);
                    command.CommandType = CommandType.StoredProcedure;

                    // Add parameters
                    command.Parameters.AddWithValue("@UserID", userId);
                    command.Parameters.AddWithValue("@Caption", caption);
                    command.Parameters.AddWithValue("@MediaType", mediaType);
                    command.Parameters.AddWithValue("@MediaURL", videoPath);

                    connection.Open();
                    var reelId = Convert.ToInt32(command.ExecuteScalar());
                    return reelId;
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to save reel to database.", ex);
            }
        }

        private string GetReelFromDatabase(int reelId)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    var command = new SqlCommand("GetReel", connection);
                    command.CommandType = CommandType.StoredProcedure;

                    // Add parameter
                    command.Parameters.AddWithValue("@ReelID", reelId);

                    connection.Open();
                    var videoPath = command.ExecuteScalar() as string;
                    return videoPath;
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to get reel from database.", ex);
            }
        }




        [HttpGet]
        [Route("api/post/GetAllReels")]
        public IHttpActionResult GetAllReels()
        {
            try
            {
                List<ReelWithUser> reelsWithUsers = new List<ReelWithUser>();

                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetAllReels", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            ReelWithUser reelWithUser = new ReelWithUser
                            {
                                ReelId = Convert.ToInt32(reader["ReelId"]),
                                UserId = Convert.ToInt32(reader["UserId"]),
                                Caption = reader["Caption"].ToString(),
                                MediaType = reader["MediaType"].ToString(),
                                MediaURL = reader["MediaURL"].ToString(),
                                Username = reader["Username"].ToString(),
                                ProfilePictureURL = reader["ProfilePictureURL"].ToString(),
                                LikesCount = Convert.ToInt32(reader["LikesCount"])
                            };

                            reelsWithUsers.Add(reelWithUser);
                        }
                    }
                }

                return Ok(reelsWithUsers);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
       

        [HttpDelete]
        [Route("api/post/DeleteComment")]
        public IHttpActionResult DeleteComment([FromBody] Comment request)
        {

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("DeleteCommentProcedure", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@CommentID", request.CommentID);
                    command.Parameters.AddWithValue("@PostID", request.PostID);

                    connection.Open();
                    command.ExecuteNonQuery();
                }
            }

            return Ok("Post deleted successfully");
        }


        [HttpGet]
        [Route("api/post/likeStatus")]
        public IHttpActionResult GetPostsWithLikeStatus(int userId)
        {
            List<PostLikeStatus> postLikeStatusList = new List<PostLikeStatus>();
           

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("GetPostsWithLikeStatus", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@UserId", userId);
                    conn.Open();

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            int postId = reader.GetInt32(0);
                            bool isLiked = reader.GetBoolean(1);
                            postLikeStatusList.Add(new PostLikeStatus { PostId = postId, IsLiked = isLiked });
                        }
                    }
                }
            }
            return Ok(postLikeStatusList);
        }

       




        //[HttpGet]
        //[Route("api/DefaultApi/SearchUsers")]
        //public IHttpActionResult SearchUsers(string query)
        //{
        //    List<User> users = new List<User>();

        //    using (SqlConnection connection = new SqlConnection(connectionString))
        //    {
        //        using (SqlCommand command = new SqlCommand("SearchUsers", connection))
        //        {
        //            command.CommandType = CommandType.StoredProcedure;
        //            command.Parameters.AddWithValue("@Query", query);

        //            connection.Open();
        //            using (
        //                SqlDataReader reader = command.ExecuteReader())
        //            {
        //                while (reader.Read())
        //                {
        //                    User user = new User
        //                    {
        //                        UserID = (int)reader["UserID"],
        //                        Username = reader["Username"].ToString(),
        //                        FullName = reader["FullName"].ToString(),
        //                        ProfilePictureURL = reader["ProfilePictureURL"].ToString()

        //                    };
        //                    users.Add(user);
        //                }
        //            }
        //        }
        //    }

        //    return Ok(users);
        //}


        [HttpPost]
        [Route("api/post/HashSearch")]
        public IHttpActionResult GetAllHasPosts([FromBody]Post post)
        {
            List<Post> postsList = new List<Post>();

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    using (SqlCommand command = new SqlCommand("GetAllHasPosts", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        List<string> cleanedHashtags = new List<string>();
                        foreach (string hashtag in post.Hashtags)
                        {
                            cleanedHashtags.Add(hashtag.TrimStart('#'));
                        }

                        // Join the cleaned hashtags into a single string separated by commas
                        string hashtagsString = string.Join(",", cleanedHashtags);

                        command.Parameters.AddWithValue("@Hashtag", hashtagsString);
                        connection.Open();

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                Post postlist = new Post
                                {
                                    Username = reader["UserName"].ToString(),
                                    PostID = Convert.ToInt32(reader["PostID"]),
                                    UserID = Convert.ToInt32(reader["UserID"]),
                                    Caption = reader["Caption"].ToString(),
                                    MediaType = reader["MediaType"].ToString(),
                                    MediaURL = reader["MediaURL"].ToString(),
                                    ProfilePictureURL = reader["ProfilePictureURL"].ToString(),
                                    Location = reader["Location"].ToString(),
                                    PostCreationTimestamp = Convert.ToDateTime(reader["PostCreationTimestamp"]),
                                    PostStatus = reader["PostStatus"].ToString(),
                                    LikesCount = Convert.ToInt32(reader["LikesCount"]),
                                    CommentsCount = Convert.ToInt32(reader["CommentsCount"]),
                                    SharesCount = Convert.ToInt32(reader["SharesCount"]),
                                    Visibility = reader["Visibility"].ToString()
                                };

                                postsList.Add(postlist);
                            }
                        }
                    }
                }

                return Ok(postsList);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


       










    }
}
