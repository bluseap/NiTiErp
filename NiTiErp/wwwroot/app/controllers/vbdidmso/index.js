var vbdidmsoController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();

    var addeditvbdidmso = new addeidtvbdidmsoController();
    
    this.initialize = function () {

        loadKhuVuc();

        registerEvents();

        addeditvbdidmso.initialize();        

        loadData();
    }

    function registerEvents() {

        $('#btnTimNoiDung').on('click', function () {
            addeditvbdidmso.loadTableVBDiDMSo();     
        });

        $('#txtTimNoiDung').on('keypress', function (e) {
            if (e.which === 13) {
                addeditvbdidmso.loadTableVBDiDMSo();     
            }
        });

        $("#btn-create").on('click', function (e) {
            e.preventDefault();

            $('#hidVBDiSMSoId').val(0);          
            $('#hidInsertVBDiSMSoId').val(1);  // insert            

            $('#modal-add-edit-VBDiSMSo').modal('show');
        });

        $('body').on('click', '.btn-addeditVBDiDMSo', function (e) {
            e.preventDefault();         
            var vbdidmsoid = $(this).data('id');
            addeditvbdidmso.loadVBDiDMSo(vbdidmsoid);
            $('#modal-add-edit-VBDiSMSo').modal('show');
        });

        $("#ddl-show-pageVBDiDMSo").on('change', function () {
            tedu.configs.pageSize = $(this).val();
            tedu.configs.pageIndex = 1;
            addeditvbdidmso.loadTableVBDiDMSo(true);     
        });

        $('body').on('click', '.btn-deleteVBDiDMSo', function (e) {
            e.preventDefault();
            $('#hidVBDiSMSoId').val(3); 
            var vbdidmsoid = $(this).data('id');
            deleteVBDiDMSo(vbdidmsoid);
        });
    }

    function deleteVBDiDMSo(vbdidmsoid) {
        var insertvbdidmso = $('#hidVBDiSMSoId').val(); 

        tedu.confirm('Bạn có chắc chắn xóa bằng này?', function () {
            $.ajax({
                type: "POST",
                url: "/Admin/VBDiDMSo/DeleteVBDiDMSo",
                data: {
                    Id: vbdidmsoid,
                    InsertVanBanDiSoId: insertvbdidmso // 3
                },
                dataType: "json",
                beforeSend: function () {
                    tedu.startLoading();
                },
                success: function (response) {
                    tedu.notify('Xóa thành công', 'success');
                    tedu.stopLoading();
                    $('#hidVBDiSMSoId').val(0);
                    addeditvbdidmso.loadTableVBDiDMSo();     
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
                $('#ddlVBDiDMAddEditKhuVuc').html(render);

                var userCorporationId = $("#hidUserCorporationId").val();
                if (userCorporationId !== "PO") {
                    $('#ddlKhuVuc').prop('disabled', true);
                    $('#ddlVBDiDMAddEditKhuVuc').prop('disabled', true);
                }
                else {
                    $('#ddlKhuVuc').prop('disabled', false);
                    $('#ddlVBDiDMAddEditKhuVuc').prop('disabled', false);
                }
                $("#ddlKhuVuc")[0].selectedIndex = 1;
                $('#ddlKhuVuc').prop('disabled', true);

                $("#ddlVBDiDMAddEditKhuVuc")[0].selectedIndex = 1;
                $('#ddlVBDiDMAddEditKhuVuc').prop('disabled', true);               

                addeditvbdidmso.loadTableVBDiDMSo();        
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Công Ty.', 'error');
            }
        });
    }

    function loadData() {
        var namhientai = new Date().getFullYear();

        $('#txtVBDiDMSoNam').val(namhientai);
        $('#txtVBDiDMSoAddEditNam').val(namhientai);

    }

}