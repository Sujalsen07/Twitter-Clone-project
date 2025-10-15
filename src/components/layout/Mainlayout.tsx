"use client"
import { useAuth } from '@/context/AuthContext'
import React, { useState } from 'react'
import LoadingSpinner from '../loading-spinner'
// import your Sidebar component instead of the icon
// If your file is named 'sidebar.tsx' (lowercase), use:
import Sidebar from './Sidebar'
// Or, if the file is in a different folder or has a different name, update the path accordingly.

const Mainlayout = ({children}:any) => {
    const {user,isloading}=useAuth()
    const [currentPage,setCurrentPage]=useState('Home')
    if(isloading){
        return(
            <div className='flex justify-center items-center min-h-screen bg-black'>
                <div className='text-center'>
                    <div className='text-white text-4xl font-bold mb-4'></div>
                    <LoadingSpinner />

                </div>


            </div>
        )
    }
    if(!user){
        return <>{children}</>
    }
  return (
    <div>
      <div className='min-h-screen bg-black text-white flex'>
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className='flex-1 border-x border-gray-800 max-w-2xl'>
            {children}
        </main>
      </div>
    </div>
  )
}

export default Mainlayout
