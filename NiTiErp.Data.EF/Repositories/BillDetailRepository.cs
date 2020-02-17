using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Data.Entities;
using NiTiErp.Data.IRepositories;

namespace NiTiErp.Data.EF.Repositories
{
    public class BillDetailRepository : EFRepository<BillDetail, int>, IBillDetailRepository
    {
        public BillDetailRepository(AppDbContext context) : base(context)
        {
        }
    }
}
