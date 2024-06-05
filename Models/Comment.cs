using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMWebApplication.Models
{
    public class Comment
    {
        public int CommentID { get; set; }
        public int PostID { get; set; }
        public int UserID { get; set; }
        public string CommentText { get; set; }
        public DateTime CommentTimestamp { get; set; }
        public string CommentStatus { get; set; }
    }
}