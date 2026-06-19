"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function AccountDisabled() {
  useEffect(() => {
    signOut({
      callbackUrl: "/login",
    });
  }, []);

  return <div className=" text-xl text-muted-foreground text-center">Account Disabled</div>;
}