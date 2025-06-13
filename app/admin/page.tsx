"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Users, Settings, Plus, Edit, Trash2, RefreshCw, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClientSupabaseClient } from "@/lib/supabase"

export default function AdminPage() {
  const { toast } = useToast()
  const [participants, setParticipants] = useState<any[]>([])
  const [speakers, setSpeakers] = useState<any[]>([])
  const [loadingParticipants, setLoadingParticipants] = useState(true)
  const [loadingSpeakers, setLoadingSpeakers] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [newSpeaker, setNewSpeaker] = useState({
    name: "",
    topic: "",
    bio: "",
  })
  const [isAddingSpeaker, setIsAddingSpeaker] = useState(false)

  // Загрузка участников
  const fetchParticipants = async () => {
    setLoadingParticipants(true)
    try {
      const supabase = createClientSupabaseClient()

      let query = supabase.from("participants").select("*").order("participant_number", { ascending: true })

      if (searchTerm) {
        query = query.or(
          `last_name.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,middle_name.ilike.%${searchTerm}%,region.ilike.%${searchTerm}%`,
        )
      }

      const { data, error } = await query

      if (error) {
        throw new Error(error.message)
      }

      setParticipants(data || [])
    } catch (error) {
      console.error("Error fetching participants:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить участников",
        variant: "destructive",
      })
    } finally {
      setLoadingParticipants(false)
    }
  }

  // Загрузка спикеров
  const fetchSpeakers = async () => {
    setLoadingSpeakers(true)
    try {
      const supabase = createClientSupabaseClient()
      const { data, error } = await supabase.from("speakers").select("*").order("created_at", { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      setSpeakers(data || [])
    } catch (error) {
      console.error("Error fetching speakers:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить спикеров",
        variant: "destructive",
      })
    } finally {
      setLoadingSpeakers(false)
    }
  }

  useEffect(() => {
    fetchParticipants()
    fetchSpeakers()
  }, [])

  const getColorBadge = (colorGroup: string) => {
    switch (colorGroup) {
      case "green":
        return "bg-green-100 text-green-800 border-green-300"
      case "yellow":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "orange":
        return "bg-orange-100 text-orange-800 border-orange-300"
      case "blue":
        return "bg-blue-100 text-blue-800 border-blue-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getColorName = (colorGroup: string) => {
    switch (colorGroup) {
      case "green":
        return "Зеленый"
      case "yellow":
        return "Желтый"
      case "orange":
        return "Оранжевый"
      case "blue":
        return "Голубой"
      default:
        return "Не определен"
    }
  }

  const handleAddSpeaker = async () => {
    if (!newSpeaker.name || !newSpeaker.topic) {
      toast({
        title: "Ошибка",
        description: "Заполните обязательные поля (имя и тема)",
        variant: "destructive",
      })
      return
    }

    setIsAddingSpeaker(true)
    try {
      const response = await fetch("/api/speakers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSpeaker),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to add speaker")
      }

      toast({
        title: "Успех",
        description: "Спикер успешно добавлен",
      })

      setNewSpeaker({ name: "", topic: "", bio: "" })
      fetchSpeakers() // Обновляем список спикеров
    } catch (error) {
      console.error("Error adding speaker:", error)
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось добавить спикера",
        variant: "destructive",
      })
    } finally {
      setIsAddingSpeaker(false)
    }
  }

  const handleDeleteSpeaker = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить этого спикера?")) {
      return
    }

    try {
      const response = await fetch(`/api/speakers/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete speaker")
      }

      toast({
        title: "Успех",
        description: "Спикер успешно удален",
      })

      fetchSpeakers() // Обновляем список спикеров
    } catch (error) {
      console.error("Error deleting speaker:", error)
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось удалить спикера",
        variant: "destructive",
      })
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchParticipants()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Панель администратора</h1>
          <p className="text-gray-600">Управление мероприятием и участниками</p>
        </div>

        <Tabs defaultValue="participants" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="participants">
              <Users className="w-4 h-4 mr-2" />
              Участники
            </TabsTrigger>
            <TabsTrigger value="speakers">
              <Settings className="w-4 h-4 mr-2" />
              Спикеры
            </TabsTrigger>
          </TabsList>

          <TabsContent value="participants" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle>Зарегистрированные участники ({participants.length})</CardTitle>
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                      placeholder="Поиск по имени, региону..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-xs"
                    />
                    <Button type="submit" size="sm">
                      <Search className="h-4 w-4 mr-2" />
                      Поиск
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={fetchParticipants}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </CardHeader>
              <CardContent>
                {loadingParticipants ? (
                  <div className="flex justify-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : participants.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? "Участники не найдены" : "Пока нет зарегистрированных участников"}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Badge className={`${getColorBadge(participant.color_group)} border`}>
                            #{participant.participant_number}
                          </Badge>
                          <div>
                            <h3 className="font-semibold">
                              {participant.last_name} {participant.first_name} {participant.middle_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {participant.position} • {participant.region}
                            </p>
                            <p className="text-xs text-gray-500">Логин: {participant.login}</p>
                            {participant.last_login && (
                              <p className="text-xs text-gray-400">
                                Последний вход: {new Date(participant.last_login).toLocaleString("ru-RU")}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">Цвет: {getColorName(participant.color_group)}</div>
                          <div className="text-xs text-gray-500">
                            Регистрация: {new Date(participant.created_at).toLocaleDateString("ru-RU")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="speakers" className="mt-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Добавить спикера</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="speakerName">ФИО спикера *</Label>
                    <Input
                      id="speakerName"
                      value={newSpeaker.name}
                      onChange={(e) => setNewSpeaker({ ...newSpeaker, name: e.target.value })}
                      placeholder="Введите полное имя спикера"
                    />
                  </div>
                  <div>
                    <Label htmlFor="speakerTopic">Тема выступления *</Label>
                    <Input
                      id="speakerTopic"
                      value={newSpeaker.topic}
                      onChange={(e) => setNewSpeaker({ ...newSpeaker, topic: e.target.value })}
                      placeholder="Введите тему выступления"
                    />
                  </div>
                  <div>
                    <Label htmlFor="speakerBio">Биография (опционально)</Label>
                    <Textarea
                      id="speakerBio"
                      value={newSpeaker.bio}
                      onChange={(e) => setNewSpeaker({ ...newSpeaker, bio: e.target.value })}
                      placeholder="Краткая биография спикера"
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleAddSpeaker} className="w-full" disabled={isAddingSpeaker}>
                    {isAddingSpeaker ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Добавление...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить спикера
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Список спикеров ({speakers.length})</CardTitle>
                    <Button variant="outline" size="sm" onClick={fetchSpeakers}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingSpeakers ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                  ) : speakers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">Пока нет добавленных спикеров</div>
                  ) : (
                    <div className="space-y-4">
                      {speakers.map((speaker) => (
                        <div key={speaker.id} className="flex items-start justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{speaker.name}</h3>
                            <p className="text-blue-600 font-medium">{speaker.topic}</p>
                            {speaker.bio && <p className="text-sm text-gray-600 mt-1">{speaker.bio}</p>}
                            <p className="text-xs text-gray-400 mt-2">
                              Добавлен: {new Date(speaker.created_at).toLocaleString("ru-RU")}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteSpeaker(speaker.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
