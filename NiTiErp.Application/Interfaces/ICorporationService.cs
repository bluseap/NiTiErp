using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.ViewModels.Corporation;
using NiTiErp.Utilities.Dtos;

namespace NiTiErp.Application.Interfaces
{
    public interface ICorporationService
    { 
        void Add(CorporationViewModel corporationVm);

        void Update(CorporationViewModel corporationVm);

        void Delete(string id);

        string CorporationNewId();

        List<CorporationViewModel> GetAll();

        PagedResult<CorporationViewModel> GetAllPaging(string keyword, int page, int pageSize);

        CorporationViewModel GetById(string id);

        void Save();
    }
}
