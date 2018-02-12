using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NiTiErp.Data.EF.Extensions;
using NiTiErp.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace NiTiErp.Data.EF.Configurations
{
    public class CorporationServiceConfiguration : DbEntityConfiguration<CorporationService>
    {
        public override void Configure(EntityTypeBuilder<CorporationService> entity)
        {
            entity.Property(c => c.Id).HasMaxLength(50)
                .IsRequired().HasColumnType("varchar(50)");
        }
    }
}
