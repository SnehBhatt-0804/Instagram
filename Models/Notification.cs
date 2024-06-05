using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMWebApplication.Models
{
    public class Notification
    {
        public int NotificationID { get; set; }
        public int UserID { get; set; }
        public string NotificationType { get; set; }
        public int? NotificationSenderUserID { get; set; }
        public int? NotificationPostID { get; set; }
        public string NotificationText { get; set; }
        public DateTime NotificationTimestamp { get; set; }
        public string NotificationStatus { get; set; }
    }
}