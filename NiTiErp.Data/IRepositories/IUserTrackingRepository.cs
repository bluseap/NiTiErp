using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Data.Entities;
using NiTiErp.Infrastructure.Interfaces;

namespace NiTiErp.Data.IRepositories
{
    public interface IUserTrackingRepository : IRepository<UserTracking, int>
    {
    }
}
