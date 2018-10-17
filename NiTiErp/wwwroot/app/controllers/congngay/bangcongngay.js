$(function () {
    var dg = $('#dg').datagrid({

        singleSelect: true,
        //collapsible: true,
        //fitColumns: true,
        rownumbers: true,
        toolbar: '#tb',
        data: data,
        view: groupview,
        groupField: 'TenPhong',
        groupFormatter: function (value, rows) {
            return value + ' - ' + rows.length + ' Nhân viên ';
        },
        onClickRow: onClickRow,
        onBeginEdit: onBeginEdit

    });
});

var editIndex = undefined;
function endEditing() {
    if (editIndex == undefined) { return true }
    if ($('#dg').datagrid('validateRow', editIndex)) {        
        $('#dg').datagrid('endEdit', editIndex);
        editIndex = undefined;
        return true;
    }
    else {
        return false;
    }
}

function onClickRow(index) {
    if (editIndex != index) {
        if (endEditing()) {
            $('#dg').datagrid('selectRow', index).datagrid('beginEdit', index);
            editIndex = index;
        }
        else {
            $('#dg').datagrid('selectRow', editIndex);
        }
    }
}

function onBeginEdit(index) {
    var luongtoithieu = $('#txtAddEditMucLuongToiThieuVung').val();//'3530000';//$('#txtAddEditMucLuongToiThieuVung').val();
    var editors = $('#dg').datagrid('getEditors', index);

    var n01 = $(editors[0].target);
    var n02 = $(editors[1].target);
    var n03 = $(editors[2].target);
    var n04 = $(editors[3].target);
    var n05 = $(editors[4].target);
    var n06 = $(editors[5].target);
    var n07 = $(editors[6].target);
    var n08 = $(editors[7].target);
    var n09 = $(editors[8].target);
    var n10 = $(editors[9].target);
    var n11 = $(editors[10].target);
    var n12 = $(editors[11].target);
    var n13 = $(editors[12].target);
    var n14 = $(editors[13].target);
    var n15 = $(editors[14].target);
    var n16 = $(editors[15].target);
    var n17 = $(editors[16].target);
    var n18 = $(editors[17].target);
    var n19 = $(editors[18].target);
    var n20 = $(editors[19].target);
    var n21 = $(editors[20].target);
    var n22 = $(editors[21].target);
    var n23 = $(editors[22].target);
    var n24 = $(editors[23].target);
    var n25 = $(editors[24].target);
    var n26 = $(editors[25].target);
    var n27 = $(editors[26].target);
    var n28 = $(editors[27].target);
    var n29 = $(editors[28].target);
    var n30 = $(editors[29].target);
    var n31 = $(editors[30].target);



    n01.textbox({
        onChange: function () {
            var ngay01 = n01.textbox('getValue');
            //console.log(kyhieucongngay);
            if (ngay01 === 'X' || ngay01 === 'CN' || ngay01 === 'KO') {
                //alert('Cog6 ngay dung');
            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n02.textbox({
        onChange: function () {
            alert(n2.textbox('getValue'));
        }
    });
    n03.textbox({
        onChange: function () {
            alert(n3.textbox('getValue'));
        }
    });

}

//function isKyHieuCongNgay(kyhieu) {

//    //var bien1;
//    //var bien2 = 0;
//    var JSONItems = [];

//    $.getJSON("/templates/luongkyhieu.json", function (data) {
//        $.each(data, function (i, item) {

//            console.log(item);
//            if (kyhieu === item.Id) {
//                console.log("giong ky hieu");
//                return false;
//            }
//            else {
//                console.log("saiii ky hieu");
//                return true;
//            }
//        });

//    });
//    //console.log(JSONItems);
//    //console.log(data2.responseJSON);
//}