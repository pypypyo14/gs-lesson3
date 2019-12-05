function commentLoop() {
    $('.movie-comment').html('');
    let storedComments = JSON.parse(localStorage.getItem('comments'));
    // 保存されているコメントがない場合はreturn
    if (storedComments === null) {
        return;
    };

    storedComments.forEach(function (comment, index) {
        $('.movie-comment').append(`<p class="marquee num-${index}">${comment['text']}</p>`);
        // コメントの高さ、横位置をランダムに設定
        let randomTop = Math.floor(Math.random() * 90);
        let randomLeft = Math.floor(Math.random() * 100);
        $(`.num-${index}`).css({ top: `${randomTop}%`, left: `${randomLeft}%`, color: `${comment['color']}` });
    });
}
function getYoutubeTime() {

}

$(function () {
    commentLoop();

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

        //コメント空でなければ、LocalStorageに登録
        if (newCommentText != "") {
            let newComment = {
                'text': newCommentText,
                'color': newCommentColor
            }
            commentList.push(newComment);
            localStorage.setItem('comments', JSON.stringify(commentList));
            commentLoop();
        };
    });
});