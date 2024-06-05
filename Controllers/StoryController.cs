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
    public class StoryController : ApiController
    {
        private string connectionString = ConfigurationManager.ConnectionStrings["MyConnectionString"].ConnectionString;
        

        // GET api/story/last
        [HttpGet]
        [Route("api/Story/GetLastStoredStory")]
        public IHttpActionResult GetLastStoredStory()
        {
            Story lastStory = null;

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    using (SqlCommand command = new SqlCommand("GetLastStoredStory", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        connection.Open();

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                lastStory = new Story
                                {
                                    StoryID = Convert.ToInt32(reader["StoryID"]),
                                    UserID = Convert.ToInt32(reader["UserID"]),
                                    MediaType = reader["MediaType"].ToString(),
                                    MediaURL = reader["MediaURL"].ToString(),
                                    StoryExpiryTimestamp = Convert.ToDateTime(reader["StoryExpiryTimestamp"])
                                };
                            }
                        }
                    }
                }

                return Ok(lastStory);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


        // GET api/story
        [HttpGet]
        [Route("api/Story/GetAllStories")]
        public IHttpActionResult GetAllStories()
        {
            List<Story> stories = new List<Story>();

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    using (SqlCommand command = new SqlCommand("GetAllStories", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        connection.Open();

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                Story story = new Story
                                {
                                    StoryID = Convert.ToInt32(reader["StoryID"]),
                                    UserID = Convert.ToInt32(reader["UserID"]),
                                    MediaType = reader["MediaType"].ToString(),
                                    MediaURL = reader["MediaURL"].ToString(),
                                    StoryStatus = reader["StoryStatus"].ToString(),
                                    StoryExpiryTimestamp = Convert.ToDateTime(reader["StoryExpiryTimestamp"])
                                };

                                stories.Add(story);
                            }
                        }
                    }
                }

                return Ok(stories);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


        [HttpPost]
        [Route("api/story/CreateStory")]
        public IHttpActionResult CreateStory(int userId)
        {
            try
            {
                var httpRequest = HttpContext.Current.Request;

                // Check if any files are attached
                var imageFiles = httpRequest.Files;
                if (imageFiles.Count < 1)
                {
                    return BadRequest("No image file found.");
                }

                // List to store image paths
                List<string> imagePaths = new List<string>();
                foreach (string fileName in imageFiles)
                {
                    HttpPostedFile postedFile = imageFiles[fileName];
                    string imagePath = SaveImage(postedFile);
                    imagePaths.Add(imagePath);
                }

                // Story metadata
                string mediaType = "image";
                DateTime StoryExpiryTimestamp = DateTime.Now;
                

                // Save each image path and metadata to the database
                foreach (string imagePath in imagePaths)
                {
                    SaveStoryToDatabase2(userId,mediaType, imagePath, StoryExpiryTimestamp);
                }

                return Ok("Story created successfully.");
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

        private void SaveStoryToDatabase2(int userId,string mediaType, string imagePath, DateTime StoryExpiryTimestamp)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    var command = new SqlCommand("CreateStory", connection);
                    command.CommandType = CommandType.StoredProcedure;

                    // Add parameters
                    command.Parameters.AddWithValue("@UserId", userId);
                    command.Parameters.AddWithValue("@MediaType", mediaType);
                    command.Parameters.AddWithValue("@MediaURL", imagePath);
                    command.Parameters.AddWithValue("@StoryExpiryTimestamp", StoryExpiryTimestamp);

                    connection.Open();
                    command.ExecuteNonQuery();
                }

            }
            catch (Exception ex)
            {
                throw new Exception("Failed to save story to database.", ex);
            }
        }




        [HttpPost]
        [Route("api/Story/MarkAsRead")]
        public IHttpActionResult MarkAsRead([FromBody] StoryReadRequest request)
        {
            if (request == null || request.StoryId <= 0 || request.UserId <= 0)
            {
                return BadRequest("Invalid story or user ID.");
            }

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("MarkStoryAsRead1", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@UserID", request.UserId));
                    command.Parameters.Add(new SqlParameter("@StoryID", request.StoryId));

                    try
                    {
                        connection.Open();
                        command.ExecuteNonQuery();
                    }
                    catch (Exception ex)
                    {
                        return InternalServerError(ex);
                    }
                }
            }

            return Ok();
        }
        






    }
}
