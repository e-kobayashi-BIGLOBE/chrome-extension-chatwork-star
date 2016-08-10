function doOnAppear() {
    messages = $('#_timeLine').find('.chatTimeLineMessage');

    if (messages.size() == 0) {
        id = setTimeout(doOnAppear, 1000);

    } else {
        clearTimeout(id);

        if ($('.memo_button').size() == 0 ){
          putButton();
        }
        onGroupChange();
        watchScroll();
    }
}

function putButton() {
  $('._chatTimeLineMessageBox').find('.timeStamp').append(replaceButton);
  $('.memo_button').click(function() {
    datarid = $(this).closest('div').parent('div').parent('div').attr('data-rid')
    mid = $(this).closest('div').parent('div').parent('div').attr('data-mid')

    // メッセージリンク
    body = $(this).closest('div').parent('div').find('pre').html() + "https://kcw.kddi.ne.jp/#!rid" + datarid + "-" + mid;

    // リプライとTo
    body = body.replace(/<div class="chatTimeLineReply _replyMessage" data-rid="(\d*)".*\.[j|p][p|n]g">/g,"[返信 aid=$1 to=" + datarid + "-" + mid + "]")
    body = body.replace(/<span class="chatTimeLineTo">.*data-aid="(\d*)".*\.[j|p][p|n]g">/g,"[To:$1]")

    // 引用
    body = body.replace(/<div class="dev_quote chatQuote">[\S\s]*[aid](\d+)[\S\s]*<div class="quoteText">([\S\s]*)<\/div><\/div>/g,"[引用 aid=$1 time=0]$2[/引用]")

    // ブロック
    body = body.replace(/<div class="chatInfo">([\S\s]*?)<\/div>/g,"[info]$1[/info]")
    body = body.replace(/<code class="chatCode">/g,"[code]")
    body = body.replace(/<\/code>/g,"[/code]")
    sendChat();
  });
}

function watchScroll() {
  $('#_timeLine').scroll(function() {
    if ($('.memo_button').size() == 0 ){
      putButton();
    }
  });
}

function sendChat() {
  // 現在選択されているルームIDを取得する
  var nowromid = $('#_roomListItems').find('li._roomSelected').data('rid');

  // メモするルームObject
  var memoroom = $('#_roomListItems').find('li[aria-label="' + memoroomname + '"]');

  // if (romid != memoroomid) {
  if ($('#_roomListItems').find('li._roomSelected').data('rid') != memoroom.data('rid')) {
      memoroom.click();

      // チャットを投稿する
      $('#_chatText').val(body);
      $('#_sendButton').trigger('click');

      // 元のルームへ移動する
      // var memoroom = $('#_roomListItems').find('li[data-rid="'+ nowromid + '"]');
      // nowromid.click();
    }
}

// ルーム変更
function onGroupChange() {
    $('._roomLink').click(function() {
      var currentRid = $('#_timeLine').find('.chatTimeLineMessage').last().data('rid');
      waitChange(currentRid);
    });
}

// 変更先ルームの表示が完了したら☆を置く
function waitChange(oldRid) {
    rid = $('#_timeLine').find('.chatTimeLineMessage').last().data('rid');

    if (oldRid == rid) {
        id = setTimeout(waitChange, 1000, oldRid);

    } else {
        clearTimeout(id);

        if ($('.memo_button').size() == 0 ){
          putButton();
        }
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

var memoroomname = "メモする"

var replaceButton = create('Star!!', 'star.png');

doOnAppear();
