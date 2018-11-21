var addeditchiphiController = function () {


    this.initialize = function () {

        registerEvents();

        loadAddEditData();
    }

    function registerEvents() {   
        
        $('#btnSaveChiPhi').on('click', function (e) {  
            e.preventDefault();            

            var loaichiphi = $("#ddlAddEditLoaiChiPhi").val();
            var dotin = $("#ddlAddEditDotIn").val();

            if (loaichiphi === "%" || dotin === "%") {
                tedu.notify("Chọn loại chi phí cho đúng. Kiểm tra lại!","error");
            }
            else {
                SaveKhoiTaoChiPhi();
            }
        });

    }

    function loadAddEditData() {
        $("#ddlAddEditLoaiChiPhi")[0].selectedIndex = 0;
        $('#ckAddEditChuyenKySau').prop('checked', false);

    }

    function SaveKhoiTaoChiPhi() {
        tedu.notify("save khoi tao chi phi","success");
        $('#modal-add-edit-ChiPhi').modal('hide');

    }

}