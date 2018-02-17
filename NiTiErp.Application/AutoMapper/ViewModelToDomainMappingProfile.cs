﻿using AutoMapper;
using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.ViewModels.Blog;
using NiTiErp.Application.ViewModels.Common;
using NiTiErp.Application.ViewModels.Product;
using NiTiErp.Application.ViewModels.System;
using NiTiErp.Application.ViewModels.Corporation;
using NiTiErp.Data.Entities;

namespace NiTiErp.Application.AutoMapper
{
    public class ViewModelToDomainMappingProfile : Profile
    {
        public ViewModelToDomainMappingProfile()
        {
            CreateMap<ProductCategoryViewModel, ProductCategory>()
                .ConstructUsing(c => new ProductCategory(c.Name, c.Description, c.ParentId, c.HomeOrder, c.Image, c.HomeFlag,
                c.SortOrder, c.Status, c.SeoPageTitle, c.SeoAlias, c.SeoKeywords, c.SeoDescription));

            CreateMap<ProductViewModel, Product>()
           .ConstructUsing(c => new Product(c.Name, c.CategoryId, c.Image, c.Price, c.OriginalPrice,
           c.PromotionPrice, c.Description, c.Content, c.HomeFlag, c.HotFlag, c.Tags, c.Unit, c.Status,
           c.SeoPageTitle, c.SeoAlias, c.SeoKeywords, c.SeoDescription));

            CreateMap<AppUserViewModel, AppUser>()
            .ConstructUsing(c => new AppUser(c.Id.GetValueOrDefault(Guid.Empty), c.FullName, c.UserName, 
            c.Email, c.PhoneNumber, c.Avatar, c.Status));

            CreateMap<PermissionViewModel, Permission>()
            .ConstructUsing(c => new Permission(c.RoleId, c.FunctionId, c.CanCreate, c.CanRead, c.CanUpdate, c.CanDelete));
            
            CreateMap<BillViewModel, Bill>()
              .ConstructUsing(c => new Bill(c.Id,c.CustomerName, c.CustomerAddress, 
              c.CustomerMobile, c.CustomerMessage, c.BillStatus, 
              c.PaymentMethod, c.Status, c.CustomerId));

            CreateMap<BillDetailViewModel, BillDetail>()
              .ConstructUsing(c => new BillDetail(c.Id, c.BillId, c.ProductId,
              c.Quantity, c.Price, c.ColorId, c.SizeId));


            CreateMap<ContactViewModel, Contact>()
                .ConstructUsing(c => new Contact(c.Id, c.Name, c.Phone, c.Email, c.Website, c.Address, c.Other, c.Lng, c.Lat, c.Status));

            CreateMap<CorporationViewModel, Corporation>()
                .ConstructUsing(c => new Corporation(c.Id, c.Name, c.Address, c.PhoneNumber1, c.PhoneNumber2, c.TaxNumber, c.Email, c.WebName, c.Image, c.ImageLogo, c.CorporationServiceId, c.DateCreated, c.DateModified));

            CreateMap<FeedbackViewModel, Feedback>()
                .ConstructUsing(c => new Feedback(c.Id, c.Name, c.Email, c.Message, c.Status));

            CreateMap<PageViewModel, Page>()
             .ConstructUsing(c => new Page(c.Id, c.Name, c.Alias, c.Content, c.Status));
        }
    }
}
