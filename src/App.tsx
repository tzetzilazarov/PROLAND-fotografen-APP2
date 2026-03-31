import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  BarChart3,
  Building2,
  CheckCircle2,
  ClipboardList,
  Eye,
  EyeOff,
  ListChecks,
  Palette,
  Settings2,
  Type,
  Users,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const initialCities = [
  "Amsterdam",
  "Rotterdam",
  "Den Haag",
  "Utrecht",
  "Eindhoven",
  "Groningen",
  "Tilburg",
  "Almere",
  "Breda",
  "Nijmegen",
  "Haarlem",
  "Arnhem",
  "Enschede",
  "Amersfoort",
  "Maastricht",
  "Zwolle",
  "Apeldoorn",
  "Leiden",
  "Leeuwarden",
];

const workloadOptions = [
  {
    value: "0% ik krijg nog geen opdrchten",
    label: "0% ik krijg nog geen opdrchten",
    detail: "Ik krijg nog geen opdrachten",
  },
  {
    value: "5% ik krijg bijna geen opdrachten",
    label: "5% ik krijg bijna geen opdrachten",
    detail: "Ik krijg bijna geen opdrachten",
  },
  {
    value: "20% Ik krijg nog te weinig opdrachten",
    label: "20% Ik krijg nog te weinig opdrachten",
    detail: "Ik krijg nog te weinig opdrachten",
  },
  {
    value: "50% ik krijg maar de helft van wat ik aankan",
    label: "50% ik krijg maar de helft van wat ik aankan",
    detail: "Ik krijg maar de helft van wat ik aankan",
  },
  {
    value: "66% Ik krijg ruim voldoende opdrachten, maar kan meer",
    label: "66% Ik krijg ruim voldoende opdrachten, maar kan meer",
    detail: "Ik krijg ruim voldoende opdrachten, maar kan meer",
  },
  {
    value: "100%+ Ik krijg mijn hele planning verzadigd aan opdrachten",
    label: "100%+ Ik krijg mijn hele planning verzadigd aan opdrachten",
    detail: "Ik krijg mijn hele planning verzadigd aan opdrachten",
  },
];

const serviceOptions = [
  "Fotografie",
  "Video",
  "360",
  "Wescan",
  "Drone",
  "Hoogte foto",
];

const earningsOptions = [
  "Minimaal 100,-",
  "Minimaal 500,-",
  "Minimaal 1000,-",
  "Minimaal 1500,-",
  "Minimaal 2000,-",
  "Minimaal 3000,-",
];

const seedPhotographers = [
  {
    id: 1,
    name: "Sanne de Vries",
    cities: ["Amsterdam", "Haarlem", "Utrecht"],
    workload: "50% ik krijg maar de helft van wat ik aankan",
    services: ["Fotografie", "Video", "360"],
    earnings: "Minimaal 1500,-",
  },
  {
    id: 2,
    name: "Milan Jansen",
    cities: ["Rotterdam", "Den Haag", "Breda"],
    workload: "20% Ik krijg nog te weinig opdrachten",
    services: ["Fotografie", "Wescan"],
    earnings: "Minimaal 1000,-",
  },
  {
    id: 3,
    name: "Noor Bakker",
    cities: ["Amsterdam", "Amersfoort"],
    workload: "5% ik krijg bijna geen opdrachten",
    services: ["Fotografie", "360"],
    earnings: "Minimaal 500,-",
  },
  {
    id: 4,
    name: "Daan Smit",
    cities: ["Utrecht", "Arnhem", "Nijmegen"],
    workload: "66% Ik krijg ruim voldoende opdrachten, maar kan meer",
    services: ["Drone", "Hoogte foto"],
    earnings: "Minimaal 2000,-",
  },
  {
    id: 5,
    name: "Eva Visser",
    cities: ["Eindhoven", "Tilburg", "Maastricht"],
    workload: "100%+ Ik krijg mijn hele planning verzadigd aan opdrachten",
    services: ["Fotografie", "Video", "Hoogte foto"],
    earnings: "Minimaal 3000,-",
  },
];

const textDefaults = {
  appTitle: "Proland Real Estate fotografen voorkeuren app",
  appIntro:
    "Twee-pagina workflow voor PROLAND. Fotografen vullen op de eerste pagina de vragenlijst in. PROLAND bekijkt op de tweede pagina de opgeslagen resultaten via grafieken, filters en profieltabellen.",
  questionnaireTitle: "Fotografen vragenlijst",
  questionnaireIntro:
    "Dit is de openingspagina. Een fotograaf vult het formulier in, slaat het op, en daarna wordt het resultaat zichtbaar in het tabblad van PROLAND.",
  resultsTitle: "PROLAND resultaten",
  resultsIntro:
    "Interactieve resultatenpagina met filters, grafieken en opgeslagen fotografenprofielen.",
  question1: "1. Wat is je naam?",
  question2:
    "2. Hoeveel opdrachten krijg je ten opzichte van wat je zou willen krijgen?",
  question5: "5. Welke diensten kan je aan?",
  question6: "6. In welke grote steden van Nederland wil je werken?",
  question7: "7. Hoeveel wil je via Proland verdienen?",
};

const defaultResultBlocks = [
  { id: "filters", type: "filters", size: 5, visible: true },
  { id: "chart-earnings", type: "chart", size: 3, visible: true },
  { id: "summary-total", type: "summary", size: 1, visible: true },
  { id: "chart-workload", type: "chart", size: 3, visible: true },
  { id: "chart-cities", type: "chart", size: 3, visible: true },
  { id: "table", type: "table", size: 5, visible: true },
];

function countByLabel(items: any[], labels: any[], key: string) {
  return labels.map((item) => ({
    name: item.label,
    value: items.filter((entry) => entry[key] === item.value).length,
    detail: item.detail,
  }));
}

function getWorkloadPercentage(value: string) {
  if (!value) return 0;
  if (value.startsWith("0%")) return 0;
  if (value.startsWith("5%")) return 5;
  if (value.startsWith("20%")) return 20;
  if (value.startsWith("50%")) return 50;
  if (value.startsWith("66%")) return 66;
  if (value.startsWith("100%+")) return 100;
  return 0;
}

function getWorkloadColor(value: string) {
  if (!value) return "#a855f7";
  if (value.startsWith("100%+")) return "#15803d";
  if (value.startsWith("66%")) return "#86efac";
  if (value.startsWith("50%")) return "#eab308";
  if (value.startsWith("20%")) return "#f97316";
  if (value.startsWith("5%")) return "#dc2626";
  if (value.startsWith("0%")) return "#a855f7";
  return "#22c55e";
}

function getWorkloadTextColor(value: string) {
  if (!value) return "#ffffff";
  if (value.startsWith("66%")) return "#0f172a";
  if (value.startsWith("50%")) return "#0f172a";
  return "#ffffff";
}

function getEarningsAmount(value: string) {
  if (!value) return 0;
  const cleaned = String(value)
    .replace("Minimaal", "")
    .replace(",-", "")
    .replace(/\./g, "")
    .trim();
  const amount = Number(cleaned);
  return Number.isFinite(amount) ? amount : 0;
}

function formatEuroAmount(value: number) {
  return (
    new Intl.NumberFormat("nl-NL").format(Math.max(0, Math.round(value))) + ",-"
  );
}

function ThemeDot({
  isSelected,
  colorClass,
}: {
  isSelected?: boolean;
  colorClass: string;
}) {
  return (
    <span
      className={`theme-dot ${colorClass} ${isSelected ? "is-selected" : ""}`}
    />
  );
}

function SortIcon({
  active,
  direction,
}: {
  active: boolean;
  direction: "asc" | "desc";
}) {
  if (!active) return <ArrowUpDown className="icon-small" />;
  return direction === "asc" ? (
    <ArrowUp className="icon-small" />
  ) : (
    <ArrowDown className="icon-small" />
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("vragenlijst");
  const [cityFilter, setCityFilter] = useState("Alle steden");
  const [weeklyFilter, setWeeklyFilter] = useState("Alle opdrachtverhoudingen");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [photographers, setPhotographers] = useState(seedPhotographers);
  const [showThemeEditor, setShowThemeEditor] = useState(false);
  const [showLayoutEditor, setShowLayoutEditor] = useState(false);
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);
  const [editableText, setEditableText] = useState(textDefaults);
  const [editableOptions, setEditableOptions] = useState({
    workload: workloadOptions.map((option) => option.label),
    services: [...serviceOptions],
  });
  const [formData, setFormData] = useState({
    name: "",
    workload: "50% ik krijg maar de helft van wat ik aankan",
    cities: ["Amsterdam"],
    customCity: "",
    services: ["Fotografie"],
    earnings: "Minimaal 1000,-",
  });
  const [resultBlocks, setResultBlocks] = useState(defaultResultBlocks);
  const [availableCities, setAvailableCities] = useState(
    [...initialCities].sort((a, b) => a.localeCompare(b, "nl"))
  );
  const [tableSort, setTableSort] = useState<{
    key: "recent" | "name" | "cities" | "workload" | "services";
    direction: "asc" | "desc";
  }>({ key: "recent", direction: "desc" });
  const [submissionSort, setSubmissionSort] = useState<
    "recent" | "name" | "workload"
  >("recent");

  const normalizeCityName = (value: string) => {
    let cleaned = value.trim();
    while (cleaned.includes("  ")) cleaned = cleaned.replaceAll("  ", " ");
    if (!cleaned) return "";
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
  };

  const workloadOptionObjects = useMemo(() => {
    return editableOptions.workload.map((label, index) => {
      const base = workloadOptions[index];
      return {
        value: label,
        label,
        detail: base?.detail || label,
      };
    });
  }, [editableOptions.workload]);

  const serviceOptionList = useMemo(
    () => editableOptions.services,
    [editableOptions.services]
  );

  const filteredPhotographers = useMemo(() => {
    return photographers.filter((photographer) => {
      const matchesCity =
        cityFilter === "Alle steden" ||
        photographer.cities.includes(cityFilter);
      const matchesWeekly =
        weeklyFilter === "Alle opdrachtverhoudingen" ||
        photographer.workload === weeklyFilter;
      const matchesSearch = photographer.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCity && matchesWeekly && matchesSearch;
    });
  }, [photographers, cityFilter, weeklyFilter, searchQuery]);

  const workloadChartData = useMemo(() => {
    return countByLabel(
      filteredPhotographers,
      workloadOptionObjects,
      "workload"
    ).sort(
      (a, b) => getWorkloadPercentage(b.name) - getWorkloadPercentage(a.name)
    );
  }, [filteredPhotographers, workloadOptionObjects]);

  const earningsChartData = useMemo(() => {
    return earningsOptions.map((option) => ({
      name: option,
      value: filteredPhotographers.filter((entry) => entry.earnings === option)
        .length,
    }));
  }, [filteredPhotographers]);

  const cityChartData = useMemo(() => {
    return availableCities
      .map((city) => ({
        name: city,
        value: filteredPhotographers.filter((photographer) =>
          photographer.cities.includes(city)
        ).length,
      }))
      .filter((city) => city.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [filteredPhotographers, availableCities]);

  const workloadOrder = workloadOptionObjects.map((option) => option.value);

  const sortedPhotographers = useMemo(() => {
    const items = [...filteredPhotographers];
    items.sort((a, b) => {
      if (tableSort.key === "recent") {
        return tableSort.direction === "desc" ? b.id - a.id : a.id - b.id;
      }

      if (tableSort.key === "name") {
        return tableSort.direction === "asc"
          ? a.name.localeCompare(b.name, "nl")
          : b.name.localeCompare(a.name, "nl");
      }

      if (tableSort.key === "cities") {
        const aValue = (a.cities || []).join(", ");
        const bValue = (b.cities || []).join(", ");
        return tableSort.direction === "asc"
          ? aValue.localeCompare(bValue, "nl")
          : bValue.localeCompare(aValue, "nl");
      }

      if (tableSort.key === "workload") {
        const aIndex = workloadOrder.indexOf(a.workload);
        const bIndex = workloadOrder.indexOf(b.workload);
        return tableSort.direction === "asc"
          ? aIndex - bIndex
          : bIndex - aIndex;
      }

      if (tableSort.key === "services") {
        const aValue = (a.services || []).join(", ");
        const bValue = (b.services || []).join(", ");
        return tableSort.direction === "asc"
          ? aValue.localeCompare(bValue, "nl")
          : bValue.localeCompare(aValue, "nl");
      }

      return 0;
    });
    return items;
  }, [filteredPhotographers, tableSort, workloadOrder]);

  const sortedSubmissionPhotographers = useMemo(() => {
    const items = [...photographers];
    if (submissionSort === "name") {
      return items.sort((a, b) => a.name.localeCompare(b.name, "nl"));
    }
    if (submissionSort === "workload") {
      return items.sort(
        (a, b) =>
          getWorkloadPercentage(b.workload) - getWorkloadPercentage(a.workload)
      );
    }
    return items.sort((a, b) => b.id - a.id);
  }, [photographers, submissionSort]);

  const summaryCards = [
    {
      id: "summary-total",
      label: "Totaal fotografen",
      value: filteredPhotographers.length,
      icon: Users,
    },
  ];

  const handleTableSort = (
    key: "recent" | "name" | "cities" | "workload" | "services"
  ) => {
    setTableSort((current) =>
      current.key === key
        ? {
            key,
            direction: current.direction === "asc" ? "desc" : "asc",
          }
        : {
            key,
            direction: key === "recent" ? "desc" : "asc",
          }
    );
  };

  const toggleBlockVisibility = (id: string) => {
    setResultBlocks((current) =>
      current.map((block) =>
        block.id === id ? { ...block, visible: !block.visible } : block
      )
    );
  };

  const handleDeletePhotographer = (id: number) => {
    setPhotographers((current) =>
      current.filter((photographer) => photographer.id !== id)
    );
  };

  const handleCityToggle = (city: string) => {
    setFormData((current) => {
      const exists = current.cities.includes(city);
      const nextCities = exists
        ? current.cities.filter((entry) => entry !== city)
        : [...current.cities, city];

      return {
        ...current,
        cities: nextCities.length ? nextCities : current.cities,
      };
    });
  };

  const handleAddCustomCity = () => {
    const normalizedCity = normalizeCityName(formData.customCity);
    if (!normalizedCity) return;

    setAvailableCities((current) => {
      if (current.includes(normalizedCity)) return current;
      return [...current, normalizedCity].sort((a, b) =>
        a.localeCompare(b, "nl")
      );
    });

    setFormData((current) => ({
      ...current,
      cities: current.cities.includes(normalizedCity)
        ? current.cities
        : [...current.cities, normalizedCity],
      customCity: "",
    }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData((current) => {
      const exists = current.services.includes(service);
      const nextServices = exists
        ? current.services.filter((entry) => entry !== service)
        : [...current.services, service];

      return {
        ...current,
        services: nextServices.length ? nextServices : current.services,
      };
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setSavedMessage(
        "Vul eerst de naam van de fotograaf in voordat je opslaat."
      );
      return;
    }

    const normalizedCustomCity = normalizeCityName(formData.customCity);
    let nextCities = [...formData.cities];

    if (normalizedCustomCity && !nextCities.includes(normalizedCustomCity)) {
      nextCities.push(normalizedCustomCity);
    }

    if (normalizedCustomCity) {
      setAvailableCities((current) => {
        if (current.includes(normalizedCustomCity)) return current;
        return [...current, normalizedCustomCity].sort((a, b) =>
          a.localeCompare(b, "nl")
        );
      });
    }

    const newPhotographer = {
      id: Date.now(),
      name: formData.name.trim(),
      workload: formData.workload,
      cities: nextCities,
      services: formData.services,
      earnings: formData.earnings,
    };

    setPhotographers((current) => [newPhotographer, ...current]);
    setSavedMessage(
      `Opgeslagen: ${newPhotographer.name}. De gegevens zijn nu zichtbaar in het tabblad resultaten van PROLAND.`
    );

    setFormData({
      name: "",
      workload: "50% ik krijg maar de helft van wat ik aankan",
      cities: ["Amsterdam"],
      customCity: "",
      services: ["Fotografie"],
      earnings: "Minimaal 1000,-",
    });

    setActiveTab("resultaten");
  };

  const updateTextField = (key: string, value: string) => {
    setEditableText((current) => ({ ...current, [key]: value }));
  };

  const renderEditControls = (blockId: string) => {
    if (!showLayoutEditor) return null;
    const block = resultBlocks.find((item) => item.id === blockId);

    return (
      <div className="card-edit-controls">
        <button
          type="button"
          onClick={() => toggleBlockVisibility(blockId)}
          className="icon-button icon-button-small icon-button-white"
        >
          {block?.visible ? (
            <Eye className="icon-small" />
          ) : (
            <EyeOff className="icon-small" />
          )}
        </button>
      </div>
    );
  };

  const renderResultBlock = (block: any) => {
    if (!block.visible) return null;

    if (block.type === "summary") {
      const card = summaryCards.find((item) => item.id === block.id);
      if (!card) return null;
      const Icon = card.icon;

      return (
        <div key={block.id} className={`grid-span-${block.size}`}>
          <div className="panel-card">
            {renderEditControls(block.id)}
            <div className="summary-card-content with-top-space">
              <div>
                <p className="muted-text">{card.label}</p>
                <p className="summary-value">{card.value}</p>
              </div>
              <div className="summary-icon-wrap">
                <Icon className="icon-medium" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (block.id === "filters") return null;

    if (block.id === "chart-workload") {
      return (
        <div key={block.id} className={`grid-span-${block.size}`}>
          <div className="panel-card">
            {renderEditControls(block.id)}
            <div className="with-top-space">
              <h3 className="section-title">
                Opdrachten ten opzichte van gewenste capaciteit
              </h3>
              <p className="section-subtitle">
                Hoeveel opdrachten fotografen nu krijgen ten opzichte van wat
                zij zouden willen krijgen.
              </p>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={workloadChartData}
                    layout="vertical"
                    margin={{ left: 20, right: 32 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={190}
                      tick={{ fontSize: 12 }}
                      interval={0}
                    />
                    <Tooltip />
                    <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                      {workloadChartData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={getWorkloadColor(entry.name)}
                        />
                      ))}
                      <LabelList
                        dataKey="value"
                        position="right"
                        formatter={(value: any) => `${value}`}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (block.id === "chart-earnings") {
      return (
        <div key={block.id} className={`grid-span-${block.size}`}>
          <div className="panel-card">
            {renderEditControls(block.id)}
            <div className="with-top-space">
              <h3 className="section-title">
                Gewenste minimale verdiensten via Proland
              </h3>
              <p className="section-subtitle">
                Hoeveel fotografen minimaal via Proland zouden willen verdienen.
              </p>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={earningsChartData}
                    layout="vertical"
                    margin={{ left: 20, right: 32 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={120}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                      {earningsChartData.map((entry) => (
                        <Cell key={entry.name} fill="#22c55e" />
                      ))}
                      <LabelList
                        dataKey="value"
                        position="right"
                        fill="#22c55e"
                        formatter={(value: any) => `${value}`}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (block.id === "chart-cities") {
      return (
        <div key={block.id} className={`grid-span-${block.size}`}>
          <div className="panel-card">
            {renderEditControls(block.id)}
            <div className="with-top-space">
              <h3 className="section-title">Stedenoverzicht</h3>
              <p className="section-subtitle">
                Hoeveel fotografen per stad zijn geselecteerd binnen de
                gefilterde dataset.
              </p>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={cityChartData}
                    layout="vertical"
                    margin={{ left: 20, right: 32 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={90}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                      {cityChartData.map((entry) => (
                        <Cell key={entry.name} fill="#22c55e" />
                      ))}
                      <LabelList
                        dataKey="value"
                        position="right"
                        fill="#22c55e"
                        formatter={(value: any) => `${value}`}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (block.id === "table") {
      return (
        <div key={block.id} className={`grid-span-${block.size}`}>
          <div className="panel-card">
            {renderEditControls(block.id)}
            <div className="with-top-space">
              <h3 className="section-title">Opgeslagen fotografenprofielen</h3>
              <p className="section-subtitle">
                Deze tabel wordt live bijgewerkt na iedere opgeslagen
                vragenlijst.
              </p>

              <div className="table-wrap">
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>
                        <button
                          type="button"
                          className="table-sort-button"
                          onClick={() => handleTableSort("name")}
                        >
                          Naam{" "}
                          <SortIcon
                            active={tableSort.key === "name"}
                            direction={tableSort.direction}
                          />
                        </button>
                      </th>
                      <th>
                        <button
                          type="button"
                          className="table-sort-button"
                          onClick={() => handleTableSort("cities")}
                        >
                          Voorkeurssteden{" "}
                          <SortIcon
                            active={tableSort.key === "cities"}
                            direction={tableSort.direction}
                          />
                        </button>
                      </th>
                      <th>
                        <button
                          type="button"
                          className="table-sort-button"
                          onClick={() => handleTableSort("workload")}
                        >
                          Opdrachten t.o.v. wens{" "}
                          <SortIcon
                            active={tableSort.key === "workload"}
                            direction={tableSort.direction}
                          />
                        </button>
                      </th>
                      <th>
                        <button
                          type="button"
                          className="table-sort-button"
                          onClick={() => handleTableSort("services")}
                        >
                          Diensten{" "}
                          <SortIcon
                            active={tableSort.key === "services"}
                            direction={tableSort.direction}
                          />
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPhotographers.map((photographer) => (
                      <tr key={photographer.id}>
                        <td className="font-medium">{photographer.name}</td>
                        <td>{photographer.cities.join(", ")}</td>
                        <td>
                          <span
                            className="workload-badge"
                            style={{
                              backgroundColor: getWorkloadColor(
                                photographer.workload
                              ),
                              color: getWorkloadTextColor(
                                photographer.workload
                              ),
                            }}
                          >
                            {photographer.workload}
                          </span>
                        </td>
                        <td>{(photographer.services || []).join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="app-shell">
      <div className="page-container">
        <header className="panel-card header-panel">
          <div className="header-top-row">
            <div>
              <p className="brand-kicker">PROLAND</p>
              <h1 className="page-title">{editableText.appTitle}</h1>
              <p className="page-intro">{editableText.appIntro}</p>
            </div>

            <div className="header-actions">
              <div className="tab-switcher">
                {[
                  {
                    id: "vragenlijst",
                    label: "Vragenlijst",
                    icon: ClipboardList,
                  },
                  {
                    id: "resultaten",
                    label: "PROLAND resultaten",
                    icon: Building2,
                  },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`tab-button ${isActive ? "is-active" : ""}`}
                    >
                      <Icon className="icon-small" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="icon-button-row">
                <button
                  type="button"
                  onClick={() => setShowThemeEditor((current) => !current)}
                  title="Thema bewerken"
                  className="icon-button"
                >
                  <Palette className="icon-small" />
                </button>

                {activeTab === "resultaten" ? (
                  <button
                    type="button"
                    onClick={() => setShowLayoutEditor((current) => !current)}
                    title="Resultaten bewerken"
                    className="icon-button"
                  >
                    <Settings2 className="icon-small" />
                  </button>
                ) : null}

                {activeTab === "vragenlijst" ? (
                  <button
                    type="button"
                    onClick={() => setShowQuestionEditor((current) => !current)}
                    title="Vragen bewerken"
                    className="icon-button"
                  >
                    <ListChecks className="icon-small" />
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          {activeTab === "resultaten" ? (
            <div className="results-filter-panel">
              <div>
                <h2 className="section-heading-large">
                  {editableText.resultsTitle}
                </h2>
                <p className="section-subtitle">{editableText.resultsIntro}</p>
              </div>

              <div className="filter-grid">
                <select
                  value={cityFilter}
                  onChange={(event) => setCityFilter(event.target.value)}
                  className="input-field"
                >
                  <option>Alle steden</option>
                  {availableCities.map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </select>

                <select
                  value={weeklyFilter}
                  onChange={(event) => setWeeklyFilter(event.target.value)}
                  className="input-field"
                >
                  <option>Alle opdrachtverhoudingen</option>
                  {workloadOptionObjects.map((option) => (
                    <option key={option.value}>{option.value}</option>
                  ))}
                </select>

                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Zoek fotograaf"
                  className="input-field"
                />
              </div>
            </div>
          ) : null}
        </header>

        {showThemeEditor ? (
          <section className="panel-card">
            <div className="two-column-grid">
              <div>
                <div className="section-label-row">
                  <Palette className="icon-small" />
                  <h3 className="section-title">Kleuren en uiterlijk</h3>
                </div>
                <p className="section-subtitle">
                  In deze CSS-versie kun je het kleurensysteem later nog verder
                  verfijnen.
                </p>

                <div className="spacing-top-lg">
                  <div className="theme-grid">
                    <button type="button" className="theme-button">
                      <span>Wit</span>
                      <ThemeDot isSelected colorClass="theme-dot-white" />
                    </button>
                    <button type="button" className="theme-button">
                      <span>Licht groen</span>
                      <ThemeDot colorClass="theme-dot-green" />
                    </button>
                    <button type="button" className="theme-button">
                      <span>Licht blauw</span>
                      <ThemeDot colorClass="theme-dot-blue" />
                    </button>
                    <button type="button" className="theme-button">
                      <span>Licht paars</span>
                      <ThemeDot colorClass="theme-dot-purple" />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="section-label-row">
                  <Type className="icon-small" />
                  <h3 className="section-title">Voorbeeld</h3>
                </div>
                <div className="preview-card">
                  <p className="brand-kicker">PROLAND</p>
                  <h4 className="preview-title">{editableText.appTitle}</h4>
                  <p className="section-subtitle">
                    Zo ziet de basisopmaak eruit in CodeSandbox.
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {showQuestionEditor ? (
          <section className="panel-card">
            <div className="two-column-grid">
              <div>
                <div className="section-label-row">
                  <ListChecks className="icon-small" />
                  <h3 className="section-title">Vragen bewerken</h3>
                </div>
                <p className="section-subtitle">
                  Pas hier de vraagteksten aan.
                </p>

                <div className="editor-grid spacing-top-lg">
                  {[
                    ["question1", "Vraag 1"],
                    ["question2", "Vraag 2"],
                    ["question5", "Vraag 5"],
                    ["question6", "Vraag 6"],
                    ["question7", "Vraag 7"],
                  ].map(([key, label]) => (
                    <div key={key}>
                      <label className="editor-label">{label}</label>
                      <input
                        value={(editableText as any)[key]}
                        onChange={(event) =>
                          updateTextField(key, event.target.value)
                        }
                        className="input-field input-full"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="section-label-row">
                  <Type className="icon-small" />
                  <h3 className="section-title">Vooraf ingevulde antwoorden</h3>
                </div>
                <p className="section-subtitle">Eén antwoord per regel.</p>

                <div className="editor-grid spacing-top-lg">
                  {[
                    ["workload", "Opdrachten ten opzichte van wens"],
                    ["services", "Diensten"],
                  ].map(([key, label]) => (
                    <div key={key}>
                      <label className="editor-label">{label}</label>
                      <textarea
                        value={((editableOptions as any)[key] || []).join("\n")}
                        onChange={(event) =>
                          setEditableOptions((current: any) => ({
                            ...current,
                            [key]: String(event.target.value || "")
                              .split("\n")
                              .map((item) => item.trim())
                              .filter(Boolean),
                          }))
                        }
                        rows={key === "services" ? 6 : 5}
                        className="input-field input-full textarea-field"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === "vragenlijst" ? (
          <section className="page-stack">
            <div className="page-stack">
              <div className="panel-card">
                <h2 className="section-heading-large">
                  {editableText.questionnaireTitle}
                </h2>
                <p className="section-subtitle">
                  {editableText.questionnaireIntro}
                </p>

                <form className="form-stack" onSubmit={handleSubmit}>
                  <div className="form-card">
                    <label className="editor-label">
                      {editableText.question1}
                    </label>
                    <input
                      value={formData.name}
                      onChange={(event) =>
                        setFormData({ ...formData, name: event.target.value })
                      }
                      className="input-field input-full spacing-top-sm"
                      placeholder="Vul volledige naam in"
                    />
                  </div>

                  <div className="form-card">
                    <p className="editor-label">{editableText.question2}</p>
                    <div className="option-stack spacing-top-sm">
                      {workloadOptionObjects.map((option) => (
                        <label key={option.value} className="option-card">
                          <input
                            type="radio"
                            name="workload"
                            checked={formData.workload === option.value}
                            onChange={() =>
                              setFormData({
                                ...formData,
                                workload: option.value,
                              })
                            }
                          />
                          <span>
                            <span className="option-title">{option.label}</span>
                            <span className="option-detail">
                              {option.detail}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-card">
                    <p className="editor-label">{editableText.question5}</p>
                    <p className="option-detail spacing-top-xs">
                      Meerdere keuzes mogelijk.
                    </p>
                    <div className="check-grid spacing-top-sm">
                      {serviceOptionList.map((service) => (
                        <label key={service} className="check-card">
                          <input
                            type="checkbox"
                            checked={formData.services.includes(service)}
                            onChange={() => handleServiceToggle(service)}
                          />
                          <span>{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-card">
                    <p className="editor-label">{editableText.question6}</p>
                    <p className="option-detail spacing-top-xs">
                      Meerdere keuzes mogelijk. Eén fotograaf kan meer dan één
                      stad selecteren. Je kunt hieronder ook zelf een stad
                      invullen.
                    </p>

                    <div className="check-grid spacing-top-sm">
                      {availableCities.map((city) => (
                        <label key={city} className="check-card">
                          <input
                            type="checkbox"
                            checked={formData.cities.includes(city)}
                            onChange={() => handleCityToggle(city)}
                          />
                          <span>{city}</span>
                        </label>
                      ))}
                    </div>

                    <div className="inline-form spacing-top-md">
                      <input
                        value={formData.customCity}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            customCity: event.target.value,
                          })
                        }
                        className="input-field input-full"
                        placeholder="Of vul hier zelf een stad in"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomCity}
                        className="primary-button"
                      >
                        Stad toevoegen
                      </button>
                    </div>
                  </div>

                  <div className="form-card">
                    <p className="editor-label">{editableText.question7}</p>
                    <div className="option-stack spacing-top-sm">
                      {earningsOptions.map((option) => (
                        <label key={option} className="option-card">
                          <input
                            type="radio"
                            name="earnings"
                            checked={formData.earnings === option}
                            onChange={() =>
                              setFormData({ ...formData, earnings: option })
                            }
                          />
                          <span className="option-title">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button className="primary-button primary-button-wide">
                    <CheckCircle2 className="icon-small" />
                    Vragenlijst opslaan
                  </button>
                </form>
              </div>

              <div className="panel-card">
                <h3 className="section-title">Wat wordt opgeslagen</h3>
                <ul className="bullet-list spacing-top-md">
                  <li>
                    • Hoeveel opdrachten iemand nu krijgt ten opzichte van wat
                    hij of zij zou willen
                  </li>
                  <li>• Diensten die de fotograaf aankan</li>
                  <li>• Voorkeurssteden</li>
                  <li>• Gewenste minimale verdiensten via Proland</li>
                </ul>

                {savedMessage ? (
                  <p className="status-message spacing-top-md">
                    {savedMessage}
                  </p>
                ) : null}
              </div>
            </div>
          </section>
        ) : (
          <section className="page-stack">
            <div className="results-grid">
              {resultBlocks
                .filter((block) => block.visible)
                .map((block) => renderResultBlock(block))}
            </div>

            <div className="panel-card">
              <div className="submissions-header-row">
                <div>
                  <h3 className="section-title">
                    Huidig opgeslagen inzendingen
                  </h3>
                  <p className="section-subtitle">
                    Deze demo bewaart de inzendingen in de app zelf, zodat het
                    resultaten-tabblad direct wordt bijgewerkt.
                  </p>
                </div>

                <div className="sort-chip-row">
                  <span className="muted-text">Sorteer op:</span>
                  <button
                    type="button"
                    onClick={() => setSubmissionSort("workload")}
                    className={`chip-button ${
                      submissionSort === "workload" ? "is-active" : ""
                    }`}
                  >
                    Verzadiging opdrachten
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubmissionSort("name")}
                    className={`chip-button ${
                      submissionSort === "name" ? "is-active" : ""
                    }`}
                  >
                    Naam
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubmissionSort("recent")}
                    className={`chip-button ${
                      submissionSort === "recent" ? "is-active" : ""
                    }`}
                  >
                    Standaard
                  </button>
                </div>
              </div>

              <div className="submission-list spacing-top-md">
                {sortedSubmissionPhotographers
                  .slice(0, 5)
                  .map((photographer) => {
                    const usagePercentage = getWorkloadPercentage(
                      photographer.workload
                    );
                    const desiredMonthlyAmount = getEarningsAmount(
                      photographer.earnings
                    );
                    const remainingMonthlyAmount =
                      desiredMonthlyAmount * (1 - usagePercentage / 100);

                    return (
                      <div key={photographer.id} className="submission-card">
                        <div className="submission-card-top">
                          <div className="submission-name-row">
                            {showLayoutEditor ? (
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeletePhotographer(photographer.id)
                                }
                                className="delete-button"
                                aria-label={`Verwijder ${photographer.name}`}
                              >
                                <X className="icon-small" />
                              </button>
                            ) : null}
                            <p className="font-medium">{photographer.name}</p>
                          </div>

                          <span
                            className="workload-badge"
                            style={{
                              backgroundColor: getWorkloadColor(
                                photographer.workload
                              ),
                              color: getWorkloadTextColor(
                                photographer.workload
                              ),
                            }}
                          >
                            {photographer.workload}
                          </span>
                        </div>

                        <p className="accent-text spacing-top-sm">
                          {photographer.workload}
                        </p>
                        <p className="section-subtitle spacing-top-sm">
                          {(photographer.services || []).join(", ")}
                        </p>
                        <p className="section-subtitle spacing-top-sm">
                          {photographer.earnings}
                        </p>
                        <p className="section-subtitle spacing-top-sm">
                          {photographer.cities.join(", ")}
                        </p>

                        <div className="submission-usage-row">
                          <div className="usage-bar-track">
                            <div
                              className="usage-bar-fill"
                              style={{
                                width: `${usagePercentage}%`,
                                backgroundColor: getWorkloadColor(
                                  photographer.workload
                                ),
                              }}
                            />
                          </div>
                          <p className="remaining-euro-text">
                            Fotograaf heeft nog{" "}
                            {formatEuroAmount(remainingMonthlyAmount)} nodig
                            deze maand.
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
