(function($){
    function getRows(target){
        var state = $(target).data('datagrid');
        if (state.filterSource){
            return state.filterSource.rows;
        } else {
            return state.data.rows;
        }
    }
    function toHtml(target, rows){
        rows = rows || getRows(target);
        var dg = $(target);
        var data = ['<table border="1" rull="all" style="border-collapse:collapse" id="tableidhtml">'];
        var fields = dg.datagrid('getColumnFields',true).concat(dg.datagrid('getColumnFields',false));
        var trStyle = 'height:32px';
        var tdStyle0 = 'vertical-align:middle;padding:0 4px';
        data.push('<tr style="'+trStyle+'">');
        for(var i=0; i<fields.length; i++){
            var col = dg.datagrid('getColumnOption', fields[i]);
            var tdStyle = tdStyle0 + ';width:'+col.boxWidth+'px;';
            data.push('<th style="'+tdStyle+'">'+col.title+'</th>');
        }
        data.push('</tr>');
        $.map(rows, function(row){
            data.push('<tr style="'+trStyle+'">');
            for(var i=0; i<fields.length; i++){
                var field = fields[i];
                data.push(
                    '<td style="'+tdStyle0+'">'+row[field]+'</td>'
                );
            }
            data.push('</tr>');
        });
        data.push('</table>');
        return data.join('');
    }

    function toArray(target, rows){
        rows = rows || getRows(target);
        var dg = $(target);
        var fields = dg.datagrid('getColumnFields',true).concat(dg.datagrid('getColumnFields',false));
        var data = [];
        var r = [];
        for(var i=0; i<fields.length; i++){
            var col = dg.datagrid('getColumnOption', fields[i]);
            r.push(col.title);
        }
        data.push(r);
        $.map(rows, function(row){
            var r = [];
            for(var i=0; i<fields.length; i++){
                r.push(row[fields[i]]);
            }
            data.push(r);
        });
        return data;
    }

    function print(target, param){
        var title = null;
        var rows = null;
        if (typeof param == 'string'){
            title = param;
        } else {
            title = param['title'];
            rows = param['rows'];
        }
        var newWindow = window.open('', '', 'width=800, height=500');
        var document = newWindow.document.open();
        var content = 
            '<!doctype html>' +
            '<html>' +
            '<head>' +
            '<meta charset="utf-8">' +
            '<title>'+title+'</title>' +
            '</head>' +
            '<body>' + toHtml(target, rows) + '</body>' +           
            '</html>';
        document.write(content);
        document.close();
        newWindow.print();
    } 

    //function print(target, param) {
    //    var title = null;
    //    var rows = null;
    //    if (typeof param == 'string') {
    //        title = param;
    //    } else {
    //        title = param['title'];
    //        rows = param['rows'];
    //    }
    //    var newWindow = window.open('', '', 'width=800, height=500');
    //    var document = newWindow.document.open();
    //    var content =
    //        '<!doctype html>' +
    //        '<html>' +
    //        '<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title> Group Rows in DataGrid - jQuery EasyUI Demo</title><link rel="stylesheet" type="text/css" href="https://www.jeasyui.com/easyui/themes/default/easyui.css"><link rel="stylesheet" type="text/css" href="https://www.jeasyui.com/easyui/themes/icon.css"><script type="text/javascript" src="https://www.jeasyui.com/easyui/jquery.min.js"></script><script type="text/javascript" src="https://www.jeasyui.com/easyui/jquery.easyui.min.js"></script><script type="text/javascript" src="https://www.jeasyui.com/easyui/datagrid-groupview.js"></script>'
    //        + '<meta charset="utf-8"></head>' +
    //        // '<body>' + toHtml(target, rows) + '</body>' +
    //        '<body> <table class="easyui-datagrid" title="Group Rows in DataGrid" style="width:700px;height:250px" data-options="singleSelect: true,  collapsible: true,  rownumbers: true, fitColumns: true, data: data"        >'
    //        + '<thead> <tr> <th data-options="field: \'itemid\',width:80">Item ID</th> <th data-options="field:\'productid\',width:100" >Product</th> <th data-options="field:\'listprice\',width:80,align:\'right\' ">List Price</th> <th data-options="field:\'unitcost\',width:80,align:\'right\' ">Unit Cost</th> <th data-options="field:\'attr1\',width:250" >Attribute</th> <th data-options="field:\'status\',width:60,align:\'center\' ">Status</th> </tr> </thead> '

    //        + '</table><script type="text/javascript"> $(function () { var data = ['
    //  +  '{ "productid": "FI-SW-01", "productname": "Koi", "unitcost": 10.00, "status": "P", "listprice": 36.50, "attr1": "Large", "itemid": "EST-1" },'
    //  + ' { "productid": "K9-DL-01", "productname": "Dalmation", "unitcost": 12.00, "status": "P", "listprice": 18.50, "attr1": "Spotted Adult Female", "itemid": "EST-10" },'
    //  +  '{ "productid": "RP-SN-01", "productname": "Rattlesnake", "unitcost": 12.00, "status": "P", "listprice": 38.50, "attr1": "Venomless", "itemid": "EST-11" },'
    //  +  '{ "productid": "RP-SN-01", "productname": "Rattlesnake", "unitcost": 12.00, "status": "P", "listprice": 26.50, "attr1": "Rattleless", "itemid": "EST-12" },'
    //   + '{ "productid": "RP-LI-02", "productname": "Iguana", "unitcost": 12.00, "status": "P", "listprice": 35.50, "attr1": "Green Adult", "itemid": "EST-13" },'
    //   + '{ "productid": "FL-DSH-01", "productname": "Manx", "unitcost": 12.00, "status": "P", "listprice": 158.50, "attr1": "Tailless", "itemid": "EST-14" },'
    //   + '{ "productid": "FL-DSH-01", "productname": "Manx", "unitcost": 12.00, "status": "P", "listprice": 83.50, "attr1": "With tail", "itemid": "EST-15" },'
    //   + '{ "productid": "FL-DLH-02", "productname": "Persian", "unitcost": 12.00, "status": "P", "listprice": 23.50, "attr1": "Adult Female", "itemid": "EST-16" },'
    //   + '{ "productid": "FL-DLH-02", "productname": "Persian", "unitcost": 12.00, "status": "P", "listprice": 89.50, "attr1": "Adult Male", "itemid": "EST-17" },'
    //   + '{ "productid": "AV-CB-01", "productname": "Amazon Parrot", "unitcost": 92.00, "status": "P", "listprice": 63.50, "attr1": "Adult Male", "itemid": "EST-18" } ]; </script> '
    //        + '</body></html>';

    //    document.write(content);
    //    document.close();
    //    newWindow.print();
    //} 

    function toXML(target, param) {
        var title = null;
        var rows = null;
        if (typeof param == 'string') {
            title = param;
        } else {
            title = param['title'];
            rows = param['rows'];
        }       

        var rows = rows || getRows(target);
        var dg = $(target);
      
        var fields = dg.datagrid('getColumnFields', true).concat(dg.datagrid('getColumnFields', false)); 

        var xml = '';
        xml = xml + "<tables>";

        $.map(rows, function (row) {
            xml += "<items>";
            for (var i = 0; i < fields.length; i++) {
                
                var field = fields[i];
                xml += '<' + field + '>' + row[field] + '</' + field + '>';
            }
            xml += "</items>";
        });

        xml = xml + '</tables>';

        //document.write(xml);
        //document.close();

        alert(xml);
        
    }

    function b64toBlob(data){
        var sliceSize = 512;
        var chars = atob(data);
        var byteArrays = [];
        for(var offset=0; offset<chars.length; offset+=sliceSize){
            var slice = chars.slice(offset, offset+sliceSize);
            var byteNumbers = new Array(slice.length);
            for(var i=0; i<slice.length; i++){
                byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, {
            type: ''
        });
    }

    function toExcel(target, param){
        var filename = null;
        var rows = null;
        var worksheet = 'Worksheet';
        if (typeof param == 'string'){
            filename = param;
        } else {
            filename = param['filename'];
            rows = param['rows'];
            worksheet = param['worksheet'] || 'Worksheet';
        }
        var dg = $(target);
        var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>{table}</body></html>'
        , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }

        var table = toHtml(target, rows);
        var ctx = { worksheet: worksheet, table: table };
        var data = base64(format(template, ctx));
        if (window.navigator.msSaveBlob){
            var blob = b64toBlob(data);
            window.navigator.msSaveBlob(blob, filename);
        } else {
            var alink = $('<a style="display:none"></a>').appendTo('body');
            alink[0].href = uri + data;
            alink[0].download = filename;
            alink[0].click();
            alink.remove();
        }
    }

    $.extend($.fn.datagrid.methods, {
        toHtml: function(jq, rows){
            return toHtml(jq[0], rows);
        },
        toArray: function(jq, rows){
            return toArray(jq[0], rows);
        },
        toExcel: function(jq, param){
            return jq.each(function(){
                toExcel(this, param);
            });
        },
        print: function(jq, param){
            return jq.each(function(){
                print(this, param);
            });
        },
        toXML: function (jq, param) {
            return jq.each(function () {
                toXML(this, param);
            });
        }
    });
})(jQuery);
