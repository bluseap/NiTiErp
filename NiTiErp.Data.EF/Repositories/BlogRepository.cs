using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NiTiErp.Data.Entities;
using NiTiErp.Data.Enums;
using NiTiErp.Data.IRepositories;

namespace NiTiErp.Data.EF.Repositories
{
    public class BlogRepository : EFRepository<Blog, int>, IBlogRepository
    {
        public BlogRepository(AppDbContext context) : base(context)
        {
        }
    }
}
