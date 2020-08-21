import React, { useState } from 'react';
import Firebase from '../Firebase';
import axios from 'axios';
var db = Firebase.firestore();

const TimeLineCheck = (props) => {

  const [TweetCollections, setTweetCollections] = useState(null);

  const getTweetFromFirestore = async (uid,q,twitteruser) => {
    //const requestUrl = 'https://us-central1-twitterevidence-e3116.cloudfunctions.net/api/gettweet/uid/'+ uid +'/q/' + q + '/u/'+twitteruser;
    const requestUrl = 'http://localhost:5000/twitterevidence-e3116/us-central1/api/gettweet/uid/'+ uid +'/q/' + q + '/u/'+twitteruser;
    const result = await axios.get(requestUrl);
    console.log(result.data);
    setTweetCollections(result.data);

    //console.log(TweetCollections);
    // setTodoList(todoArray.data);
    // return todoArray.data;
  }

  const SearchTwitterTimeLine = () =>{
    //Firebaseイベント
    Firebase.auth().onAuthStateChanged(async (user) => {
      
      if(user) {
        //検索キーワード一覧の取得
        const SearchKeyWordsSnapshot = await db.collection('SearchKeyWord')
        .where('uid', '==', user.uid)
        .get();

        //Twitterユーザー名の取得
        const UsersSnapshot = await db.collection('Users')
            .where('uid', '==', user.uid)
            .get();

        const TwitterName = UsersSnapshot.docs[0].data().twittername;
        console.log(TwitterName);
        //検索キーワードの内容をループして処理する。
        SearchKeyWordsSnapshot.docs.map(async x => {
          console.log(x.data().searchkeyword)
          await getTweetFromFirestore(user.uid,x.data().searchkeyword,'@'+TwitterName);
          //const data =await getTweetFromFirestore(user.uid,x.data(),twitteruser);
        });

        //const q = 'w';
        //const twitteruser = '@takabu152';
        //const data = getTweetFromFirestore(user.uid,q,twitteruser);
        
        
        //Twitterの情報を検索して、Firebaseの内容を取得するAPIを実行

        // h1.innerText   = 'Login Complete!';
        // info.innerHTML = `${user.displayName}さんがログインしました<br>` + `(${user.uid})`;
        //Twitterのアクセストークンの設定
        // twitter_token = localStorage.getItem('twitter_token');
        // twitter_secret = localStorage.getItem('twitter_secret');

        //firebaseの登録結果を取得して表示させる
        
      }
      else {
        window.location.href = "./Login" ;
      }
    });
  }

  //#region InputWordの画面
  return (
    <>
    <head>
      <meta charset="utf-8" />
      <title>Firebase Auth for Twitter</title>
    </head>
    <body>
      <input type="button" value="Twitterデータを取得し、表示する" onClick={SearchTwitterTimeLine}/>
      <ul>
        {
          TweetCollections?.map((x, index) =>
            <li key={index} id={x.id}>
              <img src={x.profileimageurl} alt=""/>
              <p>名前：{x.username}</p>
              <p>UID:{x.uid}</p>
              <p>スクリーンネーム：{x.userscreenname}</p>
              <p>内容：{x.text}</p>
            </li>
          )
        }
      </ul>
      <script src="https://www.gstatic.com/firebasejs/5.8.1/firebase-app.js"></script>
      <script src="https://www.gstatic.com/firebasejs/5.8.1/firebase-auth.js"></script>
      <script src="https://www.gstatic.com/firebasejs/ui/3.5.2/firebase-ui-auth__ja.js"></script>
    </body>
    </>
    )
};

export default TimeLineCheck;
