using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.ViewModels.Corporation;
using NiTiErp.Utilities.Dtos;

namespace NiTiErp.Application.Interfaces
{
    public interface ICorporationServiceService
    {
        void Add(CorporationServiceViewModel corserVm);

        void Update(CorporationServiceViewModel corserVm);

        void Delete(string id);

        List<CorporationServiceViewModel> GetAll();

        PagedResult<CorporationServiceViewModel> GetAllPaging(string keyword, int page, int pageSize);

        CorporationServiceViewModel GetById(string id);

        void Save();
    }
}
