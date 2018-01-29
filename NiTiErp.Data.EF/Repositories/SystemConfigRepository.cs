using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Data.Entities;
using NiTiErp.Data.IRepositories;

namespace NiTiErp.Data.EF.Repositories
{
    public class SystemConfigRepository : EFRepository<SystemConfig, string>, ISystemConfigRepository
    {
        public SystemConfigRepository(AppDbContext dbFactory) : base(dbFactory)
        {
        }
    }
}
