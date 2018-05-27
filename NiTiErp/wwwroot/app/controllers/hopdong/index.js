var hopdongController = function () {

    //var images = [];

    this.initialize = function () {

        loadData();

        registerEvents();
    }

    function registerEvents() {
        //Init validation
        //$('#frmMainLyLich').validate({
        //    errorClass: 'red',
        //    ignore: [],
        //    lang: 'vi',
        //    rules: {
        //        txtHoVaTen: { required: true },
        //        ddlGioiTinh: { required: true },
        //        txtHeSoLuongCoBan: {
        //            required: true,
        //            number: true
        //        },
        //        txtLuongCoBan: {
        //            required: true,
        //            number: true
        //        }
        //    }
        //});

        $("#btn-create").on('click', function () {
            resetFormMaintainance();
            $('#modal-add-edit-HopDong').modal('show');
        });

    }

    function resetFormMaintainance() {
        //$('#hidLyLichId').val(0);

        //$('#txtSoTheNhanVien').val('');
        //$('#txtHoVaTen').val('');


        //$('#txtPriceM').val('0');
        //$('#txtImageM').val('');    
        //CKEDITOR.instances.txtContentM.setData('');
        //$('#ckStatusM').prop('checked', true);
        //$('#ckHotM').prop('checked', false);
        //$('#ckShowHomeM').prop('checked', false);
    }

    function loadData() {

        //var gioitinh = [{ value: "1", ten: "Nam" }, { value: "0", ten: "Nữ" }];
        //var render = "";
        //for (var i = 0; i < gioitinh.length ; i++) {
        //    render += "<option value='" + gioitinh[i].value + "'>" + gioitinh[i].ten + "</option>";
        //}
        //$('#ddlGioiTinh').html(render);


    }



}