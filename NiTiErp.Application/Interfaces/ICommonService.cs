using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.ViewModels.Common;

namespace NiTiErp.Application.Interfaces
{
    public interface ICommonService
    {
        FooterViewModel GetFooter();
        List<SlideViewModel> GetSlides(string groupAlias);
        SystemConfigViewModel GetSystemConfig(string code);
    }
}
