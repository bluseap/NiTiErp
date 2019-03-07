
var corporationId = $("#hidUserCorporationId").val();
var fullName = $("#hidUserFullName").val();
var userNameId = $("#hidUserName").val();
var UserImage = "/admin-side/images/img.jpg";
var UserImage2 = $("#hidLoginUserImgae2").val();

var dateNow = new Date();
//var localdate = dateFormat(dateNow, "dddd, mmmm dS, yyyy, h:MM:ss TT");



const connectionChatUser = new signalR.HubConnectionBuilder().withUrl("/chatuser").build();
var chatHub = connectionChatUser;

registerClientMethods(connectionChatUser, userNameId);

connectionChatUser.start()
    .then(function () {
        //registerClientMethods(connectionChatUser, userNameId);
        AddUser(chatHub, userNameId, userNameId, UserImage, dateNow);
    })
    .catch(function (error) {
        console.error(error.message);
    });

// Declare a proxy to reference the hub.

//registerClientMethods(chatHub);

//$.ajax({
//    type: 'GET',
//    url: '/admin/chatuser/GetCallerUserOnline',
//    data: {
//        username: userNameId
//    },
//    dataType: 'json',
//    success: function (response) { },
//    error: function (status) {
//        console.log(status);
//        tedu.notify('Không thể lấy dữ liệu về.', 'error');
//    }
//}); 
$.ajax({
    type: 'GET',
    url: '/admin/chatuser/GetUserOnline',
    data: {
        username: userNameId
    },
    dataType: 'json',
    success: function (response) { },
    error: function (status) {
        console.log(status);
        tedu.notify('Không thể lấy dữ liệu về.', 'error');
    }
});    
  

function registerClientMethods(chatHub, userNameid) {    

    chatHub.on("UserDisconnected", function (connectionId) {
        var groupElement = document.getElementById("group");
        for (var i = 0; i < groupElement.length; i++) {
            if (groupElement.options[i].value === connectionId) {
                groupElement.remove(i);
            }
        }
    });

    chatHub.on("clientSendConnect", (userNameid) => {
        AddUser(chatHub, userNameid, userNameid, UserImage, dateNow);
    });

    chatHub.on("clientSendRemove", (userNameid) => {
        $('#Div' + userNameid).remove();
        var ctrId = 'private_' + userNameid;
        $('#' + ctrId).remove();
        var disc = $('<div class="disconnect">"' + userNameid + '" logged off.</div>');
        $(disc).hide();
        $('#divusers').prepend(disc);
        $(disc).fadeIn(200).delay(2000).fadeOut(200);
    });
}


$('body').on('click', '.btnChatUserHub', function (e) {
    e.preventDefault();
    tedu.notify("Chat suer nasdfj h", "success");    
   
});
  
function AddUser(chatHub, id, name, UserImage, date) {

    var code; 
    code = $('<div id="Div' + id + '"><li><a>' + 
        '<span class="image"><img class="img-circle img-sm" src="' + UserImage + '?h=29" alt="User Image" /></span>' +
        '<span> <span> </span> <span id="' + id + '"  >' + id +' </span> </span>' +
        '<span >' + date + '</span>      </a>  </li> </div>');
    
    $("#divusers").append(code);    

}

function RemoveUser(chatHub, id, name, UserImage, date) {
    $('#Div' + id).remove();

    var ctrId = 'private_' + id;
    $('#' + ctrId).remove();

    var disc = $('<div class="disconnect">"' + userName + '" logged off.</div>');

    $(disc).hide();
    $('#divusers').prepend(disc);
    $(disc).fadeIn(200).delay(2000).fadeOut(200);
}

   



