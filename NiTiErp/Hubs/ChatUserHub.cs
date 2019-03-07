using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using NiTiErp.Application.Dapper.ViewModels;

namespace NiTiErp.Hubs
{
    public class ChatUserHub : Hub
    {

        static List<AppUserViewModel> ConnectedUsers = new List<AppUserViewModel>();
        static List<MessagesViewModel> CurrentMessage = new List<MessagesViewModel>();
        //ConnClass ConnC = new ConnClass();
        string UserImage = "/admin-side/images/img.jpg";

        //public void Connect(string userName, string CurrentMessage)
        //{
        //    var id = Context.ConnectionId;
        //    if (ConnectedUsers.Count(x => x.ConnectionId == id) == 0)
        //    {
        //        string UserImg = UserImage;
        //        string logintime = DateTime.Now.ToString();
        //        ConnectedUsers.Add(new AppUserViewModel { ConnectionId = id, UserName = userName, UserImage = UserImg, LoginTime = logintime });
        //        // send to caller
        //        Clients.Caller.SendAsync("clientConnect", id, userName, ConnectedUsers, CurrentMessage);
        //        // send to all except caller client
        //        Clients.AllExcept(id).SendAsync("clientConnect", id, userName, UserImg, logintime);
        //    }
        //}
        public async Task SendConnect(string userName)
        {
            var id = Context.ConnectionId;
            if (ConnectedUsers.Count(x => x.ConnectionId == id) == 0)
            {                
                await Clients.All.SendAsync("clientSendConnect", userName);
            }            
        }

        public Task SendRemove(string user, string message)
        {
            return Clients.All.SendAsync("clientSendRemove", user, message);
        }

        public Task SendMessageToCaller(string message)
        {
            return Clients.Caller.SendAsync("clientCallerSendConnect", message);
        }

        public Task SendMessageToGroup(string message)
        {
            return Clients.Group("SignalR Users").SendAsync("clientGroupSendConnect", message);
        }


        public override async Task OnDisconnectedAsync(Exception ex)
        {
            await Clients.All.SendAsync("UserDisconnected", Context.ConnectionId);
            await base.OnDisconnectedAsync(ex);
        }



    }
}
