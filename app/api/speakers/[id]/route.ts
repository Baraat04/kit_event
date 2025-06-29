import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`Deleting speaker with ID: ${params.id}`)
    const supabase = createServerSupabaseClient()
    const speakerId = Number.parseInt(params.id)

    if (isNaN(speakerId)) {
      return NextResponse.json({ error: "Invalid speaker ID" }, { status: 400 })
    }

    const { error } = await supabase.from("speakers").delete().eq("id", speakerId)

    if (error) {
      console.error("Error deleting speaker:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`Speaker ${speakerId} deleted successfully`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Speaker deletion error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`Updating speaker with ID: ${params.id}`)
    const supabase = createServerSupabaseClient()
    const speakerId = Number.parseInt(params.id)
    const { name, topic, bio } = await request.json()
    console.log("Update data:", { name, topic, bio })

    if (isNaN(speakerId)) {
      return NextResponse.json({ error: "Invalid speaker ID" }, { status: 400 })
    }

    if (!name || !topic) {
      return NextResponse.json({ error: "Name and topic are required" }, { status: 400 })
    }

    const { data: speaker, error } = await supabase
      .from("speakers")
      .update({
        name: name.trim(),
        topic: topic.trim(),
        bio: bio?.trim() || null,
      })
      .eq("id", speakerId)
      .select()
      .single()

    if (error) {
      console.error("Error updating speaker:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("Speaker updated successfully:", speaker)
    return NextResponse.json({
      success: true,
      speaker,
    })
  } catch (error) {
    console.error("Speaker update error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
