﻿using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IChucDanhService
    {
        Task<List<ChucDanhViewModel>> ChucDanhGetList(string bangId, string id2, string id3, string parameters);
    }
}
