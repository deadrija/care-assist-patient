import { useEffect, useState } from "react";
import gsap from "gsap";
import { supabase } from "../supabaseClient";

export default function DailyUFSummary() {
    const [exchanges, setExchanges] = useState([]);

    const fetchTodayExchanges = async () => {
        const user = await supabase.auth.getUser();
        const authId = user.data.user.id;

        const { data: patient } = await supabase
            .from("patients")
            .select("id")
            .eq("auth_id", authId)
            .single();

        const today = new Date().toISOString().split("T")[0];

        const { data } = await supabase
            .from("pd_exchanges")
            .select("*")
            .eq("patient_id", patient.id)
            .gte("created_at", `${today}T00:00:00`)
            .lte("created_at", `${today}T23:59:59`)
            .order("created_at", { ascending: true });

        setExchanges(data || []);
    };

    // Load data on mount
    useEffect(() => {
        const run = async () => {
            await fetchTodayExchanges();
        };
        run();
    }, []);

    // Run GSAP animation AFTER rows render
    useEffect(() => {
        if (exchanges.length > 0) {
            gsap.from(".exchange-row", {
                opacity: 0,
                x: -20,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out"
            });
        }
    }, [exchanges]);

    return (
        <div>
            <h3>Today’s Exchanges</h3>

            {exchanges.length === 0 && <p>No sessions yet today.</p>}

            {exchanges.map((ex) => (
                <div key={ex.id} className="exchange-row" style={styles.row}>
                    <strong>{ex.baxter_strength}</strong>
                    <span>UF: {ex.uf} mL</span>
                    <span>{new Date(ex.created_at).toLocaleTimeString()}</span>
                </div>
            ))}
        </div>
    );
}

const styles = {
    row: {
        background: "#fff",
        padding: 12,
        marginBottom: 10,
        borderRadius: 10,
        boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    }
};
