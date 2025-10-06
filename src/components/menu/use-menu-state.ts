"use client";
// useMenuState.ts
import { useState } from "react";

export function useMenuState() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [reportMenuOpen, setReportMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
    if (reportMenuOpen) setReportMenuOpen(false)
  }

  const toggleReportMenu = () => {
    setReportMenuOpen(!reportMenuOpen)
  }

  return {
    menuOpen,
    reportMenuOpen,
    toggleMenu,
    toggleReportMenu
  }
}