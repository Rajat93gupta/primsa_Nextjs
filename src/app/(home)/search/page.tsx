import SearchPage from '@/components/Home/Search/SearchPage'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading search...</div>}>
      
        <SearchPage/>
      </Suspense>
      
    </div>
  )
}

export default page