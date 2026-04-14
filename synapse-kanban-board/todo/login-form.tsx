"use client"
import { useState } from "react"
import { login, register } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Lock, User, Mail, ArrowRight, Loader2, Zap } from "lucide-react"

export function LoginForm() {
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      if (isRegister) {
        await register(username, password, email)
        alert("Аккаунт создан! Теперь войдите.")
        setIsRegister(false)
      } else {
        await login(username, password)
        window.location.href = "/"
      }
    } catch (err: any) {
      setError(isRegister ? "Ошибка при регистрации" : "Неверный логин или пароль")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] w-screen h-screen flex items-center justify-center bg-[#020617] p-4 overflow-y-auto">
      
   
      <div className="absolute w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div 
        className="relative z-10 w-full mx-auto" 
        style={{ maxWidth: '400px' }} 
      >
        <Card className="border-white/10 bg-slate-900/60 backdrop-blur-2xl shadow-2xl rounded-2xl overflow-hidden border">
          <CardHeader className="text-center pt-8">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 shadow-xl shadow-primary/30 rotate-3 group hover:rotate-0 transition-transform duration-300">
              <Zap className="h-8 w-8 text-white fill-white animate-pulse" />
            </div>
            
            <CardTitle className="text-3xl font-black text-white tracking-tighter italic">
              SYNAPSE
            </CardTitle>
            <CardDescription className="text-slate-400 mt-1">
              {isRegister ? "Создайте новый аккаунт" : "Введите данные для доступа"}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 px-7">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] text-center">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                  <Input 
                    placeholder="Логин" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="pl-10 bg-slate-950/50 border-white/5 text-white h-11 focus:border-primary/50 transition-all" 
                  />
                </div>
              </div>

              {isRegister && (
                <div className="space-y-2">
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                    <Input 
                      type="email"
                      placeholder="Email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 bg-slate-950/50 border-white/5 text-white h-11 focus:border-primary/50 transition-all" 
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                  <Input 
                    type="password"
                    placeholder="Пароль" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 bg-slate-950/50 border-white/5 text-white h-11 focus:border-primary/50 transition-all" 
                    autoComplete="current-password"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 px-7 pb-8 pt-4">
              <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all font-bold text-white" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                  <span className="flex items-center">
                    {isRegister ? "СОЗДАТЬ АККАУНТ" : "ВОЙТИ В СИСТЕМУ"} <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>

              <button 
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-xs text-slate-500 hover:text-primary transition-colors font-medium uppercase tracking-wider"
              >
                {isRegister ? "← Назад ко входу" : "Нет аккаунта? Зарегистрироваться"}
              </button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}