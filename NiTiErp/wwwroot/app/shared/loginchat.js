
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
var user2user1 = '';
var countdem22 = 0;
var usernameBox = '';


//chatHub.client.sendPrivateMessage = function (windowId, fromUserName, message, userimg, CurrentDateTime) {


//chatHub.client.sendPrivateMessage = function (windowId, fromUserName, message, userimg, CurrentDateTime) {
connectionChatUser.on('sendPrivateMessage', (windowId, fromUserName, message, userimg, CurrentDateTime) => {
    $('#hdId').val(windowId);
    $('#hdUserName').val(fromUserName);
    $('#spanUser').html(fromUserName);

    var ctrId = 'private_' + windowId;
    if ($('#' + ctrId).length === 0) {
        OpenPrivateChatBox(connectionChatUser, windowId, ctrId, fromUserName, userimg);
        //OpenPrivateChatBox(chatHub, userId, ctrId, userName) {
    } 

    var CurrUser = $('#hdUserName').val();
    var Side = 'right';
    var TimeSide = 'left';

    if (CurrUser === fromUserName) {
        Side = 'left';
        TimeSide = 'right';
    }
    else {
        //var Notification = 'New Message From ' + fromUserName;
        //IntervalVal = setInterval("ShowTitleAlert('SignalR Chat App', '" + Notification + "')", 800);

        var msgcount = $('#' + ctrId).find('#MsgCountP').html();
        msgcount++;
        $('#' + ctrId).find('#MsgCountP').html(msgcount);
        $('#' + ctrId).find('#MsgCountP').attr("title", msgcount + ' New Messages');
    }

    var divChatP = '<div class="direct-chat-msg ' + Side + '">' +
        '<div class="direct-chat-info clearfix">' +
        '<span class="direct-chat-name pull-' + Side + '">' + fromUserName + '</span>' +
        '<span class="direct-chat-timestamp pull-' + TimeSide + '"">' + CurrentDateTime + '</span>' +
        '</div>' +

        ' <img class="direct-chat-img" src="' + userimg + '?h=29" alt="Message User Image">' +
        ' <div class="direct-chat-text" >' + message + '</div> </div>';

    $('#' + ctrId).find('#divMessage').append(divChatP);

    // Apply Slim Scroll Bar in Private Chat Box
    //var ScrollHeight = $('#' + ctrId).find('#divMessage')[0].scrollHeight;
    //$('#' + ctrId).find('#divMessage').slimScroll({
    //    height: ScrollHeight
    //});

    //var ScrollHeight = $('#' + ctrId).find('#divMessage').scrollTop() + $('#' + ctrId).find('#divMessage')[0].scrollHeight;
    //$('#' + ctrId).find('#divMessage').scrollTop = ScrollHeight;

    var ScrollHeight = $('#' + ctrId).find('#divMessage').scrollHeight();
    $('#' + ctrId).find('#divMessage').scrollTop = ScrollHeight;
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
        if (userNameId === usernamid) {
            $('#hdconnectId').val(connectid);        
            $('#hdconnectUserName').val(usernamid);            
        }     
        countdem22 = 100 * (chieudaidata === 0 ? 1 : chieudaidata);   
    }
    else {
        $('#hdconnectId').val(0);
        $('#hdconnectUserName').val(0);
    }  
    
});

connectionChatUser.start()
    .then(function () {
        var chatroom = "chatRoom1";
        //connectionChatUser.invoke("GetChatRoom1Members");
        connectionChatUser.invoke("RegisterMember", userNameId, chatroom);
        connectionChatUser.invoke("GetChatRoom1Members");
        
    })
    .catch(function (error) {
        console.error(error.message);
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
            //var usernamid = $('#hdconnectUserName').val();
            //usernameBox = username + usernamid;           

            //tedu.notify(userNameId + " thành công..", "success");
            if ($.inArray(countdem, arr) !== -1) {
                arr.splice($.inArray(countdem, arr), 1);
            }
            arr.unshift(countdem);            


            var id = connectionid;//'Div' + connectionid;
            var ctrId = 'private_' + id ;   
            OpenPrivateChatBox(connectionChatUser, id, ctrId, username, countdem);
           
        }
        else {
            alert("Trùng tên.");
        }
    });
}
//enPrivateChatBox(connectionChatUser, windowId, ctrId, fromUserName, userimg);
function OpenPrivateChatBox(chatHub, userId, ctrId, userName, countdem) {

    var PWClass = $('#PWCount').val();

    if ($('#PWCount').val() === 'info')
        PWClass = 'danger';
    else if ($('#PWCount').val() === 'danger')
        PWClass = 'warning';
    else
        PWClass = 'info';

    $('#PWCount').val(PWClass);
    var div1 = '  <div  id="' + ctrId + '" class="msg_box" style="right:270px" rel="' + countdem + '">' +
        '<div class="msg_head">' + userName  +

     //   ' <div class="box-tools pull-right">' +
        //' <span data-toggle="tooltip" id="MsgCountP" title="0 New Messages" class="badge bg-' + PWClass + '">0</span>' +
        //' <button type="button" class="btn btn-box-tool" data-widget="collapse">' +
        //'    <i class="fa fa-minus"></i>' +
        //'  </button>' +
        '  <a id="imgDelete" type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></a>' +
        //'</div >+'
        '</div > ' +

        ' <div class="msg_wrap">' +
        ' <div id="divMessage" class="msg_body">' + 
        '<div class="msg_push" ></div>' +
        '</div > ' +

       
        '  <div class="msg_footer">' +


        '    <input type="text" id="txtPrivateMessage" name="message" placeholder="Type Message ..." class="form-control"  />' +

        '  <div class="input-group">' +
        '    <input type="text" name="message" placeholder="Type Message ..." class="form-control" style="visibility:hidden;" />' +
        '   <span class="input-group-btn">' +
        '          <input type="button" id="btnSendMessage" class="btn btn-' + PWClass + ' btn-flat" value="send" />' +
        '   </span>' +

        '<div id="divbtnFileVanBan" class="bg_none pull-left" >' +
            '<input type="file" id="fileFileVanBanDen" />' +
        '</div>' +
        '  </div>' +
        '  </div>' +

        ' </div>' +
        ' </div> ';



    var $div = $(div1);

    // Closing Private Chat Box
    $div.find('#imgDelete').click(function () {
        $('#' + ctrId).remove();
    });

    // Send Button event in Private Chat
    $div.find("#btnSendMessage").click(function () {

        $textBox = $div.find("#txtPrivateMessage");

        var msg = $textBox.val();
        if (msg.length > 0) {
            var fromuserId = $('#hdconnectId').val();
            chatHub.invoke("SendToUserIdMessage", fromuserId, userId, userNameId, msg);          
            $textBox.val('');
        }
    });

    // Text Box event on Enter Button
    $div.find("#txtPrivateMessage").keypress(function (e) {
        if (e.which === 13) {
            $div.find("#btnSendMessage").click();
        }
    });

    // Clear Message Count on Mouse over           
    $div.find("#divMessage").mouseover(function () {

        $("#MsgCountP").html('0');
        $("#MsgCountP").attr("title", '0 New Messages');
    });

    // Append private chat div inside the main div
    $('#PriChatDiv').append($div);

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
$('body').on('click', '.msg_head', function () {   
    var chatbox = $(this).parents().attr("rel");
    $('[rel="' + chatbox + '"] .msg_wrap').slideToggle('slow');
    return false;
});




$('body').on('click', '.btnChatUserHub', function (e) {
    e.preventDefault();
    tedu.notify(" 4444444thành công..", "success"); 
});

var hidEditPassId = "";
$('body').on('click', '.btnDoiMatMaUser', function (e) {
    e.preventDefault();
    //var that = $(this).data('id');

    $('#txtCurrentPassword').prop('disabled', true);

    $.ajax({
        type: "GET",
        url: "/Admin/User/GetByUserName2Id",
        data: { username: userNameId },
        dataType: "json",
        beforeSend: function () {
            tedu.startLoading();
        },
        success: function (response) {
            var data = response;

            //$('#hidEditPassId').val(data.Id);
            hidEditPassId = data.Id;
            $('#modal-edit-password').modal('show');

            tedu.stopLoading();
        },
        error: function () {
            tedu.notify('Có lỗi xảy ra', 'error');
            tedu.stopLoading();
        }
    });
});

$(document).on('click', '#btnSaveEditPass', function () {
    var id = hidEditPassId;
    var currentpassword = $('#txtCurrentPassword').val();
    var newpassword = $('#txtNewPassword').val();

    $.ajax({
        type: "POST",
        url: "/Admin/User/SaveEditPass",
        data: {
            Id: id,
            CurrentPassword: currentpassword,
            NewPassword: newpassword
        },
        dataType: "json",
        beforeSend: function () {
            tedu.startLoading();
        },
        success: function () {
            tedu.notify('Edit password user succesful', 'success');
            $('#modal-edit-password').modal('hide');          

            tedu.stopLoading();
        },
        error: function () {
            tedu.notify('Has an error', 'error');
            tedu.stopLoading();
        }
    });
});






   



