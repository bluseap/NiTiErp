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

$('#txtTimNhanVien').on('keypress', function (e) {
    if (e.which === 13) {
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
    }
});

var editIndex = undefined;
function endEditing() {
    if (editIndex === undefined) { return true }
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
    if (editIndex !== index) {
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
            if (isNgayKyHieuChamCong(ngay01) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay01, '1');
                loadLuongBaoHiemId(congngayId);

                //alert($('#hidLuongBaoHiemMucLuong').val());

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();                
                songay.numberbox('setValue', songayid);               

                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue',$('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue',$('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue',$('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue',$('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue',$('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue',$('#hidTongTienThucLinh').val());
                
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

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();             
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());
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
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());
            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n04.textbox({
        onChange: function () {
            var ngay04 = n04.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay04) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay04, '4');
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());

            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n05.textbox({
        onChange: function () {
            var ngay05 = n05.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay05) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay05, '5');
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());

            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n06.textbox({
        onChange: function () {
            var ngay06 = n06.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay06) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay06, '6');
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());

            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n07.textbox({
        onChange: function () {
            var ngay07 = n07.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay07) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay07, '7');
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());

            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n08.textbox({
        onChange: function () {
            var ngay08 = n08.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay08) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay08, '4');
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());

            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n09.textbox({
        onChange: function () {
            var ngay09 = n09.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay09) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay09, '9');
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());

            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n10.textbox({
        onChange: function () {
            var ngay10 = n10.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay10) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay10, '10');
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());

            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n11.textbox({
        onChange: function () {
            var ngay11 = n11.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay11) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay11, '11');
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());

            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n12.textbox({
        onChange: function () {
            var ngay12 = n12.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay12) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay12, '12');
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());

            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n13.textbox({
        onChange: function () {
            var ngay13 = n13.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay13) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay13, '13');
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());

            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n14.textbox({
        onChange: function () {
            var ngay14 = n14.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay14) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay14, '14');
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());

            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n15.textbox({
        onChange: function () {
            var ngay15 = n15.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay15) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay15, '15');
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());

            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n16.textbox({
        onChange: function () {
            var ngay16 = n16.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay16) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay16, '16');
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());

            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n17.textbox({
        onChange: function () {
            var ngay17 = n17.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay17) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay17, '17');
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());

            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n18.textbox({
        onChange: function () {
            var ngay18 = n18.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay18) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay18, '18');
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());

            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n19.textbox({
        onChange: function () {
            var ngay19 = n19.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay19) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay19, '19');
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());

            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n20.textbox({
        onChange: function () {
            var ngay20 = n20.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay20) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay20, '20');
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());

            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n21.textbox({
        onChange: function () {
            var ngay21 = n21.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay21) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay21, '21');
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());

            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n22.textbox({
        onChange: function () {
            var ngay22 = n22.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay22) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay22, '22');
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());

            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n23.textbox({
        onChange: function () {
            var ngay23 = n23.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay23) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay23, '23');
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());

            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n24.textbox({
        onChange: function () {
            var ngay24 = n24.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay24) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay24, '24');
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());

            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n25.textbox({
        onChange: function () {
            var ngay25 = n25.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay25) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay25, '25');
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());

            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n26.textbox({
        onChange: function () {
            var ngay26 = n26.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay26) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay26, '26');
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());

            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n27.textbox({
        onChange: function () {
            var ngay27 = n27.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay27) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay27, '27');
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());

            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n28.textbox({
        onChange: function () {
            var ngay28 = n28.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay28) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay28, '28');
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());

            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n29.textbox({
        onChange: function () {
            var ngay29 = n29.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay29) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay29, '29');
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());

            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n30.textbox({
        onChange: function () {
            var ngay30 = n30.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay30) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay30, '30');
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());

            }
            else {
                tedu.confirmOk('Nhập sai mã ký hiệu bảng chấm công? Kiểm tra lại.', function () {
                    $('#dg').datagrid('rejectChanges');
                    editIndex = undefined;
                });
            }
        }
    });
    n31.textbox({
        onChange: function () {
            var ngay31 = n31.textbox('getValue');
            //console.log(isNgayKyHieuChamCong(ngay01));
            if (isNgayKyHieuChamCong(ngay31) === true) {
                //alert(congngayId.textbox('getValue'));
                SaveLuongBaoHiemNgay(congngayId, ngay31, '31');
                loadLuongBaoHiemId(congngayId);

                sogiocong.numberbox('setValue', $('#hidLuongBaoHiemSoGio').val());
                var songayid = $('#hidLuongBaoHiemSoNgay').val();
                songay.numberbox('setValue', songayid);
                mucluong.numberbox('setValue', $('#hidLuongBaoHiemMucLuong').val());
                tienbaohiem.numberbox('setValue', $('#hidLuongBaoHiemThanhTien').val());
                tienbaohiemyte.numberbox('setValue', $('#hidChiPhiGiamBHYT').val());
                tienbaohiemthatnghiep.numberbox('setValue', $('#hidChiPhiGiamBHTN').val());
                tienbaohiemxahoi.numberbox('setValue', $('#hidChiPhiGiamBHXH').val());
                tongtiendongbaohiem.numberbox('setValue', $('#hidChiPhiBHXH').val());
                tongtienthuclinh.numberbox('setValue', $('#hidTongTienThucLinh').val());

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

    var khoasoluongthang = $('#hidKhoaSoLuongThangDotIn').val();

    if (khoasoluongthang === "True") {
        tedu.notify("Kỳ này đã khóa sổ. Không có lưu. Kiểm tra lại.", "error");
    }

    if (khoasoluongthang === "False") {
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
                if (response.Success === false) {
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

            $('#hidLuongBaoHiemSoGio').val(moi.SoGioCong);
            $('#hidLuongBaoHiemSoNgay').val(moi.SoNgay);
            $('#hidLuongBaoHiemMucLuong').val(moi.MucLuong);
            $('#hidLuongBaoHiemThanhTien').val(moi.TienBaoHiem);
            $('#hidChiPhiGiamBHYT').val(moi.TienBHYT);
            $('#hidChiPhiGiamBHTN').val(moi.TienBHTN);
            $('#hidChiPhiGiamBHXH').val(moi.TienBHXH);
            $('#hidChiPhiBHXH').val(moi.TongTienBaoHiem);
            $('#hidTongTienThucLinh').val(moi.TongTienThucLinh);

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

            $('#hidKhoaSoLuongThangDotIn').val('');
            khoasoLuongThangDotIn(makhuvuc, thang1, nam1, dotinluongid);
        },
        error: function (status) {
            console.log(status);
            tedu.notify('Không thể lấy dữ liệu về.', 'error');
        }
    });
    return moi;
} 

function khoasoLuongThangDotIn(makhuvucLock, thangLock, namLock, dotinluongidLock) {    
    $.ajax({
        type: 'GET',
        url: '/admin/khoaso/GetLockLuongKyId',
        data: {
            makhuvuc: makhuvucLock,
            thang: thangLock,
            nam: namLock,
            dotinluongid: dotinluongidLock
        },
        dataType: "json",
        beforeSend: function () {
            tedu.startLoading();
        },
        success: function (response) {
            lockluong = response.Result[0];           

            if (lockluong !== null) {                
                $('#hidKhoaSoLuongThangDotIn').val(lockluong.IsLockLuongDotInKy);
                //alert($('#hidKhoaSoLuongThangDotIn').val());
            }
        },
        error: function (status) {
            console.log(status);
            tedu.notify('Không có danh mục Phòng.', 'error');
        }
    });

}



