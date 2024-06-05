using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMWebApplication.Models
{
    public class CommentModel
    {
        public int CommentID { get; set; }
        public string ProfilePic { get; set; }
        public string Username { get; set; }
        public string Text { get; set; }
    }
}