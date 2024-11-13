import React from "react";
import Posts from "./Posts";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightSidebar from "./RightSidebar";
import useGetAllPost from "@/hooks/UseGetAllPost";

function Home() {
  useGetAllPost()
  return (
    <div className="flex">
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  );
}

export default Home;
