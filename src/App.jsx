import './App.css'
import {BrowserRouter , Routes , Route , Navigate} from 'react-router-dom'
import LoginUser from './pages/login.jsx'
import RegisterUser from './pages/register.jsx'
import Dashboard from './pages/dashboard.jsx'
import DM from './Layouts/DM.jsx';
import DefaultView  from './views/defaultView.jsx'


function ProtectedRoute({children}){
  const token = localStorage.getItem('authToken');
  return token? children : <Navigate to='/login' replace />

}



function App() {
  
return(
<BrowserRouter>
<Routes>

<Route path = '/'      element = {<Navigate to = '/login' replace />} />
<Route path = '/login'    element= {<LoginUser />} />
<Route path = '/register'    element= {<RegisterUser />} />


<Route path= '/dashboard' element = {
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} >
  <Route index element={<DefaultView />} />
   <Route path = '@me' element={<DM />} >
   </Route>
</Route>






</Routes>
</BrowserRouter>



)










  

  
}

export default App
