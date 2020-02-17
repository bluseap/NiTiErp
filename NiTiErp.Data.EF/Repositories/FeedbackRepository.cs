using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Data.Entities;
using NiTiErp.Data.IRepositories;

namespace NiTiErp.Data.EF.Repositories
{
    public class FeedbackRepository : EFRepository<Feedback, int>, IFeedbackRepository
    {
        public FeedbackRepository(AppDbContext context) : base(context)
        {
        }
    }
}
