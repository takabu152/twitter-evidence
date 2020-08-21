import React, { useState,useEffect } from 'react';
import Firebase from '../Firebase';

// 検索クエリで流したいワードの登録処理
const InputWord = (props) => {
  
  let db = Firebase.firestore();
  console.log(db);
  const [inputText, setInputText] = useState("");
  const [SearchKeyWord,setSearchKeyWord] = useState(null);

  const SearchWords = (uid) => {
    db.collection("SearchKeyWord").where("uid", "==", uid)
          .get()
          .then(function(querySnapshot) {

              console.log(querySnapshot.docs);
              querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, " => ", doc.data());
            });

            //stateに入れる。
            //setSearchKeyWord(querySnapshot.docs);

          })
          .catch(function(error) {
            console.log("Error getting documents: ", error);
          });

  };

  // リスト初期表示 userEffectの第２引数は、stateの変数をいれる。
  // stateの変数をいれる事で、それが更新された時だけ実行されるように設定できる。
  useEffect(()=>{

    // Firebase.auth().onAuthStateChanged(async function(user) {
    //   if (user) {
    //     await SearchWords(user.uid);
    //   } else {
    //     // User is signed out.
    //     window.location.href = "./Login" ;
    //   }
    // });
    console.log('useEffectが実行されました')
  },[])
  // Firebase.auth().onAuthStateChanged(function(user) {
  //   if (user) {
  //     db.collection("SearchKeyWord").where("UID", "==", user.uid)
  //     .get()
  //     .then(function(querySnapshot) {
        
  //       let objSearchkeyWord;

  //       querySnapshot.forEach(function(doc) {
  //         // doc.data() is never undefined for query doc snapshots
  //         //console.log(doc.id, " => ", doc.data());
  //         objSearchkeyWord = {
  //           ID:doc.id,
  //           SearchWord:doc.data().SearchKeyWord
  //         };
  //         console.log(objSearchkeyWord);
  //         setSearchKeyWord(objSearchkeyWord);
  //       });
  //     })
  //     .catch(function(error) {
  //       console.log("Error getting documents: ", error);
  //     });

  //   } else {
  //     // User is signed out.
  //     // ...
  //     window.location.href = "./Login" ;
  //   };
  // });

  const handleChange = (event) =>{
    setInputText(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      //ログインユーザーの取得
      Firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          console.log('Press EnterKey')
          // エンターキー押した時の処理
          // firebaseデータに登録
          db.collection("SearchKeyWord").add({
            uid: user.uid,
            searchkeyword: inputText
          })
          .then(function(docRef) {
            //登録が正常終了した時の処理
            console.log("Document written with ID: ", docRef.id);
            setInputText("");
            //
            db.collection("SearchKeyWord").where("UID", "==", user.uid)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
              });
            })
            .catch(function(error) {
              console.log("Error getting documents: ", error);
            });
          })
          .catch(function(error) {
            console.error("Error adding document: ", error);
          });
          // User is signed in.
          // var displayName = user.displayName;
          // var email = user.email;
          // var emailVerified = user.emailVerified;
          // var photoURL = user.photoURL;
          // var isAnonymous = user.isAnonymous;
          // var uid = user.uid;
          // var providerData = user.providerData;
          // ...
        } else {
          // User is signed out.
          // ...
          window.location.href = "./Login" ;
        }
      });
      
      //inputTextの初期化
    }
  };

  //#region InputWordの画面
  return (
    <>
    <head>
      <meta charset="utf-8" />
      <title>Firebase Auth for Twitter</title>
    </head>
    <body>
      <h1>検索文字列の登録</h1>
      <input type="text" value={inputText} onChange={handleChange} onKeyDown={handleKeyDown}/>
      <div>登録内容</div>
      <script src="https://www.gstatic.com/firebasejs/5.8.1/firebase-app.js"></script>
      <script src="https://www.gstatic.com/firebasejs/5.8.1/firebase-auth.js"></script>
      <script src="https://www.gstatic.com/firebasejs/ui/3.5.2/firebase-ui-auth__ja.js"></script>
    </body>
    </>
  );
  //#endregion
}

export default InputWord;