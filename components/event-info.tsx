"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import KIT1 from "../public/kit1.jpg"
import KIT2 from "../public/kit2.jpg"
import KIT3 from "../public/kit3.jpg"
import KIT4 from "../public/kit4.jpg"
import KIT5 from "../public/kit5.jpg"
import KIT6 from "../public/kit6.jpg"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, ExternalLink, ZoomIn, Instagram, Globe } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import Image from "next/image"
import { useState, useEffect } from "react"
interface EventInfoProps {
  user: any
  onBack: () => void
}

export default function EventInfo({ user:initialUser, onBack }: EventInfoProps) {
  const { translations } = useLanguage()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [user, setUser] = useState(() => {
    // При инициализации проверяем localStorage
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('currentUser')
      return savedUser ? JSON.parse(savedUser) : initialUser
    }
    return initialUser
  })

  const galleryImages = [KIT1, KIT2, KIT3, KIT4, KIT5, KIT6]

  // Сохраняем пользователя в localStorage при изменении
  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(user))
    }
  }, [user])

  // Обработчик для сброса пользователя при выходе
  const handleBack = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser')
    }
    onBack()
  }

  // Восстанавливаем пользователя из localStorage при загрузке
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  // Сохраняем пользователя в localStorage при изменении
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user))
    }
  }, [user])
  const getParticipantColor = (colorGroup: string) => {
    switch (colorGroup?.toLowerCase()) {
      case "green":
        return "bg-green-100 border-green-500"
      case "yellow":
        return "bg-yellow-100 border-yellow-500"
      case "orange":
        return "bg-orange-100 border-yellow-500"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {translations.back}
            </Button>
            <Badge className={`${getParticipantColor(user.color_group)} ${getParticipantColorText(user.color_group)} border-2`}>
              #{user.participantNumber} {user.lastName} {user.firstName}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="program" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="program">{translations.program}</TabsTrigger>
            <TabsTrigger value="speakers">{translations.speakersLabel}</TabsTrigger>
            <TabsTrigger value="gallery">{translations.collegeGallery}</TabsTrigger>
            <TabsTrigger value="links">{translations.links}</TabsTrigger>
          </TabsList>

          <TabsContent value="program" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{translations.eventProgram}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative group cursor-pointer">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    alt="Event Program"
                    width={800}
                    height={600}
                    className="w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                    onClick={() =>
                      setSelectedImage("/placeholder.svg?height=600&width=800")
                    }
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="speakers" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {translations.speakersLabel} ({translations.speakers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {translations.speakers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {translations.noSpeakers || "Спикеры пока не добавлены"}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {translations.speakers.map((speaker: any, index: number) => (
                      <Card
                        key={index}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardContent className="p-6 text-center">
                          <Image
                            src="/placeholder.svg?height=200&width=200"
                            alt={speaker.name}
                            width={200}
                            height={200}
                            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                          />
                          <h3 className="font-semibold text-lg mb-2">
                            {speaker.name}
                          </h3>
                          <p className="text-blue-600 font-medium mb-2">
                            {speaker.topic}
                          </p>
                          {speaker.bio && (
                            <p className="text-gray-600 text-sm">
                              {speaker.bio}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{translations.collegeGallery}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {galleryImages.map((image, index) => (
                    <div key={index} className="relative group cursor-pointer">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Gallery ${index + 1}`}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover rounded-lg hover:shadow-lg transition-shadow"
                        onClick={() => setSelectedImage(image)}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                        <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="links" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{translations.downloadPhotos}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    {translations.photosAvailable}
                  </p>
                  <Button className="w-full" disabled>
                    <Download className="w-4 h-4 mr-2" />
                    {translations.downloadPhotos}
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    {translations.availableAfterEvent}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{translations.socialMedia}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <a
                      href="https://kit.edu.kz"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      kit.edu.kz
                      <ExternalLink className="w-4 h-4 ml-auto" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram className="w-4 h-4 mr-2" />
                      Instagram
                      <ExternalLink className="w-4 h-4 ml-auto" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <Image
                src={selectedImage || "/placeholder.svg"}
                alt="Enlarged view"
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain"
              />
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}