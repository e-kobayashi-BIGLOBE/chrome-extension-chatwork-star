function doOnAppear() {
    messages = $('#_timeLine').find('.chatTimeLineMessage');

    if (messages.size() == 0) {
        id = setTimeout(doOnAppear, 1000);

    } else {
        clearTimeout(id);

        putButton();
        onGroupChange();
    }
}

function putButton() {
    $('._chatTimeLineMessageBox').find('.timeStamp').append(replaceButton);
    $('.memo_button').click(function() {
        body = $(this).closest('div').parent('div').find('pre').html();
        console.log(body);
        sendChat();
    });
}

function sendChat() {
  // 現在選択されているルームIDを取得する
  // var romid = $('#_timeLine').find('.chatTimeLineMessage').last().data('rid');
  var nowromid = $('#_roomListItems').find('li._roomSelected').data('rid');
  console.log(nowromid);

  // メモするルームObject
  // var memoroom = $('#_roomListItems').find('li[data-rid="' + memoroomid + '"]');
  var memoroom = $('#_roomListItems').find('li[aria-label="' + memoroomname + '"]');

  // if (romid != memoroomid) {
  if ($('#_roomListItems').find('li._roomSelected').data('rid') != memoroom.data('rid')) {
      console.log('メモに移動する');
      memoroom.click();

      // チャットを投稿する
      $('#_chatText').val(body);
      $('#_sendButton').trigger('click');

      // 元のルームへ移動する
      var memoroom = $('#_roomListItems').find('li[data-rid="'+ nowromid + '"]');
      console.log('帰る');
      // romid.click();
    }

  console.log('おわり');
}

// ルーム変更
function onGroupChange() {
    $('._roomLink').click(function() {
      console.log('ルーム変更');
      var currentRid = $('#_timeLine').find('.chatTimeLineMessage').last().data('rid');
      waitChange(currentRid);
    });
}

// 変更先ルームの表示が完了したら☆を置く
function waitChange(oldRid) {
    rid = $('#_timeLine').find('.chatTimeLineMessage').last().data('rid');

    if (oldRid == rid) {
        id = setTimeout(waitChange, 1000, oldRid);
        console.log('待ち');

    } else {
        clearTimeout(id);

        putButton();
        console.log('ボタン置いた');
    }
}

function create(label, imageFileName) {
    var icon = document.createElement('img');
    icon.src = chrome.extension.getURL('images/' + imageFileName);
    var iconWrapper = document.createElement('li');
    iconWrapper.setAttribute('class', 'memo_button');
    iconWrapper.setAttribute('style', 'display: inline-block; padding-left: 2px;');
    iconWrapper.setAttribute('role', 'button');
    iconWrapper.setAttribute('aria-label', label);
    iconWrapper.appendChild(icon);
    return iconWrapper;
}

var memoroomid = "41825160"
var memoroomname = "メモする"

var replaceButton = create('Star!!', 'star.png');

doOnAppear();
