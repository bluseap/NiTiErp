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

        public void RegisterMemberPara(string name, string chatRoom)
        {
            var client = new AppUserLoginViewModel();
            client.ConnectionId = Context.ConnectionId;
            client.UserName = name;

            client.ChatRoom = ChatRoom.chatroom1;
            Groups.AddToGroupAsync(Context.ConnectionId, chatRoom);

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

        public Task SendMessageToGroup(string group, string message)
        {
            return Clients.Group(group).SendAsync("ClientMessageToGroup", message);
        }

        public Task JoinGroup(string group)
        {
            return Groups.AddToGroupAsync(Context.ConnectionId, group);
        }

        public void SendToUserIdMessage(string fromUserId, string toUserId, string fromUserName, string message)
        {
            string CurrentDateTime = DateTime.Now.ToString();

            // send to 
            Clients.Client(toUserId).SendAsync("sendPrivateMessage", fromUserId, fromUserName, message, UserImage, CurrentDateTime);

            // send to caller user
            //Clients.Caller.SendAsync("sendPrivateMessage", toUserId, fromUserName, message, UserImage, CurrentDateTime);
            Clients.Caller.SendAsync("sendPrivateMessage", toUserId, fromUserName, message, UserImage, CurrentDateTime);

        }

        public Task SendMessageToCaller(string message)
        {
            return Clients.Caller.SendAsync("sendPrivateMessage", message);
        }



    }
}
