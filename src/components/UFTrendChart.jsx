import { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabaseClient";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function UFTrendChart() {
    const [chartData, setChartData] = useState(null);
    const [filter, setFilter] = useState("7days");
    const [loading, setLoading] = useState(true);
    const [noData, setNoData] = useState(false);

    // Load UF Trend Data
    const loadTrend = useCallback(async () => {
        setLoading(true);
        setNoData(false);

        console.log("➡️ loadTrend() STARTED with filter:", filter);

        const { data: user } = await supabase.auth.getUser();
        if (!user?.user) {
            console.log("❌ No logged-in user.");
            return;
        }

        const authId = user.user.id;

        const { data: patient } = await supabase
            .from("patients")
            .select("id")
            .eq("auth_id", authId)
            .single();

        if (!patient?.id) {
            console.log("❌ No patient record found.");
            setLoading(false);
            return;
        }

        let fromDate = new Date();
        if (filter === "7days") fromDate.setDate(fromDate.getDate() - 7);
        if (filter === "30days") fromDate.setDate(fromDate.getDate() - 30);

        const { data, error } = await supabase
            .from("pd_exchanges")
            .select("uf, created_at")
            .eq("patient_id", patient.id)
            .gte("created_at", fromDate.toISOString())
            .order("created_at");

        console.log("📊 Query result:", data);

        if (error) console.log("Supabase error:", error);

        if (!data || data.length === 0) {
            console.log("⚠️ No UF data for selected range.");
            setNoData(true);
            setLoading(false);
            return;
        }

        const labels = data.map(r =>
            new Date(r.created_at).toLocaleDateString()
        );
        const ufValues = data.map(r => r.uf);

        setChartData({
            labels,
            datasets: [
                {
                    label: "UF Trend",
                    data: ufValues,
                    borderColor: ufValues.some(v => v < 0) ? "#ff4d4d" : "#007bff",
                    backgroundColor: "rgba(0,123,255,0.2)",
                    borderWidth: 3,
                    tension: 0.35,
                    pointRadius: 4
                }
            ]
        });

        setLoading(false);
        console.log("✅ Trend data loaded successfully.");
    }, [filter]);

    useEffect(() => { const run = async () => { await loadTrend(); }; run(); }, [loadTrend]);

    if (loading) return <p>Loading trends...</p>;

    if (noData)
        return (
            <div style={{ marginTop: 20, textAlign: "center", opacity: 0.8 }}>
                <p style={{ fontSize: 16 }}>No UF data available yet.</p>
                <p style={{ fontSize: 13, color: "#777" }}>Add a PD exchange to see trends.</p>
            </div>
        );

    return (
        <div style={{ marginTop: 20 }}>
            {/* Filter Buttons */}
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                <button
                    onClick={() => setFilter("7days")}
                    className={`filter-btn ${filter === "7days" ? "active" : ""}`}
                >
                    Last 7 Days
                </button>

                <button
                    onClick={() => setFilter("30days")}
                    className={`filter-btn ${filter === "30days" ? "active" : ""}`}
                >
                    Last 30 Days
                </button>
            </div>

            {/* Trend Chart */}
            {chartData && <Line data={chartData} />}
        </div>
    );
}
