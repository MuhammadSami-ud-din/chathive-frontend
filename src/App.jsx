import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginUser from './pages/login.jsx'
import RegisterUser from './pages/register.jsx'
import Dashboard from './pages/dashboard.jsx'
import DM from './Layouts/DM.jsx';
import DefaultView from './views/defaultView.jsx'
import DMFriends from './views/DMFriends.jsx'
import ChatArea from './views/chat.jsx'
import ServersListing from './views/server.jsx'
import ServerPage from './views/ServerPage.jsx'
import ChannelChat from './views/channelChat.jsx'
import AllServers from './views/AllServers.jsx'
import JoinedServers from './views/joinedServers.jsx'
import MyServers from './views/myservers.jsx'


function ProtectedRoute({ children }) {
  const token = localStorage.getItem('authToken');
  return token ? children : <Navigate to='/login' replace />

}



function App() {

  return (
    <BrowserRouter>
      <Routes>

        
        <Route path='/login' element={<LoginUser />} />
        <Route path='/register' element={<RegisterUser />} />


        <Route  element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } >
          <Route index element={<DefaultView />} />
          <Route path='/discovery/servers' element={<ServersListing />} >
          <Route index element={<AllServers />} />
          <Route path='joined' element={<JoinedServers />} />
          <Route path='created' element={<MyServers />} />
          </Route>
          <Route path='/channels/:server_id' element={<ServerPage />} >
          <Route path=':channel_id' element={<ChannelChat />} />
          </Route>
          


          <Route path='/@me' element={<DM />} >
            <Route index element={<DMFriends />} />
            <Route path=":id" element={<ChatArea />} />

          </Route>
          
        </Route>






      </Routes>
    </BrowserRouter>



  )


}

export default App
