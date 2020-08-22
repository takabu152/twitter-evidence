import React, { useState } from 'react';

import { Paper } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAlt';

import Firebase from '../Firebase';
import axios from 'axios';
var db = Firebase.firestore();

const TimeLineCheck = (props) => {

  const [TweetCollections, setTweetCollections] = useState(null);

  // API 呼び出し
  const getTweetFromFirestore = async (uid,q,twitteruser,maxid) => {
    const requestUrl = 'https://us-central1-twitterevidence-e3116.cloudfunctions.net/api/gettweet/uid/'+ uid +'/q/' + q + '/u/'+twitteruser+'/maxid/'+maxid;
    //const requestUrl = 'http://localhost:5000/twitterevidence-e3116/us-central1/api/gettweet/uid/'+ uid +'/q/' + q + '/u/'+twitteruser+'/maxid/'+maxid;
    const result = await axios.get(requestUrl);
    console.log(result);
    setTweetCollections(result.data);

    //console.log(TweetCollections);
    // setTodoList(todoArray.data);
    // return todoArray.data;
  }

  //TweetDataダウンロード
  const DownloadTweetData = () => {

    Firebase.auth().onAuthStateChanged(async (user) => {
      
      if(user) {
        const requestUrl = 'https://us-central1-twitterevidence-e3116.cloudfunctions.net/api/csvdownload/uid/'+ user.uid ;
        //const requestUrl = 'http://localhost:5000/twitterevidence-e3116/us-central1/api/csvdownload/uid/'+ user.uid ;
        const result = await axios.get(requestUrl);
        console.log(result.data);
            // UTF BOM
        var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
        // リンククリエイト
        var downloadLink = document.createElement("a");
        downloadLink.download =  "twweetdata.csv";
        // ファイル情報設定
        downloadLink.href = URL.createObjectURL(new Blob([bom, result.data], { type: "text/csv" }));
        downloadLink.dataset.downloadurl = ["text/csv", downloadLink.download, downloadLink.href].join(":");
        // イベント実行
        downloadLink.click();
      }
      else {
        window.location.href = "./Login" ;
      }
    });

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
        //console.log(TwitterName);
        //検索キーワードの内容をループして処理する。
        
        SearchKeyWordsSnapshot.docs.map(async x => {
          console.log(x.data().searchkeyword)
          await getTweetFromFirestore(user.uid,x.data().searchkeyword,'@'+TwitterName,x.data().maxid);
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
        <h1>TimeLine収集</h1>
        <div>
        <Button
            variant="outlined"
            color="primary"
            startIcon={<SentimentSatisfiedAltIcon />}
            onClick={SearchTwitterTimeLine}
            style={{width:"80%",marginBottom:"10px"}}
          >
            データ収集
          </Button>
          {/* <input type="button" value="Twitterデータを取得し、表示する" onClick={SearchTwitterTimeLine}/> */}
        </div>
        <div>登録内容</div>
        <ul>
          {
            TweetCollections?.map((x, index) =>
              <div>
                <Card style={{marginBottom:"10px"}}>
                  <CardContent>
                    <img src={x.profileimageurl} alt=""/>
                    <p>名前：{x.username}</p>
                    <p>UID:{x.uid}</p>
                    <p>スクリーンネーム：{x.userscreenname}</p>
                    <p>内容：{x.text}</p>
                  </CardContent>
                </Card>
                
                {/* <li key={index} id={x.id}>
                  <img src={x.profileimageurl} alt=""/>
                  <p>名前：{x.username}</p>
                  <p>UID:{x.uid}</p>
                  <p>スクリーンネーム：{x.userscreenname}</p>
                  <p>内容：{x.text}</p>
                </li> */}
              </div>
            )
          }
        </ul>
        <div>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<CloudDownloadIcon />}
            onClick={DownloadTweetData}
            style={{width:"80%",marginBottom:"10px"}}
          >
            Download
          </Button>
            {/* <input id="download" type="button" value="ダウンロード" download="tweetdata.csv" onClick={DownloadTweetData}/> */}
        </div>
        
        <div>
          <Button style={{width:"80%",marginBottom:"10px"}}  variant="outlined" color="primary"  onClick={btnMenuClick}>
            Main Menu
          </Button>
          {/* <input type="button" value="メニューに戻る" onClick={btnMenuClick}/> */}
        </div>
      </div>
    </Paper>
      
      



      <script src="https://www.gstatic.com/firebasejs/5.8.1/firebase-app.js"></script>
      <script src="https://www.gstatic.com/firebasejs/5.8.1/firebase-auth.js"></script>
      <script src="https://www.gstatic.com/firebasejs/ui/3.5.2/firebase-ui-auth__ja.js"></script>
    </body>
    </>
    )
};

export default TimeLineCheck;
