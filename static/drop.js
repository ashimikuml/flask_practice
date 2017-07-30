//http://www.techscore.com/blog/2012/11/12/html5-%E3%81%AE-file-api-%E3%81%A7%E3%83%89%E3%83%A9%E3%83%83%E3%82%B0%EF%BC%86%E3%83%89%E3%83%AD%E3%83%83%E3%83%97%E3%81%99%E3%82%8B/
$(function() {
        var droppable = $("#droppable");

        // File API が使用できない場合は諦めます.
        if(!window.FileReader) {
          alert("File API がサポートされていません。");
          return false;
        }

        // イベントをキャンセルするハンドラです.
        var cancelEvent = function(event) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }

        var postForm = function(url, data) {
            var $form = $('<form/>', {'action': url, 'method': 'post', enctype : "multipart/form-data"});
            for(var key in data) {
                $form.append($('<input/>', {'type': 'file', 'name': key, 'value': data[key]}));
            }
            $form.appendTo(document.body);
            $form.submit();
        };

        // dragenter, dragover イベントのデフォルト処理をキャンセルします.
        droppable.bind("dragenter", cancelEvent);
        droppable.bind("dragover", cancelEvent);

        // ドロップ時のイベントハンドラを設定します.
        var handleDroppedFile = function(event) {
          // デフォルトの処理をキャンセルします.
          cancelEvent(event);

          // ファイルは複数ドロップされる可能性がありますが, ここでは 1 つ目のファイルを扱います.
          var file = event.originalEvent.dataTransfer.files[0];
          $("#droppable").text("[" + file.name + ">" + location.href + "]");
          //var formData = new FormData();
	      //formData.append('file', file);
	      //$.ajax({
	      //    url: location.href,
		  //    type: "POST",
		  //    data: formData,
		  //    contentType: false,
          //    processData: false,
          //    dataType: "json"
          //})

          //redirect
          var data = { "file" : file };
          postForm(location.href, data);

          return false;
        }

        // ドロップ時のイベントハンドラを設定します.
        droppable.bind("drop", handleDroppedFile);
      });
