var nghiviecController = function () {


    this.initialize = function () {

        registerEvents();
    }

    this.loadSaveNghiViec = function (hosoId) {
        loadNghiViec(hosoId);
    }

    function registerEvents() {
        formMainValidate();

        $('#btnSaveNghiViec').on('click', function () {
            SaveNghiViec();
        });

        $('#txtNghiViecNgayNghi ').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'vi'
        });

        $('#btnPhucHoiNghiViec').on('click', function () {
            PhucHoiNghiViec();
        });

    }

    function formMainValidate() {        

        jQuery.validator.addMethod("isDateVietNam", function (value, element) {
            return this.optional(element) || moment(value, "DD/MM/YYYY").isValid();
        },
            "Nhập theo định dạng ngày, tháng, năm."
        );

        $('#frmMainNghiViec').validate({
            errorClass: 'red',
            ignore: [],
            language: 'vi',
            rules: {
                txtNghiViecNgayNghi: {
                    required: true,
                    isDateVietNam: true
                },
                txtNghiViecLyDo: {
                    required: true                   
                }
            },
            messages: {
                txtNghiViecNgayNghi: { required: "Nhập nghĩ việc cho đúng.." },
                txtNghiViecLyDo: { requied: "Nhập lý do nghĩ việc"}
            }
        });

    }

    function isFormMainValidate() {
        if ($('#frmMainNghiViec').valid() ) {
            return true;
        }
        else {
            return false;
        }
    }

    function loadNghiViec(hosoId) {
        tedu.notify(hosoId, "success");

        $('#hidInsertNghiViecId').val(1);
        $('#hidNghiViecHoSoNhanVienId').val(hosoId);

        $.ajax({
            type: "GET",
            url: "/Admin/hoso/GetHoSoNghiViecId",
            data: { hosonhanvienid: hosoId },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    $('#hidNghiViec').val('');
                    $('#txtNghiViecNgayNghi').val('');
                    $('#txtNghiViecLyDo').val('');   
                }
                else {
                    var hosonghiviec = response.Result.Results[0];

                    $('#hidNghiViec').val(hosonghiviec.Id);
                    $('#txtNghiViecNgayNghi').val(tedu.getFormattedDate(hosonghiviec.NgayNghiViec));
                    $('#txtNghiViecLyDo').val(hosonghiviec.LyDoNghiViec);   
                  
                    //$('#txtNgayKyHopDong').val(tedu.getFormattedDate(hopdong.NgayKyHopDong                   
                }
                //$('#ckStatusM').prop('checked', data.Status === 1);     
                tedu.stopLoading();
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }   

    function SaveNghiViec() {
        tedu.notify("luu nghi viec nhan vien", "success");
        var isMainValidate = isFormMainValidate();
        if (isMainValidate === true) {           

            var nghiviecid = $('#hidNghiViec').val();
            var insertnghiviecId = $('#hidInsertNghiViecId').val();
            var hosoId = $('#hidNghiViecHoSoNhanVienId').val();            

            var ngaynghiviec = tedu.getFormatDateYYMMDD($('#txtNghiViecNgayNghi').val());
            var lydo = $('#txtNghiViecLyDo').val();
            var ghichu = '';

            //var ngayhethan = tedu.getFormatDateYYMMDD($('#txtNgayHetHan').val());

            $.ajax({
                type: "POST",
                url: "/Admin/hoso/AddUpdateNghiViec",
                data: {
                    Id: 1,
                    HoSoNhanVienId: hosoId,
                    InsertHoSoNghiViecId: insertnghiviecId,

                    NgayNghiViec: ngaynghiviec,
                    LyDoNghiViec: lydo,
                    GhiChu: ghichu      
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
                        tedu.notify('Tạo hồ sơ nghĩ việc.', 'success'); 
                        $('#modal-add-edit-NghiViec').modal('hide');
                        tedu.stopLoading();
                    }
                },
                error: function () {
                    tedu.notify('Có lỗi! Tạo hồ sơ nghĩ việc', 'error');
                    tedu.stopLoading();
                }
            });

        }
    }

    function PhucHoiNghiViec() {
        var hosonahnvienid = $('#hidNghiViecHoSoNhanVienId').val();

        $.ajax({
            type: "POST",
            url: "/Admin/hoso/DeleteNghiViec",
            data: {
                Id: 1,
                HoSoNhanVienId: hosonahnvienid,
                InsertHoSoNghiViecId: 5, // phuc hoi ho so nghi viec nhan vien

                NgayNghiViec: '2018-1-1',
                LyDoNghiViec: '',
                GhiChu: ''
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
                    tedu.notify('Phục hồi hồ sơ nghĩ việc.', 'success');
                    $('#modal-add-edit-NghiViec').modal('hide');
                    tedu.stopLoading();
                }
            },
            error: function () {
                tedu.notify('Có lỗi! Tạo hồ sơ nghĩ việc', 'error');
                tedu.stopLoading();
            }
        });

    }

}