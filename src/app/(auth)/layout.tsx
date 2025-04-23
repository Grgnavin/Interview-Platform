import React from 'react'
import { isAuthenticated } from '../actions/auth';
import { redirect } from 'next/navigation';

const Authlayout =async ({ children } : { children: React.ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  
    if (isUserAuthenticated) redirect('/');
  return (
    <div className='auth-layout'>
        {children}
    </div>
  )
}

export default Authlayout;