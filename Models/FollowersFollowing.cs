using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMWebApplication.Models
{
    public class FollowersFollowing
    {
        public int RelationshipID { get; set; }
        public int FollowerUserID { get; set; }
        public int FollowingUserID { get; set; }
        public bool IsFriend { get; set; }
        public string RequestStatus { get; set; }
        public DateTime FollowTimestamp { get; set; }
    }
}