using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class VanBanDenViewModel
    {
        public Int64 Id { set; get; }

        public long VanBanDenId { get; set; }
        

        [StringLength(50)]
        public string KETQUA { set; get; }

        public int InsertVanBanDenId { set; get; }

        public Guid CodeFileGuidId { get; set; }

        [StringLength(250)]
        public string DuongDanFile { get; set; }


        [StringLength(500)]
        public string CorporationId { set; get; }

        [StringLength(500)]
        public string TenKhuVuc { set; get; }

        [StringLength(20)]
        public string PhongBanDanhMucId { get; set; }

        [StringLength(1000)]
        public string TenPhong { get; set; }

        [StringLength(20)]
        public string ChucVuNhanVienId { get; set; }

        [StringLength(500)]
        public string TenChucVu { get; set; }



        [StringLength(2000)]
        public string TrichYeuCuaVanBan { set; get; }

        public int VanBanLinhVucId { get; set; }

        public string TenLinhVuc { get; set; }

        public int VanBanLoaiId { get; set; }

        public string TenLoaiVanBan { get; set; }

        public DateTime NgayBanHanhCuaVanBan { get; set; }

        public DateTime NgayDenCuaVanBan { get; set; }

        public int VanBanDenSoId { get; set; }

        public int NamSoVanBan { get; set; }

        public string TenSoVanBan { get; set; }

        public int SoVanBanDen { get; set; }

        public int SoVanBanDenStt { get; set; }

        public string SoKyHieuCuaVanBan { get; set; }

        public string NguoiKyCuaVanBan { get; set; }

        public int VanBanCoQuanBanHanhId { get; set; }

        public string TenCoQuanBanHanh { get; set; }

        public string NoiLuuBanChinh { get; set; }

        public Guid HoSoNhanVienId { get; set; }

        public string TenLanhDaoDuyet { get; set; }

        public int VanBanKhanId { get; set; }

        public string TenVanBanKhan { get; set; }

        public int VanBanMatId { get; set; }

        public string TenVanBanMat { get; set; }

        public string GhiChu { get; set; }

        public int SoTo { get; set; }

        public bool IsVanBanDienTu { get; set; }

        public Int64 VanBanDienTuId { get; set; }

        public string TTXuLy { get; set; }

        public string TTDuyet { get; set; }

        public string TTDangXuLy { get; set; }

        public bool IsPhatHanh { get; set; }

        public DateTime NgayPhatHanh { get; set; }

        public string GhiChuPhatHanh { get; set; }

        public bool IsPhatHanhDienTu { get; set; }

        public string CorporationPhatHanhId { get; set; }

        public string TenKhuVucPhatHanh { get; set; }

        public bool IsLanhDaoXem { get; set; }

        public DateTime NgayLanhDaoXem  { get; set; }

        public string TenFile { get; set; }

        public string VBDXuLyFilePatch { get; set; }


        public int Status { get; set; }

        public bool Active { get; set; }

        public int Stt { get; set; }

        public DateTime CreateDate { get; set; }

        [StringLength(50)]
        public string CreateBy { get; set; }

        public DateTime UpdateDate { get; set; }

        [StringLength(50)]
        public string UpdateBy { get; set; }



    }
}


