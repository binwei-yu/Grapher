/*===--------------------------- GRID ---------------------------===*/
var len = canvasWidth * 1.0 / 20;
bctx.strokeStyle = "#eeeeee";
for(var i = len; i < canvasWidth; i += len) {
    bctx.beginPath();
    bctx.moveTo(i, 0);
    bctx.lineTo(i, canvasHeight);
    bctx.stroke();
}
for(var i = len; i < canvasHeight; i += len) {
    bctx.beginPath();
    bctx.moveTo(0, i);
    bctx.lineTo(canvasWidth, i);
    bctx.stroke();
}
/*===--------------------------- INIT ---------------------------===*/

/*===-------------------------- CANVAS --------------------------===*/
ctx.save();
sctx.save();
bctx.save();
ctx.restore();
ctx.strokeStyle = "#000000";

$("#main-canvas").click(function(e) {
    // 
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

