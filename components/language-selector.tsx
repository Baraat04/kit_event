"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex gap-2">
      <Button variant={language === "en" ? "default" : "outline"} size="sm" onClick={() => setLanguage("en")}>
        English
      </Button>
      <Button variant={language === "ru" ? "default" : "outline"} size="sm" onClick={() => setLanguage("ru")}>
        Русский
      </Button>
      <Button variant={language === "kz" ? "default" : "outline"} size="sm" onClick={() => setLanguage("kz")}>
        Қазақша
      </Button>
    </div>
  )
}
