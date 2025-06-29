import { lazy, useEffect, useState } from 'react'
import {Route, BrowserRouter as Router, Routes} from "react-router-dom"

import Home from './Page/Home/Home'
import {Toaster} from 'react-hot-toast'

import axios from 'axios'
import { useDispatch } from 'react-redux'
import { userExists, userNotExists } from './redux/reducers/auth'

import { SocketProvider } from './Socket'


// User
const ResetPassword=lazy(()=>import('./Page/ResetPassword'));
const Signup=lazy(()=>import('./Page/Signup'))
const Signin=lazy(()=>import('./Page/Signin'))
const Dashboard=lazy(()=>import('./Page/Daashyboard'))
const Projects=lazy(()=>import('./component/Layouts/Delete'))
const ProjectCard=lazy(()=>import('./component/Specific/ProjectCard'))
const TaskManagement=lazy(()=>import('./Page/TaskManagement'))
const TaskCard=lazy(()=>import('./component/Specific/TaskCard'))
const Communication=lazy(()=>import('./Page/Communication'))
const Chat=lazy(()=>import('./Page/Chat'))
// admin
const AdminDashboard=lazy(()=>import('./Page/Admin/AdminDashboard'));
const AdminProjects=lazy(()=> import('./Page/Admin/AdminProjects'));
const  AdminTaskCard=lazy(()=>import('./component/Specific/AdminTaskCard'));
const AdminProjectCard=lazy(()=>import('./component/Specific/AdminProjectCard'))
const AdminCommunication=lazy(()=>import('./Page/Admin/AdminCommunication'))
const PdfAnalytics=lazy(()=>import('./component/PdfReport/PdfAnalytics'));
const AdminChats=lazy(()=>import('./Page/Admin/AdminChats'));


function App() {

  const dispatch=useDispatch()
  useEffect(()=>{
    // console.log(server);
        axios.get("http://localhost:3000/me",{ withCredentials:true })
          .then(({data})=>dispatch(userExists(data.data)))
          .catch((err)=>dispatch(userNotExists()))
          console.log("use")
  },[])

  return (
    <Router>
      <Routes>
        <Route path='/resetPassword' element={<ResetPassword />} />
       
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/" element={<Home />} />
        
        
        <Route path='/pdf/:projectId' element={<PdfAnalytics />} />
        <Route element={<SocketProvider />} >
          <Route path="/Projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectCard />}  />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/pr' element={<ProjectCard />} />
          <Route path='/task' element={<TaskManagement />} />
          <Route path='task/:id' element={<TaskCard />} />
          <Route path='/communication' element={<Communication />}  />
          <Route path='/communication/chats/:id' element={<Chat />} />

          <Route path='/admin' element={<AdminDashboard />} />
          <Route path='/adminProjects' element={<AdminProjects />} />
          <Route path='/adminproject/:id' element={<AdminProjectCard />}  />
          <Route path='/admin/task/:id' element={<AdminTaskCard />} />
          <Route path='/admin/communication' element={<AdminCommunication />} />
          <Route path='/admin/communication/chats/:id' element={<AdminChats />} />          
          

        </Route>


      </Routes>
      <Toaster position='bottom-center' />
    </Router>
  )
}

export default App
