using System;
using System.Collections.Generic;
using System.Text;

using Dapper;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System.Linq;

namespace NiTiErp.Application.Dapper.Implementation
{
    public class RegisterDocSendService : IRegisterDocSendService
    {
        private readonly string _connectionString;
        //private readonly string _connectionStringErp;

        public RegisterDocSendService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
            //_connectionStringErp = configuration.GetConnectionString("DbConnectionStringErp");
        }

        public async Task<bool> CreateRegisterDocSendVBDDId (long vanbandenduyetId, string firebasenotifiId, string createBy)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                if (conn.State == System.Data.ConnectionState.Closed)
                    conn.Open();

                var paramaters = new DynamicParameters();

                paramaters.Add("@VanBanDenDuyetId", vanbandenduyetId);
                paramaters.Add("@FirebaseNotifiId", firebasenotifiId);
                paramaters.Add("@CreateBy", createBy);   

                try
                {
                    await conn.QueryAsync<RegisterDocSendViewModel>(
                        "Create_RegisterDocSend_VBDDId", paramaters, commandType: CommandType.StoredProcedure);
                    return true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }


    }
}
