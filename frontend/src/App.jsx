import Signup from './components/signup'
import Login from './components/Login'
import MainLayout from './components/MainLayout'
import Home from './components/Home'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Profile from './components/Profile'

const browserRouter = createBrowserRouter([
  {
    path : '/',
    element : <MainLayout/>,

    children : [
      {
        path : "/",
        element : <Home/>
      },
      {
        path : "/profile",
        element : <Profile/>
      }
    ]
  },
  {
    path : "/login" ,
    element : <Login/>
  },
  {
    path : "/signup",
    element : <Signup/>
  },

])
function App() {

  return (
      <>
      <RouterProvider router={browserRouter} /> 
      </>

  )
}

export default App
