using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMWebApplication.Models
{
    public class PasswordResetRequest
    {
        public string Email { get; set; }
        public int UserId { get; set; }
    }
}