"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/hooks/use-language"
import { ArrowLeft, Volume2, VolumeX, Loader2, LogIn, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClientSupabaseClient } from "@/lib/supabase"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Participant {
  participant_number: number
  last_name: string
  first_name: string
  middle_name: string | null
  region: string
  position: string
  login: string
  color_group: string
  password?: string | null
}

interface RegistrationFormProps {
  onSuccess: (user: any) => void
  onBack: () => void
  onLoginClick: () => void
}

export default function RegistrationForm({ onSuccess, onBack, onLoginClick }: RegistrationFormProps) {
  const { translations, language } = useLanguage()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    region: "",
    position: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registeredUser, setRegisteredUser] = useState<any>(null)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [audioError, setAudioError] = useState(false)
  const [registrationError, setRegistrationError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<Participant[]>([])
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const lastNameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (lastNameInputRef.current) {
      lastNameInputRef.current.focus()
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!formData.lastName || formData.lastName.length < 2) {
        setSuggestions([])
        setIsPopoverOpen(false)
        setFormData({
          lastName: formData.lastName,
          firstName: "",
          middleName: "",
          region: "",
          position: "",
        })
        return
      }

      try {
        const supabase = createClientSupabaseClient()
        const { data, error } = await supabase
          .from("participants")
          .select("participant_number, last_name, first_name, middle_name, region, position, login, color_group, password")
          .ilike("last_name", `%${formData.lastName}%`)
          .limit(5)

        if (error) {
          console.error("Supabase error:", error)
          throw new Error("Failed to fetch suggestions")
        }

        setSuggestions(data || [])
        setIsPopoverOpen(data?.length > 0 && formData.lastName.length >= 2)
      } catch (error) {
        console.error("Error fetching suggestions:", error)
        setSuggestions([])
        setIsPopoverOpen(formData.lastName.length >= 2)
        toast({
          title: translations.error || "Error",
          description: translations.suggestionError || "Failed to fetch participant suggestions",
          variant: "destructive",
        })
      }
    }

    const debounce = setTimeout(fetchSuggestions, 500)
    return () => clearTimeout(debounce)
  }, [formData.lastName, translations, toast])

  const playRegistrationSound = async () => {
    if (!audioRef.current) return

    try {
      setAudioError(false)
      setAudioPlaying(true)
      audioRef.current.src = `/audio/registration-${language}.mp3`
      audioRef.current.currentTime = 0
      await audioRef.current.play()
    } catch (error) {
      console.warn("Audio playback failed:", error)
      setAudioError(true)
      setAudioPlaying(false)
    }
  }

  const handleAudioEnded = () => {
    setAudioPlaying(false)
  }

  const handleAudioError = () => {
    setAudioError(true)
    setAudioPlaying(false)
  }

  const getParticipantColor = (colorGroup: string) => {
    switch (colorGroup?.toLowerCase()) {
      case "green":
        return "bg-green-100 border-green-500"
      case "yellow":
        return "bg-yellow-100 border-yellow-500"
      case "orange":
        return "bg-orange-100 border-orange-500"
      case "blue":
        return "bg-blue-100 border-blue-500"
      case "white":
        return "bg-gray-100 border-gray-500"
      default:
        return "bg-gray-100 border-gray-500"
    }
  }

  const getParticipantColorText = (colorGroup: string) => {
    switch (colorGroup?.toLowerCase()) {
      case "green":
        return "text-green-800"
      case "yellow":
        return "text-yellow-800"
      case "orange":
        return "text-orange-800"
      case "blue":
        return "text-blue-800"
      case "white":
        return "text-gray-800"
      default:
        return "text-gray-800"
    }
  }

  const handleSelectSuggestion = (participant: Participant) => {
    setFormData({
      lastName: participant.last_name,
      firstName: participant.first_name,
      middleName: participant.middle_name || "",
      region: participant.region,
      position: participant.position,
    })
    setSuggestions([])
    setIsPopoverOpen(false)
  }

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, lastName: e.target.value })
  }

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault()
  setIsSubmitting(true)
  setRegistrationError(null)

  try {
    const supabase = createClientSupabaseClient()
    const { data: participant, error } = await supabase
      .from("participants")
      .select("*")
      .eq("last_name", formData.lastName)
      .eq("first_name", formData.firstName)
      .eq("middle_name", formData.middleName || null)
      .eq("region", formData.region)
      .eq("position", formData.position)
      .single()

    if (error || !participant) {
      throw new Error(translations.noMatchingParticipants || "Participant not found")
    }

    const user = {
      participantNumber: participant.participant_number,
      lastName: participant.last_name,
      firstName: participant.first_name,
      middleName: participant.middle_name,
      region: participant.region,
      position: participant.position,
      login: participant.login,
      password: participant.password,
      color_group: participant.color_group,
      color: getParticipantColor(participant.color_group),
      colorText: getParticipantColorText(participant.color_group),
    }

    // Сохраняем пользователя в localStorage
    localStorage.setItem('currentUser', JSON.stringify(user))

    await playRegistrationSound()
    setRegisteredUser(user)
    onSuccess(user)
    
  } catch (error) {
    console.error("Login error:", error);
    setRegistrationError(error instanceof Error ? error.message : "An unknown error occurred");
    toast({
      title: translations.loginError || "Login Error",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};

  if (registeredUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className={`w-full max-w-md ${registeredUser.color} border-2`}>
          <CardHeader className="text-center">
            <CardTitle className={`text-2xl ${registeredUser.colorText}`}>
              #{registeredUser.participantNumber} {registeredUser.lastName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className={`font-semibold ${registeredUser.colorText}`}>{translations.loginSuccess}</p>
              <div className="bg-white/50 p-4 rounded-lg">
                <p>
                  <strong>{translations.password}:</strong> {registeredUser.password || "Not set"}
                </p>
              </div>
              <p className="text-sm text-gray-600">
                {translations.saveCredentials || "Save these credentials for future login"}
              </p>
            </div>
            <Button onClick={() => onSuccess(registeredUser)} className="w-full">
              {translations.continue}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <audio ref={audioRef} preload="none" onEnded={handleAudioEnded} onError={handleAudioError} />

      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <CardTitle className="text-xl">{translations.login}</CardTitle>
              {audioPlaying ? (
                <Volume2 className="w-5 h-5 text-blue-600 animate-pulse" />
              ) : audioError ? (
                <VolumeX className="w-5 h-5 text-red-500" />
              ) : (
                <Volume2 className="w-5 h-5 text-blue-600" />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {registrationError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{registrationError}</AlertDescription>
            </Alert>
          )}

        <form onSubmit={handleSubmit} className="space-y-4">
<div>
  <Label htmlFor="lastName">{translations.lastName}</Label>
  <div className="relative">
    <Input
      ref={lastNameInputRef}
      id="lastName"
      value={formData.lastName}
      onChange={handleLastNameChange}
      required
      placeholder={translations.lastNamePlaceholder || "Введите фамилию"}
      autoComplete="off"
    />
    {isPopoverOpen && suggestions.length > 0 && (
      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
        <ul className="py-1">
          {suggestions.map((participant) => (
            <li
              key={participant.participant_number}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectSuggestion(participant)}
            >
              {participant.last_name} {participant.first_name} {participant.middle_name || ""}
              <span className="block text-sm text-gray-500">{participant.region}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
</div>

  <div>
    <Label htmlFor="firstName">{translations.firstName}</Label>
    <Input
      id="firstName"
      value={formData.firstName}
      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
      required
      placeholder={translations.firstNamePlaceholder || "Введите имя"}
    />
  </div>

  <div>
    <Label htmlFor="middleName">{translations.middleName}</Label>
    <Input
      id="middleName"
      value={formData.middleName}
      onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
      placeholder={translations.middleNamePlaceholder || "Введите отчество"}
    />
  </div>

  <div>
    <Label htmlFor="region">{translations.region}</Label>
    <Input
      id="region"
      value={formData.region}
      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
      required
      placeholder={translations.regionPlaceholder || "Введите регион"}
    />
  </div>

  <div>
    <Label htmlFor="position">{translations.position}</Label>
    <Input
      id="position"
      value={formData.position}
      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
      required
      placeholder={translations.positionPlaceholder || "Введите должность"}
    />
  </div>

  <Button type="submit" className="w-full" disabled={isSubmitting}>
    {isSubmitting ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {translations.loggingIn}
      </>
    ) : (
      translations.loginButton
    )}
  </Button>
</form>
        </CardContent>
      </Card>
    </div>
  )
}