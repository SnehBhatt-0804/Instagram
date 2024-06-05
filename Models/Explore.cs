using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMWebApplication.Models
{
    public class Explore
    {
        public int ExploreID { get; set; }
        public int PostID { get; set; }
        public DateTime? PostTimestamp { get; set; }
        public int? PostPopularityScore { get; set; }
        public string PostSource { get; set; }
    }

}