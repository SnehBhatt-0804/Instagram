using SMWebApplication.Models;
using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using System.Web.Mvc;

namespace SMWebApplication.Controllers
{
    public class HomeController : Controller
    {
        

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult SignUp()
        {
            return View();
        }

        public ActionResult LogIn()
        {
            return View();
        }
        public ActionResult Profile()
        {
            return View();
        }

        public ActionResult EditProfile()
        {
            return View();
        }

        public ActionResult Explore()
        {
            return View();
        }

        public ActionResult Reels()
        {
            return View();
        }

        public ActionResult Message()
        {
            return View();
        }

        public ActionResult SearchUser()
        {
            return View();
        }

        public ActionResult followers()
        {
            return View();
        }
        public ActionResult followings()
        {
            return View();
        }
        public ActionResult Archieve()
        {
            return View();
        }
        public ActionResult ForgotPassword()
        {
            return View();
        }
        public ActionResult ForgotPasswordForm()
        {
            return View();
        }

        public ActionResult ForgotPasswordExpired()
        {
            return View();
        }

        public ActionResult OtpPage()
        {
            return View();
        }

        public ActionResult VerifyAccount()
        {
            return View();
        }



        [HttpPost]
        public ActionResult LogIn(User model)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["MyConnectionString"].ConnectionString;

                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand("SPLogin", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@username", model.Username);
                        command.Parameters.AddWithValue("@password", model.Password);

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                int userId = Convert.ToInt32(reader["UserID"]);
                                string username = reader["username"].ToString();
                                bool Verified = Convert.ToBoolean(reader["Verified"]); // New: Read IsVerified from the reader

                                // If user is not verified, return IsVerified as false
                                if (!Verified)
                                {
                                    return Json(new { Verified = false }, JsonRequestBehavior.AllowGet);
                                }
                                else
                                {
                                    Session["UserId"] = userId;

                                    var user = new { UserId = userId, Username = username, Verified = true }; // Modify to include IsVerified in the response
                                    return Json(user, JsonRequestBehavior.AllowGet);
                                }
                            }
                            else
                            {
                                return new HttpStatusCodeResult(HttpStatusCode.Unauthorized, "Invalid username or password");
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, $"An error occurred: {ex.Message}");
            }
        }


    }
}
