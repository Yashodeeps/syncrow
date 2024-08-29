"use client";

import { RootState } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";
import { useSelector } from "react-redux";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  console.log(user);
  if (user.id === null) {
    router.push("/auth");
  }

  return <div>{children}</div>;
};

export default AuthLayout;
