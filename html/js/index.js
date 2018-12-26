/* Save initial state */
ctx.save();
sctx.save();
bctx.save();

/* Drawing grid */
var unit_w = canvasWidth * 1.0 / 20;
//var unit_h = canvasHeight * 1.0 / 10;
bctx.strokeStyle = "#eeeeee";
for(var i = unit_w; i < canvasWidth; i += unit_w) {
    bctx.beginPath();
    bctx.moveTo(i, 0);
    bctx.lineTo(i, canvasHeight);
    bctx.stroke();
}
for(var i = unit_w; i < canvasHeight; i += unit_w) {
    bctx.beginPath();
    bctx.moveTo(0, i);
    bctx.lineTo(canvasWidth, i);
    bctx.stroke();
}

/*===-------------------------- Click and draw --------------------------===*/
ctx.restore();
ctx.strokeStyle = "#000000";

$("#main-canvas").click(function(e) {
    var insideIdx = 0;
    for(var i in nodes) {
        if(Math.pow(e.pageX-nodes[i][1], 2) + Math.pow(e.pageY-nodes[i][2], 2) < Math.pow(radius, 2)) {
            insideIdx = i;
            break;
        }
    }
    /*===---------------- Inside nodes ----------------===*/
    if(insideIdx) {
        sctx.save();
        /* Not selected */
        if(!nodes[insideIdx][3]) {
            sctx.fillStyle = "#cccccc";
            sctx.beginPath();
            sctx.arc(nodes[insideIdx][1], nodes[insideIdx][2], radius, 0, 2 * Math.PI, false);
            sctx.fill();
            sctx.stroke();
        }
        else {
            sctx.clearRect(nodes[insideIdx][1] - radius, nodes[insideIdx][2] - radius, 2 * radius, 2 * radius);
        }
        nodes[insideIdx][3] = !nodes[insideIdx][3];
        sctx.restore();
    }
    /*===---------------- Outside nodes ----------------===*/
    else {
        /* Draw circle */
        ctx.beginPath();
        ctx.arc(e.pageX, e.pageY, radius, 0, 2 * Math.PI, false);
        ctx.stroke();

        /* Place label */
        ctx.font = "20px Georgia";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(getLabel(nodeIdx, startChar), e.pageX, e.pageY);
        // index, positionX, positionY, ifSelected
        nodes.push([nodeIdx++, e.pageX, e.pageY, false]);
        //ctx.clearRect(e.pageX - 50, e.pageY - 50, 100, 100);
    }
});

/* Select */
// Change cursor style
$("#main-canvas").mousemove(function(e) {
    // TODO
    for(var i in nodes) {
        if(Math.pow(e.pageX-nodes[i][1], 2) + Math.pow(e.pageY-nodes[i][2], 2)
           <= Math.pow(radius, 2)) {
            $(this).css("cursor", "pointer");
            return;
        }
    }
    $(this).css("cursor", "default");
});

