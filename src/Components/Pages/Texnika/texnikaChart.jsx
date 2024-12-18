import React, { useEffect, useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
} from "chart.js";
import "../../style/Texnikachart.css"; // Import CSS for styling
import Referense from "../Referense";
import { useNavigate } from "react-router-dom";

// Регистрация компонентов Chart.js
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    Title,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale
);

const TexnikaChart = () => {
    const [chartData, setChartData] = useState({
        workingConditionData: [0, 0],
        repairData: [0, 0],
        unusedData: [0, 0],
        totalTexnika: 0,
        workingConditionCount: 0,
        repairCount: 0,
        unusedCount: 0,
    });

    const navigate = useNavigate();

    const BACK_API = process.env.REACT_APP_BACK_API;

    const [lineChartData, setLineChartData] = useState({
        labels: [],
        percentages: [],
    });

    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    // Message Modal
    const [text, setText] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [success, setSuccess] = useState(false);

    const [isNull, setIsNull] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const queryParams = new URLSearchParams({
                    filter: "naimenovaniya_tex",
                    status: "all",
                    page: 1,
                    size: 10,
                }).toString();

                const response = await fetch(
                    `${BACK_API}api/readtexnika?${queryParams}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                // Handle 403 token expired status
                if (response.status === 403) {
                    setText("Срок действия вашего токена истек");
                    setSuccess(false);
                    setShowSuccess(true);
                    setLoading(false); // Set loading to false as the error occurred

                    setTimeout(() => {
                        setShowSuccess(false); // Hide the error message after 3 seconds
                        navigate("/"); // Redirect to login page
                    }, 3000);
                    return;
                }

                const responseBody = await response.json();
                if (!response.ok) throw new Error(responseBody.message);

                const texnikaData = responseBody.data;

                // Check if texnikaData is empty or null
                if (Array.isArray(texnikaData) && texnikaData.length > 0) {
                    setIsNull(false);
                    // Data for generating the linear chart
                    const dateCounts = {};

                    // Counting status types
                    const totalTexnika = texnikaData.length;
                    const readTexnika = texnikaData.filter(
                        (item) => item.status === "В рабочем состоянии"
                    );
                    const readTexnikaRepair = texnikaData.filter(
                        (item) => item.status === "В ремонте"
                    );
                    const readTexnikaUnused = texnikaData.filter(
                        (item) => item.status === "В нерабочем состоянии"
                    );

                    setChartData({
                        workingConditionData: [
                            (readTexnika.length / totalTexnika) * 100,
                            100 - (readTexnika.length / totalTexnika) * 100,
                        ],
                        repairData: [
                            (readTexnikaRepair.length / totalTexnika) * 100,
                            100 - (readTexnikaRepair.length / totalTexnika) * 100,
                        ],
                        unusedData: [
                            (readTexnikaUnused.length / totalTexnika) * 100,
                            100 - (readTexnikaUnused.length / totalTexnika) * 100,
                        ],
                        totalTexnika,
                        workingConditionCount: readTexnika.length,
                        repairCount: readTexnikaRepair.length,
                        unusedCount: readTexnikaUnused.length,
                    });

                    const sortedDates = Object.keys(dateCounts).sort();
                    const devicesPerDate = sortedDates.map((date) => dateCounts[date]);

                    const maxDevicesInADay = Math.max(...devicesPerDate);

                    setLineChartData({
                        labels: sortedDates,
                        percentages: devicesPerDate,
                        maxYAxis: maxDevicesInADay + 2,
                    });

                } else {
                    setIsNull(true); // If texnikaData is empty or null
                }

                setLoading(false); // Hide loading state after successful fetch
            } catch (error) {
                console.error("Ошибка:", error);
                setLoading(false); // Set loading to false in case of error
                setText(error.message || "Произошла ошибка при загрузке данных.");
                setSuccess(false);
                setShowSuccess(true);
            }
        };

        fetchData();
    }, [token, navigate]);

    // Function to calculate percentage and round it
    const calculatePercentage = (part, total) => {
        return ((part / total) * 100).toFixed(0); // Round the percentage to nearest integer
    };

    const renderSuccessMessage = () => {
        if (showSuccess) {
            return <Referense title={text} background={success} />;
        }
    };

    return (
        <div>
            {isNull ? (
                <div className="no-texnika-message">
                    <p>В настоящее время нет зарегистрированных техники.</p>
                </div>
            ) : (
                <div className="texnika-chart-container">
                    {/* Техника в рабочем состоянии */}
                    <div className="donut-chart">
                        <h3>В рабочем состоянии</h3>
                        <div className="chart-content">
                            <Doughnut
                                data={{
                                    labels: [], // Hide labels
                                    datasets: [
                                        {
                                            data: chartData.workingConditionData,
                                            backgroundColor: [
                                                "rgb(75, 192, 192)",
                                                "rgba(200, 200, 200, 0.7)",
                                            ],
                                            hoverOffset: 4,
                                        },
                                    ],
                                }}
                                options={{
                                    cutout: "70%",
                                    rotation: 0,
                                    circumference: 360,
                                    plugins: {
                                        tooltip: {
                                            enabled: false, // Disable tooltips
                                        },
                                        legend: {
                                            display: false, // Disable legend
                                        },
                                    },
                                    animation: {
                                        duration: 0, // No animation
                                    },
                                }}
                            />
                            {/* Display percentage in the center of the donut */}
                            <div className="donut-center">
                                <p>{calculatePercentage(chartData.workingConditionCount, chartData.totalTexnika)}%</p>
                            </div>
                        </div>
                        <div className="chart-stats">
                            <p>Всего техники: {chartData.totalTexnika}</p>
                            <p>В рабочем состоянии: {chartData.workingConditionCount}</p>
                        </div>
                    </div>

                    {/* Техника в ремонте */}
                    <div className="donut-chart">
                        <h3>В ремонте</h3>
                        <div className="chart-content">
                            <Doughnut
                                data={{
                                    labels: [], // Hide labels
                                    datasets: [
                                        {
                                            data: chartData.repairData,
                                            backgroundColor: [
                                                "rgb(255, 99, 132)",
                                                "rgba(200, 200, 200, 0.7)",
                                            ],
                                            hoverOffset: 4,
                                        },
                                    ],
                                }}
                                options={{
                                    cutout: "70%",
                                    rotation: 0,
                                    circumference: 360,
                                    plugins: {
                                        tooltip: {
                                            enabled: false, // Disable tooltips
                                        },
                                        legend: {
                                            display: false, // Disable legend
                                        },
                                    },
                                    animation: {
                                        duration: 0, // No animation
                                    },
                                }}
                            />
                            {/* Display percentage in the center of the donut */}
                            <div className="donut-center">
                                <p>{calculatePercentage(chartData.repairCount, chartData.totalTexnika)}%</p>
                            </div>
                        </div>
                        <div className="chart-stats">
                            <p>Всего техники: {chartData.totalTexnika}</p>
                            <p>В ремонте: {chartData.repairCount}</p>
                        </div>
                    </div>

                    {/* Техника в нерабочем состоянии */}
                    <div className="donut-chart">
                        <h3>В нерабочем состоянии</h3>
                        <div className="chart-content">
                            <Doughnut
                                data={{
                                    labels: [], // Hide labels
                                    datasets: [
                                        {
                                            data: chartData.unusedData,
                                            backgroundColor: [
                                                "rgb(255, 159, 64)",
                                                "rgba(200, 200, 200, 0.7)",
                                            ],
                                            hoverOffset: 4,
                                        },
                                    ],
                                }}
                                options={{
                                    cutout: "70%",
                                    rotation: 0,
                                    circumference: 360,
                                    plugins: {
                                        tooltip: {
                                            enabled: false, // Disable tooltips
                                        },
                                        legend: {
                                            display: false, // Disable legend
                                        },
                                    },
                                    animation: {
                                        duration: 0, // No animation
                                    },
                                }}
                            />
                            {/* Display percentage in the center of the donut */}
                            <div className="donut-center">
                                <p>{calculatePercentage(chartData.unusedCount, chartData.totalTexnika)}%</p>
                            </div>
                        </div>
                        <div className="chart-stats">
                            <p>Всего техники: {chartData.totalTexnika}</p>
                            <p>Не используется: {chartData.unusedCount}</p>
                        </div>
                    </div>

                    {/* Линейный график */}
                    <div className="line-charts">
                        <h3>Тенденции устройств по времени</h3>
                        <Line
                            data={{
                                labels: lineChartData.labels,
                                datasets: [
                                    {
                                        label: "Созданные устройства за день",
                                        data: lineChartData.percentages,
                                        borderColor: "rgb(75, 192, 192)",
                                        fill: false,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                plugins: { legend: { position: "top" } },
                                scales: {
                                    y: {
                                        ticks: {
                                            stepSize: 0,
                                        },
                                        title: {
                                            display: true,
                                            text: "",
                                        },
                                        min: 0,
                                        max: lineChartData.maxYAxis,
                                    },
                                    x: {
                                        title: {
                                            display: true,
                                            text: "",
                                        },
                                        position: "bottom",
                                    },
                                },
                            }}
                        />
                    </div>
                    {renderSuccessMessage()}
                </div>
            )}
        </div>
    );
};

export default TexnikaChart;
