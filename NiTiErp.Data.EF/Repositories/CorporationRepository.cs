using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Data.Entities;
using NiTiErp.Data.IRepositories;


namespace NiTiErp.Data.EF.Repositories
{
    public class CorporationRepository : EFRepository<Corporation, string>, ICorporationRepository
    {
        public CorporationRepository(AppDbContext context) : base(context)
        {
        }
    }
}
