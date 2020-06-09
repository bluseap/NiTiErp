using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Serialization;

namespace NiTiApp
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
            //services.AddDbContext<AppDbContext>(options =>
            //    options.UseSqlServer(Configuration.GetConnectionString("DbConnectionString")));
            //services.AddIdentity<AppUser, AppRole>()
            //    .AddEntityFrameworkStores<AppDbContext>()
            //    .AddDefaultTokenProviders();  
            //services.AddTransient<IUserStore<AppUser>, UserStore>();
            //services.AddTransient<IRoleStore<AppRole>, RoleStore>();

            services.AddMemoryCache();

            //services.AddMinResponse();

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

            //services.AddRecaptcha(new RecaptchaOptions()
            //{
            //    SiteKey = Configuration["Recaptcha:SiteKey"],
            //    SecretKey = Configuration["Recaptcha:SecretKey"]
            //});

            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromHours(2);
                options.Cookie.HttpOnly = true;
            });

            //services.AddImageResizer();
            //services.AddAutoMapper();
            
            services.AddAuthentication(options =>
            {
                //options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            })
                .AddFacebook(facebookOpts =>
                {
                    facebookOpts.AppId = Configuration["Authentication:Facebook:AppId"];
                    facebookOpts.AppSecret = Configuration["Authentication:Facebook:AppSecret"];
                })
                .AddGoogle(googleOpts =>
                {
                    googleOpts.ClientId = Configuration["Authentication:Google:ClientId"];
                    googleOpts.ClientSecret = Configuration["Authentication:Google:ClientSecret"];
                })
                .AddCookie(options =>
                {
                    options.LoginPath = "/Admin/Home/Index";
                })
                ;

            // Add application services.
            //services.AddScoped<UserManager<AppUser>, UserManager<AppUser>>();
            //services.AddScoped<RoleManager<AppRole>, RoleManager<AppRole>>();

            //services.AddSingleton(Mapper.Configuration);
            //services.AddScoped<IMapper>(sp => new Mapper(sp.GetRequiredService<AutoMapper.IConfigurationProvider>(), sp.GetService));

            //services.AddTransient<IEmailSender, EmailSender>();
            //services.AddTransient<IViewRenderService, ViewRenderService>();

            ////  services.AddTransient<DbInitializer>();
            //services.AddScoped<IUserClaimsPrincipalFactory<AppUser>, CustomClaimsPrincipalFactory>();
                       

            services.AddLocalization(opts => { opts.ResourcesPath = "Resources"; });

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
            .SetCompatibilityVersion(CompatibilityVersion.Version_2_1)

            //.AddViewLocalization(LanguageViewLocationExpanderFormat.Suffix,
            //        opts => { opts.ResourcesPath = "Resources"; })
            
            //.AddDataAnnotationsLocalization(otp =>
            //{
            //    otp.DataAnnotationLocalizerProvider = (type, factory) =>
            //    {
            //        var assemblyName = new AssemblyName(typeof(SharedResource).GetTypeInfo().Assembly.FullName);
            //        return factory.Create("SharedResource", assemblyName.Name);
            //    };
            //})

            .AddRazorPagesOptions(options => options.AllowAreas = true)

            .AddJsonOptions(options => options.SerializerSettings.ContractResolver = new DefaultContractResolver());

            services.AddCors(options => options.AddPolicy("CorsPolicy",
               builder =>
               {
                   builder.AllowAnyOrigin()
                       .AllowAnyHeader()
                       .WithOrigins("http://localhost:44342", "https://localhost:44342")
                       .AllowAnyMethod()
                       .AllowCredentials();
               }));

            //services.Configure<RequestLocalizationOptions>(
            // opts =>
            // {
            //     var supportedCultures = new List<CultureInfo>
            //     {
            //         new CultureInfo("vi-VN")
            //         //new CultureInfo("vi-VN"),
            //         //new CultureInfo("en-US")
            //     };
            //     opts.DefaultRequestCulture = new RequestCulture("vi-VN");
            //     // Formatting numbers, dates, etc.
            //     opts.SupportedCultures = supportedCultures;
            //     // UI strings that we have localized.
            //     opts.SupportedUICultures = supportedCultures;
            // });

            //services.AddTransient<IAppUserLoginRepository, AppUserLoginRepository>();
            //services.AddTransient<IFunctionRepository, FunctionRepository>();

           
            services.AddSignalR();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddFile("Logs/niti-{Date}.txt");
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                //app.UseBrowserLink();
                app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }
            //app.UseImageResizer();
            app.UseStaticFiles();
            //app.UseMinResponse();
            app.UseAuthentication();
            app.UseSession();

            var options = app.ApplicationServices.GetService<IOptions<RequestLocalizationOptions>>();
            app.UseRequestLocalization(options.Value);
            app.UseMvcWithDefaultRoute();

            app.UseCors("CorsPolicy");

            //app.UseSignalR(routes =>
            //{
            //    routes.MapHub<UserOnlineHub>("/useronlinehub");
            //});

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default55",                    
                    template: "{controller=Home}/{action=Index}/{id?}");

                //routes.MapRoute(
                //    name: "default4",
                //    template: "{area:exists}/{controller=Home}/{action=Index}/{id?}");
                //routes.MapAreaRoute(
                //    name: "default44",
                //    areaName: "CNews",
                //    template: "{controller=Home}/{action=Index}/{id?}");             

                //routes.MapAreaRoute(
                //    name: "ClientShop",
                //    areaName: "ClientShop",
                //    template: "{controller=Home}/{action=Index}/{id?}");         //  localhost/admin: login to client shop
            });
        }
    }
}
