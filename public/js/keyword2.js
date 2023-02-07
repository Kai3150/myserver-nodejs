$(function () {

	// 回転制御
	var rotate = function (logo, angle) {
		logo.css({
			"transform": "rotate(" + angle + "deg)",
			"transition-duration": "0.8s",
            "transform-origin": "100% 100%"
		});
	}

	const selList = ['twitter', 'facebook', 'pinterest', 'instagram', 'google'];
	const listCnt = selList.length;

	$(window).scroll(function () {

		// 1回転する角度
		var angle = $(window).scrollTop();
		// 180pxスクロールするごとに72度回転する
		angle = Math.round(angle / 180) * (360 / listCnt);

		rotate($("ul"), angle);
		rotate($("ul > li"), angle * -1);

		// 選択中リストの動的更新
		roleCnt = angle / (360 / listCnt);

		// 回転数がリストの要素以上なら要素数分マイナスする
		while(true) {
			if (roleCnt < listCnt) {
				break;
			}
			roleCnt -= listCnt;
		}

		var selText = selList[roleCnt];
		$(".select-menu").text(selText);
	})
});