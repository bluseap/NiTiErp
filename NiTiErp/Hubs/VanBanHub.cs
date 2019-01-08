using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NiTiErp.Hubs
{
    public class VanBanHub : Hub
    {
        public void Send(string name, string message)
        {
            // Call the broadcastMessage method to update clients.
            Clients.All.SendAsync("broadcastMessage", name, message);
        }

        public async Task SendVanBanDenChuaXuLy(string message)
        {
            // Call the broadcastMessage method to update clients.
            await Clients.All.SendAsync("VanBanDenChuaXuLy", message);
        }

        public async Task SendVanBanDenDangXuLy(string message)
        {
            // Call the broadcastMessage method to update clients.
            await Clients.All.SendAsync("VanBanDenDangXuLy", message);
        }

        public async Task SendVanBanDenChoDuyet(string message)
        {
            // Call the broadcastMessage method to update clients.
            await Clients.All.SendAsync("VanBanDenChoDuyet", message);
        }

        public async Task SendVanBanDenChuaPhatHanh(string message)
        {
            // Call the broadcastMessage method to update clients.
            await Clients.All.SendAsync("VanBanDenChuaPhatHanh", message);
        }

        public async Task SendVanBanDenDienTu(string message)
        {
            // Call the broadcastMessage method to update clients.
            await Clients.All.SendAsync("VanBanDenDienTu", message);
        }

    }
}
