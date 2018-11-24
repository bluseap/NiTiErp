var addeditchiphiController = function () {


    this.initialize = function () {

        registerEvents();

        loadAddEditData();
    }

    function registerEvents() {   
        
        $('#btnSaveChiPhi').on('click', function (e) {  
            e.preventDefault();            

            var makhuvuc = $("#ddlAddEditKhuVuc").val();
            var thang = $("#ddlAddEditThang").val();
            var nam = $("#txtAddEditNam").val();
            var loaichiphi = $("#ddlAddEditLoaiChiPhi").val();
            var dotin = $("#ddlAddEditDotIn").val();

            if (loaichiphi === "%" || dotin === "%") {
                tedu.notify("Chọn loại chi phí cho đúng. Kiểm tra lại!","error");
            }
            else {
                $.ajax({
                    type: 'GET',
                    url: '/admin/khoaso/GetLockLuongKyId',
                    data: {
                        makhuvuc: makhuvuc,
                        thang: thang,
                        nam: nam,
                        dotinluongid: dotin
                    },
                    dataType: "json",
                    beforeSend: function () {
                        tedu.startLoading();
                    },
                    success: function (response) {
                        lockluong = response.Result[0];

                        if (lockluong.IsLockLuongDotInKy === "False") {
                            SaveKhoiTaoChiPhi();
                        }
                        if (lockluong.IsLockLuongDotInKy === "True") {
                            tedu.notify('Lương tháng đã khóa sổ. Kiểm tra lại.', 'error');
                        }
                        
                    },
                    error: function (status) {
                        console.log(status);
                        tedu.notify('Khóa sổ lương tháng đợ in.', 'error');
                    }
                });                
            }
        });

    }

    function loadAddEditData() {
        $("#ddlAddEditLoaiChiPhi")[0].selectedIndex = 0;
        $('#ckAddEditChuyenKySau').prop('checked', false);

    }

    function SaveKhoiTaoChiPhi() {        

        var chiphikhoitaoid = $('#hidChiPhiKhoiTaoId').val();
        var makhuvuc = $("#ddlAddEditKhuVuc").val();
        var thang = $("#ddlAddEditThang").val();
        var nam = $("#txtAddEditNam").val();
        var kykhoitao = tedu.getFormatDateYYMMDD("01/" + thang + "/" + nam); 
        //var dotin = $("#ddlAddEditDotIn").val();
        var loaichiphi = $("#ddlAddEditLoaiChiPhi").val();
        var chuyenkysau = $('#ckAddEditChuyenKySau').prop('checked') === true ? 1 : 0;

        $.ajax({
            type: "POST",
            url: "/Admin/chiphi/AddUpdateChiPhi",
            data: {
                Id: chiphikhoitaoid,
                CorporationId: makhuvuc,
                KyKhoiTao: nam + "/" + thang + "/01",                
                ChiPhiId: loaichiphi,
                IsChuyenKy: chuyenkysau                
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                if (response.Success === false) {
                    tedu.notify(response.Message, "error");
                }
                else {
                    tedu.stopLoading();
                    $('#modal-add-edit-ChiPhi').modal('hide');
                    tedu.notify('Khởi tạo chi phí thành công.', 'success');
                }                
            },
            error: function () {
                tedu.notify('Lỗi khởi tạo chi phí.', 'error');
                tedu.stopLoading();
            }
        });

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
                }
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Khóa sổ lương tháng đợt in.', 'error');
            }
        });
    }

}