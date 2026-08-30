"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";
import { calculatePoints } from "@/lib/scoring";

export async function submitRaceResult(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdminEmail(user?.email)) {
    throw new Error("Accès refusé");
  }

  const raceId = String(formData.get("race_id") ?? "");
  const podium1 = String(formData.get("podium_1") ?? "");
  const podium2 = String(formData.get("podium_2") ?? "");
  const podium3 = String(formData.get("podium_3") ?? "");
  const safetyCar = formData.get("safety_car") === "true";

  if (!raceId || !podium1 || !podium2 || !podium3) {
    throw new Error("Merci de renseigner le podium complet.");
  }
  if (new Set([podium1, podium2, podium3]).size !== 3) {
    throw new Error("Les 3 pilotes du podium doivent être différents.");
  }

  const admin = createAdminClient();
  const result = {
    podium_1: podium1,
    podium_2: podium2,
    podium_3: podium3,
    safety_car: safetyCar,
  };

  const { error: resultError } = await admin
    .from("race_results")
    .upsert({ race_id: raceId, ...result }, { onConflict: "race_id" });
  if (resultError) throw new Error(resultError.message);

  const { error: statusError } = await admin
    .from("races")
    .update({ status: "finished" })
    .eq("id", raceId);
  if (statusError) throw new Error(statusError.message);

  const [{ data: predictions, error: predictionsError }, { data: memberships, error: membersError }] =
    await Promise.all([
      admin
        .from("predictions")
        .select("user_id, podium_1, podium_2, podium_3, safety_car")
        .eq("race_id", raceId),
      admin.from("group_members").select("user_id, group_id"),
    ]);
  if (predictionsError) throw new Error(predictionsError.message);
  if (membersError) throw new Error(membersError.message);

  const groupsByUser = new Map<string, string[]>();
  for (const m of memberships ?? []) {
    const list = groupsByUser.get(m.user_id) ?? [];
    list.push(m.group_id);
    groupsByUser.set(m.user_id, list);
  }

  const scoreRows = (predictions ?? []).flatMap((prediction) => {
    const points = calculatePoints(prediction, result);
    const groupIds = groupsByUser.get(prediction.user_id) ?? [];
    return groupIds.map((group_id) => ({
      user_id: prediction.user_id,
      race_id: raceId,
      group_id,
      points,
      calculated_at: new Date().toISOString(),
    }));
  });

  if (scoreRows.length > 0) {
    const { error: scoresError } = await admin
      .from("scores")
      .upsert(scoreRows, { onConflict: "user_id,race_id,group_id" });
    if (scoresError) throw new Error(scoresError.message);
  }

  revalidatePath("/admin/results");
  revalidatePath("/races");
}
