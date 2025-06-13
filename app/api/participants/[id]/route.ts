import { type NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`Deleting participant with ID: ${params.id}`);
    const supabase = createServerSupabaseClient();
    const participantId = Number.parseInt(params.id);

    if (isNaN(participantId)) {
      return NextResponse.json(
        { error: "Invalid participant ID" },
        { status: 400 }
      );
    }

    // Получаем информацию об участнике перед удалением (для логирования)
    const { data: participant, error: fetchError } = await supabase
      .from("participants")
      .select("participant_number, last_name, first_name")
      .eq("id", participantId)
      .single();

    if (fetchError) {
      console.error("Error fetching participant before deletion:", fetchError);
    } else {
      console.log(
        `Deleting participant #${participant.participant_number}: ${participant.last_name} ${participant.first_name}`
      );
    }

    // Удаляем участника
    const { error } = await supabase
      .from("participants")
      .delete()
      .eq("id", participantId);

    if (error) {
      console.error("Error deleting participant:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`Participant ${participantId} deleted successfully`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Participant deletion error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
