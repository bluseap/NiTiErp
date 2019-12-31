using System;
using System.Collections.Generic;
using System.IO;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using NiTiErp.Data.EF;

namespace NiTiErp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateWebHostBuilder(args).Build();
            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;

                try
                {
                    var dbInitializer = services.GetService<DbInitializer>();
                    dbInitializer.Seed().Wait();
                }
                catch (Exception ex)
                {
                    var logger = services.GetService<ILogger<Program>>();
                    logger.LogError(ex, "An error occurred while seeding the database");
                }
            }
            host.Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder (string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                //.UseStartup<Startup>()

                .UseIISIntegration()  
                .UseKestrel(options =>
                {
                    options.Limits.KeepAliveTimeout = TimeSpan.FromMinutes(120);
                    options.Limits.RequestHeadersTimeout = TimeSpan.FromMinutes(120);
                    //options.Limits.MaxRequestBodySize = 500_000_000;
                    //options.Limits.MaxRequestBufferSize = null;
                    //options.Limits.MaxResponseBufferSize = null;

                })
                //</ set upload timeout >

                .UseStartup<Startup>()  ;

    }
}
