using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class DaoTaoLopViewModel
    {
        public Guid Id { set; get; }

        public int InsUpDaoTaoLopId { set; get; }

        [StringLength(50)]
        public string KETQUA { get; set; }


        public int DaoTaoNoiId { set; get; }

        [StringLength(100)]
        public string TenTruong { get; set; }

        [StringLength(20)]
        public string LoaiDaoTaoDanhMucId { get; set; }

        [StringLength(1000)]
        public string TenLoaiHinhDaoTao { get; set; }

        [StringLength(20)]
        public string LoaiBangDanhMucId { get; set; }

        [StringLength(1000)]
        public string TenLoaiBang { get; set; }

        [StringLength(100)]
        public string ChuyenMon { get; set; }
        
        [StringLength(100)]
        public string NoiHoc { get; set; }
        
        [StringLength(100)]
        public string DiaChiHoc { get; set; }
        
        [StringLength(50)]
        public string SoDienThoai { get; set; }
        
        [StringLength(50)]
        public string Email { get; set; }

        public int SoLuongDangKy { set; get; }
        
        public int SoLuongHoc { set; get; }

        public DateTime NgayBatDau { set; get; }
        
        public DateTime NgayKetThuc { set; get; }

        public int SoTietHoc { set; get; }
        
        public int SoChungChiHoc { set; get; }
        
        [StringLength(1000)]
        public string Hinh { get; set; }



        public Guid DaoTaoGiaoVienId { get; set; }

        [StringLength(50)]
        public string GiaoVienTenGiaoVien { get; set; }

        [StringLength(50)]
        public string GiaoVienChucDanh { get; set; }

        [StringLength(50)]
        public string GiaoVienSoDienThoai { get; set; }
        
        [StringLength(50)]
        public string GiaoVienEmail { get; set; }
        


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
