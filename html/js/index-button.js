$("#submit-btn").click(function() {
	//var nodeAmount = $("#node-amount").val();
	var nodeAmount = 10;
	var isDirected = $("#directed-cbx").is(':checked');
	var isWeighted = $("#weighted-cbx").is(':checked');
	var isSorted = $("#sorted-cbx").is(':checked');
	
	/* Clear data board */
	$("#data-board").html("");

	/* Initialize adjacent list */
	nodeIdx = 0;
	// TODO
	adjList.clear();
	selectedSet.clear();

	for(var i = 0; i < nodeAmount; i++) {
		var nodeLabel = getLabel(nodeIdx++, startChar);
		adjList.put(nodeLabel, new Array());
		selectedSet.put(nodeLabel, new Array());
	}
	parse($("#text-board").val(), isWeighted, isSorted);

	/* Generate nodes *
	for(var i = 0; i < nodeAmount; i++) {
		var x = Math.floor(radius + Math.random() * (canvasWidth - 2 * radius));
		var y = Math.floor(radius + Math.random() * (canvasHeight - 2 * radius));

        /* Draw circle *
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.stroke();

        /* Place label *
        ctx.font = "20px Georgia";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(getLabel(nodeIdx), x, y);
        // index, positionX, positionY, ifSelected
        nodes.push([nodeIdx++, x, y, false]);
	}

	/* Connect *
	if(ifDirected) {
		for(var i in adjList) {
			var startNode = adjList[i][0];
			var endNode = adjList[i][1];
			ctx.beginPath();
		    ctx.moveTo(nodes[startNode][1], nodes[startNode][2]);
		    ctx.lineTo(nodes[endNode][1], nodes[endNode][2]);
		    ctx.stroke();
		}
	}
	*/
});

$("#clear-btn").click(function() {
	nodes.splice(0, nodes.length);
	adjList.splice(0, adjList.length);
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	sctx.clearRect(0, 0, canvasWidth, canvasHeight);
	nodeIdx = 1;
});

$("#data-board").on("click", ".row span:not(:first-child)", function() {
	// input span
	if($(this).attr("class") == "tmp-npt") return;
	// '+' span
	else if($(this).html() == "+") {
		//if($(this).prev().attr("class") != "tmp-npt") {
			$(this).before("<span class=\"tmp-npt\"><input\/></span>")
			$("#data-board .tmp-npt input").focus();
		//}
	}
	// other spans
	else {
		var color = $(this).css("background-color");
		if(color == "rgb(180, 180, 180)") {
			$(this).css("background-color", "rgb(135, 206, 250)");
			selectedSet.get($(this).parent().children().eq(0).html()).push($(this).html());
		}
		else {
			$(this).css("background-color", "rgb(180, 180, 180)");
			var children = selectedSet.get($(this).parent().children().eq(0).html());
			for(var i in children)
				if(children[i] == $(this).html())
					children.splice(i, 1);
		}
	}
	//for(var key in selectedSet.objects())
	//	console.log(selectedSet.objects()[key]);
});

$("#data-board").on("blur", ".tmp-npt input", function() {
	$(".tmp-npt").remove();
})
.on("keydown", ".tmp-npt input", function(e) {
	if(e.keyCode == 13) {
		// input->span->div->first-child
		var parent = $(this).parent().parent().children().eq(0).html();
		// TODO check validity
		var child = $(this).val();
		adjList.get(parent).push(child);
		
		/* Redraw data board */
		$("#data-board").html("");
		adjListPrint($("#weighted-cbx").is(':checked'), $("#sorted-cbx").is(':checked'));
		//$(this).parent().removeClass("tmp-npt");
		//$(this).parent().html(child);
	}
});

$(document).keydown(function(e){
	if(e.keyCode == 8 || e.keyCode == 46){
		for(var key in selectedSet.objects()) {
			var selectedChildren = selectedSet.objects()[key];
			var children = adjList.objects()[key];

			for(var i in selectedChildren) {
				for(var j in children) {
					if(selectedChildren[i] == children[j]) 
						children.splice(j, 1);
				}
			}
		};
		var objects = selectedSet.objects();
		for(var key in objects)
			objects[key].splice(0, objects[key].length);

		/* Redraw data board */
		$("#data-board").html("");
		adjListPrint($("#weighted-cbx").is(':checked'), $("#sorted-cbx").is(':checked'));
	};
});

