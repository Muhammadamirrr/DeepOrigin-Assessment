import React from 'react'
import { Route, Routes } from 'react-router-dom'
import TaskManager from './componenet/TaskManager'
import ExecutedTaskList from './componenet/ExecutedTaskList'
import Navbar from './componenet/NavBar'

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<TaskManager />} />
        <Route path='/ExecutedTaskList' element={<ExecutedTaskList />} />
      </Routes>
    </>
  )
}

export default App
