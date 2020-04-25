using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using NiTiErp.Data.Enums;
using NiTiErp.Data.Interfaces;
using NiTiErp.Infrastructure.SharedKernel;

namespace NiTiErp.Data.Entities
{
    [Table("ProductCategories")]
    public class ProductCategory : DomainEntity<int>,
        IHasSeoMetaData, ISwitchable, ISortable, IDateTracking,IUserTracking
    {
        public ProductCategory()
        {
            Products = new List<Product>();
        }

        public ProductCategory(string name, string description, int? parentId,int? homeOrder,
            string image,bool? homeFlag,int sortOrder,Status status,string seoPageTitle,string seoAlias,
            string seoKeywords, string seoDescription, string corporationId)
        {
            Name = name;           
            Description = description;
            ParentId = parentId;
            HomeOrder = homeOrder;
            Image = image;
            HomeFlag = homeFlag;
            SortOrder = sortOrder;
            Status = status;
            SeoPageTitle = seoPageTitle;
            SeoAlias = seoAlias;
            SeoKeywords = seoKeywords;
            SeoDescription = seoDescription;
            CorporationId = corporationId;
        }
        public string Name { get; set; }      

        public string Description { get; set; }

        public int? ParentId { get; set; }

        public int? HomeOrder { get; set; }

        public string Image { get; set; }

        public bool? HomeFlag { get; set; }

        public string CorporationId { get; set; }

        public DateTime DateCreated { set; get; }
        public DateTime DateModified { set; get; }
        public int SortOrder { set; get; }
        public Status Status { set; get; }
        public string SeoPageTitle { set; get; }
        public string SeoAlias { set; get; }
        public string SeoKeywords { set; get; }
        public string SeoDescription { set; get; }

        public virtual ICollection<Product> Products { set; get; }
        [StringLength(20)]
        public string UserCreated { set; get; }
        [StringLength(20)]
        public string UserModified { set; get; }
    }
}