using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using NiTiErp.Application.Dapper.Implementation;
using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Application.Dapper.Interfaces;

namespace NiTiErp.Hubs
{
    public class ChatUserHub : Hub
    {        
        static string UserImage = "/admin-side/images/img.jpg";


        public Task SendMessageToUser2(string connectionId, string message)
        {
            return Clients.Client(connectionId).SendAsync("ClientSendMessageToUser2", message);
        }        

        public void RegisterMember(string name, string chatRoom)
        {
            var client = new AppUserLoginViewModel();
            client.ConnectionId = Context.ConnectionId;
            client.UserName = name;
            if (chatRoom == "chatRoom1")
            {
                client.ChatRoom = ChatRoom.chatroom1;
                Groups.AddToGroupAsync(Context.ConnectionId, "chatRoom1");
            }            
            ConnectionHelper.Connections.Add(client);
        }

        public Task GetChatRoom1Members()
        {
            return Clients.All.SendAsync("ClientGetChatRoom1Members", ConnectionHelper.Connections.Where(c => c.ChatRoom == ChatRoom.chatroom1));
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            var client = ConnectionHelper.Connections.FirstOrDefault(c => c.ConnectionId == Context.ConnectionId);
            if (client != null)
            {
                ConnectionHelper.Connections.Remove(client);
                Clients.All.SendAsync("ClientGetChatRoom1Members", ConnectionHelper.Connections.Where(c => c.ChatRoom == ChatRoom.chatroom1));
            }
            return base.OnDisconnectedAsync(exception);
        }



    }
}
