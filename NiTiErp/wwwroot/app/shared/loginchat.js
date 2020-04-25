
var corporationId = $("#hidUserCorporationId").val();
var fullName = $("#hidUserFullName").val();
var userNameId = $("#hidUserName").val();
var UserImage = "/admin-side/images/img.jpg";
var UserImage2 = $("#hidLoginUserImgae2").val();
var avatarUser = $("#hidAvatarUserId").val();

var dateNow = new Date();
//var localdate = dateFormat(dateNow, "dddd, mmmm dS, yyyy, h:MM:ss TT");
var arr = []; // List of users	
var fileUploadHinh = [];

const connectionChatUser = new signalR.HubConnectionBuilder().withUrl("/chatuser").build();

var user1user2 = '';
var user2user1 = '';
var countdem22 = 0;
var usernameBox = '';
var tongdongchatuser = 0;


//new PNotify({
//    title: 'Regular Notice',
//    text: 'Check me out! I\'m a notice.',
//    styling: 'bootstrap3'
//});

//chatHub.client.sendPrivateMessage = function (windowId, fromUserName, message, userimg, CurrentDateTime) {
connectionChatUser.on('sendPrivateMessage', (windowId, fromUserName, message, userimg, CurrentDateTime) => {
    $('#hdId').val(windowId);
    $('#hdUserName').val(fromUserName);
    $('#spanUser').html(fromUserName);

    var ctrId = 'private_' + windowId;
    if ($('#' + ctrId).length === 0) {
        //OpenPrivateChatBox(connectionChatUser, windowId, ctrId, fromUserName, userimg);
        OpenPrivateChatBox(connectionChatUser, windowId, ctrId, fromUserName, countdem22);
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
        //'<span class="direct-chat-name pull-' + Side + '">' + fromUserName + '  </span> &nbsp;' +
        ' &nbsp; <span class="direct-chat-timestamp pull-' + TimeSide + '""> ' + CurrentDateTime + '</span>' +
        '</div>' +
        '<span class="chat-img1 pull-left">' +
        ' <img class="profile_img" src="' + userimg + '?h=29" alt="Message User Image">' +
        '</span> &nbsp; ' +
        ' <div class="direct-chat-text" >' + message + '</div>' +
    
        '</div > ';

    $('#' + ctrId).find('#divMessage').append(divChatP);

   displayChatBox();

   // var div1 = '  <div  id="' + ctrId + '" class="msg_box" style="right:270px" rel="' + countdem + '">' +

    // Apply Slim Scroll Bar in Private Chat Box
    //var ScrollHeight = $('#' + ctrId).find('#divMessage')[0].scrollHeight;
    //$('#' + ctrId).find('#divMessage').slimScroll({
    //    height: ScrollHeight
    //});

    //var ScrollHeight = $('#' + ctrId).find('#divMessage').scrollTop() + $('#' + ctrId).find('#divMessage')[0].scrollHeight;
    //$('#' + ctrId).find('#divMessage').scrollTop = ScrollHeight;

    $('#' + ctrId).find("#divMessage").animate({
        scrollTop: $("#divMessage")[0].scrollHeight
    }, 500);     

    
});

connectionChatUser.on('ClientGetChatRoom1Members', (data) => {   
    $("#divusers").html('');
    for (var i = 0; i < data.length; i++) {      
        //AddUser(connectionChatUser, data[i].userName, data[i].connectionId, UserImage, dateNow, 100 * (i === 0 ? 1 : i+1));
        AddUser(connectionChatUser, data[i].userName, data[i].connectionId, data[i].avatarUser, dateNow, 100 * (i === 0 ? 1 : i + 1));
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

connectionChatUser.on('SendUserOnline', (username, userImg) => {
    if (userNameId !== username) {
        new PNotify({
            title: username + ' Online.',
            text: '<img src="' + userImg + '?h=29" > Đăng nhập.',
            type: 'success',
            styling: 'bootstrap3'
        });
    }
});

connectionChatUser.on('sendUserOffline', (username, userImg) => {
    new PNotify({
        title: username + ' Offline',
        text: '<img src="' + userImg + '?h=29" > Thoát.',
        styling: 'bootstrap3'
    });
});

connectionChatUser.start()
    .then(function () {
        var chatroom = "chatRoom1";
        //connectionChatUser.invoke("GetChatRoom1Members");
        //connectionChatUser.invoke("RegisterMember", userNameId, chatroom);
        connectionChatUser.invoke("RegisterMemberParaLogin", userNameId, chatroom, fullName, avatarUser);
        connectionChatUser.invoke("GetChatRoom1Members");
        
    })
    .catch(function (error) {
        console.error(error.message);
    });

function AddUser(chatHub, username, connectionid, UserImage, date, countdem) {   
    var code;
    code = $('<div id="Div' + connectionid + '"  ><li><a>' +
        '<span class="image"><img alt class="img-circle img-responsive" src="' + UserImage + '?h=29" alt="User Image" /></span>' +
        '<span><span id="' + connectionid + '"  >' + username + ' </span> <span>  </span></span > ' +
        //'<span class="message">ts for movie makers.They were where... </span >' +
        //'<span >' + date + '</span>
        //'<span> ' + countdem + '</span > ' +
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

       // '<img id="loader" src="http://opengraphicdesign.com/wp-content/uploads/2009/01/loader64.gif">' +

        '<div class="msg_push" ></div>' +
        '</div > ' +

       
        '  <div class="msg_footer">' +


        '    <input type="text" id="txtPrivateMessage" name="message" placeholder="Type Message ..." class="form-control"  />' +
     
        '  <div class="input-group">' +      

            '<div id="divbtnFileVanBan" class="bg_none pull-left" >' +
        //    '<label for="fileFileVanBanDen" class="fa fa-chain-broken" > </label>' +
        //'<input type="file" id="fileFileVanBanDen" name="fileFileVanBanDen" style="display:none;" /> &ensp; ' + 

        '<label for="fileFileHinhVBD" class="fa fa-chain-broken" >  </label>' +
        '<input type="file" id="fileFileHinhVBD" name="fileFileHinhVBD" style="display:none;" />' +

            '</div>' +

            '<div class="bg_none pull-right" >' +
                '   <span class="input-group-btn">' +
                '          <input type="button" id="btnSendMessage" class="btn btn-' + PWClass + ' btn-flat" value="send" />' +
            '   </span>' +
            '</div>' +

        '    <input type="text" name="message" placeholder="Type Message ..." class="form-control" style="visibility:hidden;" />' +
        '<input type="hidden" id="hidTenFileHinhVBDId" value="" />' +

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
            //chatHub.invoke("SendToUserIdMessage", fromuserId, userId, userNameId, msg);          
            chatHub.invoke("SendToUserIdAvatarMessage", fromuserId, userId, userNameId, msg, avatarUser);          
            $textBox.val('');

            SaveMessage(userNameId, userName, msg);

            //$("#divMessage").scrollTop($("#divMessage")[0].scrollHeight - 100);   // cuon den cuoi dong
            $div.find("#divMessage").animate({
                scrollTop: $("#divMessage")[0].scrollHeight
            }, 500);
        }
    });

    $div.find("#fileFileHinhVBD").on('change', function () {
        var dateNow = new Date();
        var yyyyMMDD = tedu.getFormattedDateYYYYMMDD(dateNow);
        var datetimeNow = tedu.getFormattedDateTimeHour(dateNow);

        var fileUpload = $(this).get(0);
        var files = fileUpload.files;

        $('#hidTenFileHinhVBDId').val(datetimeNow + files[0].name);
        var filename = datetimeNow + files[0].name;
        var data = new FormData();

        for (var i = 0; i < files.length; i++) {
            data.append(datetimeNow + files[i].name, files[i]);
        }

        $.ajax({
            type: "POST",
            url: "/Admin/Upload/UploadHinhChatUser",
            contentType: false,
            processData: false,
            data: data,
            success: function (path) {
                clearFileInputHinh($("#fileFileHinhVBD"));
                fileUploadHinh.push(path);
                tedu.notify('Đã tải file lên thành công!', 'success');

                var textBoxHinh = $('#hidTenFileHinhVBDId').val();
                var fromuserId = $('#hdconnectId').val();

                if (IsValidateFile(files[0].name)) {
                    if (IsImageFile(files[0].name)) {
                        var msgHinh = '<img id="imgFileHinhChatUser" class="direct-chat-img" src="/uploaded/chatuser/' +
                            yyyyMMDD + '/' + textBoxHinh + '?h=100" alt="Attachment Image" > ';

                        if (msgHinh.length > 0) {                            
                            //chatHub.invoke("SendToUserIdMessage", fromuserId, userId, userNameId, msgHinh);
                            chatHub.invoke("SendToUserIdAvatarMessage", fromuserId, userId, userNameId, msgHinh, avatarUser);          
                            $('#hidTenFileHinhVBDId').val('');
                            SaveFileMessage(userNameId, userName, msgHinh, files[0].name);
                        }
                    }
                    else {
                        var msgFile = '<a id="imgFileFileChatUser" class="btn btn-default btn-xs" href="/uploaded/chatuser/' +
                            yyyyMMDD + '/' + textBoxHinh + '" target="_blank" >' + files[0].name +
                            '<i class="fa fa-camera"></i> Xem</a> ';
                        //  '<a href="' + imgDisplay.src + '" target="_blank" class="btn btn-default btn-xs"><i class="fa fa-camera"></i> View</a>'
                        if (msgFile.length > 0) {                          
                            //chatHub.invoke("SendToUserIdMessage", fromuserId, userId, userNameId, msgFile);
                            chatHub.invoke("SendToUserIdAvatarMessage", fromuserId, userId, userNameId, msgFile, avatarUser);    
                            $('#hidTenFileHinhVBDId').val('');
                            SaveFileMessage(userNameId, userName, msgFile, files[0].name);
                        }
                    }
                }

            },
            error: function () {
                tedu.notify('There was error uploading files!', 'error');
            }
        });        

    });

    // Text Box event on Enter Button
    $div.find("#txtPrivateMessage").keypress(function (e) {
        if (e.which === 13) {
            $div.find("#btnSendMessage").click();

            //$("#divMessage").scrollTop($("#divMessage")[0].scrollHeight - 100);   // cuon den cuoi dong
        }
    });

    // Clear Message Count on Mouse over           
    $div.find("#divMessage").mouseover(function () {
        $("#MsgCountP").html('0');
        $("#MsgCountP").attr("title", '0 New Messages');
    });

    // Append private chat div inside the main div
    $('#PriChatDiv').append($div);

    //displayChatdBox();

    //SaveMessage(userNameId, userName, msg);
    loadChatUser(userNameId, userName);
    //GetPagingChatUserScroll(userNameId, userName, 1, 10, tongdongchatuser);

    //$("#divMessage").scrollTop($("#divMessage")[0].scrollHeight);
    //$('#loader').hide();
    var sotrang = 1;
    $("#divMessage").scroll(function () {
        if ($('#divMessage').scrollTop() === 0) {
            // Display AJAX loader animation
            //$('#loader').show();

            //Simulate server delay;
            setTimeout(function () {
                // Simulate retrieving 4 messages
                //for (var i = 0; i < 4; i++) {
                //    $('#divMessage').prepend('<div class="messages">Newly Loaded messages<br/><span class="date">' + Date() + '</span> </div>');
                //}

                // Hide loader on success
                //$('#loader').hide();
                sotrang = sotrang + 1;
                GetPagingChatUser(userNameId, userName, sotrang, 10, tongdongchatuser);

                // Reset scroll
                $('#divMessage').scrollTop(30);
            }, 780);
        }
    });
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

function SaveMessage(fromuserId, touserId, msg) {
    $.ajax({
        type: "POST",
        url: "/Admin/home/SentMessage",
        data: {
            FormAppUserId: fromuserId,
            ToAppUserId: touserId,
            TextMessage: msg
        },
        dataType: "json",       
        success: function () {          
            tedu.stopLoading();
        },
        error: function () {
            tedu.notify('Has an error', 'error');
            tedu.stopLoading();
        }
    });
}

function SaveFileMessage(fromuserId, touserId, msg, tenfile) {
    $.ajax({
        type: "POST",
        url: "/Admin/home/SentMessage",
        data: {
            FormAppUserId: fromuserId,
            ToAppUserId: touserId,
            TextMessage: msg,
            Notes: tenfile
        },
        dataType: "json",
        success: function () {
            tedu.stopLoading();
        },
        error: function () {
            tedu.notify('Has an error', 'error');
            tedu.stopLoading();
        }
    });
}

function clearFileInputHinh(ctrl) {
    try {
        fileUploadHinh = [];
        ctrl.value = null;
        ctrl.value('');
    }
    catch (ex) {
        tedu.notify(ex, 'error');
    }
}

function IsValidateFile(fileF) {
    var allowedFiles = [".doc", ".docx", ".pdf", ".txt", ".xlsx", ".xls", ".png", ".jpg", ".gif"];
    var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(" + allowedFiles.join('|') + ")$");
    if (!regex.test(fileF.toLowerCase())) {
        alert("Chọn những file có đuôi: " + allowedFiles.join(', ') + " chỉ.");
        return false;
    }
    return true;
}

function IsImageFile(fileF) {
    var ImageFiles = [".png", ".jpg", ".gif"];
    var regex = new RegExp("(" + ImageFiles.join('|') + ")$");
    if (!regex.test(fileF.toLowerCase())) {
        return false;
    }
    return true;
}

function loadChatUser(fromuserid, touserid) {
    var template = $('#table-VBDDMSo').html();
    var render = "";

    var makhuvuc = $('#ddlKhuVuc').val();
    var namSo = $('#txtVBDDMSoNam').val();
    var timnhanvien = $('#txtTimNoiDung').val();

    $.ajax({
        type: 'GET',
        data: {
            fromUserId: fromuserid,
            toUserId: touserid
        },
        url: '/admin/home/GetAllChatUser',
        dataType: 'json',
        success: function (response) {
            if (response.Result.length === 0) {
                render = "<tr><th><a>Không có dữ liệu</a></th></tr>";
            }
            else {
                tongdongchatuser = response.Result.length;
                GetPagingChatUserScroll(fromuserid, touserid, 1, 10, tongdongchatuser);           
            }  
        },
        error: function (status) {
            console.log(status);
            tedu.notify('Không thể lấy dữ liệu về.', 'error');
        }
    });

}

function GetPagingChatUser(fromuserid, touserid, sotrang, trangtrendong, tongdongchatuser) {
    var template = $('#table-VBDDMSo').html();
    var render = "";

    var makhuvuc = $('#ddlKhuVuc').val();
    var namSo = $('#txtVBDDMSoNam').val();
    var timnhanvien = $('#txtTimNoiDung').val();

    $.ajax({
        type: 'GET',
        data: {
            fromUserId: fromuserid,
            toUserId: touserid,
            page: sotrang,
            pageSize: trangtrendong,
            tongdongChatUser: tongdongchatuser
        },
        url: '/admin/home/GetPagingChatUser',
        dataType: 'json',
        success: function (response) {
            if (response.Result.Results.length === 0) {
                render = "<tr><th><a>Không có dữ liệu</a></th></tr>";
            }
            else {
               
                var CurrUser = $('#hdUserName').val();
                var Side = 'right';
                var TimeSide = 'left';              

                $.each(response.Result.Results, function (i, item) {
                    var divChatP = '<div class="direct-chat-msg ' + Side + '">' +
                        '<div class="direct-chat-info clearfix">' +
                       // '<span class="direct-chat-name pull-' + Side + '">' + item.FromUserName + '  </span> &nbsp; ' +
                        ' &nbsp; <span class="direct-chat-timestamp pull-' + TimeSide + '""> ' + item.TimeMessage + '</span>' +
                        '</div>' +
                        '<span class="chat-img1 pull-left">' +
                        ' <img class="profile_img" src="' + item.FromAvatar + '?h=29" alt="Message User Image">' +
                        '</span> &nbsp; ' +
                        ' <div class="direct-chat-text" >' + item.TextMessage + '</div>' +
                        '</div > ';

                    $('#divMessage').prepend(divChatP);
                });

                //$("#divMessage").animate({
                //    scrollTop: $("#divMessage")[0].scrollHeight
                //}, 500);
            }

        },
        error: function (status) {
            console.log(status);
            tedu.notify('Không thể lấy dữ liệu về.', 'error');
        }
    });

}


function GetPagingChatUserScroll(fromuserid, touserid, sotrang, trangtrendong, tongdongchatuser) {
    var template = $('#table-VBDDMSo').html();
    var render = "";

    var makhuvuc = $('#ddlKhuVuc').val();
    var namSo = $('#txtVBDDMSoNam').val();
    var timnhanvien = $('#txtTimNoiDung').val();

    $.ajax({
        type: 'GET',
        data: {
            fromUserId: fromuserid,
            toUserId: touserid,
            page: sotrang,
            pageSize: trangtrendong,
            tongdongChatUser: tongdongchatuser
        },
        url: '/admin/home/GetPagingChatUser',
        dataType: 'json',
        success: function (response) {
            if (response.Result.Results.length === 0) {
                render = "<tr><th><a>Không có dữ liệu</a></th></tr>";
            }
            else {

                var CurrUser = $('#hdUserName').val();
                var Side = 'right';
                var TimeSide = 'left';

                $.each(response.Result.Results, function (i, item) {
                    var divChatP = '<div class="direct-chat-msg ' + Side + '">' +
                        '<div class="direct-chat-info clearfix">' +
                       // '<span class="direct-chat-name pull-' + Side + '">' + item.FromUserName + '  </span> &nbsp; ' +
                        ' &nbsp; <span class="direct-chat-timestamp pull-' + TimeSide + '""> ' + item.TimeMessage + '</span>' +
                        '</div>' +
                        '<span class="chat-img1 pull-left">' +
                        ' <img class="profile_img" src="' + item.FromAvatar + '?h=29" alt="Message User Image">' +
                        '</span> &nbsp; ' +
                        ' <div class="direct-chat-text" >' + item.TextMessage + '</div>' +
                        '</div > ';

                    $('#divMessage').prepend(divChatP);
                });

                $("#divMessage").animate({
                    scrollTop: $("#divMessage")[0].scrollHeight
                }, 500);
            }

        },
        error: function (status) {
            console.log(status);
            tedu.notify('Không thể lấy dữ liệu về.', 'error');
        }
    });

}


   



