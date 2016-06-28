(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _toolIconCreater = require('./modules/tool-icon-creater');

var replaceButton = (0, _toolIconCreater.create)('_favButton', 'Star!!', 'star.png');

document.getElementById('_chatSendTool').appendChild(replaceButton);

$('#_favButton').click(function (e) {
    var val = $('#_chatText').val();

    $('#_chatText').val('');

    util.changeMemoChat(function() {
			util.send(val);
		});
});

},{"./modules/tool-icon-creater":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.create = create;

/**
 * ツールチップ表示されるアイコンを作成する
 * @param id 要素のID
 * @param label ツールチップで表示される説明
 * @param imageFileName アイコン画像のファイル名(imagesディレクトリ内に置く)
 */
function create(id, label, imageFileName) {
    var icon = document.createElement('img');
    icon.src = chrome.extension.getURL('images/' + imageFileName);
    var iconWrapper = document.createElement('li');
    iconWrapper.id = id;
    iconWrapper.setAttribute('class', '_showDescription');
    iconWrapper.setAttribute('class', '_cwABAction linkstatus');
    iconWrapper.setAttribute('style', 'display: inline-block; padding-top: 3px;');
    iconWrapper.setAttribute('role', 'button');
    iconWrapper.setAttribute('aria-label', label);
    iconWrapper.appendChild(icon);
    return iconWrapper;
}

},{}]},{},[1]);
