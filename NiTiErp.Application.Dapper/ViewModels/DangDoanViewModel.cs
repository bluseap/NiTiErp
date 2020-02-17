using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class DangDoanViewModel
    {
        [StringLength (50)]
        public string Parameters { set; get; }

        [StringLength (50)]
        public string KETQUA { set; get; }

        public int InsertUpdateDangDoanId { set; get; }

        public int InsertUpdateDangId { set; get; }
        public int InsertUpdateDoanId { set; get; }
        public int InsertUpdateCongDoanId { set; get; }
        public int InsertUpdateCachMangId { set; get; }
        public int InsertUpdateNhapNguId { set; get; }


        public string ThamGiaDangId { set; get; }
        public string ThamGiaDoanId { set; get; }
        public string ThamGiaCongDoanId { set; get; }
        public string ThamGiaCachMangId { set; get; }
        public string ThamGiaQuanDoiId { set; get; }


        public Guid HoSoNhanVienId { get; set; }

       
        public DateTime NgayVaoDang { get; set; }

        [StringLength(50)]
        public string MaTheDang { get; set; }

        [StringLength(50)]
        public string ChucVuDangId { get; set; }

        [StringLength(100)]
        public string TenChucVuDang { get; set; }

        [StringLength(500)]
        public string NoiSinhHoatDang { get; set; }


        public DateTime NgayVaoDoan { get; set; }

        [StringLength(50)]
        public string MaTheDoan { get; set; }

        [StringLength(50)]
        public string ChucVuDoanId { get; set; }

        [StringLength(100)]
        public string TenChucVuDoan { get; set; }

        [StringLength(500)]
        public string NoiSinhHoatDoan { get; set; }


        public DateTime NgayVaoCongDoan { get; set; }

        [StringLength(50)]
        public string MaTheCongDoan { get; set; }

        [StringLength(50)]
        public string ChucVuCongDoanId { get; set; }

        [StringLength(100)]
        public string TenChucVuCongDoan { get; set; }

        [StringLength(500)]
        public string NoiSinhHoatCongDoan { get; set; }


        public DateTime NgayThamGiaCachMang { get; set; }

        [StringLength(2000)]
        public string DacDiemBanThanCu { get; set; }

        [StringLength(2000)]
        public string DacDiemBanThanMoi { get; set; }


        public DateTime NgayNhapNgu { get; set; }
        public DateTime NgayXuatNgu { get; set; }

        [StringLength(20)]
        public string ChucVuQuanDoiId { get; set; }

        [StringLength(1000)]
        public string TenChucVuQuanDoi { get; set; }

        [StringLength(20)]
        public string CapBacQuanDoiId { get; set; }

        [StringLength(1000)]
        public string TenCapBac { get; set; }

        [StringLength(1000)]
        public string DonViQuanDoi { get; set; }       


        public DateTime CreateDate { get; set; }

        [StringLength(20)]
        public string CreateBy { get; set; }

        public DateTime UpdateDate { get; set; }

        [StringLength(20)]
        public string UpdateBy { get; set; }


    }
}
