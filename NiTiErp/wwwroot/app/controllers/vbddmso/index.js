var vbddmsoController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();

    var addeditvbddmso = new addeidtvbddmsoController();

    this.initialize = function () {

        loadKhuVuc();

        registerEvents();

        addeditvbddmso.initialize();

        loadData();
    }

    function registerEvents() {

        $('#btnTimNoiDung').on('click', function () {
            addeditvbddmso.loadTableVBDDMSo();
        });

        $('#txtTimNoiDung').on('keypress', function (e) {
            if (e.which === 13) {
                addeditvbddmso.loadTableVBDDMSo();
            }
        });

        $("#btn-create").on('click', function (e) {
            e.preventDefault();

            $('#hidVBDSMSoId').val(0);
            $('#hidInsertVBDSMSoId').val(1);  // insert            

            $('#modal-add-edit-VBDSMSo').modal('show');
        });

        $('body').on('click', '.btn-addeditVBDDMSo', function (e) {
            e.preventDefault();
            var vbddmsoid = $(this).data('id');
            addeditvbddmso.loadVBDDMSo(vbddmsoid);
            $('#modal-add-edit-VBDSMSo').modal('show');
        });

        $("#ddl-show-pageVBDDMSo").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            addeditvbddmso.loadTableVBDDMSo(true);
        });

        $('body').on('click', '.btn-deleteVBDDMSo', function (e) {
            e.preventDefault();
            $('#hidVBDSMSoId').val(3);
            var vbddmsoid = $(this).data('id');
            deleteVBDDMSo(vbddmsoid);
        });
    }

    function deleteVBDDMSo(vbddmsoid) {
        var insertvbddmso = $('#hidVBDSMSoId').val();

        tedu.confirm('Bạn có chắc chắn xóa bằng này?', function () {
            $.ajax({
                type: "POST",
                url: "/Admin/VBDDMSo/DeleteVBDDMSo",
                data: {
                    Id: vbddmsoid,
                    InsertVanBanDenSoId: insertvbddmso // 3
                },
                dataType: "json",
                beforeSend: function () {
                    tedu.startLoading();
                },
                success: function (response) {
                    tedu.notify('Xóa thành công', 'success');
                    tedu.stopLoading();
                    $('#hidVBDSMSoId').val(0);
                    addeditvbddmso.loadTableVBDDMSo();
                },
                error: function (status) {
                    tedu.notify('Xóa Nơi khám Sức khỏe lỗi! Kiểm tra lại.', 'error');
                    tedu.stopLoading();
                }
            });
        });
    }

    function loadKhuVuc() {
        return $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetListCorNhanSu',
            dataType: 'json',
            success: function (response) {
                var render = "<option value='%' >-- Tất cả --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Name + "</option>";
                });
                $('#ddlKhuVuc').html(render);
                $('#ddlVBDDMAddEditKhuVuc').html(render);

                var userCorporationId = $("#hidUserCorporationId").val();
                if (userCorporationId !== "PO") {
                    $('#ddlKhuVuc').prop('disabled', true);
                    $('#ddlVBDDMAddEditKhuVuc').prop('disabled', true);
                }
                else {
                    $('#ddlKhuVuc').prop('disabled', false);
                    $('#ddlVBDDMAddEditKhuVuc').prop('disabled', false);
                }
                $("#ddlKhuVuc")[0].selectedIndex = 1;
                $('#ddlKhuVuc').prop('disabled', true);

                $("#ddlVBDDMAddEditKhuVuc")[0].selectedIndex = 1;
                $('#ddlVBDDMAddEditKhuVuc').prop('disabled', true);

                addeditvbddmso.loadTableVBDDMSo();
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Công Ty.', 'error');
            }
        });
    }

    function loadData() {
        var namhientai = new Date().getFullYear();

        $('#txtVBDDMSoNam').val(namhientai);
        $('#txtVBDDMSoAddEditNam').val(namhientai);

    }



}