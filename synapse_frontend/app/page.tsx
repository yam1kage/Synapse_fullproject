"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/todo/login-form"
import { Dashboard } from "@/todo/dashboard"
import { isAuthenticated } from "@/lib/api"

export default function Page() {
  const [auth, setAuth] = useState<boolean | null>(null)

  useEffect(() => {

    setAuth(isAuthenticated())
  }, [])

  if (auth === null) return null 

  if (!auth) {
   
    return <LoginForm />
  }

  return <Dashboard />
}