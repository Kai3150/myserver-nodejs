$(function () {

	// 回転制御
	var rotate = function (logo, angle) {
		logo.css({
			"transform": "rotate(" + angle + "deg)",
			"transition-duration": "0.8s",
			// "transform-origin": "621px 311px"
		});
	}

	const selList = ['c1','c2','c3','c4'];
	const listCnt = selList.length;

	$(window).scroll(function () {

		// 1回転する角度
		var angle = $(window).scrollTop();
		// 180pxスクロールするごとに72度回転する
		angle = Math.round(angle / 180) * (360 / listCnt);

		rotate($("ul"), angle);
		rotate($("ul > li"), angle * -1);
	})
});
