var quanlyvbController = function () {

    var userCorporationId = $("#hidUserCorporationId").val();
    var addeditqlvb = new addeditqlvbController();

    this.initialize = function () {       
        loadKhuVuc();

        registerEvents();
       
        addeditqlvb.initialize();
     
        loadData();
    }

    function registerEvents() {
        $('#btnTimNoiDung').on('click', function () {           
            addeditqlvb.loadTableQuanLyVanBan();
        });

        $('#txtTenDanhMucHoSo').on('keypress', function (e) {
            if (e.which === 13) {              
                addeditqlvb.loadTableQuanLyVanBan();
            }
        });

        $("#btn-create").on('click', function (e) {
            e.preventDefault();
            addeditqlvb.clearAddEditData();

            $('#hidQuanLyVanBanId').val(0);
            $('#hidInsertQuanLyVanBanId').val(1);  // insert  
            $('#modal-add-edit-QuanLyVanBan').modal('show');
        });

        $('body').on('click', '.btn-addeditQuanLyVanBan', function (e) {
            e.preventDefault();       
            
            var quanlyvanbanid = $(this).data('id');
            $('#hidQuanLyVanBanId').val(quanlyvanbanid);
            $('#hidInsertQuanLyVanBanId').val(2); // update  
            addeditqlvb.loadQuanLyVanBan(quanlyvanbanid);
         
            $('#modal-add-edit-QuanLyVanBan').modal('show');
        });

        $('body').on('click', '.btn-deleteQuanLyVanBan', function (e) {
            e.preventDefault();

            var quanlyvanbanid = $(this).data('id');
            $('#hidQuanLyVanBanId').val(quanlyvanbanid);
            $('#hidInsertQuanLyVanBanId').val(3); // delete  

            deleteQuanLyVanBan(quanlyvanbanid);           
        });

    }

    function loadKhuVuc() {
        return $.ajax({
            type: 'GET',
            url: '/admin/hoso/GetListCorNhanSu',
            dataType: 'json',
            success: function (response) {
                var render = "<option value='%' >-- Lựa chọn --</option>";
                $.each(response.Result, function (i, item) {
                    render += "<option value='" + item.Id + "'>" + item.Name + "</option>";
                });
                $('#ddlKhuVuc').html(render);
                $('#ddlKhuVucQLVB').html(render);
                
                if (userCorporationId !== "PO") {
                    $('#ddlKhuVuc').prop('disabled', true);
                    $('#ddlKhuVucQLVB').prop('disabled', true);
                }
                else {
                    $('#ddlKhuVuc').prop('disabled', false);
                    $('#ddlKhuVucQLVB').prop('disabled', false);
                }
                $("#ddlKhuVuc")[0].selectedIndex = 1;   
                $("#ddlKhuVucQLVB")[0].selectedIndex = 1;   

                addeditqlvb.loadTableQuanLyVanBan();
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Công Ty.', 'error');
            }
        });
    }

    function deleteQuanLyVanBan(quanlyvanbanid) {
        var insertquanlyvbid = $('#hidInsertQuanLyVanBanId').val();
        tedu.confirm('Bạn có chắc chắn xóa bằng này?', function () {
            $.ajax({
                type: "POST",
                url: "/Admin/quanlyvb/DeleteQuanLyVB",
                data: {
                    Id: quanlyvanbanid,
                    InsertQuanLyVanBanId: insertquanlyvbid // 3
                },
                dataType: "json",
                beforeSend: function () {
                    tedu.startLoading();
                },
                success: function (response) {
                    tedu.notify('Xóa thành công', 'success');
                    tedu.stopLoading();
                    $('#hidQuanLyVanBanId').val(0);
                    $('#hidInsertQuanLyVanBanId').val(0); 
                    addeditqlvb.loadTableQuanLyVanBan();
                },
                error: function (status) {
                    tedu.notify('Xóa Quản lý văn bản! Kiểm tra lại.', 'error');
                    tedu.stopLoading();
                }
            });
        });
    }

    function loadData() {

    }

    

}