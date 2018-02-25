using AutoMapper;
using AutoMapper.QueryableExtensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NiTiErp.Application.Interfaces;
using NiTiErp.Application.ViewModels.Corporation;
using NiTiErp.Data.Entities;
using NiTiErp.Data.IRepositories;
using NiTiErp.Infrastructure.Interfaces;
using NiTiErp.Utilities.Dtos;

namespace NiTiErp.Application.Implementation
{
    public class CorporationService : ICorporationService
    {
        private ICorporationRepository _corporationRepository;
        private IUnitOfWork _unitOfWork;

        public CorporationService(ICorporationRepository corporationRepository,
            IUnitOfWork unitOfWork)
        {
            this._corporationRepository = corporationRepository;
            this._unitOfWork = unitOfWork;
        }

        public void Add(CorporationViewModel pageVm)
        {
            var page = Mapper.Map<CorporationViewModel, Corporation>(pageVm);
            _corporationRepository.Add(page);
        }

        public void Delete(string id)
        {
            _corporationRepository.Remove(id);
        }

        public void Dispose()
        {
            GC.SuppressFinalize(this);
        }

        public string CorporationNewId()
        {
            var query = _corporationRepository.FindAll().Max(p => p.Id.Substring(2, 4));

            string maxId = (int.Parse(query) + 1).ToString("D4");

            return maxId;
        }

        public List<CorporationViewModel> GetAll()
        {
            return _corporationRepository.FindAll().ProjectTo<CorporationViewModel>()
                .OrderByDescending(p => p.DateCreated).ToList();
        }

        public PagedResult<CorporationViewModel> GetAllPaging(string keyword, int page, int pageSize)
        {
            var query = _corporationRepository.FindAll();
            if (!string.IsNullOrEmpty(keyword))
                query = query.Where(x => x.Name.Contains(keyword));

            int totalRow = query.Count();
            var data = query.OrderByDescending(x => x.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize);

            var paginationSet = new PagedResult<CorporationViewModel>()
            {
                Results = data.ProjectTo<CorporationViewModel>().ToList(),
                CurrentPage = page,
                RowCount = totalRow,
                PageSize = pageSize
            };

            return paginationSet;
        }

        public CorporationViewModel GetById(string id)
        {
            return Mapper.Map<Corporation, CorporationViewModel>(_corporationRepository.FindById(id));
        }

        public void Save()
        {
            _unitOfWork.Commit();
        }

        public void Update(CorporationViewModel pageVm)
        {
            var page = Mapper.Map<CorporationViewModel, Corporation>(pageVm);
            _corporationRepository.Update(page);
        }
    }
}
