"use client";

import { UserButton } from "@clerk/nextjs";
import { CookieIcon, RefrigeratorIcon } from "lucide-react";
import React from "react";

const UserDropdown = () => {
  return (
    <UserButton>
      <UserButton.MenuItems>
        <UserButton.Link
          href="/recipes"
          label="My Recipes"
          labelIcon={<CookieIcon size={16} />}
        />

        <UserButton.Link
          href="/recipes"
          label="My Pantry"
          labelIcon={<RefrigeratorIcon size={16} />}
        />
        <UserButton.Action label="manageAccount"/>
      </UserButton.MenuItems>
    </UserButton>
  );
};

export default UserDropdown;
