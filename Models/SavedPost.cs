using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMWebApplication.Models
{
    public class SavedPost
    {
        public int SaveID { get; set; }
        public int UserID { get; set; }
        public int PostID { get; set; }
        public DateTime SaveTimestamp { get; set; }
    }
}