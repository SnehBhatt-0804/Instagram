using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMWebApplication.Models
{
    public class Like
    {
        public int CommentID { get; set; }
        public int ReelID { get; set; }
        public int LikeID { get; set; }
        public int PostID { get; set; }
        public int UserID { get; set; }
        public DateTime LikeTimestamp { get; set; }
    }

}