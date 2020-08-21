import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './Components/Login';
import MainMenu from './Components/MainMenu';
import InputWord from './Components/InputWord';
import TimeLineCheck from './Components/TimeLineCheck';
import axios from 'axios';

//#region App
const App = () => {
  //(テスト)カウント情報
  const [count, setCount] = useState(0);
  //ログイン情報の設定

  return (
    <Router>
      <Route path="/login">
        <Login count={count} setCount = {setCount} />
			</Route>
      <Route path="/mainmenu">
        <MainMenu  />
			</Route>
      <Route path="/inputword">
        <InputWord  />
			</Route>
      <Route path="/timelinecheck">
        <TimeLineCheck  />
			</Route>
    </Router>
  );
}
//#endregion

export default App;
