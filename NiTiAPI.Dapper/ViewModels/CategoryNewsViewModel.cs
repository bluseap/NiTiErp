using System;
using System.Collections.Generic;
using System.Text;

namespace NiTiAPI.Dapper.ViewModels
{
    public class CategoryNewsViewModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int ParentId { get; set; }

        public int SortOrder { get; set; }

        public bool ShowInMenu { get; set; }

        public bool ShowInHome { get; set; }

        public string Thumbnail { get; set; }


        public int Status { get; set; }

        public bool Active { get; set; }       

        public DateTime CreateDate { get; set; }

        public string CreateBy { get; set; }

        public DateTime UpdateDate { get; set; }

        public string UpdateBy { get; set; }

    }
}
