$(function () {
    var dg = $('#dg').datagrid({

        singleSelect: true,
        //collapsible: true,
        //fitColumns: true,
        rownumbers: true,
        //toolbar: '#tb',
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

$('#btnTimNhanVien').on('click', function () {    
    var datakv = loadTableCongNgay();
    var dg = $('#dg').datagrid({
        singleSelect: true,
        //collapsible: true,
        //fitColumns: true,
        rownumbers: true,
        //toolbar: '#tb',
        data: datakv,
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

    var sogiocong = $(editors[31].target);
    var songay = $(editors[32].target);
    var mucluong = $(editors[33].target);
    var tienbaohiem = $(editors[34].target);

    var congngayId = $(editors[35].target).textbox('getValue');

    //var songayan = $(editors[36].target);
    //var tienangiuaca = $(editors[37].target);
    //var tienhieuquakinhdoanh = $(editors[38].target);

    var tienbaohiemyte = $(editors[36].target);
    var tienbaohiemthatnghiep = $(editors[37].target);
    var tienbaohiemxahoi = $(editors[38].target);
    var tongtiendongbaohiem = $(editors[39].target);

    var tongtienthuclinh = $(editors[40].target);

    $('#hidLuongBaoHiemSoNgay').val("0");

    n01.textbox({
        onChange: function () {
            var ngay01 = n01.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay01) == true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay01, '1');
                loadLuongBaoHiemId(congngayId);

                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                //console.log(songayid + 'fff');
                songay.numberbox('setValue', songayid);
                
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
            var ngay02 = n02.textbox('getValue');         
            if (isNgayKyHieuChamCong(ngay02) === true) {                
                SaveLuongBaoHiemNgay(congngayId, ngay02, '2');
                loadLuongBaoHiemId(congngayId);

                var songayid = $('#hidLuongBaoHiemSoNgay').val();               
                songay.numberbox('setValue', songayid);
            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n03.textbox({
        onChange: function () {
            var ngay03 = n03.textbox('getValue');            
            if (isNgayKyHieuChamCong(ngay03) === true) {
                SaveLuongBaoHiemNgay(congngayId, ngay03, '3');
            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });   

}

function isNgayKyHieuChamCong(kyhieu) { 
    if (kyhieu === 'X'  || kyhieu === 'CT' || kyhieu === 'H' || kyhieu === 'F' || kyhieu === 'L' || kyhieu === 'R'
        || kyhieu === 'RO' || kyhieu === 'OM' || kyhieu === 'CO' || kyhieu === 'VS' || kyhieu === 'TS' || kyhieu === 'NB' || kyhieu === 'O'
        || kyhieu === 'T'
        || kyhieu === 'CN'
    ) {

        return true;
    }
    else {
        return false;
    }
}

function formatPrice(val, row) {
    return '<span>' + tedu.formatNumber(val) + '</span>';
}

function SaveLuongBaoHiemNgay(luongbaohiemid, ngaynao, isngay) {   
    //tedu.notify("vao hop dong", "success");  
    //var ngayhethan = tedu.getFormatDateYYMMDD($('#txtNgayHetHanMoi').val());

    $.ajax({
        type: "POST",
        url: "/Admin/congngay/AddUpdateLuongBaoHiem",
        data: {
            Id: luongbaohiemid,    
            InsertLuongBaoHiemId: '2',
            Ngay01: ngaynao,
            IsNgay: isngay           
        },
        dataType: "json",
        beforeSend: function () {
            tedu.startLoading();
        },
        success: function (response) {
            if (response.Success == false) {
                tedu.notify(response.Message, "error");
            }            
            tedu.stopLoading();
        },
        error: function () {
            tedu.notify('Có lỗi! Không thể lưu Bảng chấm công ngày nhân viên', 'error');
            tedu.stopLoading();
        }
    });
}

function loadLuongBaoHiemId(luongbaohiemid) {
    var thang1 = $('#ddlThang').val();
    var nam1 = $('#txtNam').val();
    var makhuvuc = $('#ddlKhuVuc').val();
    var maphong = $('#ddlPhongBan').val();
    var keyword2 = $('#txtTimNhanVien').val();   

    $.ajax({
        type: 'POST',
        url: '/admin/congngay/LuongBaoHiemGetListId',
        data: {
            Id: luongbaohiemid,
            nam: '2018',
            thang: '10',
            corporationId: 'PO',
            phongId: '%',
            chucvuId: "%",
            keyword: '%',
            page: tedu.configs.pageIndex,
            pageSize: tedu.configs.pageSize
        },
        async: false,
        dataType: "json",
        beforeSend: function () {
            tedu.startLoading();
        },
        success: function (response) {
            moi = response.Result[0];           
            $('#hidLuongBaoHiemSoNgay').val(moi.SoNgay);
            //console.log($('#hidLuongBaoHiemSoNgay').val());
        },
        error: function (status) {
            console.log(status);
            tedu.notify('Không thể lấy dữ liệu về.', 'error');
        }
    });

}

function loadTableCongNgay() {

    var thang1 = $('#ddlThang').val();
    var nam1 = $('#txtNam').val();
    var makhuvuc = $('#ddlKhuVuc').val();
    var maphong = $('#ddlPhongBan').val();
    var keyword2 = $('#txtTimNhanVien').val();

    var dotinluongid = $('#ddlLuongDotIn').val();

    var moi;

    $.ajax({
        type: 'POST',
        url: '/admin/congngay/LuongBaoHiemGetList',
        data: {
            nam: nam1,
            thang: thang1,
            corporationId: makhuvuc,
            phongId: maphong,
            chucvuId: "%",
            keyword: keyword2,
            page: tedu.configs.pageIndex,
            pageSize: tedu.configs.pageSize,
            dotinluong: dotinluongid
        },
        async: false,
        dataType: "json",
        beforeSend: function () {
            tedu.startLoading();
        },
        success: function (response) {
            moi = response.Result;
            
        },
        error: function (status) {
            console.log(status);
            tedu.notify('Không thể lấy dữ liệu về.', 'error');
        }
    });
    return moi;
} 



