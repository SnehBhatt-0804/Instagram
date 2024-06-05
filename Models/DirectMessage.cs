using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMWebApplication.Models
{
    public class DirectMessage
    {
        public int MessageID { get; set; }
        public int SenderUserID { get; set; }
        public int ReceiverUserID { get; set; }
        public string MessageText { get; set; }
        public DateTime MessageTimestamp { get; set; }
        public string MessageStatus { get; set; }
    }
}