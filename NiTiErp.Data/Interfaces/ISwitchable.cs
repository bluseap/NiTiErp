using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Data.Enums;

namespace NiTiErp.Data.Interfaces
{
    public interface ISwitchable
    {
        Status Status { set; get; }
    }
}
