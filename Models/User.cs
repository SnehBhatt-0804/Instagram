using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMWebApplication.Models
{
    public class User
    {
        public int UserID { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public string ProfilePictureURL { get; set; }
        public string Bio { get; set; }
        public string Website { get; set; }
        public string Gender { get; set; }
        public string DateOfBirth { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime AccountCreationTimestamp { get; set; }
        public DateTime? LastLoginTimestamp { get; set; }
        public string AccountStatus { get; set; }

        public bool IsFriend { get; set; }
        public string RequestStatus { get; set; }


        public bool IsFollowing { get; set; }
        public bool IsFollowedBack { get; set; }
    }
}