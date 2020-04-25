using System;
using System.Collections.Generic;
using System.Text;

namespace NiTiErp.Data.Interfaces
{
    public interface IHasSoftDelete
    {
        bool IsDeleted { set; get; }
    }
}
