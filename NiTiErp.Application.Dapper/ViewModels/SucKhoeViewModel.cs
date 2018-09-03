using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class SucKhoeViewModel
    {
        public string Id { set; get; }

        public int InsertUpdateSucKhoeId { set; get; }

        public int NamKham { set; get; }

        public Guid HoSoNhanVienId { set; get; }       

        [StringLength(1000)]
        public string Ten { get; set; }


        [StringLength(50)]
        public string CorporationId { get; set; }

        [StringLength(500)]
        public string TenKhuVuc { get; set; }

        [StringLength(20)]
        public string PhongBanDanhMucId { get; set; }

        [StringLength(1000)]
        public string TenPhong { get; set; }

        [StringLength(20)]
        public string ChucVuNhanVienId { get; set; }

        [StringLength(500)]
        public string TenChucVu { get; set; }

        [StringLength(2)]
        public string GioiTinh { get; set; }

        public DateTime NgaySinh { get; set; }


        public decimal CanNang { get; set; }

        public int CanNangIs { get; set; }

        public decimal ChieuCao { get; set; }

        public int ChieuCaoIs { get; set; }

        [StringLength(100)]
        public string HuyetAp { get; set; }

        public int HuyetApIs { get; set; }

        [StringLength(100)]
        public string Mat { get; set; }

        public int MatIs { get; set; }

        [StringLength(100)]
        public string TaiMuiHong { get; set; }

        public int TaiMuiHongIs { get; set; }

        [StringLength(100)]
        public string RangHamMat { get; set; }

        public int RangHamMatIs { get; set; }

        [StringLength(100)]
        public string SieuAmVungBung { get; set; }

        public int SieuAmVungBungIs { get; set; }

        [StringLength(100)]
        public string XQTimPhoi { get; set; }

        public int XQTimPhoiIs { get; set; }

        [StringLength(100)]
        public string DoDienTim { get; set; }

        public int DoDienTimIs { get; set; }

        [StringLength(100)]
        public string PhuKhoa { get; set; }

        public int PhuKhoaIs { get; set; }

        [StringLength(100)]
        public string PhetTBAmDao { get; set; }

        public int PhetTBAmDaoIs { get; set; }

        [StringLength(100)]
        public string CongThucMau { get; set; }

        public int CongThucMauIs { get; set; }

        [StringLength(100)]
        public string TPTNT { get; set; }

        public int TPTNTIs { get; set; }

        [StringLength(100)]
        public string GlucoDuong { get; set; }

        public int GlucoDuongIs { get; set; }

        [StringLength(100)]
        public string NhomMau { get; set; }

        public int NhomMauIs { get; set; }


        public int PhanLoaiSucKhoeId { get; set; }
        [StringLength(100)]
        public string PhanLoaiSucKhoe { get; set; }
       
        public string TenBenh { get; set; }

        public string HuongDieuTri { get; set; }

        public int TongIs { get; set; }

        [StringLength(100)]
        public string GhiChu { get; set; }        




        public int Status { get; set; }

        public int Stt { get; set; }

        public bool Active { get; set; }
        

        [StringLength(20)]
        public string CreateBy { get; set; }

        public DateTime CreateDate { get; set; }
        [StringLength(20)]
        public string UpdateBy { get; set; }

        public DateTime UpdateDate { get; set; }


    }
}
