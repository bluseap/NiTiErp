﻿using NiTiErp.Application.Dapper.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface ILockService
    {
        Task<List<LockViewModel>> LockGetList(string bangId, string id2, string id3, string parameters);
    }
}
