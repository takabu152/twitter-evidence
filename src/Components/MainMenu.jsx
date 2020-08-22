import React, { useState } from 'react';

import { Paper } from '@material-ui/core';
import { Button } from '@material-ui/core';

import Firebase from '../Firebase';

//#region MainMenu画面（メニュー画面）
const MainMenu = (props) => {
  //#region Component内global変数
  let twitter_token;
  let twitter_secret;
  //#endregion
  
  //Firebaseイベント
  Firebase.auth().onAuthStateChanged( (user) => {
    let h1   = document.querySelector('h1');
    let info = document.querySelector('#info');

    if(user) {
      //h1.innerText   = 'Login Complete!';
      //info.innerHTML = `${user.displayName}さんがログインしました<br>` + `(${user.uid})`;
      //Twitterのアクセストークンの設定
      twitter_token = localStorage.getItem('twitter_token');
      twitter_secret = localStorage.getItem('twitter_secret');
      console.log(user);
    }
    else {
      h1.innerText = 'Not Login';
    }
  });

  //#region Doneコンポーネントのイベント処理
  // ログアウトボタンの処理
  const LogoutBtn = async () => {
    await Firebase.auth().signOut().then(()=>{
      alert("ログアウトしました。");
      window.location.href = "./Login" ;
    })
    .catch( (error)=>{
      alert(`ログアウト時にエラーが発生しました (${error})`);
    });
  }

  const TimeLineCheckBtn = () => {
    window.location.href = "./timelinecheck" ;
  } 

  const InputWordBtn = () => {
    window.location.href = "./inputword" ;

  }
  //#endregion


  //#region Doneの画面
  return (
    <>
    <head>
      <meta charset="utf-8" />
      <title>Firebase Auth for Twitter</title>
    </head>
    <body>
      <Paper>
        <div class = "box">
          <h1>Main Menu</h1>
          <div id="info"></div>
          <div>
            <Button id="searchword_button" variant="outlined" color="primary"  onClick={InputWordBtn}>
              検索ワード登録
            </Button>    
          </div>
          <div>
            <Button id="timeline_button" variant="outlined" color="primary"  onClick={TimeLineCheckBtn}>
              TimeLine 収集
            </Button>
          </div>
          <div>
            <Button id="logout_button" variant="outlined" color="secondary" onClick={LogoutBtn}>
              Logout
            </Button>
          </div>
        </div>
      </Paper>
      
      <script src="https://www.gstatic.com/firebasejs/5.8.1/firebase-app.js"></script>
      <script src="https://www.gstatic.com/firebasejs/5.8.1/firebase-auth.js"></script>
      <script src="https://www.gstatic.com/firebasejs/ui/3.5.2/firebase-ui-auth__ja.js"></script>
    </body>
    </>
  );
    //#endregion
}
//#endregion

export default MainMenu;