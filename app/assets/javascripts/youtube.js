// <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
// <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js"></script>
// <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"></script>

// document.write("<script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js'></script>");
// document.write("<script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js'></script>");
// document.write("<script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js'></script>");

var flashvars = { };
var params = { allowScriptAccess:"always" };
var attributes = { id:"myytplayer" };
swfobject.embedSWF(
    "http://www.youtube.com/apiplayer?enablejsapi=1&version=3&playerapiid=ytplayer",
    "ytapiplayer",
    "560",
    "340",
    "8.0.0", /*  Flash Player8 以降を指定 */
    "/content/lib/swfobject/expressInstall.swf",
    flashvars,
    params,
    attributes
);

/*WebSocket関連*/
var current_time = 0;
var state = 0;

var uri = "ws://"+location.host+"/server.php";
// var uri = "ws://"+location.host+"/server";

$(function(){

    $("#slider").slider({
        max:0, //最大値
        min:0,   //最小値
        value:0, //初期値
        step:1, //幅

        slide: function(event,ui){
            $("#slidervalue").html("slider:"+ui.value);                                                          
        },
        create: function(event,ui){
            $("#slidervalue").html("create:"+$(this).slider("value"));  
        },
        start: function(event,ui){
            $("#slidervalue").html("start："+ui.value);
        },
        stop: function( event, ui ) {
            $("#slidervalue").html("stop："+ui.value);
        },
        change: function( event, ui ) {
            $("#slidervalue").html(ui.value);
        }
    });
    

    $("#slider_seek").click(function(ui){
        
        var num = $("#slider").slider("option","value");
        console.log("hello");
        
        if(ytplayer){
            ytplayer.seekTo(num,true);
            console.log("hello2");
            return false;
        }
    });


    /* 再生/一時停止 */
    $("#btn_play").toggle(function(){
        // alert("test");
        console.log("testtest");


        if(ytplayer){
            console.log("btn_play ytplayer 1");
            ytplayer.playVideo();
            // $("#slider").slider("max",ytplayer.getDuration());
            // $("#slider").slider("max",200);
            // $("#slider").slider({max:200});
            // console.log("getDuration() = "+getDuration());
            console.log("maxtime = "+maxtime);
        }
        
        return false;
        
        // $("#slider").slider("option","max") = ytplayer.getDuration();
    },function(){
        if(ytplayer) ytplayer.pauseVideo();
        return false;
    });
    /* 停止 */
    $("#btn_stop").click(function(){
        if(ytplayer) ytplayer.stopVideo();
        return false;
    });

    /* シーク位置 */
    $("#btn_seek").click(function(){
        var num=($("#seek").val()) ? $("#seek").val() : 0;
        console.log("hello");

        if(ytplayer){
            ytplayer.seekTo(num,true);
            console.log("hello2");
            return false;
        }
    });

    


});
/* プレーヤーの準備ができると呼ばれる関数 */

function onYouTubePlayerReady(playerId) {
    ytplayer = document.getElementById("myytplayer");
     ytplayer.cueVideoById("bD3Pr3F0B_4");
    // ytplayer.cueVideoById("9sJUDx7iEJw");
    //ytplayer.cueVideoById("xSkCny-HtTw");
    timerID=setInterval("getStatus()",1);

    var s="";

    s+="動画のURL:<br><input type='text' style='width:560px;border:1px solid #ccc;' value='"+ytplayer.getVideoUrl()+"' /><br>";
    s+="動画の埋め込みコード:<br><textarea style='width:560px;height:150px;border:1px solid #ccc;background:#eee;'>"+ytplayer.getVideoEmbedCode()+"</textarea>";
    $("#status").append(s);
}

function send_status(tmp,current_time){
    console.log("state:"+tmp);
    console.log("current_time:"+current_time);

}

function getStatus(){
    var s="";
    // s+="再生中の動画の長さ:"+ytplayer.getDuration()+"<br>";
    console.log("137:getDuration() 2"+ytplayer.getDuration());

    var tmp = ytplayer.getPlayerState();

    if(tmp == -1){
        tmpstr="未開始";
        // console.log("未開始");
    }else if(tmp==0){
        tmpstr="終了";
        // console.log("終了");
    }else if(tmp==1){
        tmpstr="再生中";
        maxtime = ytplayer.getDuration();
        $("#slider").slider({max:maxtime});
        // send_currentTime();
        // send_status(tmp,current_time);
        // send();
        // console.log("再生中:"+maxtime);
    }else if(tmp==2){
        tmpstr="一時停止";
        // console.log("停止");
    }else if(tmp==3){
        tmpstr="バッファリング中";
        // console.log("バッファリング中");
    }else if(tmp=-5){
        tmpstr="頭出し済";
        // console.log("頭出し済");
    }

    
    // console.log("140: maxtime "+maxtime);

    current_time = ytplayer.getCurrentTime();
    // s+="動画の再生を開始してからの経過時間:"+ytplayer.getCurrentTime()+"秒"+"<br>";
    s+="動画の再生を開始してからの経過時間:"+current_time+"秒"+"<br>";
    s+="プレーヤーの状態:"+tmpstr+"<br>";
    // send_currentTime();



    $("#duration").html(s);
}
