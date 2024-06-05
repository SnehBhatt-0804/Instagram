using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMWebApplication.Models
{
    public class CommentData
    {
        public int CommentID { get; set; }
        public string ProfilePic { get; set; }
        public string Username { get; set; }
        public string Text { get; set; }
        public int? ParentCommentId { get; set; }
        public int TotalLikesCount { get; set; } // Total likes count
        public string Comment { get; set; }
        public int UserId { get; set; }
        public int PostID { get; set; }
    }
}