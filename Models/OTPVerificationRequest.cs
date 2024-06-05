using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMWebApplication.Models
{
    public class OTPVerificationRequest
    {
        public string Email { get; set; }
        public string OTP { get; set; }
    }
}