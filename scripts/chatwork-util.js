// このコードは http://leko.jp/archives/735 を参考にしています
(function(global) {
	'use strict';

	// チャットルーム一覧の属性の変更を監視し、チャットルームの切り替えを検知する
	var roomObserver = new MutationObserver(function(mutations) {
		$(window).trigger('chatworkutil:change:room', [mutations]);
	});

	var util = {
		/**
		 * 送信先のチャットルーム名
		 */
    MEMOCHAT_NAME: 'メモする',

		/**
		 * チャットへのリンクを表す要素を取得する
		 * NOTE: チャット一覧のDOMは頻繁に書き換わるため変数にキャッシュすると期待道理に動かない。
		 *       なので変数にキャッシュせずに毎回取得を行う
		 * NOTE: 送信先のチャットルームに設定されている名前のチャットを取得する
		 * @return jQuery 送信先チャットを表すjQueryオブジェクト
		 */
		getMemoChat: function() {
			var selector = 'li[aria-label="' + this.MEMOCHAT_NAME + '"]';
			return $('#_roomListItems').find(selector);
		},

		/**
		 * 送信先のチャットが現在開かれているか否か
		 * @return boolean
		 */
		isMemoChatSelected: function() {
			return ($('#_roomListItems').find('li._roomSelected').get(0) === this.getMemoChat().get(0));
		},

		/**
		 * 送信先チャットへ切り替え
		 * NOTE: clickイベントを発行した後に非同期でAjaxが走りチャット内容の切り替え、送信先ルームの変更が行われるため、
		 *       MutationObserverを利用しHTMLの属性を監視して、チャットルームの切り替えを検知する。
		 * @param function callback チャットルームの切り替えが完了した際に呼ばれるコールバック
		 * @return void
		 */
		changeMemoChat: function(callback) {
			callback = callback || function() {};

			function callCallback() {
				$(window).off('chatworkutil:change:room', onChangeRoom);
				callback();
			}

			function onChangeRoom(e, mutations) {
				mutations.some(function(mutation) {
					if(util.isMemoChatSelected()) {
						// ジャストだと処理が重くなると実際の切り替えよりも遅くなるのでやや遅延させる
						callCallback();
						return true;
					}
				});
			}

			$(window).on('chatworkutil:change:room', onChangeRoom);

			// 既に送信先のチャットが選択されているなら直接コールバックを呼ぶ
			if(this.isMemoChatSelected()) {
				callCallback();
			} else {
				this.getMemoChat().trigger('click');
			}
		},

		/**
		 * 現在のチャットへ発言する
		 * @param string body 発言内容
		 * @return void
		 */
		send: function(body) {
			util.$chatText.val(body);
			util.$sendBtn.trigger('click');
		},

		/**
		 * 指定されたテキストをチャットワーク記法の[info]タグへ変換する
		 * @param string body    [info]タグの本文にあたる部分
		 * @param string [title] 指定されたら[title]タグも使用する。省略された場合使用しない
		 * @return string [info]...[/info]で囲われた文字列
		 */
		toInfomation: function(body, title) {
			var info = '[info]';

			// titleが指定されていたらtitleタグを使用
			if(typeof title !== 'undefined')
				info += '[title]' + title + '[/title]';

			info += body + '[/info]';
			return info;
		},
	};

	$(function() {
		// チャット内容入力フォーム、送信ボタンを変数にキャッシュ
		util.$chatText = $("#_chatText");
		util.$sendBtn = $("#_sendButton");

		// チャットルーム一覧の属性をオブザーバに渡し、監視を行う
		var $roomListBox = $('#_roomListItems');
		roomObserver.observe($roomListBox.get(0), {
			subtree: true,				// 子孫要素まで監視を行う
			attributes: true,			// 属性の変更を監視する
			attributeFilter: ['class']	// classの変更のみ監視する
		});
	});

	global.util = util;
}(this));
