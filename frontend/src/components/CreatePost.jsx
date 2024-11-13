import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback } from './ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

function CreatePost({open , setOpen}) {

  const imgRef = useRef();
  const [file , setFile] = useState("")
  const [caption , setCaption] = useState("")
  const [imagePreview , setImagePreview] = useState("")
  const [loading , setLoading] = useState(false)


  const fileChangeHandeler = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
    }
    const dataUrl = await readFileAsDataURL(file)
    setImagePreview(dataUrl)
  }

  const createPostHandeler = async (e) => {
    const formData = new FormData()
    formData.append('caption' , caption);
    if (imagePreview) formData.append('image' , file)

    try {
      setLoading(true)
      const res = await axios.post("http://localhost:3000/api/v1/post/addpost" , formData , {
        headers : {
          "Content-Type" : 'multipart/form-data'
        },
        withCredentials : true
      } );

      if (res.data.success) {
        toast.success(res.data.message)
      }
    } catch (error) {
      toast.error(error.response.data.message)
      console.log(error);
    } finally{
      setLoading(false)
    }
  }

  return (
    <Dialog open = {open}>
      <DialogContent onInteractOutside = {() => setOpen(false)} >
        <DialogHeader className="font-semibold text-center" >Create new post </DialogHeader>
        <div className='flex gap-3 items-center '>
          <Avatar>
            <AvatarImage src="" alt='IMG'/> 
            <AvatarFallback>RB</AvatarFallback>
          </Avatar>
          <div>
            <h1 className='font-semibold text-xs ' >username</h1>
            <span className='text-gray-600 text-xs'> Bio her...</span>
          </div>
        </div>
        <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="focus-visible:ring-transparent border-none" placeholder="write caption" />
        {
          imagePreview && (
            <div className='w-full h-64 flex items-center justify-center ' >
              <img src={imagePreview} alt="" className='object-cover rounded-md h-full w-full' />
            </div>
          )
        }
        <input ref={imgRef} type="file" className='hidden ' onChange={fileChangeHandeler} />
        <Button onClick={() => imgRef.current.click() } className="w-fit mx-auto bg-[#0095F6] hover:bg-[#3481b4] ">Select from device</Button>
        {
          imagePreview && (
            loading ? (
              <Button>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please wait
              </Button>
            ) : (
              <Button onClick={createPostHandeler} type='submit'  > Post </Button>
            )

          )
        }
      </DialogContent>  
    </Dialog>
  )
}

export default CreatePost