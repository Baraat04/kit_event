"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Eye, EyeOff, Loader2, LogIn } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { useToast } from "@/hooks/use-toast"

interface LoginFormProps {
  onSuccess: (user: any) => void
  onBack: () => void
}

export default function LoginForm({ onSuccess, onBack }: LoginFormProps) {
  const { translations } = useLanguage()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const loginInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Автофокус на поле логина
    if (loginInputRef.current) {
      loginInputRef.current.focus()
    }
  }, [])

  const getParticipantColor = (number: number) => {
    if (number <= 20) return "bg-green-100 border-green-500"
    if (number <= 40) return "bg-yellow-100 border-yellow-500"
    if (number <= 60) return "bg-orange-100 border-orange-500"
    return "bg-blue-100 border-blue-500"
  }

  const getParticipantColorText = (number: number) => {
    if (number <= 20) return "text-green-800"
    if (number <= 40) return "text-yellow-800"
    if (number <= 60) return "text-orange-800"
    return "text-blue-800"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Создаем объект пользователя для отображения
      const user = {
        participantNumber: data.participant.participant_number,
        lastName: data.participant.last_name,
        firstName: data.participant.first_name,
        middleName: data.participant.middle_name,
        region: data.participant.region,
        position: data.participant.position,
        login: data.participant.login,
        password: data.participant.password,
        color: getParticipantColor(data.participant.participant_number),
        colorText: getParticipantColorText(data.participant.participant_number),
      }

      toast({
        title: translations.loginSuccess || "Login Successful",
        description: translations.welcomeBack || "Welcome back!",
      })

      onSuccess(user)
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: translations.loginError || "Login Error",
        description: error instanceof Error ? error.message : "Invalid login credentials",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="text-xl flex items-center gap-2">
              <LogIn className="w-5 h-5" />
              {translations.login || "Login"}
            </CardTitle>
          </div>
          <p className="text-sm text-gray-600">
            {translations.loginDescription || "Enter your credentials to access the event"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="login">{translations.login || "Login"}</Label>
              <Input
                ref={loginInputRef}
                id="login"
                type="text"
                value={formData.login}
                onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                placeholder="user001"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <Label htmlFor="password">{translations.password || "Password"}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {translations.loggingIn || "Logging in..."}
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  {translations.loginButton || "Login"}
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {translations.noAccount || "Don't have an account?"}{" "}
              <Button variant="link" className="p-0 h-auto font-normal" onClick={onBack}>
                {translations.registerHere || "Register here"}
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
