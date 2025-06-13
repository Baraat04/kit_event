import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    const { data: speakers, error } = await supabase
      .from("speakers")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching speakers:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ speakers })
  } catch (error) {
    console.error("Speakers fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { name, topic, bio } = await request.json()

    if (!name || !topic) {
      return NextResponse.json({ error: "Name and topic are required" }, { status: 400 })
    }

    const { data: speaker, error } = await supabase
      .from("speakers")
      .insert({
        name: name.trim(),
        topic: topic.trim(),
        bio: bio?.trim() || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error inserting speaker:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      speaker,
    })
  } catch (error) {
    console.error("Speaker creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
