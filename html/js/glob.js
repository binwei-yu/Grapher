/* Resize */
var clientHeight, clientWidth;
$(document).ready(function(){
                  clientHeight = $(document).height();
                  clientWidth = $(document).width();
                  });

/* Basic information of canvas */
var canvasHeight = $("#main-board .row div:first-child").height();
var canvasWidth = $("#main-board .row div:first-child").width();

var c = document.getElementById("main-canvas");
var sc = document.getElementById("select-canvas");
var bc = document.getElementById("back-canvas");
c.width = canvasWidth;
c.height = canvasHeight;
sc.width = canvasWidth;
sc.height = canvasHeight;
bc.width = canvasWidth;
bc.height = canvasHeight;
var ctx = c.getContext("2d");
var sctx = sc.getContext("2d");
var bctx = bc.getContext("2d");

/* Lib */
var radius = 20;

/* Recorder */
var nodeIdx = 0;
var nodes = new Array();
var adjList = new HashMap();
var selectedSet = new HashMap();

/* Advanced setting */
var startChar = '0';			// Customized start character
var showAsAlphabet = true;		// Whether node indices be showed as alphabets or numbers
