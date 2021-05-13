import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom"
import { io } from 'socket.io-client'
import { useEffect, useState } from 'react'

import './static/styles/main.css'
import './static/styles/header.css'
import './static/styles/footer.css'
import './static/styles/sign-in.css'
import './static/styles/home.css'
import './static/styles/post.css'
import './static/styles/post_detail.css'
import './static/styles/create.css'
import './static/styles/me.css'
import './static/styles/about.css'
import './static/styles/responsive.css'


import Home from './pages/home'
import Post from './pages/post'
import Post2 from './pages/me/post'
import SignIn from './pages/sign-in'
import SignUp from './pages/sign-up'
import Me from './pages/me'
import Detail from './pages/detail_post'
import Create from './pages/create'
import Crawl from './pages/create/crawl'
import Update from './pages/update'
import Search from './pages/search'
import Loading from './components/Loading'

import store from './redux/store'
import { Provider } from 'react-redux'


// const socket = io('https://manhbui-testdeploy-mblog.herokuapp.com')

function App() {

  return (
    <Provider store={store}>
      <Router>
        <div className='myblog'>
          <Loading />
          <div className='container'>
            <Switch>
              <Route path="/sign-in">
                <SignIn />
              </Route>
              <Route path="/sign-up">
                <SignUp />
              </Route>
              <Route path="/me">
                <Me />
              </Route>
              <Route axact path="/posts/update/:postId">
                <Update />
              </Route>
              <Route axact path="/posts/create">
                <Create />
              </Route>
              <Route path="/posts/me">
                <Post2 />
              </Route>
              <Route path="/posts/:title">
                <Detail />
              </Route>
              <Route axact path="/posts">
                <Post />
              </Route>
              <Route axact path="/crawl">
                <Crawl/>
              </Route>
              <Route axact path="/search">
                <Search />
              </Route>
              <Route exact path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    </Provider>
  )
}

export default App
