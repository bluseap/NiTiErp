using System;
using System.Collections.Generic;
using System.Text;

using System.Data;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Xml.Linq;
using System.Data.SqlClient;
using System.Collections;

using NiTiErp.Application.Dao.Implementation;
using NiTiErp.Application.Dao.Interfaces;

namespace NiTiErp.Application.Dao.Implementation
{
    public class HoSoNhanVienDao : IHoSoNhanVienDao
    {
        private readonly Database _db;

        public HoSoNhanVienDao(Database db)
        {
            _db = db;
        }

        public DataSet HoSoNhanVienGetList(string corporationId, string phongId, string keyword,
                string hosoId, string hosoId2, string hosoId3, string parameters)
        {
            //Database db = new Database();
            SqlParameter[] prams = {
                    _db.MakeInParam("@corporationId", SqlDbType.VarChar  , 20, corporationId),
                    _db.MakeInParam("@phongId", SqlDbType.VarChar  , 20, phongId),
                    _db.MakeInParam("@keyword", SqlDbType.NVarChar  , 1000, keyword),
                    _db.MakeInParam("@hosoId", SqlDbType.UniqueIdentifier  , 1000, hosoId),
                    _db.MakeInParam("@hosoId2", SqlDbType.UniqueIdentifier  , 1000, hosoId2),
                    _db.MakeInParam("@hosoId3", SqlDbType.UniqueIdentifier  , 1000, hosoId3),

                    _db.MakeInParam("@parameters", SqlDbType.VarChar  , 50, parameters)
                };
            DataSet ds = _db.RunExecProc("HoSoNhanVienGetList", prams);
            _db.Dispose();
            return ds;
        }


    }
}