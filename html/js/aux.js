/* File 'aux.js' stores auxiliary functions that will be used in event handling functions
 * Author: Vincent Yu
 */

// updateAdvancedSetting()
function updateAS() {
	isDirected = $("#directed-cbx").is(':checked');
	isWeighted = $("#weighted-cbx").is(':checked');
	isSorted = $("#sorted-cbx").is(':checked');
}

// getLabel(nodeIndex, startChar, mode). 'nodeIndex' represents index of node.
// 'startChar' specifies which character the label starts from.
function getLabel(idx, strtChr) {
    if(strtChr >= '0' && strtChr <= '9')
    	return (idx + strtChr.charCodeAt() - 48).toString();
    else {
    	var label = "";
	    ++idx;
	    while(idx) {
	        --idx;
	        label = String.fromCharCode(strtChr.charCodeAt() + idx % 26) + label;
	        idx = Math.floor(idx / 26);
	    }
    	return label;
	}
};

// parse(input, isWeighted, isSorted). 'input' represents the string provided by
// the user. 'isWeighted' tells if this is a weighted graph.
function parse(str, isWeighted, isSorted) {
	var strList = str.match(/(0|[1-9]\d*)(\.[0-9]+)?/g);
	if(strList != null) {
		/* Generate adjacent list */
		for(var i = 0; i < strList.length; ) {
			// TODO (check validity of input)
			var _start = strList[i];
			var _end = strList[i+1];
			if(isWeighted) {
				// TODO (check validity of input)
				var _weight = strList[i+2];
				adjList.get(_start).push({ _end, _weight });
				i += 3;
			}
			else {
				adjList.get(_start).push(_end);
				i += 2;
			}
		}	// for
		
		adjListPrint(isWeighted, isSorted);
	}	// if
	else {
		/* Ouput to console */
		$("#console-board").val($("#console-board").val() + " [warning]: input is empty\n");
	}
};

function adjListPrint(isWeighted, isSorted) {
	$("#data-board").html("");
	var objects = adjList.objects();
	for(var key in objects) {
		$("#data-board").append("<div class=\"row\"><span>" + key + "</span></div>");
		if(isSorted)
			objects[key].sort();
		for(var j in objects[key]) {
			$("#data-board div:last-child").append("<span>" + objects[key][j] + "</span>");
		}
		$("#data-board div:last-child").append("<span>+</span>");
	}
};