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
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Http;

namespace SMWebApplication.Controllers
{
    public class DefaultApiController : ApiController
    {
        private string connectionString = ConfigurationManager.ConnectionStrings["MyConnectionString"].ConnectionString;
       
        [HttpGet]
        [Route("api/DefaultApi/SearchUsers")]
        public IHttpActionResult SearchUsers(string query)
        {
            List<User> users = new List<User>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("SearchUsers", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@Query", query);

                    connection.Open();
                    using (
                        SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            User user = new User
                            {
                                UserID = (int)reader["UserID"],
                                Username = reader["Username"].ToString(),
                                FullName = reader["FullName"].ToString(),
                                ProfilePictureURL = reader["ProfilePictureURL"].ToString()
                                
                            };
                            users.Add(user);
                        }
                    }
                }
            }

            return Ok(users);
        }

        [HttpGet]
        [Route("api/DefaultApi/GetAllUsersExceptLoggedInUser")]
        public List<User> GetAllUsersExceptLoggedInUser(int loggedInUserId)
        {
            List<User> userList = new List<User>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand("GetAllUsersExceptLoggedInUser", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@LoggedInUserId", loggedInUserId);

                connection.Open();

                using (SqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        User user = new User
                        {
                            UserID = (int)reader["UserID"],
                            Username = reader["Username"].ToString(),
                            ProfilePictureURL = reader["ProfilePictureURL"].ToString(),
                            
                        };

                        userList.Add(user);
                    }
                }
            }

            return userList;
        }



        [HttpPost]
        [Route("api/DefaultApi/AddFriend")]
        public IHttpActionResult AddFriend(FollowersFollowing request)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("AddFriend", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@FollowerUserID", request.FollowerUserID);
                    command.Parameters.AddWithValue("@FollowingUserID", request.FollowingUserID);
                    

                    connection.Open();
                    command.ExecuteNonQuery();
                }
            }

            return Ok();
        }

        [HttpPost]
        [Route("api/DefaultApi/RemoveFriend")]
        public IHttpActionResult RemoveFriend(FollowersFollowing request)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("RemoveFriend", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@FollowerUserID", request.FollowerUserID);
                    command.Parameters.AddWithValue("@FollowingUserID", request.FollowingUserID);

                    connection.Open();
                    command.ExecuteNonQuery();
                }
            }

            return Ok();
        }

        [HttpPost]
        [Route("api/DefaultApi/ConfirmFriendRequest")]
        public IHttpActionResult ConfirmFriendRequest(FollowersFollowing request)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("ConfirmFriendRequest", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@FollowerUserID", request.FollowerUserID);
                    command.Parameters.AddWithValue("@FollowingUserID", request.FollowingUserID);

                    connection.Open();
                    command.ExecuteNonQuery();
                }
            }

            return Ok();
        }


        [HttpPost]
        [Route("api/DefaultApi/SubmitComment")]
        public IHttpActionResult SubmitComment(Comment model)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("Comment", connection);
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@PostID", model.PostID);
                    command.Parameters.AddWithValue("@UserID", model.UserID);
                    command.Parameters.AddWithValue("@CommentText", model.CommentText);

                    SqlParameter CommentsCount = new SqlParameter("@CommentsCount", SqlDbType.Int);
                    CommentsCount.Direction = ParameterDirection.Output;
                    command.Parameters.Add(CommentsCount);

                    connection.Open();
                    command.ExecuteNonQuery();

                    // Retrieve the value of the output parameter
                    int commentsCountValue = Convert.ToInt32(CommentsCount.Value);

                    return Ok(new { CommentsCount = commentsCountValue });
                    // Alternatively, you can directly return the comment submitted successfully message here if you don't want to return CommentsCount
                    // return Ok("Comment submitted successfully");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
                return InternalServerError(new Exception("Failed to submit comment"));
            }
        }

        [HttpGet]
        [Route("api/DefaultApi/GetCommentsForPost")]
        public IHttpActionResult GetCommentsForPost(int postId)
        {
            try
            {
                List<CommentModel> comments = new List<CommentModel>();

                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetCommentsForPost", connection);
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@PostID", postId);

                    connection.Open();
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        CommentModel comment = new CommentModel();
                        comment.CommentID = (int)reader["CommentID"]; // Add this line to retrieve the CommentID
                        comment.ProfilePic = reader["ProfilePic"].ToString();
                        comment.Username = reader["Username"].ToString();
                        comment.Text = reader["Text"].ToString();
                        comments.Add(comment);
                    }

                    reader.Close();
                }

                return Ok(comments);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
                return InternalServerError(new Exception("Failed to get comments for post"));
            }
        }



     
        [HttpGet]
        [Route("api/DefaultApi/GetAllfollowers")]
        public List<User> GetAllfollowers(int loggedInUserId)
        {
            List<User> userList = new List<User>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand("GetFollowersForUser", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@UserID", loggedInUserId);

                connection.Open();

                using (SqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        User user = new User
                        {
                            UserID = (int)reader["UserID"],
                            Username = reader["Username"].ToString(),
                            ProfilePictureURL = reader["ProfilePictureURL"].ToString(),
                            
                        };

                        userList.Add(user);
                    }
                }
            }

            return userList;
        }

        [HttpGet]
        [Route("api/DefaultApi/GetAllfollowings")]
        public List<User> GetAllfollowings(int loggedInUserId)
        {
            List<User> userList = new List<User>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand("GetFollowingsForUser", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@UserID", loggedInUserId);

                connection.Open();

                using (SqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        User user = new User
                        {
                            UserID = (int)reader["UserID"],
                            Username = reader["Username"].ToString(),
                            ProfilePictureURL = reader["ProfilePictureURL"].ToString(),
                            
                        };

                        userList.Add(user);
                    }
                }
            }

            return userList;
        }



        [HttpGet]
        [Route("api/DefaultApi/notifications")]
        public IHttpActionResult GetNotifications(int userId)
        {
            List<string> notifications = new List<string>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("FetchNotifications", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@YourUserID", userId);

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            string notificationMessage = reader["NotificationMessage"].ToString();
                            notifications.Add(notificationMessage);
                        }
                    }
                }
            }

            return Ok(notifications);
        }


        [HttpPost]
        [Route("api/DefaultApi/AddComment")]
        public IHttpActionResult AddComment([FromBody] CommentData commentData)
        {
            try
            {
                // Perform validation if necessary

                int commentId = 0; // Initialize to default value
                string userProfileImageUrl = null;
                string username = null;

                // Insert the comment into the database and fetch additional data
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    using (SqlCommand command = new SqlCommand("AddComment", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@ParentCommentId", commentData.ParentCommentId);
                        command.Parameters.AddWithValue("@CommentText", commentData.Comment);
                        command.Parameters.AddWithValue("@UserID", commentData.UserId);
                        command.Parameters.AddWithValue("@PostID", commentData.PostID);// Pass the UserID
                        connection.Open();

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                commentId = Convert.ToInt32(reader["CommentID"]);
                                userProfileImageUrl = reader["UserProfileImageUrl"].ToString();
                                username = reader["Username"].ToString();
                            }
                            // No need for else condition since commentId, userProfileImageUrl, and username 
                            // are already initialized to default values
                        }
                    }
                }

                // Check if any data was returned
                if (commentId == 0 || userProfileImageUrl == null || username == null)
                {
                    throw new Exception("No data returned from AddComment stored procedure.");
                }

                return Ok(new
                {
                    success = true,
                    commentId = commentId,
                    userProfileImageUrl = userProfileImageUrl,
                    username = username,
                    commentText = commentData.Comment
                });
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                Console.WriteLine("Error adding comment: " + ex.Message);
                return InternalServerError(new Exception("Failed to add comment."));
            }
        }






        [HttpGet]
        [Route("api/DefaultApi/GetCommentsForPostWithReplies")]
        public IHttpActionResult GetCommentsForPostWithReplies(int postId)
        {
            try
            {
                List<CommentData> comments = new List<CommentData>();

                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    using (SqlCommand command = new SqlCommand("GetCommentsForPostWithReplies", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@PostID", postId);
                        connection.Open();

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                CommentData comment = new CommentData
                                {
                                    UserId = (int)reader["UserID"],
                                    CommentID = Convert.ToInt32(reader["CommentID"]),
                                    ProfilePic = reader["ProfilePic"].ToString(),
                                    Username = reader["Username"].ToString(),
                                    Text = reader["Text"].ToString(),
                                    ParentCommentId = reader["ParentCommentId"] == DBNull.Value ? null : (int?)reader["ParentCommentId"],
                                    TotalLikesCount = Convert.ToInt32(reader["TotalLikesCount"]) // Add total likes count
                                };
                                comments.Add(comment);
                            }
                        }
                    }
                }

                return Ok(comments);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error fetching comments:", ex.Message);
                return InternalServerError(new Exception("Failed to fetch comments."));
            }
        }
       


        [HttpGet]
        [Route("api/DefaultApi/GetAllChatUsers")]
        public IHttpActionResult GetAllChatUsers()
        {
            List<User> users = new List<User>();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("GetAllChatUsers", conn)) // Call the stored procedure
                {
                    cmd.CommandType = CommandType.StoredProcedure; // Specify that it's a stored procedure
                    conn.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        users.Add(new User
                        {
                            UserID = (int)reader["UserID"],
                            Username = reader["Username"].ToString(),
                            ProfilePictureURL = reader["ProfilePictureURL"].ToString()
                        });
                    }
                }
            }

            return Ok(users);
        }

        [HttpPost]
        [Route("api/DefaultApi/ForgotPassword")]
        public IHttpActionResult ForgotPassword([FromBody] PasswordResetRequest request)
        {
            try
            {
                // Retrieve SMTP settings from configuration
                string smtpServer = ConfigurationManager.AppSettings["smtpServer"];
                int smtpPort = int.Parse(ConfigurationManager.AppSettings["smtpPort"]);
                string smtpUser = ConfigurationManager.AppSettings["smtpUser"];
                string smtpPass = ConfigurationManager.AppSettings["smtpPass"];

                // Generate a token
                string token = GenerateToken();
                string encodedToken = HttpUtility.UrlEncode(token);
                string link = "http://localhost:62189/Home/ForgotPasswordForm?token=" + encodedToken;



                // Create the email message
                MailMessage mailMessage = new MailMessage();
                mailMessage.From = new MailAddress(smtpUser); // Your Gmail address
                mailMessage.To.Add(request.Email);
                mailMessage.Subject = "Password Reset";
                mailMessage.Body = $"Please follow this link to reset your password:" + link;

                // Configure the SMTP client
                SmtpClient smtpClient = new SmtpClient(smtpServer, smtpPort);
                smtpClient.EnableSsl = true;
                smtpClient.UseDefaultCredentials = false;
                smtpClient.Credentials = new NetworkCredential(smtpUser, smtpPass);

                // Send the email
                smtpClient.Send(mailMessage);

                // Save the token to the database with the current timestamp
                SaveTokenToDatabase(request.Email, request.UserId, token);

                return Ok("Password reset email sent successfully.");
            }
            catch (SmtpException smtpEx)
            {
                // Log the error (you could use a logging framework here)
                return InternalServerError(smtpEx);
            }
            catch (Exception ex)
            {
                // Log the error
                return InternalServerError(ex);
            }
        }

        // Token generation logic
        private string GenerateToken(int length = 32)
        {
            const string validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            StringBuilder result = new StringBuilder(length);
            using (var rng = new RNGCryptoServiceProvider())
            {
                byte[] uintBuffer = new byte[sizeof(uint)];

                while (length-- > 0)
                {
                    rng.GetBytes(uintBuffer);
                    uint num = BitConverter.ToUInt32(uintBuffer, 0);
                    result.Append(validChars[(int)(num % (uint)validChars.Length)]);
                }
            }
            return result.ToString();
        }

        // Save the token to the database
        private void SaveTokenToDatabase(string email, int UserId, string token)
        {
            
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("SavePasswordResetToken", conn))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Email", email);
                    cmd.Parameters.AddWithValue("@UserId", UserId);
                    cmd.Parameters.AddWithValue("@Token", token);
                    cmd.Parameters.AddWithValue("@DateRequested", DateTime.Now);
                    conn.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }

       


        [HttpPost]
        [Route("api/DefaultApi/CheckTokenExpiration")]
        public IHttpActionResult CheckTokenExpiration([FromBody] TokenCheckRequest request)
        {
            try
            {
                bool isExpired = false;

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("CheckTokenExpiration", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@Token", request.Token);
                        cmd.Parameters.Add("@IsExpired", SqlDbType.Bit).Direction = ParameterDirection.Output; // Add the output parameter

                        conn.Open();
                        cmd.ExecuteNonQuery(); // Execute the stored procedure

                        // Get the value of the output parameter
                        isExpired = Convert.ToBoolean(cmd.Parameters["@IsExpired"].Value);
                    }
                }

                return Ok(new { isExpired = isExpired });
            }
            catch (Exception ex)
            {
                // Log the error
                return InternalServerError(ex);
            }
        }

       
        

        //[HttpPost]
        //[Route("api/DefaultApi/ResetPasswordByEmail")]
        //public IHttpActionResult ResetPasswordByEmail([FromBody] ResetPasswordRequest request)
        //{
        //    try
        //    {
        //        int result = UpdatePassword(request.Token, request.NewPassword);

        //        // Return the result directly
        //        return Ok(result);
        //    }
        //    catch (Exception ex)
        //    {
        //        return InternalServerError(ex);
        //    }
        //}

        [HttpPost]
[Route("api/DefaultApi/ResetPasswordByEmail")]
public IHttpActionResult ResetPasswordByEmail([FromBody] ResetPasswordRequest request)
{
    ResetPasswordResponse response = new ResetPasswordResponse();
    try
    {
        int result = UpdatePassword(request.Token, request.NewPassword);

        // Populate response based on the result
        if (result == 0)
        {
            response.Success = true;
        }
        else if (result == 1)
        {
            response.Success = false;
            response.ErrorMessage = "Invalid token or email.";
        }
        else if (result == 2)
        {
            response.Success = false;
            response.ErrorMessage = "Invalid token.";
        }
        else if (result == 3)
        {
            response.Success = false;
            response.ErrorMessage = "You cannot reuse any of your last three passwords.";
        }
        else
        {
            response.Success = false;
            response.ErrorMessage = "An error occurred while updating the password.";
        }

        // Return the response
        return Ok(response);
    }
    catch (Exception ex)
    {
        response.Success = false;
        response.ErrorMessage = ex.Message;
        return InternalServerError(ex);
    }
}

        // Method to update password in the database
        private int UpdatePassword(string token, string newPassword)
        {
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("ResetPasswordByEmail", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Token", token);
                    cmd.Parameters.AddWithValue("@NewPassword", newPassword);

                    conn.Open();
                    var result = (int)cmd.ExecuteScalar();
                    return result; 
                }
            }
        }

        // Request model for resetting password
       
        ////////////////////
        ///////OTP
        /////////
        ///
        [HttpPost]
        [Route("api/DefaultApi/OtpVerify")]
        public IHttpActionResult OtpVerify([FromBody] PasswordResetRequest request)
        {
            try
            {
                // Retrieve SMTP settings from configuration
                string smtpServer = ConfigurationManager.AppSettings["smtpServer"];
                int smtpPort = int.Parse(ConfigurationManager.AppSettings["smtpPort"]);
                string smtpUser = ConfigurationManager.AppSettings["smtpUser"];
                string smtpPass = ConfigurationManager.AppSettings["smtpPass"];

                // Generate a token
                string Otp = GenerateOtp();
               



                // Create the email message
                MailMessage mailMessage = new MailMessage();
                mailMessage.From = new MailAddress(smtpUser); // Your Gmail address
                mailMessage.To.Add(request.Email);
                mailMessage.Subject = "One Time Password";
                mailMessage.Body = $"Your One Time Password Is :" + Otp;

                // Configure the SMTP client
                SmtpClient smtpClient = new SmtpClient(smtpServer, smtpPort);
                smtpClient.EnableSsl = true;
                smtpClient.UseDefaultCredentials = false;
                smtpClient.Credentials = new NetworkCredential(smtpUser, smtpPass);

                // Send the email
                smtpClient.Send(mailMessage);

                // Save the token to the database with the current timestamp
                SaveOtpToDatabase(request.Email,Otp);

                return Ok("Password reset email sent successfully.");
            }
            catch (SmtpException smtpEx)
            {
                // Log the error (you could use a logging framework here)
                return InternalServerError(smtpEx);
            }
            catch (Exception ex)
            {
                // Log the error
                return InternalServerError(ex);
            }
        }

        // Token generation logic
        private string GenerateOtp(int length = 4)
        {
            const string validChars = "0123456789";
            StringBuilder result = new StringBuilder(length);
            using (var rng = new RNGCryptoServiceProvider())
            {
                byte[] uintBuffer = new byte[sizeof(uint)];

                while (length-- > 0)
                {
                    rng.GetBytes(uintBuffer);
                    uint num = BitConverter.ToUInt32(uintBuffer, 0);
                    result.Append(validChars[(int)(num % (uint)validChars.Length)]);
                }
            }
            return result.ToString();
        }


        // Save the token to the database
        private void SaveOtpToDatabase(string email,string Otp)
        {

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("SaveOtp", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Email", email);
                    cmd.Parameters.AddWithValue("@OTP", Otp);
                    cmd.Parameters.AddWithValue("@DateGenerated", DateTime.Now);
                    conn.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }

        [HttpPost]
        [Route("api/DefaultApi/VerifyOTP")]
        public IHttpActionResult VerifyOTP([FromBody] OTPVerificationRequest request)
        {
            if (request == null)
            {
                return BadRequest("Request is null.");
            }

            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.OTP))
            {
                return BadRequest("Email or OTP is missing.");
            }

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("VerifyOTP", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@Email", request.Email);
                        cmd.Parameters.AddWithValue("@EnteredOTP", request.OTP);
                        cmd.Parameters.Add("@IsMatch", SqlDbType.Bit).Direction = ParameterDirection.Output;

                        conn.Open();
                        cmd.ExecuteNonQuery();

                        // Retrieve the output parameter
                        bool isMatch = Convert.ToBoolean(cmd.Parameters["@IsMatch"].Value);

                        // Return success if OTP matches
                        if (isMatch)
                        {
                            return Ok(new { isMatched = true });
                        }
                        else
                        {
                            return Ok(new { isMatched = false, message = "Invalid OTP." });
                        }
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                

                return InternalServerError(sqlEx);
            }
            catch (Exception ex)
            {
               

                return InternalServerError(ex);
            }
        }


       


}
}
