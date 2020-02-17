using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Data.Entities;
using NiTiErp.Data.IRepositories;

namespace NiTiErp.Data.EF.Repositories
{
    public class ProductImageRepository : EFRepository<ProductImage, int>, IProductImageRepository
    {
        public ProductImageRepository(AppDbContext context) : base(context)
        {
        }
    }
}
