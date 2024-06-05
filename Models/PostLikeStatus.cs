using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMWebApplication.Models
{
    public class PostLikeStatus
    {
        public int PostId { get; set; }
        public bool IsLiked { get; set; }
    }
}