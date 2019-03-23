function roomDets() {

  var msgDate = new Date();
  var date = msgDate.getDate();
  var month = msgDate.getMonth() + 1;
  var year = msgDate.getFullYear();
  var hour = msgDate.getHours();
  var min = msgDate.getMinutes();
  var sec = msgDate.getSeconds();

  selectedRoom = document.querySelector('#chatrooms').value;
  document.querySelector('#chatrooms').value = selectedRoom;

  timestamp = date + "/" + month + "/" + year + "  -  " + hour + ": " + min + ": " + sec;

  if (selectedRoom != ''){
    document.querySelector('#enterRoom').innerHTML =timestamp + " - " + localStorage.getItem('username') + " just entered the room " + selectedRoom;
  }else{
    document.querySelector('#enterRoom').innerHTML = '';
  };

  msgArray = JSON.parse(localStorage.getItem('msgArray'));
  nameArray = JSON.parse(localStorage.getItem('nameArray'));
  timeArray = JSON.parse(localStorage.getItem('timeArray'));
  roomsArray = JSON.parse(localStorage.getItem('roomsArray'));
  fileName = localStorage.getItem('fileName');

  var sel = document.querySelector("#chatrooms");
  var room = document.querySelector('#chatrooms').value;

  var emptyList = document.querySelector("#oldmsgs");
  emptyList.innerHTML = '';

  for (i in roomsArray) {
    if (roomsArray[i] === room) {
      const li = document.createElement('li');
      li.innerHTML =  "<br>" + timeArray[i] + "<br>" +  nameArray[i] + ": " + msgArray[i] + "<br>";
      document.querySelector('#oldmsgs').append(li);
    };
  };

  if (fileName != '' && fileName != null) {
    const li = document.createElement('li');
    li.innerHTML ="Uploaded File: " + fileName + "<br>";
    document.querySelector('#oldmsgs').append(li);
  };

  rememberRoom = document.querySelector('#chatrooms').value;
  localStorage.setItem("rememberRoom", rememberRoom);
};


function rememberChannel() {
  var rememberedRoom = localStorage.getItem('rememberRoom');
  document.querySelector('#chatrooms').value = rememberedRoom;
  if (rememberedRoom === '') {
    document.querySelector('#type-message').style.visibility = "hidden";
  }else{
    document.querySelector('#type-message').style.visibility = "visible";
  };
};


document.addEventListener('DOMContentLoaded', () => {

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    username = localStorage.getItem('username');
    if (username==undefined || username==null) {
      var username=prompt("This is Chatbox\nLet's start chatting, shall we?\n\nYour username:");

      while (username === ""){
        alert("Please enter a username!")
        var username=prompt("This is Chatbox\nLet's start chatting, shall we?\n\nYour username:");
      };
      if (username){
        document.querySelector('#username').innerHTML = username;
        localStorage.setItem('username', username);
        location.reload();
      }else{
        document.body.style.display = "none";
      };

    }else{
      document.querySelector('h2').innerHTML = "Hi " + username + ", it's great to see you at ChatBoX!";
    };

    existingRooms = JSON.parse(localStorage.getItem('existingRooms'));
    for (i in existingRooms) {
      const option = document.createElement('option');
      option.innerHTML = existingRooms[i];
      document.querySelector('#chatrooms').append(option);
    };

    $(document).ready(function () {
      bsCustomFileInput.init();
    });

    socket.on('connect', () => {
      document.querySelector('#new-chatroom').onsubmit = () => {
            var roomname = document.querySelector('#chatroom').value;
            socket.emit('send roomname', {'roomname': roomname});
            document.querySelector('#chatroom').value='';
            return false;
        };
      });

    socket.on('received roomname', data => {
      var existingRooms = JSON.parse(localStorage.getItem("allRooms"));
      if(existingRooms == null) {
      existingRooms = [];}
      var chatroom = `${data.roomname}`;
      var check =  existingRooms.indexOf(chatroom);

      if (check >= 0 || chatroom == "General") {
        document.querySelector('h4').innerHTML = "Oops! ChatRooM already exists.<br><br> You will be redirected to try again in a few seconds.";
        setTimeout(location.reload.bind(location), 4000);
      };
      if (check < 0 && chatroom != "General"){
        localStorage.setItem(chatroom, JSON.stringify(chatroom));
        existingRooms.push(chatroom);
        localStorage.setItem("allRooms", JSON.stringify(existingRooms));
        allRooms = localStorage.getItem("allRooms");
        document.querySelector('h4').innerHTML = "Awesome! Your ChatRooM will be added to the dropdown below in a few seconds";
        setTimeout(location.reload.bind(location), 3000);
        localStorage.setItem("existingRooms", JSON.stringify(existingRooms));
        existingRooms = JSON.parse(localStorage.getItem('existingRooms'));
      };
    });

    x = document.querySelector("#chatrooms");
    for (i = 0; i < x.length; i++) {
      rememberChannel();
      roomDets();
    }

     for (var i in existingRooms) {
       rememberChannel();
       roomDets();
     };

    socket.on('connect', data => {

      hundredMsgs = JSON.parse(localStorage.getItem('msgArray'));
      if (hundredMsgs == undefined || hundredMsgs.length == 0) {
        var hundredMsgs = [];
      };

      hundredUsername = JSON.parse(localStorage.getItem('nameArray'));
      if (hundredUsername == undefined || hundredUsername.length == 0) {
        var hundredUsername = [];
      };

      hundredTime = JSON.parse(localStorage.getItem('timeArray'));
      if (hundredTime == undefined || hundredTime.length == 0) {
        var hundredTime = [];
      };

      rooms = JSON.parse(localStorage.getItem('roomsArray'));
      if (rooms == undefined || rooms.length == 0) {
        var rooms = [];
      };

         document.querySelector('#send-message').onclick = () => {

           var msgDate = new Date();
           var date = msgDate.getDate();
           var month = msgDate.getMonth() + 1;
           var year = msgDate.getFullYear();
           var hour = msgDate.getHours();
           var min = msgDate.getMinutes();
           var sec = msgDate.getSeconds();

           var textMsg = document.querySelector('#message').value;
           var username = localStorage.getItem('username');
           var time = date + "/" + month + "/" + year + " - " + hour + ": " + min + ": " + sec;
           var enterRoom = document.querySelector('#chatrooms');
           var roomName = enterRoom.value;

           var sel = document.querySelector("#chatrooms");
           var room= sel.options[sel.selectedIndex].text;

           hundredMsgs.push(textMsg);
           hundredUsername.push(username);
           hundredTime.push(time);
           rooms.push(room);

           if (hundredMsgs.length>99) {
             var msgArray = hundredMsgs.slice(-100);
           }else{
             var msgArray = hundredMsgs;
           }
           localStorage.setItem("msgArray", JSON.stringify(msgArray));

           if (hundredUsername.length>99) {
             var nameArray = hundredUsername.slice(-100);
           }else{
             var nameArray = hundredUsername;
           }
           localStorage.setItem("nameArray", JSON.stringify(nameArray));

           if (hundredTime.length>99) {
             var timeArray = hundredTime.slice(-100);
           }else{
             var timeArray = hundredTime;
           };
           localStorage.setItem("timeArray", JSON.stringify(timeArray));

           if (rooms.length>99) {
             var roomsArray = rooms.slice(-100);
           }else{
             var roomsArray = rooms;
           };
           localStorage.setItem("roomsArray", JSON.stringify(roomsArray));

           var fileName = document.querySelector('#customFile').value;
           fileName = fileName.substring(12);
           var empty = ""

           if (fileName === ''){
             localStorage.setItem("fileName", empty);
           }else{
             localStorage.setItem("fileName", fileName);
           };

           socket.emit('send message', {'textMsg': textMsg, 'roomName': roomName, 'fileName': fileName});
           document.querySelector('#message').value='';
           return false;
         };
       });

       socket.on('received message', data => {

         document.querySelector('#chatrooms').onchange = () => {

           roomDets();

           var msgDate = new Date();
           var newdate = msgDate.getDate();
           var newmonth = msgDate.getMonth() + 1;
           var newyear = msgDate.getFullYear();
           var newhour = msgDate.getHours();
           var newmin = msgDate.getMinutes();
           var newsec = msgDate.getSeconds();

           newRoom = (document.querySelector('#chatrooms').value);

           newTimestamp = newdate + "/" + newmonth + "/" + newyear + "  -  " + newhour + ": " + newmin + ": " + newsec;
           if (newRoom != ''){
             document.querySelector('#enterRoom').innerHTML = timestamp + " - " + localStorage.getItem('username') + " just entered the room " + selectedRoom;
           }else{
             document.querySelector('#enterRoom').innerHTML = '';
           };

           document.querySelector('#newmsgs').innerHTML = '';
         };

         var msgDate = new Date();
         var date = msgDate.getDate();
         var month = msgDate.getMonth() + 1;
         var year = msgDate.getFullYear();
         var hour = msgDate.getHours();
         var min = msgDate.getMinutes();
         var sec = msgDate.getSeconds();

        timestamp = date + "/" + month + "/" + year + " - " + hour + ": " + min + ": " + sec;
        const div = document.createElement('div');
        const li = document.createElement('li');
        li.innerHTML = `<br>${timestamp}<br>${username}: ${data.textMsg}<br>`;
        if (`${data.fileName}` != '') {
          li.innerHTML = `<br>${timestamp}<br>${username}: ${data.textMsg}<br>Uploaded File: ${data.fileName}`;
        };
        document.querySelector('#newmsgs').append(li);

        enterRoom = document.querySelector('#chatrooms');
        enterRoom.value=`${data.roomName}`;

       });

       document.querySelector('#removeAccount').onclick = () => {
         if (confirm("Are you sure you want to remove your username?\n \nYou will have to use a new username the next time you want to chat in ChatBoX.") == true) {
           localStorage.removeItem('username');
           location.reload();
         };
       };

});
