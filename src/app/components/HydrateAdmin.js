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
