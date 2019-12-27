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

/**
 * PlayerがReady状態になったらコメント表示用の関数を定期実行
 */
const onPlayerReady = () => setInterval(displayLocalStorageComment, 1000);

/**
 * youtube動画の再生時間(今動画の何秒目か)を取得
 */
const getYoutubeTime = () => player.getCurrentTime();

/**
 * ランダムな番号を生成
 * @param {number} num 番号の最大値 - 1
 * @return {number} ランダムな番号
 */
const generateRandomNum = (num) => Math.floor(Math.random() * num + 1);

/**
 * 16桁のユニークなIDを生成
 */
function uniqueId() {
    const DIGITS = 16;
    let uid = '';
    for (var i = 0; i < DIGITS; i++)
        uid += generateRandomNum(DIGITS).toString(16).toLowerCase();
    return uid
};


/**
 * ローカルストレージ内のコメントを参照し、動画再生のタイミングと合わせて表示する関数
 */
function displayLocalStorageComment() {
    // ローカルストレージからコメントの一覧を取得（空の場合は即終了）
    let storedComments = JSON.parse(localStorage.getItem('comments'));
    if (storedComments === null) {
        return;
    };

    // コメントごとにループ
    storedComments.forEach(function (comment) {
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
};

/**
 * コメントを画面に表示
 * @param {*} comment 投稿コメント
 */
function postComment(comment) {
    // コメントのcssのtopパラメータをランダムに設定(0~90%)
    let top = generateRandomNum(90);
    // コメントをHTML上に表示し、CSSをつける
    $('.movie-comment').append(`<p class="marquee" id="${comment['id']}">${comment['text']}</p>`);
    $(`#${comment['id']}`).css("top", `${top}%`).css("color", `${comment['color']}`);
};

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

//コメント表示非表示
$('#commentdisable-button').on('click', function () {
    // .on がついている場合(非表示状態->表示状態へ)
    if ($(this).hasClass('on')) {
        $(this).removeClass('on');
        $(this).text('コメントを非表示');
        $('.movie-comment').css('visibility', '');
    } else {
        // 現在.onがついていない(表示状態->非表示状態へ)
        $(this).addClass('on');
        $(this).text('コメントを表示');
        $('.movie-comment').css('visibility', 'hidden');
    };
});
