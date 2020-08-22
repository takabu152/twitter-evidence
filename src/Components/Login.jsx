import React, { useState } from 'react';
import { Paper } from '@material-ui/core';
import { Button } from '@material-ui/core';

import Firebase from '../Firebase'
var db = Firebase.firestore();

//#region Login画面
const Login = (props) =>{

  const subSetCount = () => {
    props.setCount(props.count + 1);
  }

  //#region Twitterへのログイン処理
  const btnTwitterLogin = () => {
    const provider = new Firebase.auth.TwitterAuthProvider()
    Firebase.auth().signInWithRedirect(provider);
  }
  //#endregion

  const inputUserInfo = async (uid,twitterid,twittername) => {

    //すでにuidがあった場合は、削除して、再度作成する。
    const UsersSnapshot = await db.collection('Users')
            .where('uid', '==', uid)
            .get();

    //データがあったら一度削除
    if(UsersSnapshot.empty === false)
    {
      UsersSnapshot.docs.map(async x => {
        await db.collection('Users').doc(x.id).delete()
        .then(function(){
          console.log('削除完了')
        }).catch(function(error) {
          console.error("Error removing document: ", error);
        });
      });
    };

    //FirebaseのUsersTableに入れる。
    await db.collection("Users").add({
      uid: uid,
      twitterid:twitterid,
      twittername:twittername
    })
    .then(function(docRef) {
      //登録が正常終了した時の処理
      console.log('登録完了');
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

  }

  //#region Firebaseの認証が通ったあとの処理
  Firebase.auth().getRedirectResult().then(async function(result) {
    if (result.credential) {
      var token = result.credential.accessToken;
      var secret = result.credential.secret;
      localStorage.setItem('twitter_token', token);
      localStorage.setItem('twitter_secret', secret);

      await inputUserInfo(result.user.uid,result.additionalUserInfo.profile.id_str,result.additionalUserInfo.username);
      
      window.location.href = "./MainMenu" ;
    }
    // The signed-in user info.
    var user = result.user;
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
    console(error);
  });
  //#endregion
  
  return (
    <>
    <head>
      <meta charset="utf-8" />
      <title>Twitter Evidence</title>
      <link type="text/css" rel="stylesheet" href="https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.css" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

    </head>
    <body>

      <Paper >
        <div class="box">
          <h1>Twitter Evidence</h1>
          <div id="firebaseui-auth-container"></div>

          <Button variant="outlined" color="primary" id="twitter_login_button" onClick={btnTwitterLogin}>
            Login
          </Button>
        </div>
      </Paper>
      <script src="https://www.gstatic.com/firebasejs/5.8.1/firebase-app.js"></script>
      <script src="https://www.gstatic.com/firebasejs/5.8.1/firebase-auth.js"></script>
      <script src="https://www.gstatic.com/firebasejs/ui/3.5.2/firebase-ui-auth__ja.js"></script>
    </body>
    </>
  );
}
//#endregion

export default Login;