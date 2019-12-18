using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class VanBanDiViewModel
    {
        public long Id { get; set; }

        public int InsertVanBanDiId { get; set; }

        public string KETQUA { get; set; }

        public Guid CodeFileGuidId { get; set; }

        public string CorporationId { get; set; }

        public string TenKhuVuc { get; set; }

        public string TrichYeuCuaVanBan { get; set; }

        public int VanBanLinhVucId { get; set; }

        public string TenLinhVuc { get; set; }

        public int VanBanLoaiId { get; set; }

        public string TenLoaiVanBan { get; set; }

        public DateTime NgayBanHanhCuaVanBan { get; set; }

        public DateTime NgayDiCuaVanBan { get; set; }

        public int VanBanDiSoId { get; set; }

        public int NamSoVanBan { get; set; }

        public string TenSoVanBan { get; set; }

        public int SoVanBanDi { get; set; }

        public int SoVanBanDiStt { get; set; }

        public string SoKyHieuCuaVanBan { get; set; }

        public Guid HoSoNhanVienIdKyVB { get; set; }

        public string TenNhanVienKyVBDi { get; set; }

        public Guid HoSoNhanVienIdSoanVB { get; set; }

        public string TenNhanVienSoanVBDi { get; set; }

        public string YKienSoanVB { get; set; }

        public int VanBanKhanId { get; set; }

        public string TenVanBanKhan { get; set; }

        public int VanBanMatId { get; set; }

        public string TenVanBanMat { get; set; }

        public Guid LDDuyetHoSoNhanVienId { get; set; }

        public string TenLDDuyetVBDi { get; set; }

        public string ChucVuTenLDDuyetVBDi { get; set; }


        public string GhiChu { get; set; }

        public int SoTo { get; set; }

        public int SoBanPhatHanh { get; set; }

        public int VanBanCoQuanBanHanhId { get; set; }

        public string CacDonViNhanVanBan { get; set; }

        public string TenCoQuanBanHanh { get; set; }

        public string NoiLuuBanChinh { get; set; }

        public bool IsVanBanDienTu { get; set; }

        public long VanBanDienTuId { get; set; }

        public int TTChoXuLy { get; set; }

        public int TTChoDuyet { get; set; }

        public int TTChuaPhatHanh { get; set; }

        public bool IsVanBanDenId { get; set; }

        public long VanBanDenId { get; set; }

        public DateTime VanBanDenNgayNhap { get; set; }

        public bool IsPhatHanh { get; set; }

        public DateTime NgayPhatHanh { get; set; }

        public string GhiChuPhatHanh { get; set; }

        public bool IsPhatHanhDienTu { get; set; }

        public string CorporationPhatHanhId { get; set; }

        public bool IsLanhDaoXem { get; set; }

        public bool IsChuyenLanhDao { get; set; }

        public DateTime NgayChuyenLanhDao { get; set; }

        public String GhiChuChuyenLanhDao { get; set; }

        public bool IsSaiDuyet { get; set; }

        public DateTime NgaySaiDuyet { get; set; }

        public string GhiChuSaiDuyet { get; set; }

        public string DuongDanFile { get; set; }

        public int VBDiCoQuanBanHanhId { get; set; }


        public string DocCode { get; set; }

        public long QuanLyVanBanId { get; set; }

        public string LanguageId { get; set; }

        public int SoLuongPhatHanh { get; set; }

        public DateTime HanTraLoiVanBan { get; set; }

        public int SoThuTuTrongHoSo { get; set; }


        public int SoTrang { get; set; }

        public string TenNoiNhan { get; set; }



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
