"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Volume2, VolumeX } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

interface LanguageModalProps {
  onLanguageSelected: () => void
}

export default function LanguageModal({ onLanguageSelected }: LanguageModalProps) {
  const { setLanguage } = useLanguage()
  const [selectedLang, setSelectedLang] = useState<"en" | "ru" | "kz" | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioError, setAudioError] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const languages = [
    { code: "en" as const, name: "English", flag: "🇺🇸" },
    { code: "ru" as const, name: "Русский", flag: "🇷🇺" },
    { code: "kz" as const, name: "Қазақша", flag: "🇰🇿" },
  ]

  const playAudio = async (langCode: "en" | "ru" | "kz") => {
    if (!audioRef.current) return

    try {
      setAudioError(false)
      setIsPlaying(true)

      // Set the audio source based on selected language
      audioRef.current.src = `/audio/welcome-${langCode}.mp3`
      audioRef.current.currentTime = 0

      await audioRef.current.play()
    } catch (error) {
      console.warn("Audio playback failed:", error)
      setAudioError(true)
      setIsPlaying(false)
    }
  }

  const handleLanguageSelect = async (langCode: "en" | "ru" | "kz") => {
    setSelectedLang(langCode)
    setLanguage(langCode)
    await playAudio(langCode)
  }

  const handleContinue = () => {
    if (selectedLang) {
      onLanguageSelected()
    }
  }

  const handleAudioEnded = () => {
    setIsPlaying(false)
  }

  const handleAudioError = () => {
    setAudioError(true)
    setIsPlaying(false)
  }

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            {selectedLang === "en" && "Select Language"}
            {selectedLang === "ru" && "Выберите язык"}
            {selectedLang === "kz" && "Тілді таңдаңыз"}
            {!selectedLang && "Select Language / Выберите язык / Тілді таңдаңыз"}
          </CardTitle>
          <p className="text-gray-600">
            {selectedLang === "en" && "Choose your preferred language to continue"}
            {selectedLang === "ru" && "Выберите предпочитаемый язык для продолжения"}
            {selectedLang === "kz" && "Жалғастыру үшін қалаған тіліңізді таңдаңыз"}
            {!selectedLang && "Choose your preferred language to continue"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <audio ref={audioRef} onEnded={handleAudioEnded} onError={handleAudioError} preload="none" />

          <div className="space-y-3">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={selectedLang === lang.code ? "default" : "outline"}
                className={`w-full justify-start text-left h-auto p-4 ${
                  selectedLang === lang.code ? "bg-blue-600 hover:bg-blue-700 text-white" : "hover:bg-gray-50"
                }`}
                onClick={() => handleLanguageSelect(lang.code)}
              >
                <div className="flex items-center gap-3 w-full">
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-medium text-lg">{lang.name}</span>
                  {selectedLang === lang.code && (
                    <div className="ml-auto flex items-center gap-2">
                      {isPlaying ? (
                        <Volume2 className="w-5 h-5 animate-pulse" />
                      ) : audioError ? (
                        <VolumeX className="w-5 h-5 text-red-500" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </div>
                  )}
                </div>
              </Button>
            ))}
          </div>

          {selectedLang && (
            <div className="pt-4 border-t">
              <Button onClick={handleContinue} className="w-full bg-green-600 hover:bg-green-700" size="lg">
                {selectedLang === "en" && "Continue"}
                {selectedLang === "ru" && "Продолжить"}
                {selectedLang === "kz" && "Жалғастыру"}
              </Button>
            </div>
          )}

          {audioError && (
            <div className="text-center text-sm text-red-600">
              {selectedLang === "en" && "Audio playback not available"}
              {selectedLang === "ru" && "Воспроизведение аудио недоступно"}
              {selectedLang === "kz" && "Аудио ойнату қол жетімді емес"}
              {!selectedLang && "Audio playback not available"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
