"use client";

import React, { useEffect, useState } from "react";
import { HoveredLink, Menu, MenuItem } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

function Navbar({ className }) {
  const router = useRouter();
  const { isAuthenticated, logout, checkAuthStatus } = useAuthStore();
  const [active, setActive] = useState(null); // Added state for active menu item

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      router.push("/");
    }
  };

  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        {" "}
        {/* Pass setActive properly */}
        <Link href={"/"}>
          <MenuItem item="Home" setActive={setActive} active={active} />
        </Link>
        <Link href={"/profile"}>
          <MenuItem item="Profile" setActive={setActive} active={active} />
        </Link>
        <MenuItem item="BuildCareer" setActive={setActive} active={active}>
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/resume">Resume Classifier</HoveredLink>
            <HoveredLink href="/interview">Interview Preparation</HoveredLink>
            <HoveredLink href="/courses">Course Recommendation</HoveredLink>
            <HoveredLink href="/jobs">Jobs and Opportunities</HoveredLink>
            <HoveredLink href="/mentor">AI Mentor</HoveredLink>
          </div>
        </MenuItem>
        {isAuthenticated ? (
          <button
            className="text-black dark:text-white hover:text-red-500 transition-colors"
            onClick={handleLogout}
          >
            LogOut
          </button>
        ) : (
          <Link href={"/signup"}>
            <MenuItem item="SignUp" setActive={setActive} active={active} />
          </Link>
        )}
      </Menu>
    </div>
  );
}

export default Navbar;
