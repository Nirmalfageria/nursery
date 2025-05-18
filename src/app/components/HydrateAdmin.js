// when the page get refereshed the redux store is reset so to avoid that we are using cookies to store the isAdmin value and rehydrate the redux store on every refresh
"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { setAdmin } from '../../redux/store/adminSlice';

export default function HydrateAdmin() {
  const dispatch = useDispatch();

  useEffect(() => {
    const isAdminCookie = Cookies.get("isAdmin");
    if (isAdminCookie) {
      dispatch(setAdmin(isAdminCookie === "true"));
    }
  }, [dispatch]);

  return null; // No UI
}
