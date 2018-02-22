using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Data.Entities;
using NiTiErp.Data.IRepositories;

namespace NiTiErp.Data.EF.Repositories
{
    public class UserTrackingRepository : EFRepository<UserTracking, int>, IUserTrackingRepository
    {
        public UserTrackingRepository(AppDbContext context) : base(context)
        {
        }
    }
}
