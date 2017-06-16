
	MyEditor = function(){}

	
	/**
	 * 创建编辑器并保存起来
	 */
	MyEditor.createEditor = function(editorId, style){
		if(style != null){
			return CKEDITOR.replace(editorId, style);
		}
		return CKEDITOR.replace(editorId);
	};
	
	
	/**
	 * 获取html文本
	 */
	MyEditor.getHtmlVal = function(editor){
		return editor.getData();
	};


	/**
	 * 获取纯文本
	 */
	MyEditor.getTextVal = function(editor){
		return editor.document.getBody().getText();
	}

	
	/**
	 * 给编辑器赋值
	 */
	MyEditor.setData = function(editor, data){
		editor.on("instanceReady", function(e){
			e.editor.setData(data);
		});
	}

