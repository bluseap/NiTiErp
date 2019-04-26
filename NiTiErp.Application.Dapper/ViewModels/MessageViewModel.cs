using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class MessageViewModel
    {
        public long Id { get; set; }

        public int InsertMessageId { get; set; }

        [StringLength(50)]
        public string KETQUA { set; get; }

        public string FormAppUserId { get; set; }

        public string FromUserName { get; set; }

        public string FromAvatar { get; set; }


        public string ToAppUserId { get; set; }

        public string ToUserName { get; set; }

        public string ToAvatar { get; set; }



        public int RoomId { get; set; }

        public string TextMessage { get; set; }

        public DateTime TimeMessage { get; set; }

        public string Color { get; set; }

        public string Notes { get; set; }

                     

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
