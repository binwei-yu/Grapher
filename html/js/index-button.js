
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
  console.log('Taking a break...');
  await sleep(2000);
  console.log('Two seconds later');
}

demo();

$("#submit-btn").click(function() {
	//var nodeAmount = $("#node-amount").val();
	var nodeAmount = 10;
	updateAS();

	/* Clear data board */
	$("#data-board").html("");

	/* Initialize adjacent list */
	var nodeIdx = 0;
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

/*===--------------------------- BACKSPACE ---------------------------===*/
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
		adjListPrint($("#weighted-cbx").is(':checked'), $("#sorted-cbx").is(':checked'));
	};
});

/*===--------------------------- ADD-ROW BUTTON ---------------------------===*/
$("#add-panel #add-btn").click(function() {
	var mainNode = $("#main-node-npt").val();
	var adjNodes = $("#adj-nodes-npt").val().match(/(0|[1-9]\d*)/g);
	if(adjNodes != null) {
		if(!adjList.containsKey(mainNode)) {
			adjList.put(mainNode, new Array());
		}
		for(var i in adjNodes)
			adjList.get(mainNode).push(adjNodes[i]);
	}
	$("main-node-npt").val("");
	$("adj-nodes-npt").val("");

	/* Redraw */
	adjListPrint(isWeighted, isSorted);
});

/*===--------------------------- DRAW BUTTON ---------------------------===*/
$("#draw-btn").click(async function() {
	$("#dash-board").remove();

	// Check connection
	var cluster = new Array();

	var queue = [];
	var visited = new Object();
	for(var key in adjList.objects()) 
		visited[key] = 0;

	for(var key in visited) {
		if(!visited[key]) {
			// Orphan node
			if(adjList.get(key).length == 0) {
				visited[key] = 1;
				if(ifIgnoreOrphan) continue;
				else cluster.push([ key ]);
			}
			else {
				cluster.push(new Array());
				queue.push(key);
				visited[key] = 1;
				while(queue.length) {
					var u = queue.shift();
					for(var i in adjList.get(u)) {
						var v = adjList.get(u)[i];
						if(!visited[v]) {
							queue.push(v);
							visited[v] = 1;
						}
					}
					cluster[cluster.length-1].push(u);
				}
			}	// orphan or not
		}	// visited or not
	};

	/************* Fruchtermann & Reingold Force-Directed *************/
	var newAdjList = new Object();
	for(var key in adjList.objects())
		newAdjList[key] = new Array();
	for(var key in adjList.objects()) {
		for(var i in adjList.get(key)) {
			newAdjList[adjList.get(key)[i]].push(key);
			newAdjList[key].push(adjList.get(key)[i]);
		};
	};

	//for(var key in newAdjList)
	//	console.log(key, newAdjList[key]);
	// Distribute vertices
	var center = [canvasWidth / 2, canvasHeight / 2];
	var l = 100;
	var len = (l / 2) / Math.sin(2 * Math.PI / 10 / 2);
	var idx = 0;
	for(var key in adjList.objects()) {
		var x = center[0] + len * Math.sin(2 * Math.PI / 10 * idx);
		var y = center[1] + len * Math.cos(2 * Math.PI / 10 * idx);
		idx++;
		//var x = Math.floor(radius + Math.random() * (canvasWidth - 2 * radius));
		//var y = Math.floor(radius + Math.random() * (canvasHeight - 2 * radius));
		// Add to positions
		positions[key] = [x, y];
	};

	// Sort vertex with gretest out-degree
	var keyOrder = new Array();
	for(var key in positions)
		keyOrder.push(key);
	keyOrder.sort(function(a, b) {
		return adjList.get(b).length - adjList.get(a).length;
	});

	var createdVertices = new Object();

	// friction
	var friction = 1;


	// Implement algorithm
	for(var key in keyOrder) {
		createdVertices[key] = 1;
		var createdEdges = new Object();
        while(true) {
        	for(var i in newAdjList[key]) {
		        var edge = newAdjList[key][i];
		        if(edge in createdEdges) continue;
		        else {
		        	createdEdges[edge] = 1;
		        	break;
		        }
        	}
        	var fx = 0.0, fy = 0.0, unit = 0.5;
	        for(var adj in createdVertices) {
	        	if(adj == key) continue;

				var d = Math.sqrt(Math.pow(positions[adj][0] - positions[key][0], 2) +  Math.pow(positions[adj][1] - positions[key][1], 2));
				if(d > 2 * l) continue;
				var f = l * l / (d * d);

				fx += f * (positions[key][0] - positions[adj][0]) / d;
				fy += f * (positions[key][1] - positions[adj][1]) / d;
	        }

	        var f = Math.sqrt(Math.pow(fx, 2) + Math.pow(fy, 2));
	        //console.log(f);
	        if(f > friction) {
				positions[key][0] += unit * fx / f;
				positions[key][1] += unit * fy / f;
			}
	        await sleep(1);
			ctx.clearRect(0, 0, canvasWidth, canvasHeight);
			sctx.clearRect(0, 0, canvasWidth, canvasHeight);
			for(var drawKey in createdVertices) {
				// Draw circle
				ctx.beginPath();
		        ctx.arc(positions[drawKey][0], positions[drawKey][1], radius, 0, 2 * Math.PI, false);
		        ctx.stroke();

		        // Place label
		        ctx.font = "20px Georgia";
		        ctx.textAlign = "center";
		        ctx.textBaseline = "middle";
		        ctx.fillText(drawKey, positions[drawKey][0], positions[drawKey][1]);

		        for(var i in newAdjList) {
		        	var drawAdj = newAdjList[drawKey][i];
		        	if(drawAdj in createdEdges) {
						ctx.beginPath();
					    ctx.moveTo(positions[drawKey][0], positions[drawKey][1]);
					    ctx.lineTo(positions[drawAdj][0], positions[drawAdj][1]);
					    ctx.stroke();
		        	}
		        }
			};
			if(f <= friction) break;
	    };

        //console.log(key, newAdjList[key]);
    	/*
        for(var i in newAdjList[key]) {
        	var adj = newAdjList[key][i];
        	if(adj in createdVertices) {
        		await sleep(1000);
				ctx.beginPath();
			    ctx.moveTo(positions[key][0], positions[key][1]);
			    ctx.lineTo(positions[adj][0], positions[adj][1]);
			    ctx.stroke();
        	}
        };
        */
	};


	/*
	var unit = 0.5, threshold = 50;
	for(var i in keyOrder) {
		//if(i > 1) break;
		var key = keyOrder[i];
		while(true) {
			var fx = 0, fy = 0;
			// Repulsive force
			for(var i in positions) {
				if(i == key || newAdjList[key].includes(i)) continue;
				if(key == "6") console.log(i);
				//console.log(i);
				var d = Math.sqrt(Math.pow(positions[i][0] - positions[key][0], 2) +  Math.pow(positions[i][1] - positions[key][1], 2));
				var f = l * l / d;

				fx += f * (positions[key][0] - positions[i][0]) / d;
				fy += f * (positions[key][1] - positions[i][1]) / d;
			};
			// Attractive force
			for(var i in newAdjList[key]) {
				if(i == key) continue;
				var d = Math.sqrt(Math.pow(positions[i][0] - positions[key][0], 2) +  Math.pow(positions[i][1] - positions[key][1], 2));
				var f = d * d / l;

				fx += f * (positions[i][0] - positions[key][0]) / d;
				fy += f * (positions[i][1] - positions[key][1]) / d;
			};
			var Force = Math.sqrt(Math.pow(fx, 2) + Math.pow(fy, 2));
			if(threshold > Force)
				break;
			positions[key][0] += unit * fx / Force;
			positions[key][1] += unit * fy / Force;
			//console.log(fx, fy), 1000;

			await sleep(10);
			ctx.clearRect(0, 0, canvasWidth, canvasHeight);
			sctx.clearRect(0, 0, canvasWidth, canvasHeight);
			for(var key2 in positions) {
		        // Draw circle
		        ctx.beginPath();
		        ctx.arc(positions[key2][0], positions[key2][1], radius, 0, 2 * Math.PI, false);
		        ctx.stroke();

		        // Place label
		        ctx.font = "20px Georgia";
		        ctx.textAlign = "center";
		        ctx.textBaseline = "middle";
		        ctx.fillText(key2, positions[key2][0], positions[key2][1]);

		        // Connect
				for(var i in adjList.get(key2)) {
					var adj = adjList.get(key2)[i];
					ctx.beginPath();
				    ctx.moveTo(positions[key2][0], positions[key2][1]);
				    ctx.lineTo(positions[adj][0], positions[adj][1]);
				    ctx.stroke();
				};
			};
		};
	};
	*/
});


















