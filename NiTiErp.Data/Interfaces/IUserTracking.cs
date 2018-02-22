using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Data.Interfaces
{
    public interface IUserTracking
    {
        [StringLength(20)]
        string UserCreated { set; get; }
        [StringLength(20)]
        string UserModified { set; get; }
    }
}
