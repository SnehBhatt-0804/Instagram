using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMWebApplication.Models
{
    public class ReelWithUser
    {
        
            public int ReelId { get; set; }
            public int UserId { get; set; }
            public string Caption { get; set; }
            public string MediaType { get; set; }
            public string MediaURL { get; set; }
            public string Username { get; set; }
            public string ProfilePictureURL { get; set; }
            public int LikesCount { get; set; }
        
    }
}