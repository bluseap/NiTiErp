using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Data.Entities;
using NiTiErp.Data.IRepositories;

namespace NiTiErp.Data.EF.Repositories
{
    public class CorporationServiceRepository : EFRepository<CorporationService, string>, ICorporationServiceRepository
    {
        public CorporationServiceRepository(AppDbContext context) : base(context)
        {
        }
    }
}
