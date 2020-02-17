var addeditchiphidmController = function () {


    this.initialize = function () {

        loadaddeditData();

        registerEvents();

        
    }

    function registerEvents() {        
                

    }    

    function loadaddeditData() {

        var ischiphitang = [{ value: "%", ten: "-- Chọn chi phí --" },{ value: "1", ten: "CP Tăng" }, { value: "2", ten: "CP Giảm" }];
        var render = "";
        for (var i = 0; i < ischiphitang.length; i++) {
            render += "<option value='" + ischiphitang[i].value + "'>" + ischiphitang[i].ten + "</option>";
        }
        $('#ddlAddEditIsChiPhiTang').html(render);        
    }       


}