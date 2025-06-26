"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, RefreshCw } from "lucide-react"
import { createClientSupabaseClient } from "@/lib/supabase"

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)

  const fetchParticipants = async () => {
    setLoading(true)
    setError(null)

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
    } catch (err) {
      console.error("Error fetching participants:", err)
      setError(err instanceof Error ? err.message : "Failed to load participants")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchParticipants()
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
      case "white":
        return "bg-white text-gray-800 border-gray-300"
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
      case "white":
        return "Белый"
      default:
        return "Не определен"
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchParticipants()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Список участников ({participants.length})</CardTitle>
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
          {loading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : participants.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Участники не найдены</div>
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
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">Цвет: {getColorName(participant.color_group)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}