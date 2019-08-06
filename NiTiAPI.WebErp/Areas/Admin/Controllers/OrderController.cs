using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using NiTiAPI.Dapper.Repositories.Interfaces;
using NiTiAPI.Dapper.ViewModels;
using NiTiAPI.WebErp.Filters;

namespace NiTiAPI.WebErp.Areas.Admin.Controllers
{
    public class OrderController : BaseController
    {
        private readonly IOrderRepository _order;
        private readonly IOrderDetailsRepository _orderDetailsRepository;
        private readonly IAttributeOptionValueRepository _attributeOption;

        public OrderController(IOrderRepository order, IOrderDetailsRepository orderDetailsRepository,
            IAttributeOptionValueRepository attributeOption)
        {
            _order = order;
            _orderDetailsRepository = orderDetailsRepository;
            _attributeOption = attributeOption;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetId(long id)
        {
            var model = await _order.GetById(id);
            return new OkObjectResult(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetPaging(string keyword, int corporationId,
           int pageIndex, int pageSize)
        {
            var model = await _order.GetAllPagingOrder(corporationId, keyword, pageIndex, pageSize);
            return new OkObjectResult(model);
        }

        [HttpPost]
        [ClaimRequirement(FunctionCode.SALES_ORDER, ActionCode.UPDATE)]
        public async Task<IActionResult> UpdateOrder(OrderViewModel orderVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                orderVm.UpdateDate = DateTime.Now;
                var order = await _order.UpdateOrder(orderVm);
                return new OkObjectResult(order);
            }
        }

        [HttpPost]
        [ClaimRequirement(FunctionCode.SALES_ORDER, ActionCode.DELETE)]
        public async Task<IActionResult> DeleteOrder(long Id, string username)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var role = await _order.DeleteOrder(Id, username);
                return new OkObjectResult(role);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetListAttriSizes(string codeSize, string language)
        {
            var model = await _attributeOption.GetByAttriCodeSize(codeSize, language);
            return new OkObjectResult(model);
        }

        #region Order Details

        [HttpGet]
        [ClaimRequirement(FunctionCode.SALES_ORDER, ActionCode.VIEW)]
        public async Task<IActionResult> GetListOrderDetail(long orderId, string languageId)
        {
            var model = await _orderDetailsRepository.GetListOrderDetails(orderId, languageId);
            return new OkObjectResult(model);
        }

        #endregion

    }
}