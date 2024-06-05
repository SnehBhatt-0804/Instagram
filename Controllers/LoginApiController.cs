using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using SMWebApplication.Models;

namespace SMWebApplication.Controllers
{
    public class LoginApiController : ApiController
    {
        
        private string connectionString = ConfigurationManager.ConnectionStrings["MyConnectionString"].ConnectionString;

        [HttpPost]
        [Route("api/LoginApi/CheckUsernameExists")]
        public IHttpActionResult CheckUsernameExists([FromBody]User user)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand("CheckUsernameExists", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@Username", user.Username);

                  

                    // Execute the stored procedure
                    int count = (int)command.ExecuteScalar();

                    // Return response based on the result
                    return Ok(new { exists = count > 0 });
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("api/LoginApi/CheckEmailExists")]
        public IHttpActionResult CheckEmailExists([FromBody] User user)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand("CheckEmailExists", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@Email", user.Email);



                    // Execute the stored procedure
                    int count = (int)command.ExecuteScalar();

                    // Return response based on the result
                    return Ok(new { exists = count > 0 });
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("api/LoginApi/CheckMobileNumberExists")]
        public IHttpActionResult CheckMobileNumberExists([FromBody] User user)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand("CheckMobileNumberExists", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@PhoneNumber", user.PhoneNumber);



                    // Execute the stored procedure
                    int count = (int)command.ExecuteScalar();

                    // Return response based on the result
                    return Ok(new { exists = count > 0 });
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }




        [HttpPost]
        [Route("api/LogInApi/Register")]
        public IHttpActionResult Register([FromBody] User user)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand("SPRegister", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@Username", user.Username);
                    command.Parameters.AddWithValue("@Email", user.Email);
                    command.Parameters.AddWithValue("@Password", user.Password);
                    command.Parameters.AddWithValue("@FullName", user.FullName);
                    command.Parameters.AddWithValue("@DateOfBirth", user.DateOfBirth);
                    command.Parameters.AddWithValue("@PhoneNumber",user.PhoneNumber);

                    command.ExecuteNonQuery();

                    return Ok("User registered successfully.");
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex); 
            }
        }






    }
}


    
       