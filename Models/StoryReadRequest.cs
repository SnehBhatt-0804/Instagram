using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMWebApplication.Models
{
    public class StoryReadRequest
    {
        public int UserId { get; set; }
        public int StoryId { get; set; }
    }
}