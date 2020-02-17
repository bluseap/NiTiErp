using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NiTiErp.Application.ViewModels.Common;

namespace NiTiErp.Models
{
    public class ContactPageViewModel
    {
        public ContactViewModel Contact { set; get; }

        public FeedbackViewModel Feedback { set; get; }
    }
}
