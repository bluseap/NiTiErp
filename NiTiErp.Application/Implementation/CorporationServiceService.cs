using AutoMapper;
using AutoMapper.QueryableExtensions;
using NiTiErp.Application.Interfaces;
using NiTiErp.Application.ViewModels.Corporation;
using NiTiErp.Data.IRepositories;
using NiTiErp.Infrastructure.Interfaces;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;

namespace NiTiErp.Application.Implementation
{
    public class CorporationServiceService : ICorporationServiceService
    {
        private ICorporationServiceRepository _corserRepository;
        private IUnitOfWork _unitOfWork;

        public CorporationServiceService(ICorporationServiceRepository corserRepository,
            IUnitOfWork unitOfWork)
        {
            this._corserRepository = corserRepository;
            this._unitOfWork = unitOfWork;
        }

        public void Add(CorporationServiceViewModel pageVm)
        {
            var page = Mapper.Map<CorporationServiceViewModel, Data.Entities.CorporationService>(pageVm);
            _corserRepository.Add(page);
        }

        public void Delete(string id)
        {
            _corserRepository.Remove(id);
        }

        public void Dispose()
        {
            GC.SuppressFinalize(this);
        }

        public List<CorporationServiceViewModel> GetAll()
        {
            return _corserRepository.FindAll().ProjectTo<CorporationServiceViewModel>()
                .OrderBy(p => p.Order).ToList();
        }

        public PagedResult<CorporationServiceViewModel> GetAllPaging(string keyword, int page, int pageSize)
        {
            var query = _corserRepository.FindAll();
            if (!string.IsNullOrEmpty(keyword))
                query = query.Where(x => x.Name.Contains(keyword));

            int totalRow = query.Count();
            var data = query.OrderByDescending(x => x.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize);

            var paginationSet = new PagedResult<CorporationServiceViewModel>()
            {
                Results = data.ProjectTo<CorporationServiceViewModel>().ToList(),
                CurrentPage = page,
                RowCount = totalRow,
                PageSize = pageSize
            };

            return paginationSet;
        }

        public CorporationServiceViewModel GetById(string id)
        {
            return Mapper.Map<Data.Entities.CorporationService, CorporationServiceViewModel>(_corserRepository.FindById(id));
        }

        public void Save()
        {
            _unitOfWork.Commit();
        }

        public void Update(CorporationServiceViewModel pageVm)
        {
            var page = Mapper.Map<CorporationServiceViewModel, Data.Entities.CorporationService>(pageVm);
            _corserRepository.Update(page);
        }
    }
}