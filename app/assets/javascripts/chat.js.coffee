class @ChatClass
  constructor: (url, useWebsocket) ->
    # これがソケットのディスパッチャー
    @dispatcher = new WebSocketRails(url, useWebsocket)
    # イベントを監視
    @bindEvents()

  bindEvents: () =>
    # 送信ボタンが押されたらサーバへメッセージを送信

    #$('#send').on 'click', @sendMessage
    $('#slider_seek').on 'click', @sendMessage
    # サーバーからnew_messageを受け取ったらreceiveMessageを実行
    @dispatcher.bind 'new_message', @receiveMessage

  sendMessage: (event) =>
    # サーバ側にsend_messageのイベントを送信
    # オブジェクトでデータを指定
    user_name = $('#username').val()
    msg_body = $('#slidervalue').text()
    @dispatcher.trigger 'new_message', { name: user_name , body: msg_body }
    $('#msgbody').val('')

  receiveMessage: (message) =>
    # 受け取ったデータをappend
    num = message.body
    parseInt(num)
    console.log(num);
    ytplayer.seekTo(num,true);
    $('#chat').append "#{message.name} : #{message.body}<br/>"

$ ->
  window.chatClass = new ChatClass($('#chat').data('uri'), true)