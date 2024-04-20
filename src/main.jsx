import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from 'routes/Layout.jsx'
import Forum from 'routes/Forum.jsx'
import PostDetails from './site-components/PostDetails.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}/>
          <Route index={true} path="/" element={<App/>}>
          <Route index={false} path="/forum" element={<Forum/>}/>
          <Route index={false} path="/postDetails/:postid" element={<PostDetails/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
