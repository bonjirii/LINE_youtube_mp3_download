//＊使い方＊
//1，LINEからMessaging APIのアカウントを作成し、アクセストークンを取得し、下のCHANNEL_ACCESS_TOKENにコピペする。
//2，↓のSAVE_FOLDER_NAMEの名前のフォルダをGoogleドライブ直下に作る。
//3，URL:https://api.rakuten.net/Prasadbro/api/youtube-to-mp32/endpointsより、アカウントを作り、Youtube To Mp3を利用できるようにする。
//4，下の方のyoutube_to_mp3()関数の内容を、サイトのコードズニペットからjavascript、fetchを開き、照らし合わせ、コードを完成させる。
//5，コードをウェブアプリケーションとして公開し、LINEのWebHookの設定もする。
//6，完成！

var CHANNEL_ACCESS_TOKEN = 'hogehoge';
const SAVE_FOLDER_NAME = "LINE_youtube_mp3"

function doPost(e) {
  var contents = e.postData.contents;
  var obj = JSON.parse(contents)
  var events = obj["events"];
  
  for(var i = 0; i < events.length; i++){
    if(events[i].source.groupid != null){
      //GroupChatMode(events);
    }else if(events[i].source.roomId != null){
      //RoomChatMode(events);
    }else{
      PrivateChatMode(events);
    }
  }
}

function doGet(e) {
    return ContentService.createTextOutput("SUCCESS");
}





//Chatモード

function GroupChatMode(events){
  for(var i = 0; i < events.length; i++){
    var user_id = events[i].source.userId;
    var group_id = events[i].source.groupId;
    var userProfile = getUserProfile(user_id);
    var groupProfile = getGroupProfile(group_id);
    var groupCount = getGroupCount(group_id);
    var thisGroupSheet = getSheetData(Data_FOLDER_ID, group_id);
    
    if(events[i].type == "message"){
      if(events[i].message.type == "text"){
      }else if(events[i].message.type == "image"){
      }else if(events[i].message.type == "video"){
      }else{
      }
    }else if(events[i].type == "follow"){
    }else if(events[i].type == "unfollow"){
    }else if(events[i].type == "join"){
    }else if(events[i].type == "leave"){
    }else if(events[i].type == "memberJoined"){
    }else if(events[i].type == "memberLeft"){
    }
  }
}

function RoomChatMode(events){
  for(var i = 0; i < events.length; i++){
    var user_id = events[i].source.userId;
    var room_id = events[i].source.roomId;
    var userProfile = getUserProfile(user_id);
    var thisRoomSheet = getSheetData(Data_FOLDER_ID, room_id);
    
    if(events[i].type == "message"){
      if(events[i].message.type == "text"){
      }else if(events[i].message.type == "image"){
      }else if(events[i].message.type == "video"){
      }else{
      }
    }else if(events[i].type == "follow"){
    }else if(events[i].type == "unfollow"){
    }else if(events[i].type == "join"){
    }else if(events[i].type == "leave"){
    }else if(events[i].type == "memberJoined"){
    }else if(events[i].type == "memberLeft"){
    }
  }
}

function PrivateChatMode(events){
  for(var i = 0; i < events.length; i++){
    if(events[i].type == "message"){
      if(events[i].message.type == "text"){
        var Log_Message = LINE_to_download(events[i].message.text, events[i]);
        //SendMessage(events[i], Log_Message);
      }else if(events[i].message.type == "image"){
      }else if(events[i].message.type == "video"){
      }else{
      }
    }else if(events[i].type == "follow"){
    }else if(events[i].type == "unfollow"){
    }else if(events[i].type == "join"){
    }else if(events[i].type == "leave"){
    }else if(events[i].type == "memberJoined"){
    }else if(events[i].type == "memberLeft"){
    }
  }
}





//youtube to mp3のapi

function LINE_to_download(youtube_url, events){
  var youtube_id = /[/?=]([-\w]{11})/.exec(youtube_url);
  
  var dougainfo_Json = youtube_to_mp3(youtube_id[1]);
  
  if (dougainfo_Json.Title.length > 30) {
    // textが30文字より大きい場合
    dougainfo_Json.Title = dougainfo_Json.Title.substr(0, 30) + '…';
  }
  
  var mp3file_Name = dougainfo_Json.Download_Size + " " + dougainfo_Json.Title + ".mp3";
  var message = "\"Status\":" + dougainfo_Json.Status + "\n\"Status_Code\":" + dougainfo_Json.Status_Code + "\n\"Title\":" + dougainfo_Json.Title + "\n\"Download_Size\":" + dougainfo_Json.Download_Size + "\n\"Download_url\":" + dougainfo_Json.Download_url;
  SendMessage(events, message);
  
  downloadFiles(dougainfo_Json.Download_url, mp3file_Name, SAVE_FOLDER_NAME);
}

//ここは適宜置き換える。↓コードズニペットからjavascript、fetchを開き、照らし合わせる。URL:https://api.rakuten.net/Prasadbro/api/youtube-to-mp32/endpoints
function youtube_to_mp3(youtube_id){
  var get_movie_url = "hoge?video_id=" + youtube_id;
  var jsondata = UrlFetchApp.fetch(get_movie_url, {
    "method": "GET",
    "headers": {
		"x-rapidapi-host": "hoge.com",
		"x-rapidapi-key": "hogehoge"
	}
  })
  return JSON.parse(jsondata);
}

function downloadFiles(url, fileName, folderName) {
  // データを取得
  var response = UrlFetchApp.fetch(url);
  var fileBlob = response.getBlob().setName(fileName);
  
  // 取得したデータをGoogle Driveにアップロード
  var file = DriveApp.createFile(fileBlob);
  
  // 予め作っておいたフォルダの情報を取得
  var folders = DriveApp.getFoldersByName(folderName);
  while(folders.hasNext()) {
    var folder = folders.next();
    if(folder.getName() == folderName){
      break;
    }
  }
  // ルートディレクトリにデータが保存されているのでフォルダにコピー
  file.makeCopy(file.getName(), folder);
  // ルートディレクトリのデータを削除
  file.setTrashed(true);
}





//LineApiの機能

function SendMessage(e, text){
  var postData = {
    "replyToken" : e.replyToken,
    "messages" : [
      {
        "type" : "text",
        "text" : text
      }
    ]
  };
  var options = {
    "method" : "post",
    "headers" : {
      "Content-Type" : "application/json",
      "Authorization" : "Bearer " + CHANNEL_ACCESS_TOKEN
    },
    "payload" : JSON.stringify(postData)
  };
  
  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", options);
}

function getGroupProfile(groupId){
    var url = 'https://api.line.me/v2/bot/group/' + groupId + '/summary';
  var groupProfile = UrlFetchApp.fetch(url,{
    'headers': {
      'Authorization' :  'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
  })
  return JSON.parse(groupProfile)
  
}

function getGroupCount(groupId) {
  var url = 'https://api.line.me/v2/bot/group/' + groupId + '/members/count';
  var groupProfile = UrlFetchApp.fetch(url,{
    'headers': {
      'Authorization' :  'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
  })
  return JSON.parse(groupProfile).count;
}

function leaveGroup(groupId) {
  var url = 'https://api.line.me/v2/bot/group/' + groupId + '/leave';
  
    var options = {
    "method" : "post",
    "headers" : {
      "Authorization" : "Bearer " + CHANNEL_ACCESS_TOKEN
    },
  };
  
  UrlFetchApp.fetch(url, options);
}

function getRoomCount(roomId){
  var url = 'https://api.line.me/v2/bot/room/' + roomId + '/members/count';
  var groupProfile = UrlFetchApp.fetch(url,{
    'headers': {
      'Authorization' :  'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
  })
  return JSON.parse(groupProfile).count;
}

function leaveRoom(roomId){
  var url = 'https://api.line.me/v2/bot/room/' + roomId + '/leave';
    var options = {
    "method" : "post",
    "headers" : {
      "Authorization" : "Bearer " + CHANNEL_ACCESS_TOKEN
    },
  };
  
  UrlFetchApp.fetch(url, options);
}

function getUserProfile(userId) {
  var url = 'https://api.line.me/v2/bot/profile/' + userId;
  var userProfile = UrlFetchApp.fetch(url,{
    'headers': {
      'Authorization' :  'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
  })
  return JSON.parse(userProfile);
}

function getPictureContentMessage(SaveDirectory_Id, messageId, userDisplayName) {
  var url = 'https://api.line.me/v2/bot/message/' + messageId + "/content";
  var RawContent = UrlFetchApp.fetch(url, {
      'headers': {
            'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
      },
  })
  var jpegImage = DriveApp.createFile(RawContent).getId();
  var date = new Date();
  DriveApp.getFileById(jpegImage).setName(userDisplayName + "," + Utilities.formatDate( date, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss') + "," + messageId);
  DriveApp.getFolderById(SaveDirectory_Id).addFile(DriveApp.getFileById(jpegImage));
  DriveApp.getRootFolder().removeFile(DriveApp.getFileById(jpegImage));
  
  return jpegImage;
}
