
var corporationId = $("#hidUserCorporationId").val();
var fullName = $("#hidUserFullName").val();
var userNameId = $("#hidUserName").val();
var UserImage = "/admin-side/images/img.jpg";
var UserImage2 = $("#hidLoginUserImgae2").val();

var dateNow = new Date();
//var localdate = dateFormat(dateNow, "dddd, mmmm dS, yyyy, h:MM:ss TT");
var arr = []; // List of users	

const connectionChatUser = new signalR.HubConnectionBuilder().withUrl("/chatuser").build();

var user1user2 = '';
var countdem22 = 0;
var usernameBox = '';

connectionChatUser.start()
    .then(function () {
        var chatroom = "chatRoom1";
        connectionChatUser.invoke("GetChatRoom1Members");
        connectionChatUser.invoke("RegisterMember", userNameId, chatroom);
        connectionChatUser.invoke("GetChatRoom1Members");   
        //connectionChatUser.invoke("SendMessageToUser2", userNameId, message);
    })
    .catch(function (error) {
        console.error(error.message);
    });


connectionChatUser.on('ClientGetChatRoom1Members', (data) => {   
    $("#divusers").html('');
    for (var i = 0; i < data.length; i++) {      
        AddUser(connectionChatUser, data[i].userName, data[i].connectionId, UserImage, dateNow, 100 * (i === 0 ? 1 : i+1));
    }
    var chieudaidata = data.length;
    if (chieudaidata > 0) {
        var connectid = data[chieudaidata - 1].connectionId;
        var usernamid = data[chieudaidata - 1].userName;
        $('#hdconnectId').val(connectid);
        //$('#hdconnectUserName').val(usernamid);
        $('#hdconnectUserName').val(userNameId);
        countdem22 = 100 * (chieudaidata === 0 ? 1 : chieudaidata);
    }
    else {
        $('#hdconnectId').val(0);
        $('#hdconnectUserName').val(0);
    }
  
});

connectionChatUser.on("ClientSendMessageToUser2", function (message) {
    //var message = document.getElementById("txtSentMessToUser").value;
    //alert(message);
    //var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var div = document.createElement("div");
    div.innerHTML = message;// + "<hr/>";
    document.getElementById("bodyTinNhan" + user1user2).appendChild(div);
    document.getElementById('msgbodyTinNhan' + user1user2).scrollTop = document.getElementById('msgbodyTinNhan' + user1user2).scrollHeight;    

    //var connectIdchinh = $('#hdconnectId').val();
    //var usernamchinh = $('#hdconnectUserName').val();
    //openChatBox(connectIdchinh, usernamchinh, countdem22);
});

function AddUser(chatHub, username, connectionid, UserImage, date, countdem) {   
    var code;
    code = $('<div id="Div' + connectionid + '"><li><a>' +
        '<span class="image"><img class="img-circle img-sm" src="' + UserImage + '?h=29" alt="User Image" /></span>' +
        '<span> <span> </span> <span id="' + connectionid + '"  >' + username + ' </span> </span>' +
        '<span >' + date + '</span> <span >' + countdem + '</span>' +
        '</a >  </li > </div > ');

    $("#divusers").append(code);    
    
    $(code).click(function () {
        if (userNameId !== username) {
            //tedu.notify(userNameId + " thành công..", "success");
            if ($.inArray(countdem, arr) !== -1) {
                arr.splice($.inArray(countdem, arr), 1);
            }
            arr.unshift(countdem);
            var usernamid = $('#hdconnectUserName').val();
            usernameBox = username + usernamid;
            openChatBox(connectionid, username, countdem);
        }
        else {
            alert("Trùng tên.");
        }
    });
}

function openChatBox(connectionid, username, countdem) {  
    var usernamid = $('#hdconnectUserName').val();
    var user12 = username + usernamid;
    var txtsentuser12 = "txtsent" + username + usernamid;
    var codechatbox =
        $('<div class="msg_box" id="divmsgbox' + user12 + '" style="right:270px" rel="' + countdem + '">' +
                '<div class="msg_head">' + username +
                    '<div class="close">x</div>' +
                '</div > ' +
            '<div class="msg_wrap"> <div class="msg_body" id="msgbodyTinNhan' + user12 + '" >' +
            '<div class="msg_push" id="bodyTinNhan' + user12 + '"></div></div >' +
                    '<div class="msg_footer">'+
            '<div class="col-xs-12"><input type="text" id="' + txtsentuser12 +'" placeholder="Nhập tin..." ></input>' +
            ' <button class="bg_none" id="btnSentMessToUser"><i class="fa fa-send-o"></i> </button>' +
                        '</div>' +
                        '<div class="col-xs-12">			' +          			
            '<button class="bg_none pull-left" id="btnSFile' + username + '"><i class="glyphicon glyphicon-paperclip"></i> </button>' +                          
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div > ');

    var txtsentuser123 = "#txtsent" + username + usernamid;
    user1user2 = user12;
    $(document).on('keypress', txtsentuser123, function (e) {        
        if (e.which === 13) {
            //var message = document.getElementById("txtSentMessToUser").value;
            var message = document.getElementById(txtsentuser12).value;
            //alert(connectionid);  
            //var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            var div = document.createElement("div");
            div.innerHTML = message;// + "<hr/>";
            document.getElementById("bodyTinNhan" + user12).appendChild(div);
            document.getElementById('msgbodyTinNhan' + user12).scrollTop = document.getElementById('msgbodyTinNhan' + user12).scrollHeight;    

            //var connectIdchinh = $('#hdconnectId').val();  
            connectionChatUser.invoke("SendMessageToUser2", connectionid, message).catch(function (err) {
                return console.error(err.toString());
            });   

            document.getElementById(txtsentuser12).value = "";
        }
        //e.preventDefault();
    });

    //$(document).on('click', '#btnSentMessToUser', function (e) {      
    //    var message = document.getElementById("txtSentMessToUser").value;
    //    //alert(connectionid);
    //    var connectIdchinh = $('#hdconnectId').val();       
    //    connectionChatUser.invoke("NhanTinNhanToUser2", connectIdchinh, message).catch(function (err) {
    //        return console.error(err.toString());
    //    });  
    //});
  

    $("body").append(codechatbox);
    displayChatBox();
}

function displayChatBox() {
    i = 30; // start position
    j = 260;  //next position
    $.each(arr, function (index, value) {
        if (index < 4) {
            $('[rel="' + value + '"]').css("right", i);
            $('[rel="' + value + '"]').show();
            i = i + j;
        }
        else {
            $('[rel="' + value + '"]').hide();
        }
    });
}

$('body').on('click', '.btnChatUserHub', function (e) {
    e.preventDefault();
    tedu.notify(" 4444444thành công..", "success"); 
});

$(document).on('click', '.msg_head', function () {
    var chatbox = $(this).parents().attr("rel");
    $('[rel="' + chatbox + '"] .msg_wrap').slideToggle('slow');
    return false;
});

$(document).on('click', '.close', function () {
    //$("#div-msg-box").html('');
    var usernmameboxm = '#divmsgbox' + usernameBox;
    $(usernmameboxm).remove();

    var chatbox = $(this).parents().parents().attr("rel");
    $('[rel="' + chatbox + '"]').hide();
    arr.splice($.inArray(chatbox, arr), 1);   
    displayChatBox();
    return false;
});

//$("#btnSentMessToUser").click(function () {
//    alert("gui mess den user");
//    //$textBox = $div.find("#txtPrivateMessage");

//    //var msg = $textBox.val();
//    //if (msg.length > 0) {
//    //    chatHub.server.sendPrivateMessage(userId, msg);
//    //    $textBox.val('');
//    //}
//});

//$(document).on('click', '#btnSentMessToUser', function () {    
//    var message = document.getElementById("txtSentMessToUser").value;
//    //alert(message);
//    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
//    var div = document.createElement("div");
//    div.innerHTML = msg + "<hr/>";
//    document.getElementById("bodyTinNhan").appendChild(div);
//    document.getElementById('msgbodyTinNhan').scrollTop = document.getElementById('msgbodyTinNhan').scrollHeight;

//    document.getElementById("txtSentMessToUser").value = "";
//});

//$(document).on('keypress', '#txtSentMessToUser', function (e) {
//    if (e.which === 13) {      
//        var message = document.getElementById("txtSentMessToUser").value;

//        connection.invoke("SendMessageToUser", groupValue, message).catch(function (err) {
//            return console.error(err.toString());
//        });

//        //var message = document.getElementById("txtSentMessToUser").value;
//        ////alert(message);
//        //var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
//        //var div = document.createElement("div");
//        //div.innerHTML = msg + "<hr/>";
//        //document.getElementById("bodyTinNhan").appendChild(div);
//        //document.getElementById('msgbodyTinNhan').scrollTop = document.getElementById('msgbodyTinNhan').scrollHeight;

//        //document.getElementById("txtSentMessToUser").value = "";
//    }
//});




   



