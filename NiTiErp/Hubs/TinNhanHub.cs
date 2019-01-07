using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NiTiErp.Hubs
{
    public class TinNhanHub : Hub
    {
        public async Task SendThongBaoMauXanh(string message)
        {
            // Call the broadcastMessage method to update clients.
            await Clients.All.SendAsync("ThongBaoMauXanh", message);
        }

    }
}
