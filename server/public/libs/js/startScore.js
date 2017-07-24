
var defaults2 = {
		fen_d: 16,
		ScoreGrade: 10,
		half:0.5,
		types: ["很不满意", "差得太离谱", "非常不满意", "不满意", "一般", "只是完成了", "还可以", "满意", "挺满意的", "非常满意"],
		nameScore: $(".fenshu"),
		parent: $(".star_score"),
		attitude: $(".attitude"),
		now_cli2:"",
		DataFenshu:"",
		currFenshu:"",
		hasClick:false
		
};
function show2(num, obj) {
	console.log(num);
		var n = parseInt(num) + 1;
		var lefta = num * defaults2.fen_d;
		var ww = defaults2.fen_d * n;
		var scor = defaults2.half * n;
		atu = defaults2.types[parseInt(num)];
		$("#starttwo").find("a").removeClass("clibg");
		$(".star_score").find("a").removeClass("clibg");
		obj.addClass("clibg");
		obj.css({
			"width": ww,
			"left": "0"
		});
		$(".fenshu").text(scor);
		$(".attitude").text(atu);
	}
$(function(){
	for(var i = 0; i < 10; i++) {
		var newSpan = $("<a href='javascript:void(0)'></a>");
		newSpan.css({
			"left": 0,
			"width": 16 * (i + 1),
			"z-index": 10 - i
		});
		newSpan.appendTo($(".star_score"));
	}

		$(document).on("click",".star_score a",function(){
			defaults2.now_cli2 = $(this).index();
			show2(defaults2.now_cli2, $(this));
			defaults2.hasClick=true;
			defaults2.currFenshu=(defaults2.now_cli2+1)/2;
		});
		$(document).on("mouseenter",".star_score a",function(){
			defaults2.now_cli2 = $(this).index();
			show2(defaults2.now_cli2, $(this));
		});
		$(document).on("mouseleave",".star_score a",function(){
			if(defaults2.now_cli2 >= 0) {
				var scor = defaults2.half * (parseInt(defaults2.now_cli2) + 1);
				defaults2.parent.find("a").removeClass("clibg");
				defaults2.parent.find("a").eq(defaults2.now_cli2).addClass("clibg");
				var ww = defaults2.fen_d * (parseInt(defaults2.now_cli2) + 1);
				console.log(ww);
				defaults2.parent.find("a").eq(defaults2.now_cli2).css({
					"width": ww,
					"left": "0"
				});
				defaults2.parent.find("a").eq(9).css({//强制修正bug
					"width": 160,
					"left": "0"
				});
				if($(".fenshu")) {
					$(".fenshu").text(scor)
				}
			} else {
				defaults2.parent.find("a").removeClass("clibg");
				if($(".fenshu")) {
					$(".fenshu").text("")
				}
			}
		});
		$(document).on("mouseleave",".star_score",function(){
			if(!defaults2.hasClick && defaults2.DataFenshu){
				var cli=(defaults2.DataFenshu-0)*2-1;
				show2(cli, $(".star_score").find('a').eq(cli));
			}
			if(defaults2.hasClick){
				var cli=(defaults2.currFenshu-0)*2-1;
				show2(cli, $(".star_score").find('a').eq(cli));
			}
		});
	
});
