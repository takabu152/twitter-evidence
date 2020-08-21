import React, { useState } from 'react';
import Firebase from '../Firebase';

//#region MainMenu画面（メニュー画面）
const Index = (props) => {
  
  const TimeLineCheckBtn = () => {
    window.location.href = "./timelinecheck" ;
  } 

  const InputWordBtn = () => {
    window.location.href = "./inputword" ;
  }


  //#region Doneの画面
  return (
    <>
    <head>
      <meta charset="utf-8" />
      <title>Firebase Auth for Twitter</title>
    </head>
    <body>
      <h1>...Please wait</h1>
      <div id="info"></div>
      <input type="button" value="追跡ワード登録" onClick={InputWordBtn} />
      <input type="button" value="証拠状況の確認" onClick={TimeLineCheckBtn}/>
      <input type="button" value="Logout" onClick={LogoutBtn}/>
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