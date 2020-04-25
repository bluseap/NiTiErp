using AutoMapper;
using AutoMapper.QueryableExtensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NiTiErp.Application.Interfaces;
using NiTiErp.Application.ViewModels.Blog;
using NiTiErp.Application.ViewModels.Common;
using NiTiErp.Data.Entities;
using NiTiErp.Data.IRepositories;
using NiTiErp.Infrastructure.Interfaces;
using NiTiErp.Utilities.Constants;
using NiTiErp.Utilities.Dtos;
using NiTiErp.Utilities.Helpers;

namespace NiTiErp.Application.Implementation
{
    public class CommonService : ICommonService
    {
        IFooterRepository _footerRepository;
        ISystemConfigRepository _systemConfigRepository;
        IUnitOfWork _unitOfWork;
        ISlideRepository _slideRepository;
        public CommonService(IFooterRepository footerRepository,
            ISystemConfigRepository systemConfigRepository,
            IUnitOfWork unitOfWork,
            ISlideRepository slideRepository)
        {
            _footerRepository = footerRepository;
            _unitOfWork = unitOfWork;
            _systemConfigRepository = systemConfigRepository;
            _slideRepository = slideRepository;
        }

        public FooterViewModel GetFooter()
        {
            return Mapper.Map<Footer, FooterViewModel>(_footerRepository.FindSingle(x => x.Id ==
            CommonConstants.DefaultFooterId));
        }

        public List<SlideViewModel> GetSlides(string groupAlias)
        {
            return _slideRepository.FindAll(x => x.Status && x.GroupAlias == groupAlias)
                .ProjectTo<SlideViewModel>().ToList();
        }

        public SystemConfigViewModel GetSystemConfig(string code)
        {
            return Mapper.Map<SystemConfig, SystemConfigViewModel>(_systemConfigRepository.FindSingle(x => x.Id == code));
        }
    }
}
