import { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabaseClient";

export default function UFWeeklyAvgCard() {
    const [avgUF, setAvgUF] = useState(null);

    const loadWeeklyAvg = useCallback(async () => {
        const { data: user } = await supabase.auth.getUser();
        const authId = user.user.id;

        const { data: patient } = await supabase
            .from("patients")
            .select("id")
            .eq("auth_id", authId)
            .single();

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data } = await supabase
            .from("pd_exchanges")
            .select("uf")
            .eq("patient_id", patient.id)
            .gte("created_at", sevenDaysAgo.toISOString());

        if (!data || data.length === 0) {
            setAvgUF(0);
            return;
        }

        const total = data.reduce((sum, r) => sum + r.uf, 0);
        setAvgUF(Math.round(total / data.length));
    }, []);

    useEffect(() => {
        const run = async () => await loadWeeklyAvg();
        run();
    }, [loadWeeklyAvg]);

    return (
        <div className="uf-card">
            <div className="uf-card-title">7-Day Avg UF</div>
            <div className="uf-card-value" style={{ color: "#008f5a" }}>
                {avgUF !== null ? `${avgUF} mL` : "Loading..."}
            </div>
        </div>
    );
}
