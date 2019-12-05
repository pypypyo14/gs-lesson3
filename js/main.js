// YoutubeAPIでPlayer(iframe)の設定
// https://developers.google.com/youtube/iframe_api_reference?hl=ja
let player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('movie-player',
        {
            host: 'https://www.youtube.com',
            videoId: 'tAA_yWX8ycQ',
            width: 560,
            height: 315,
            playerVars: {
                'autoplay': 1,
                'controls': 0,
                'start': 70
            },
            events: {
                'onReady': onPlayerReady
            }
        }
    );
};

// PlayerがReady状態になったらコメント表示用の関数を定期実行
function onPlayerReady() {
    setInterval(displayComment, 1000);
}

// youtube動画の再生時間(今動画の何秒目か)を取得
function getYoutubeTime() {
    var currentTime = player.getCurrentTime();
    return currentTime
};

// ランダムな番号を生成
function generateRandomNum(num) {
    let randomNum = Math.floor(Math.random() * num);
    return randomNum;
}

// 16桁のユニークなIDを生成
function uniqueId() {
    var uid = '';
    for (var i = 0; i < 16; i++)
        uid += generateRandomNum(16).toString(16).toLowerCase();
    return uid
}

// コメント表示用関数
function displayComment() {
    // ローカルストレージからコメントの一覧を取得（空の場合は即終了）
    let storedComments = JSON.parse(localStorage.getItem('comments'));
    if (storedComments === null) {
        return;
    };

    // コメントごとにループ
    storedComments.forEach(function (comment, index) {
        //すでに流したコメントは処理しない
        if ($(`#${comment['id']}`).length) {
            return;
        };
        // 各コメントの['Time']パラメータと現在の動画の再生時間の差が1秒以内の場合は、コメントを画面に表示
        let now = getYoutubeTime();
        let trigger = comment['time'] - now;
        if (-0.5 < trigger && trigger < 0.5) {
            postComment(comment);
        };
    });
}

// コメントの表示
function postComment(comment) {
    // コメントのcssのtopパラメータをランダムに設定(0~90%)
    let top = generateRandomNum(90);
    // コメントをHTML上に表示し、CSSをつける
    $('.movie-comment').append(`<p class="marquee" id="${comment['id']}">${comment['text']}</p>`);
    $(`#${comment['id']}`).css("top", `${top}%`).css("color", `${comment['color']}`);
}


//コメントの投稿
$('#comment-button').on('click', function () {
    //コメントに関連する値を抽出し、テキストボックスを空にする
    let newCommentText = $('#comment-text').val();
    let newCommentColor = $('input[name="color"]:checked').val();
    $('#comment-text').val('');

    // LocalStorageを参照。空であれば初期化
    let commentList = JSON.parse(localStorage.getItem('comments'));
    if (commentList === null) {
        let newArray = new Array();
        localStorage.setItem('comments', JSON.stringify(newArray));
        commentList = newArray;
    };

    //投稿されたコメントが空でなければ、LocalStorageに登録
    if (newCommentText != "") {
        let newComment = {
            'id': uniqueId(),
            'text': newCommentText,
            'color': newCommentColor,
            'time': getYoutubeTime()
        }
        commentList.push(newComment);
        localStorage.setItem('comments', JSON.stringify(commentList));
        postComment(newComment);
    };
});