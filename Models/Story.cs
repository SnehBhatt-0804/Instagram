using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMWebApplication.Models
{
    public class Story
    {

        public int StoryID { get; set; }
        public int UserID { get; set; }
        public string MediaType { get; set; }
        public string MediaURL { get; set; }
        public string StoryStatus { get; set; }
        public DateTime? StoryExpiryTimestamp { get; set; }
    }
}