"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Trash2, AlertTriangle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CleanupPage() {
  const { toast } = useToast()
  const [isCleaningUp, setIsCleaningUp] = useState(false)
  const [cleanupResult, setCleanupResult] = useState<any>(null)

  const handleCleanup = async () => {
    setIsCleaningUp(true)
    setCleanupResult(null)

    try {
      const response = await fetch("/api/cleanup-duplicates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Cleanup failed")
      }

      setCleanupResult(data)
      toast({
        title: "Очистка завершена",
        description: data.message,
      })
    } catch (error) {
      console.error("Cleanup error:", error)
      toast({
        title: "Ошибка очистки",
        description: error instanceof Error ? error.message : "Не удалось выполнить очистку",
        variant: "destructive",
      })
    } finally {
      setIsCleaningUp(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Очистка базы данных</h1>
        <p className="text-gray-600">Удаление дублирующихся записей участников</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Очистка дубликатов</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Эта операция удалит дублирующиеся записи участников с одинаковыми логинами. Будет сохранена самая ранняя
              запись для каждого логина.
            </AlertDescription>
          </Alert>

          {cleanupResult && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Результат очистки:</strong>
                <br />
                Найдено групп дубликатов: {cleanupResult.duplicateGroups}
                <br />
                Удалено записей: {cleanupResult.deletedCount}
                <br />
                {cleanupResult.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button onClick={handleCleanup} disabled={isCleaningUp} className="flex-1">
              {isCleaningUp ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Очистка...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Запустить очистку
                </>
              )}
            </Button>
          </div>

          <div className="text-sm text-gray-500">
            <p>
              <strong>Что делает очистка:</strong>
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Находит участников с одинаковыми логинами</li>
              <li>Сохраняет самую раннюю запись для каждого логина</li>
              <li>Удаляет все остальные дублирующиеся записи</li>
              <li>Выводит отчет о количестве удаленных записей</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
