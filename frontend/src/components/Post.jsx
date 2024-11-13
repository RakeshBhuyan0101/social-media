import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import React, { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart } from "react-icons/fa";
import CommentDailog from "./CommentDailog";

function Post({post}) {
    const [text , setText] = useState("")
    const [open , setOpen] = useState(false)
    const onChangeHandeler = (e) =>  {
        const inputData = e.target.value 
        if (inputData.trim()) {
            setText(inputData)
        } else{
            setText("")
        }
    }
  return (
    <div className=" max-w-screen-sm ml-2 mt-5 pt-2">
      <div className="">
        <div className="flex items-center  justify-between">
          <div className="flex items-center gap-2 ">
            <Avatar className="w-9 h-9">
              <AvatarImage src= {post.author.profilePicture} alt="post_img" >
              </AvatarImage >
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1>{post.author.username}</h1>
          </div>
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <MoreHorizontal />
              </DialogTrigger>
              <DialogContent>
                <Button type="ghost"> unfollow </Button>
                <Button type="ghost"> unfollow </Button>
                <Button type="ghost"> unfollow </Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="mt-2">
          <img
            className="rounded-xl w-full my-2  object-cover aspect-auto "
            src={post.image}
          />
        </div>
        <div>
          <div className=" flex justify-between mt-8 ">
            <div className="flex gap-4 items-center  ">
                <Heart className="cursor-pointer hover:text-gray-600 "/>
                <MessageCircle onClick={() => setOpen(true)} className="cursor-pointer hover:text-gray-600 " />
                <Send className="cursor-pointer hover:text-gray-600 " />
            </div>
            <div> 
                <Bookmark className="cursor-pointer hover:text-gray-600 " />
            </div>
          </div>
        </div>
        <span className=" text-sm block mb-2 ">1k Likes</span>
        <p>
            <span>{post.author.username}</span> {post.caption}
            
        </p>

           <span  onClick={() => setOpen(true)} className="cursor-pointer text-gray-400" > view all 10 comments</span>
           <CommentDailog open={open} setOpen={setOpen} />
           <div className="flex justify-between  ">
                <input type="text"
                    value={text}
                    onChange={onChangeHandeler}
                    placeholder="add a comment" 
                    className="outline-none w-full text-sm "  
                />
                 {
                    text && <span className="text-[#3BADF8] cursor-pointer "> post</span>
                 }
                
           </div>
      </div>
    </div>
  );
}

export default Post;
