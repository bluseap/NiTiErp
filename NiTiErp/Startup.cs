﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Serialization;
using NiTiErp.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using PaulMiami.AspNetCore.Mvc.Recaptcha;
using Microsoft.AspNetCore.Mvc;

using NiTiErp.Data;
using NiTiErp.Models;
using NiTiErp.Services;
using NiTiErp.Data.EF;
using NiTiErp.Data.Entities;
using NiTiErp.Data.EF.Repositories;
using NiTiErp.Data.IRepositories;
using NiTiErp.Application.Interfaces;
using NiTiErp.Application.Implementation;
using NiTiErp.Helpers;
using NiTiErp.Authorization;
using NiTiErp.Extensions;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Application.Dapper.Implementation;

namespace NiTiErp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"),
                o => o.MigrationsAssembly("NiTiErp.Data.EF")));

            

            services.AddIdentity<AppUser, AppRole>()
                .AddEntityFrameworkStores<AppDbContext>()
                .AddDefaultTokenProviders();

            services.AddMemoryCache();

            services.AddMinResponse();

            // Configure Identity
            services.Configure<IdentityOptions>(options =>
            {
                // Password settings
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;

                // Lockout settings
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
                options.Lockout.MaxFailedAccessAttempts = 10;

                // User settings
                options.User.RequireUniqueEmail = true;
            });

            services.AddRecaptcha(new RecaptchaOptions()
            {
                SiteKey = Configuration["Recaptcha:SiteKey"],
                SecretKey = Configuration["Recaptcha:SecretKey"]
            });

            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromHours(2);
                options.Cookie.HttpOnly = true;
            });
            services.AddImageResizer();
            services.AddAutoMapper();
            services.AddAuthentication()
                .AddFacebook(facebookOpts =>
                {
                    facebookOpts.AppId = Configuration["Authentication:Facebook:AppId"];
                    facebookOpts.AppSecret = Configuration["Authentication:Facebook:AppSecret"];
                })
                .AddGoogle(googleOpts => {
                    googleOpts.ClientId = Configuration["Authentication:Google:ClientId"];
                    googleOpts.ClientSecret = Configuration["Authentication:Google:ClientSecret"];
                });
            // Add application services.
            services.AddScoped<UserManager<AppUser>, UserManager<AppUser>>();
            services.AddScoped<RoleManager<AppRole>, RoleManager<AppRole>>();

            services.AddSingleton(Mapper.Configuration);
            services.AddScoped<IMapper>(sp => new Mapper(sp.GetRequiredService<AutoMapper.IConfigurationProvider>(), sp.GetService));

            services.AddTransient<IEmailSender, EmailSender>();
            services.AddTransient<IViewRenderService, ViewRenderService>();

            services.AddTransient<DbInitializer>();

            services.AddScoped<IUserClaimsPrincipalFactory<AppUser>, CustomClaimsPrincipalFactory>();

            services.AddMvc(options =>
            {
                options.CacheProfiles.Add("Default",
                    new CacheProfile()
                    {
                        Duration = 60
                    });
                options.CacheProfiles.Add("Never",
                    new CacheProfile()
                    {
                        Location = ResponseCacheLocation.None,
                        NoStore = true
                    });
            })
                .AddJsonOptions(options => options.SerializerSettings.ContractResolver = new DefaultContractResolver());

            services.AddTransient(typeof(IUnitOfWork), typeof(EFUnitOfWork));
            services.AddTransient(typeof(IRepository<,>), typeof(EFRepository<,>));

            //Repositories
            services.AddTransient<IProductCategoryRepository, ProductCategoryRepository>();
            services.AddTransient<IFunctionRepository, FunctionRepository>();
            services.AddTransient<IProductRepository, ProductRepository>();
            services.AddTransient<ITagRepository, TagRepository>();
            services.AddTransient<IProductTagRepository, ProductTagRepository>();
            services.AddTransient<IPermissionRepository, PermissionRepository>();
            services.AddTransient<IBillRepository, BillRepository>();
            services.AddTransient<IBillDetailRepository, BillDetailRepository>();
            services.AddTransient<IColorRepository, ColorRepository>();
            services.AddTransient<ISizeRepository, SizeRepository>();
            services.AddTransient<IProductQuantityRepository, ProductQuantityRepository>();
            services.AddTransient<IProductImageRepository, ProductImageRepository>();
            services.AddTransient<IWholePriceRepository, WholePriceRepository>();
            services.AddTransient<IFeedbackRepository, FeedbackRepository>();
            services.AddTransient<IContactRepository, ContactRepository>();
            services.AddTransient<IBlogRepository, BlogRepository>();
            services.AddTransient<IPageRepository, PageRepository>();

            services.AddTransient<IBlogTagRepository, BlogTagRepository>();
            services.AddTransient<ISlideRepository, SlideRepository>();
            services.AddTransient<ISystemConfigRepository, SystemConfigRepository>();

            services.AddTransient<IFooterRepository, FooterRepository>();

            services.AddTransient<ICorporationRepository, CorporationRepository>();
            services.AddTransient<ICorporationServiceRepository, CorporationServiceRepository>();

            //Serrvices
            services.AddTransient<IProductCategoryService, ProductCategoryService>();
            services.AddTransient<Application.Interfaces.IFunctionService, Application.Implementation.FunctionService>();
            services.AddTransient<IProductService, ProductService>();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IRoleService, RoleService>();
            services.AddTransient<IBillService, BillService>();
            services.AddTransient<IBlogService, BlogService>();
            services.AddTransient<ICommonService, CommonService>();
            services.AddTransient<IFeedbackService, FeedbackService>();
            services.AddTransient<IContactService, ContactService>();
            services.AddTransient<Application.Interfaces.ICorporationService, Application.Implementation.CorporationService>();
            services.AddTransient<ICorporationServiceService, Application.Implementation.CorporationServiceService>();

            services.AddTransient<IPageService, PageService>();

            //dung Dapper
            services.AddTransient<NiTiErp.Application.Dapper.Interfaces.IFunctionService,
                NiTiErp.Application.Dapper.Implementation.FunctionService>();
            services.AddTransient<IReportService, ReportService>();
            services.AddTransient<IAppUserRolesService, AppUserRolesService>();
            services.AddTransient<IProductsImagesService, ProductsImagesService>();

            services.AddTransient<Application.Dapper.Interfaces.ICorporationService, Application.Dapper.Implementation.CorporationService>();
            services.AddTransient<IPhongDanhMucService, PhongDanhMucService>();
            services.AddTransient<IHonNhanService, HonNhanService>();

            services.AddTransient<IDanTocService, DanTocService>();
            services.AddTransient<ITonGiaoService, TonGiaoService>();
            services.AddTransient<IXuatThanService, XuatThanService>();
            services.AddTransient<ILoaiBangService, LoaiBangService>();
            services.AddTransient<ILoaiDaoTaoService, LoaiDaoTaoService>();
            services.AddTransient<IXepLoaiService, XepLoaiService>();
            services.AddTransient<ILoaiHopDongService, LoaiHopDongService>();
            services.AddTransient<IChucVuDangService, ChucVuDangService>();
            services.AddTransient<IChucVuDoanService, ChucVuDoanService>();
            services.AddTransient<IChucVuCongDoanService, ChucVuCongDoanService>();
            services.AddTransient<IChucVuQuanDoiService, ChucVuQuanDoiService>();
            services.AddTransient<ICapBacQuanDoiService, CapBacQuanDoiService>();
            services.AddTransient<IChucVuNhanVienService, ChucVuNhanVienService>();
            services.AddTransient<IHoSoNhanVienService, HoSoNhanVienService>();
            services.AddTransient<ITrinhDoService, TrinhDoService>();
            services.AddTransient<IHopDongService, HopDongService>();
            services.AddTransient<IDangDoanService, DangDoanService>();
            services.AddTransient<ICongViecService, CongViecService>();

            services.AddTransient<IAuthorizationHandler, BaseResourceAuthorizationHandler>();


        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddFile("Logs/tedu-{Date}.txt");

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseBrowserLink();
                app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseImageResizer();
            app.UseStaticFiles();
            app.UseMinResponse();
            app.UseAuthentication();
            app.UseSession();
            

            app.UseMvc(routes =>
            {
                //routes.MapRoute(
                //    name: "default",
                //    template: "{controller=Home}/{action=Index}/{id?}");

                //routes.MapRoute(
                //    name: "default",
                //    template: "{controller=HomeNews}/{action=Index}/{id?}");               

                routes.MapRoute(
                   name: "areaRoute",
                   template: "{area:exists}/{controller=Login}/{action=Index}/{id?}");

                routes.MapAreaRoute(
                    name: "default",
                    areaName: "Admin",
                    template: "{controller=Login}/{action=Index}/{id?}");

                //routes.MapRoute(
                //    name: "areaRoute",
                //    template: "{area:exists}/{controller=Login}/{action=Index}/{id?}");

                //routes.MapRoute(
                //    name: "areaClientRoute",
                //    template: "{area:exists}/{controller=CorporationClient}/{action=Index}/{id?}");

            });

        }
    }
}
