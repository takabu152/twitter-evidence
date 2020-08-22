import React, { useState,useEffect } from 'react';

import { Paper } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { IconButton } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import Firebase from '../Firebase';

// 検索クエリで流したいワードの登録処理
const InputWord = (props) => {
  
  let db = Firebase.firestore();

  const [inputText, setInputText] = useState("");
  const [_SearchKeyWord,setSearchKeyWord] = useState(null);
  const [_uid,setUID] = useState("");


  db.collection("SearchKeyWord").where("uid", "==", _uid)
    .onSnapshot(function(querySnapshot) {
      const SearchKeyWordsCollection = querySnapshot.docs.map(x => {
        return {
          id: x.id,
          uid: x.data().uid,
          searchkeyword: x.data().searchkeyword
        };
      });
      
      setSearchKeyWord(SearchKeyWordsCollection);
    });

  // const SearchWords = (uid) => {
  //   db.collection("SearchKeyWord").where("uid", "==", uid)
  //         .get()
  //         .then(function(querySnapshot) {

  //             //console.log(querySnapshot.docs);
  //             querySnapshot.forEach(function(doc) {
  //             // doc.data() is never undefined for query doc snapshots
  //             console.log(doc.id, " => ", doc.data());
  //           });

  //           //stateに入れる。
  //           //setSearchKeyWord(querySnapshot.docs);

  //         })
  //         .catch(function(error) {
  //           console.log("Error getting documents: ", error);
  //         });

  // };

  // リスト初期表示 userEffectの第２引数は、stateの変数をいれる。
  // stateの変数をいれる事で、それが更新された時だけ実行されるように設定できる。
  useEffect(()=>{

    Firebase.auth().onAuthStateChanged(async function(user) {
      if (user) {
        // stateに保存
        setUID(user.uid);

        //検索キーワード一覧の取得
        const SearchKeyWordsSnapshot = await db.collection('SearchKeyWord')
        .where('uid', '==', user.uid)
        .get();

        const SearchKeyWordsCollection = SearchKeyWordsSnapshot.docs.map(x => {
          return {
            id: x.id,
            uid: x.data().uid,
            searchkeyword: x.data().searchkeyword
          };
        });

        console.log(SearchKeyWordsCollection);

        setSearchKeyWord(SearchKeyWordsCollection);

        console.log(_SearchKeyWord);
        console.log('useEffectが実行されました')

      } else {
        // User is signed out.
        window.location.href = "./Login" ;
      }
    });
    
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

  const AddKeyWord = () => {
    const _inputtext = inputText;
    setInputText("");
    //ログインユーザーの取得
    Firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log('Press EnterKey')
        // エンターキー押した時の処理
        // firebaseデータに登録
        db.collection("SearchKeyWord").add({
          uid: user.uid,
          searchkeyword: _inputtext,
          maxid:"0"
        })
        .then(function(docRef) {
          //登録が正常終了した時の処理
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
      } else {
        // User is signed out.
        // ...
        window.location.href = "./Login" ;
      }
    });
  }

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {

      const _inputtext = inputText;

      setInputText("");

      //ログインユーザーの取得
      Firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          console.log('Press EnterKey')
          // エンターキー押した時の処理
          // firebaseデータに登録
          db.collection("SearchKeyWord").add({
            uid: user.uid,
            searchkeyword: _inputtext,
            maxid:"0"
          })
          .then(function(docRef) {
            //登録が正常終了した時の処理
            console.log("Document written with ID: ", docRef.id);
          })
          .catch(function(error) {
            console.error("Error adding document: ", error);
          });
        } else {
          // User is signed out.
          // ...
          window.location.href = "./Login" ;
        }
      });
      
      //inputTextの初期化
    }
  };

  // メニュークリック
  const btnMenuClick = () => {
    window.location.href = "./MainMenu" ;
  };

  //#region InputWordの画面
  return (
    <>
    <head>
      <meta charset="utf-8" />
      <title>Firebase Auth for Twitter</title>
    </head>
    <body>
      <Paper>
        <div class="box">
          <h1>検索ワードの登録</h1>
          <div>
            <TextField id="standard-basic" label="SearchKeyword" value={inputText} onChange={handleChange} />
            <IconButton aria-label="Add" onClick={AddKeyWord}>
              <AddCircleIcon fontSize="large" style={{color:"blue" }}  />
            </IconButton>
            {/* <input type="text" value={inputText} onChange={handleChange} onKeyDown={handleKeyDown}/> */}
          </div>
          <Paper>    
            <div class="box" style={{marginBottom:"10px"}}>  
            <div>登録内容</div>
              <ul>
                {
                  _SearchKeyWord?.map((x, index) =>
                    <li key={index} id={x.id}>
                      <p>{x.searchkeyword}</p>
                    </li>
                  )
                }
              </ul>
            </div>
          </Paper>
          <div>
            <Button style={{width:"100%",marginBottom:"10px"}} id="mainmenu_button" variant="outlined" color="primary"  onClick={btnMenuClick}>
              Main Menu
            </Button>
            {/* <input type="button"  value="メニューに戻る" onClick={btnMenuClick} /> */}
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

export default InputWord;