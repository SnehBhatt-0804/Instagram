using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMWebApplication.Models
{
    public class TaggedUser
    {
        public int TagID { get; set; }
        public int PostID { get; set; }
        public int UserID { get; set; }
        public DateTime TagTimestamp { get; set; }
    }
}