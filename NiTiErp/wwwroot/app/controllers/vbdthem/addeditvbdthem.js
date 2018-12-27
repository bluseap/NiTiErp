var addeditvbdthemController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
  

    this.initialize = function () {
        
        registerEvents();

        loadAddEditData();

    }

    this.vanbandanhmuc = function () {
        loadVanBanKhanList();
        loadVanBanMatList();
    }

    function registerEvents() {

        $('body').on('click', '.btnFileVanBan', function (e) {            
            $('#modal-add-edit-FileVanBanDen').modal('show');  
        });

        $("#btnThemMoiCoQuan").on('click', function (e) {
            e.preventDefault();
            $('#modal-add-edit-ThemCoQuan').modal('show');  
        });

    }

    function loadAddEditData() {
        $('#ddlSoVanBanDen').prop("disabled", true);
        $('#txtSoVanBanDen').prop("disabled", true);

    }

    function loadVanBanKhanList() {
        $.ajax({
            type: 'GET',
            url: '/admin/vbkhan/VanBanKhanGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Ten + "</option>";
                });
                $('#ddlCapDoKhan').html(render);               
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có văn bản khẩn.', 'error');
            }
        });
    }

    function loadVanBanMatList() {
        $.ajax({
            type: 'GET',
            url: '/admin/vbmat/VanBanMatGetList',
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                var render = "<option value='%' >--- Lựa chọn ---</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Ten + "</option>";
                });
                $('#ddlCapDoMat').html(render);
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có văn bản mật.', 'error');
            }
        });
    }

    function ClearFormAddEdit() {
        $('#hidVanBanDenId').val('');
        $('#hidInsertVBDThemId').val(0);
        $('#hidCodeFileGuidId').val('');

    }

}