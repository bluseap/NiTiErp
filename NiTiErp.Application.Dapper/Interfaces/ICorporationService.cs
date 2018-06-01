﻿using System;
using System.Collections.Generic;
using System.Text;

using System.Threading.Tasks;
using NiTiErp.Application.Dapper.ViewModels;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface ICorporationService
    {
        Task<List<CorporationViewModel>> CorporationGetList(string corporationServiceId, string id2, string id3, string parameters);

    }  
}
