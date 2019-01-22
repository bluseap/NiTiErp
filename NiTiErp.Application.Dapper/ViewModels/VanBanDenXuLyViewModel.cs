using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class VanBanDenXuLyViewModel
    {
        public long Id { get; set; }

        public string KETQUA { get; set; }

        public int InsertVBDXLId { get; set; }  

        public long VanBanDenDuyetId { get; set; }

        public DateTime NgayNhanVanBan { get; set; }

        public DateTime NgayBatDauXuLy { get; set; }

        public DateTime NgayXuLy { get; set; }

        public string GhiChuXuLy { get; set; }

        public bool IsXemDeBiet { get; set; }

        public DateTime NgayXemDeBiet { get; set; }

        public string GhiChuXemDeBiet { get; set; }

        public bool IsChuyenLanhDao { get; set; }

        public DateTime NgayChuyenLanhDao { get; set; }

        public string GhiChuChuyenLanhDao { get; set; }

        public bool IsSaiXuLy { get; set; }

        public DateTime NgaySaiXyLy { get; set; }

        public string GhiChuSaiXuLy { get; set; }

        public bool IsSaiChuyenLanhDao { get; set; }

        public DateTime NgaySaiChuyenLanhDao { get; set; }

        public string GhiChuSaiChuyenLanhDao { get; set; }

        public bool IsLanhDaoXem { get; set; }

        public DateTime NgayLanhDaoXem { get; set; }
        


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
