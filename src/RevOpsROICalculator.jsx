import { useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const Card = ({ children, className }) => <div className={`bg-white p-6 rounded-xl shadow-lg ${className}`}>{children}</div>;
const CardContent = ({ children, className }) => <div className={className}>{children}</div>;
const Input = (props) => <input {...props} className="border p-2 w-full rounded-md shadow-sm" />;
const Button = ({ children, ...props }) => (
  <button
    {...props}
    className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-200 text-white py-2 px-6 rounded-full font-semibold shadow-md"
  >
    {children}
  </button>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="bg-white text-black p-4 rounded-lg shadow-lg border border-gray-300"
        style={{
          transform: 'translateY(-20px)',
          pointerEvents: 'none',
          maxWidth: '220px',
          whiteSpace: 'normal',
        }}
      >
        <p className="font-bold text-sm mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {Number(entry.value).toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function RevOpsROICalculator({ showTitles = true }) {
  const [arr, setArr] = useState(1000000);
  const [leads, setLeads] = useState(500);
  const [conversionRate, setConversionRate] = useState(10);
  const [asp, setAsp] = useState(10000);
  const [cac, setCac] = useState(2000);
  const [winRate, setWinRate] = useState(25);
  const [roi, setRoi] = useState(null);
  const [industry, setIndustry] = useState("SaaS");

  const improvementFactors = {
    SaaS: { conversion: 0.15, winRate: 0.20, asp: 0.15, cac: 0.20 },
    Fintech: { conversion: 0.12, winRate: 0.18, asp: 0.20, cac: 0.18 },
    eCommerce: { conversion: 0.10, winRate: 0.15, asp: 0.10, cac: 0.25 },
    HealthcareTech: { conversion: 0.14, winRate: 0.22, asp: 0.18, cac: 0.19 }
  };

  const industryBenchmarks = {
    SaaS: { conversionRate: 7, winRate: 22, asp: 8000, cac: 2500 },
    Fintech: { conversionRate: 5, winRate: 20, asp: 10000, cac: 3000 },
    eCommerce: { conversionRate: 3, winRate: 18, asp: 500, cac: 150 },
    HealthcareTech: { conversionRate: 6, winRate: 24, asp: 12000, cac: 2800 }
  };

  const benchmarks = industryBenchmarks[industry];
  const boost = improvementFactors[industry];
  const investment = 90000;

  const calculateROI = () => {
    const improvedConversion = conversionRate * (1 + boost.conversion);
    const improvedASP = asp * (1 + boost.asp);
    const reducedCAC = cac * (1 - boost.cac);
    const improvedWinRate = winRate * (1 + boost.winRate);

    const baselineRevenue = leads * (conversionRate / 100) * asp * 12;
    const improvedRevenue = leads * (improvedConversion / 100) * improvedASP * 12;
    const revenueGain = improvedRevenue - baselineRevenue;

    const roiCalc = ((revenueGain - investment) / investment) * 100;
    setRoi(roiCalc.toFixed(2));
  };

  const charts = [
    {
      title: "Conversion Rate %",
      data: [
        { label: "Conversion Rate %", Benchmark: benchmarks.conversionRate, Without: conversionRate, With: conversionRate * (1 + boost.conversion) }
      ]
    },
    {
      title: "Win Rate %",
      data: [
        { label: "Win Rate %", Benchmark: benchmarks.winRate, Without: winRate, With: winRate * (1 + boost.winRate) }
      ]
    },
    {
      title: "Average Sale Price ($)",
      data: [
        { label: "Avg Sale Price ($)", Benchmark: benchmarks.asp, Without: asp, With: asp * (1 + boost.asp) }
      ]
    },
    {
      title: "Customer Acquisition Cost ($)",
      data: [
        { label: "CAC ($)", Benchmark: benchmarks.cac, Without: cac, With: cac * (1 - boost.cac) }
      ]
    },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <Card className="space-y-6">
        <CardContent className="space-y-4">
          <div>
            <label className="font-medium">Select Industry:</label>
            <select
              className="w-full border rounded p-2 mt-1"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            >
              <option value="SaaS">SaaS</option>
              <option value="Fintech">Fintech</option>
              <option value="eCommerce">eCommerce</option>
              <option value="HealthcareTech">HealthcareTech</option>
            </select>
          </div>
          <div><label>Current ARR ($):</label><Input type="number" value={arr} onChange={(e) => setArr(Number(e.target.value))} /></div>
          <div><label>Avg Monthly Leads:</label><Input type="number" value={leads} onChange={(e) => setLeads(Number(e.target.value))} /></div>
          <div><label>Conversion Rate (%):</label><Input type="number" value={conversionRate} onChange={(e) => setConversionRate(Number(e.target.value))} /></div>
          <div><label>Win Rate (%):</label><Input type="number" value={winRate} onChange={(e) => setWinRate(Number(e.target.value))} /></div>
          <div><label>Avg Sale Price ($):</label><Input type="number" value={asp} onChange={(e) => setAsp(Number(e.target.value))} /></div>
          <div><label>CAC ($):</label><Input type="number" value={cac} onChange={(e) => setCac(Number(e.target.value))} /></div>

          <div className="flex justify-center pt-4">
            <Button onClick={calculateROI}>Calculate ROI</Button>
          </div>

          {roi && (
            <div className="mt-6 text-center">
              <p className="text-xl font-semibold">Estimated ROI: {roi}%</p>
              <p className="text-sm mt-2 text-gray-600">Based on projected gains in conversion, win rate, ASP, and CAC with a $90k annual RevOps investment.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {roi !== null && charts.map((chart, index) => (
        <div key={index} className="mt-10">
          {showTitles && <h2 className="text-md font-semibold mb-2 text-center">{chart.title}</h2>}
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chart.data} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="label" type="category" width={200} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Benchmark" fill="#999999" name="Industry Benchmark" />
              <Bar dataKey="Without" fill="#000000" name="Without RevOps" />
              <Bar dataKey="With" fill="#2aa5dc" name="With RevOps" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}
