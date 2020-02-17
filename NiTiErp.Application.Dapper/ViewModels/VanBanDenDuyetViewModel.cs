using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class VanBanDenDuyetViewModel
    {
        public long Id { set; get; }

        [StringLength(50)]
        public string KETQUA { set; get; }

        public int InsertVanBanDenDuyetId { set; get; }



        public long VanBanDenId { get; set; }

        public Guid HoSoNhanVienDuyetId { get; set; }

        public string TenNhanVienDuyet { get; set; }


        public DateTime NgayNhanVanBan { get; set; }

        public DateTime NgaySaiNhanVanBan { get; set; }

        public DateTime NgayDuyet { get; set; }

        public DateTime HanXuLy  { get; set; }

        public string ButPheLanhDao  { get; set; }

        public string GhiChu  { get; set; }

        public bool IsChuyenChuyenMon  { get; set; }

        public int VanBanPhoiHopXuLyId  { get; set; }

        public string TenPhoiHop { get; set; }


        public int VanBanNhomXuLyId { get; set; }

        public string TenNhom { get; set; }


        public DateTime NgayChuyenChuyenMon { get; set; }

        public string GhiChuChuyenChuyenMon { get; set; }

        public bool IsSaiChuyenMon { get; set; }

        public DateTime NgaySaiChuyenMon { get; set; }

        public string GhiChuSaiChuyenMon { get; set; }

        public bool IsDuyetPhatHanh { get; set; }

        public DateTime NgayDuyetPhatHanh { get; set; }

        public string GhiChuPhatHanh { get; set; }

        public bool IsDangXuLyXem { get; set; }

        public DateTime NgayDangXuLyXem { get; set; }

        public bool IsXuLyXem { get; set; }

        public DateTime NgayXuLyXem { get; set; }



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
