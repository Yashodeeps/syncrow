"use client";
import { RootState } from "@/lib/store";
import React from "react";
import { useSelector } from "react-redux";

const page = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <div className="p-4 flex flex-col justify-center items-center">
      <h1 className="text-2xl font-semibold">{user.name}</h1>
      <p className="text-gray-500">Welcome to the dashboard</p>
    </div>
  );
};

export default page;
