import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    console.log("Cleanup duplicates API called")
    const supabase = createServerSupabaseClient()

    // Находим дублирующиеся логины
    const { data: duplicates, error: duplicatesError } = await supabase.rpc("find_duplicate_logins")

    if (duplicatesError) {
      console.error("Error finding duplicates:", duplicatesError)
      return NextResponse.json(
        {
          error: "Database error",
          details: `Find duplicates failed: ${duplicatesError.message}`,
        },
        { status: 500 },
      )
    }

    console.log("Found duplicates:", duplicates)

    // Если дубликатов нет, создаем простой запрос для поиска
    const { data: allParticipants, error: allError } = await supabase
      .from("participants")
      .select("id, login, participant_number, created_at")
      .order("created_at", { ascending: true })

    if (allError) {
      console.error("Error getting all participants:", allError)
      return NextResponse.json(
        {
          error: "Database error",
          details: `Get participants failed: ${allError.message}`,
        },
        { status: 500 },
      )
    }

    // Группируем по логинам
    const loginGroups: { [key: string]: any[] } = {}
    allParticipants.forEach((participant) => {
      if (!loginGroups[participant.login]) {
        loginGroups[participant.login] = []
      }
      loginGroups[participant.login].push(participant)
    })

    // Находим группы с дубликатами
    const duplicateGroups = Object.entries(loginGroups).filter(([login, participants]) => participants.length > 1)

    let deletedCount = 0

    // Удаляем дубликаты, оставляя самую раннюю запись
    for (const [login, participants] of duplicateGroups) {
      // Сортируем по дате создания и оставляем первую
      const sortedParticipants = participants.sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      )

      // Удаляем все кроме первой записи
      for (let i = 1; i < sortedParticipants.length; i++) {
        const { error: deleteError } = await supabase.from("participants").delete().eq("id", sortedParticipants[i].id)

        if (deleteError) {
          console.error("Error deleting duplicate:", deleteError)
        } else {
          deletedCount++
          console.log(`Deleted duplicate participant with ID: ${sortedParticipants[i].id}`)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Cleanup completed. Deleted ${deletedCount} duplicate records.`,
      duplicateGroups: duplicateGroups.length,
      deletedCount,
    })
  } catch (error) {
    console.error("Cleanup error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
