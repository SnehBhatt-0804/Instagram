using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMWebApplication.Models
{
    public class Post
    {
        public string[] Hashtags { get; set; }
        public string Username { get; set; }
        public int PostID { get; set; }
        public int UserID { get; set; }
        public string Caption { get; set; }
        public string MediaType { get; set; }
        public string MediaURL { get; set; }
        public string Location { get; set; }
        public string ProfilePictureURL { get; set; }
        public DateTime PostCreationTimestamp { get; set; }
        public string PostStatus { get; set; }
        public int LikesCount { get; set; }
        public int CommentsCount { get; set; }
        public int SharesCount { get; set; }
        public string Visibility { get; set; }
    }
}