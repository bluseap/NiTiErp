var HomeController = function () {
    var userCorporationId = $("#hidUserCorporationId").val();

    this.initialize = function () {
        loadKhuVuc();
        
        loadData();      

        registerEvents();
    }

    function registerEvents() {

        $('body').on('click', '.btnTrangChu', function (e) {
            e.preventDefault();
            var url = window.location.href;       // Hiển thị đường dẫn url
            //var tieude = window.document.title;    // Hiển thị tiêu đề trang  
            var win = window.open(url, '_blank');
            win.focus();
        });

        $('#btnTimNhanVien').on('click', function () {
            loadChart();
        });

        $('#txtTimNhanVien').on('keypress', function (e) {
            if (e.which === 13) {
                loadChart();
            }
        });
    }

    function loadData() {       
        chartThongKeNhanVien("", "");

        chartThongKeChucVu("", "");

        //thongbao();
    }

    function loadChart() {
        chartThongKeNhanVienMakv("", "");
        chartThongKeChucVuMakv("", "");
    }

    function chartThongKeNhanVienMakv(formDate, toDate) {       
        var khuvuc = $('#ddlKhuVuc').val();

        $.ajax({
            type: "GET",
            url: "/Admin/Home/TKSLNhanVien",
            data: {
                corporationId: khuvuc,
                phongId: "",
                chucvuId: "",
                trinhdoId: ""
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                $('#graphBar').empty();
                $("#graphBar").append('<div id="graph_bar2" style="width: 100 %; height: 280px;"></div>');

                if (response.length === 0) {
                    Morris.Bar({
                        element: 'graph_bar2',
                        data: response,
                        xkey: 'TenPhong',
                        ykeys: ['SoNguoi'],
                        labels: ['Nhân viên: '],
                        barRatio: 0.4,
                        barColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
                        xLabelAngle: 35,
                        hideHover: 'auto',
                        resize: true
                    });
                }
                else {     
                    Morris.Bar({
                        element: 'graph_bar2',
                        data: response,
                        xkey: 'TenPhong',
                        ykeys: ['SoNguoi'],
                        labels: ['Nhân viên: '],
                        barRatio: 0.4,
                        barColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
                        xLabelAngle: 35,
                        hideHover: 'auto',
                        resize: true
                    });
                }
                
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
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
                var userCorporationId = $("#hidUserCorporationId").val();
                if (userCorporationId !== "PO") {
                    $('#ddlKhuVuc').prop('disabled', true);                   
                }
                else {
                    $('#ddlKhuVuc').prop('disabled', false);                   
                }
                $("#ddlKhuVuc")[0].selectedIndex = 1;   

                var makv = $('#ddlKhuVuc').val();
                thongbao();
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không có danh mục Công Ty.', 'error');
            }
        });
    }

    function initChart(data) {
        var arrRevenue = [];
        var arrProfit = [];

        $.each(data, function (i, item) {
            arrRevenue.push([new Date(item.Date).getTime(), item.Revenue]);
        });
        $.each(data, function (i, item) {
            arrProfit.push([new Date(item.Date).getTime(), item.Profit]);
        });

        var chart_plot_02_settings = {
            grid: {
                show: true,
                aboveData: true,
                color: "#3f3f3f",
                labelMargin: 10,
                axisMargin: 0,
                borderWidth: 0,
                borderColor: null,
                minBorderMargin: 5,
                clickable: true,
                hoverable: true,
                autoHighlight: true,
                mouseActiveRadius: 100
            },
            series: {
                lines: {
                    show: true,
                    fill: true,
                    lineWidth: 2,
                    steps: false
                },
                points: {
                    show: true,
                    radius: 4.5,
                    symbol: "circle",
                    lineWidth: 3.0
                }
            },
            legend: {
                position: "ne",
                margin: [0, -25],
                noColumns: 0,
                labelBoxBorderColor: null,
                labelFormatter: function (label, series) {
                    return label + '&nbsp;&nbsp;';
                },
                width: 40,
                height: 1
            },
            colors: ['#96CA59', '#3F97EB', '#72c380', '#6f7a8a', '#f7cb38', '#5a8022', '#2c7282'],
            shadowSize: 0,
            tooltip: true,
            tooltipOpts: {
                content: "%s: %y.0",
                xDateFormat: "%d/%m",
                shifts: {
                    x: -30,
                    y: -50
                },
                defaultTheme: false
            },
            yaxis: {
                min: 0
            },
            xaxis: {
                mode: "time",
                minTickSize: [1, "day"],
                timeformat: "%d/%m/%y",
                //min: arrRevenue[0][0],
                //max: arrRevenue[20][0]
            }
        };
        if ($("#chart_plot_02").length) {
            console.log('Plot2');

            $.plot($("#chart_plot_02"),
                [{
                    label: "Revenue",
                    data: arrRevenue,
                    lines: {
                        fillColor: "rgba(150, 202, 89, 0.12)"
                    },
                    points: {
                        fillColor: "#fff"
                    }
                },
                {
                    label: "Profit",
                    data: arrProfit,
                    lines: {
                        fillColor: "rgba(140, 232, 289, 0.12)"
                    },
                    points: {
                        fillColor: "#fff"
                    }
                }], chart_plot_02_settings);

        }
    }
    function initDateRangePicker() {

        if (typeof ($.fn.daterangepicker) === 'undefined') { return; }
        console.log('init_daterangepicker');

        var cb = function (start, end, label) {
            console.log(start.toISOString(), end.toISOString(), label);
            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        };

        var optionSet1 = {
            startDate: moment().subtract(29, 'days'),
            endDate: moment(),
            minDate: '01/01/2012',
            maxDate: moment().format('MM/DD/YYYY'),
            dateLimit: {
                days: 60
            },
            showDropdowns: true,
            showWeekNumbers: true,
            timePicker: false,
            timePickerIncrement: 1,
            timePicker12Hour: true,
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            opens: 'left',
            buttonClasses: ['btn btn-default'],
            applyClass: 'btn-small btn-primary',
            cancelClass: 'btn-small',
            format: 'MM/DD/YYYY',
            separator: ' to ',
            locale: {
                applyLabel: 'Submit',
                cancelLabel: 'Clear',
                fromLabel: 'From',
                toLabel: 'To',
                customRangeLabel: 'Custom',
                daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                firstDay: 1
            }
        };

        $('#reportrange span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
        $('#reportrange').daterangepicker(optionSet1, cb);
        $('#reportrange').on('show.daterangepicker', function () {
            console.log("show event fired");
        });
        $('#reportrange').on('hide.daterangepicker', function () {
            console.log("hide event fired");
        });
        $('#reportrange').on('apply.daterangepicker', function (ev, picker) {
            console.log("apply event fired, start/end dates are " + picker.startDate.format('MMMM D, YYYY') + " to " + picker.endDate.format('MMMM D, YYYY'));
            loadData(picker.startDate.format("MM/DD/YYYY"), picker.endDate.format('MM/DD/YYYY'));


        });
        $('#reportrange').on('cancel.daterangepicker', function (ev, picker) {
            console.log("cancel event fired");
        });
        $('#options1').click(function () {
            $('#reportrange').data('daterangepicker').setOptions(optionSet1, cb);
        });
        $('#options2').click(function () {
            $('#reportrange').data('daterangepicker').setOptions(optionSet2, cb);
        });
        $('#destroy').click(function () {
            $('#reportrange').data('daterangepicker').remove();
        });
    }
    function loadChartPhongTo() {
        var date = new Date();        
        var tungayId = tedu.getFormatDateYYMMDD(tedu.getFormattedDate(date));
        var denngayId = tedu.getFormatDateYYMMDD(tedu.getFormattedDate(date));

        var datachart = loadData(tungayId, tungayId);
        
    }

    function chartThongKeNhanVien(form, to) {
        var khuvuc = userCorporationId;

        $.ajax({
            type: "GET",
            url: "/Admin/Home/TKSLNhanVien",
            data: {
                corporationId: khuvuc,
                phongId: "",
                chucvuId: "",
                trinhdoId: ""
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {        
                $(document).ready(function () {
                    Morris.Bar({
                        element: 'graph_bar2',
                        data:
                            response,
                        xkey: 'TenPhong',
                        ykeys: ['SoNguoi'],
                        labels: ['Nhân viên: '],
                        barRatio: 0.4,
                        barColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
                        xLabelAngle: 35,
                        hideHover: 'auto',
                        resize: true
                    });

                });

            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function chartThongKeChucVu(form, to) {
        var khuvuc = userCorporationId;

        $.ajax({
            type: "GET",
            url: "/Admin/Home/TKSLChucVu",
            data: {
                corporationId: khuvuc,
                phongId: "",
                chucvuId: "",
                trinhdoId: ""
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {  
                Morris.Donut({
                    element: 'graph_donut2',
                    data: response,
                    colors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB', '#F7CA18', '#E74C3C'],
                    formatter: function (y) {                       
                        return y;
                        //return y + "%";
                    },
                    resize: true
                });

                //$(document).ready(function () {
                //    Morris.Donut({
                //        element: 'graph_donut2',
                //        data: [
                //            { label: 'Jam', value: 25 },
                //            { label: 'Frosted', value: 40 },
                //            { label: 'Custard', value: 25 },
                //            { label: 'Sugar', value: 10 }
                //        ],
                //        colors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
                //        formatter: function (y) {
                //            return y + "%";
                //        },
                //        resize: true
                //    });
                //});
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function chartThongKeChucVuMakv(form, to) {
        var khuvuc = $('#ddlKhuVuc').val();

        $.ajax({
            type: "GET",
            url: "/Admin/Home/TKSLChucVu",
            data: {
                corporationId: khuvuc,
                phongId: "",
                chucvuId: "",
                trinhdoId: ""
            },
            dataType: "json",
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                $('#graphDonut').empty();
                $("#graphDonut").append('<div id="graph_donut2" style="width:100%; height:300px;"></div>');

                Morris.Donut({
                    element: 'graph_donut2',
                    data: response,
                    colors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
                    formatter: function (y) {
                        return y;
                        //return y + "%";
                    },
                    resize: true
                });               
            },
            error: function (status) {
                tedu.notify('Có lỗi xảy ra', 'error');
                tedu.stopLoading();
            }
        });
    }

    function thongbao(isPageChanged) {
        var template = $('#table-ThongBao').html();
        var render = "";

        var makhuvuc = $('#ddlKhuVuc').val(); 
        var phongid = ""; //$('#ddlPhongBan').val();
        //var timnhanvien = $('#btnTimNhanVien').val();
        var timnhanvien = "";

        $.ajax({
            type: 'GET',
            url: '/admin/thongbao/GetListThongBaoPaging',            
            data: {
                corporationId: makhuvuc,
                phongId: phongid,
                keyword: timnhanvien,
                page: tedu.configs.pageIndex,
                pageSize: tedu.configs.pageSize,
                hosoId: ""
            },            
            dataType: 'json',
            beforeSend: function () {
                tedu.startLoading();
            },
            success: function (response) {
                if (response.Result.Results.length === 0) {
                    render = "<tr><th><a>Không có dữ liệu</a></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
                }
                else {
                    $.each(response.Result.Results, function (i, item) {
                        render += Mustache.render(template, {
                            Id: item.Id,
                            TieuDe: item.TieuDe,
                            //HinhNhanVien: item.Image === null ? '<img src="/admin-side/images/user.png?h=90"' : '<img src="' + item.HinhNhanVien + '?h=90" />',
                            NoiDung: item.NoiDung,
                            TenKhuVuc: item.TenKhuVuc,
                            UploadFile1: item.UploadFile1,
                            CreateDate: tedu.getFormattedDateTimeN(item.CreateDate),
                            Status: tedu.getHoSoNhanVienStatus(item.Status)
                            // Price: tedu.formatNumber(item.Price, 0),                          
                        });
                    });
                }

                //$('#lblThongBaoTotalRecords').text(response.Result.RowCount);

                if (render !== '') {
                    $('#tblContentThongBao').html(render);
                }

                if (response.Result.RowCount !== 0) {
                    wrapPagingThongBao(response.Result.RowCount, function () {                       
                        thongbao(userCorporationId);
                    },
                        isPageChanged);
                }
            },
            error: function (status) {
                console.log(status);
                tedu.notify('Không thể lấy dữ liệu về.', 'error');
            }
        });
    }
    function wrapPagingThongBao(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationULThongBaoHome a').length === 0 || changePageSize === true) {
            $('#paginationULThongBaoHome').empty();
            $('#paginationULThongBaoHome').removeData("twbs-pagination");
            $('#paginationULThongBaoHome').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationULThongBaoHome').twbsPagination({
            totalPages: totalsize,
            visiblePages: 0,
            first: '',
            prev: '<',
            next: '>',
            last: '',
            onPageClick: function (event, p) {                
                if (tedu.configs.pageIndex !== p) {
                    tedu.configs.pageIndex = p;
                    setTimeout(callBack(), 200);
                }
            }
        });
    }


}