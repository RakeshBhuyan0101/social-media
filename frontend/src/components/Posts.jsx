import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

function Posts() {
  const {posts} = useSelector(store => store.post)
  return (
    <div className='flex flex-col items-center justify-center border max-w-screen-md '>
        {posts.map( (post) => <Post key={post._id} post = {post} />)}
    </div>
  )
}

export default Posts