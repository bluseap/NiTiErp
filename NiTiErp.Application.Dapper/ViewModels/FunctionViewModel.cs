using NiTiErp.Data.Enums;
using System.ComponentModel.DataAnnotations;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class FunctionViewModel
    {
        public string Id { get; set; }

        public string IconCss { get; set; }

        [Required]
        [StringLength(128)]
        public string Name { set; get; }        

        [StringLength(128)]
        public string ParentId { set; get; }
     
        public int SortOrder { set; get; }

        public Status Status { set; get; }

        [Required]
        [StringLength(250)]
        public string URL { set; get; }


    }
}