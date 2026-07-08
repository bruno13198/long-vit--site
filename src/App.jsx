import React, { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronUp, Users, Beaker, Apple, Activity, Leaf, Moon, FlaskConical, Heart, FlaskRound, RefreshCw, ShieldCheck, ArrowRight, Microscope, Salad, PersonStanding, BedDouble } from "lucide-react";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
`;

const GRADE_INFO = {
  A: { label: "Preuve forte", color: "#1F8A5C", desc: "Essais randomisés multiples et méta-analyses convergentes" },
  B: { label: "Preuve modérée", color: "#8AA83B", desc: "Résultats prometteurs, réplication encore limitée" },
  C: { label: "Preuve faible", color: "#E2972E", desc: "Études préliminaires ou effets modestes/inconstants" },
  D: { label: "Preuve insuffisante", color: "#D65C3D", desc: "Surtout marketing ou données animales/in vitro" },
  E: { label: "Preuve contraire", color: "#B23A4E", desc: "Des études solides n'ont trouvé aucun effet, ou ont montré un effet négatif" },
};

const ALIMENTS = [
  { id: 1, nom: "Poissons gras (saumon, maquereau, sardine)", categorie: "Protéines", grade: "A", etudes: 61, resume: "Riches en oméga-3 EPA/DHA, associés à une réduction du risque cardiovasculaire et de mortalité toutes causes dans de larges cohortes.", sources: [{ label: "Méta-analyse de 23 cohortes — poisson et mortalité toutes causes (PubMed)", url: "https://pubmed.ncbi.nlm.nih.gov/28802305/" }] },
  { id: 2, nom: "Légumes verts à feuilles", categorie: "Légumes", grade: "A", etudes: 48, resume: "Apport élevé en folates, nitrates et lutéine ; lié à un déclin cognitif plus lent et une mortalité réduite." },
  { id: 3, nom: "Fruits à coque (noix, amandes)", categorie: "Oléagineux", grade: "A", etudes: 39, resume: "Une poignée par jour est associée à une baisse du risque cardiovasculaire dans plusieurs essais contrôlés.", sources: [{ label: "Méta-analyse dose-réponse — noix et mortalité (PubMed)", url: "https://pubmed.ncbi.nlm.nih.gov/27916000/" }] },
  { id: 4, nom: "Huile d'olive extra vierge", categorie: "Matières grasses", grade: "A", etudes: 44, resume: "Pilier du régime méditerranéen, effet protecteur cardiovasculaire confirmé par essai randomisé à grande échelle (PREDIMED).", sources: [{ label: "PREDIMED — huile d'olive et mortalité cardiovasculaire (PubMed)", url: "https://pubmed.ncbi.nlm.nih.gov/24886626/" }] },
  { id: 5, nom: "Légumineuses (lentilles, pois chiches)", categorie: "Protéines végétales", grade: "A", etudes: 33, resume: "Fibres et protéines végétales associées à une meilleure régulation glycémique et à une longévité accrue." },
  { id: 6, nom: "Baies (myrtilles, fraises)", categorie: "Fruits", grade: "A", etudes: 29, resume: "Riches en anthocyanes, effets positifs répétés sur la mémoire et la santé vasculaire." },
  { id: 7, nom: "Yaourt et aliments fermentés", categorie: "Laitiers", grade: "B", etudes: 22, resume: "Impact favorable sur le microbiote, mais les effets sur des issues de santé dures restent moins établis." },
  { id: 8, nom: "Thé vert", categorie: "Boissons", grade: "B", etudes: 27, resume: "Catéchines associées à une réduction modeste du risque cardiométabolique, effet dose difficile à isoler." },
  { id: 9, nom: "Curcuma / curcumine", categorie: "Épices", grade: "B", etudes: 31, resume: "Propriétés anti-inflammatoires démontrées in vitro ; biodisponibilité orale faible limite l'effet clinique.", articleUrl: "/article-curcuma.html" },
  { id: 10, nom: "Ail", categorie: "Légumes", grade: "B", etudes: 18, resume: "Effets sur la tension artérielle observés, mais tailles d'effet modestes et études souvent courtes.", articleUrl: "/article-ail.html" },
  { id: 11, nom: "Chocolat noir (>70%)", categorie: "Autres", grade: "C", etudes: 14, resume: "Flavanols intéressants, mais les essais sont petits et l'effet se dilue avec le sucre et les graisses ajoutées." },
  { id: 12, nom: "Super-aliments exotiques (spiruline, baies de goji)", categorie: "Autres", grade: "D", etudes: 6, resume: "Antioxydants présents, mais aucune preuve clinique solide d'un bénéfice supérieur aux fruits et légumes courants." },
  { id: 13, nom: "Vin rouge (consommation modérée)", categorie: "Boissons", grade: "E", etudes: 20, resume: "Ancienne hypothèse cardioprotectrice invalidée par des études de randomisation mendélienne : aucun effet causal protecteur identifié." },
  { id: 14, nom: "Suppléments de bêta-carotène à haute dose", categorie: "Supplémentation", grade: "E", etudes: 11, resume: "Deux grands essais randomisés (CARET, ATBC) ont montré une augmentation du risque de cancer du poumon chez les fumeurs supplémentés.", sources: [{ label: "Essai CARET — bêta-carotène et cancer du poumon (PubMed)", url: "https://pubmed.ncbi.nlm.nih.gov/15572756/" }] },
];

const COMPORTEMENTS = [
  { id: 1, nom: "Activité physique régulière", categorie: "Mouvement", grade: "A", etudes: 84, resume: "Le facteur le plus documenté de réduction de la mortalité toutes causes, à toutes les intensités." },
  { id: 2, nom: "Sommeil de 7 à 9 heures", categorie: "Récupération", grade: "A", etudes: 52, resume: "Durée associée de façon constante à un meilleur profil métabolique et cognitif ; les extrêmes (trop court ou trop long) sont défavorables." },
  { id: 3, nom: "Ne pas fumer", categorie: "Toxiques", grade: "A", etudes: 90, resume: "Cause évitable de mortalité la mieux établie en épidémiologie, effet massif et reproduit sur des décennies." },
  { id: 4, nom: "Liens sociaux forts", categorie: "Social", grade: "A", etudes: 35, resume: "La qualité du réseau social est l'un des meilleurs prédicteurs de longévité dans les études de cohorte longitudinales.", sources: [{ label: "Holt-Lunstad et al. — méta-analyse relations sociales et mortalité (PMC)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2910600/" }] },
  { id: 5, nom: "Méditation et gestion du stress", categorie: "Mental", grade: "B", etudes: 26, resume: "Réduction mesurable du cortisol et de la tension artérielle ; effets sur la mortalité encore peu étudiés directement." },
  { id: 6, nom: "Jeûne intermittent", categorie: "Alimentation", grade: "B", etudes: 23, resume: "Bénéfices métaboliques à court terme bien documentés ; peu de données humaines sur le très long terme." },
  { id: 7, nom: "Sauna régulier", categorie: "Récupération", grade: "B", etudes: 12, resume: "Cohortes finlandaises montrant une association avec une mortalité cardiovasculaire réduite, causalité pas totalement isolée.", sources: [{ label: "Étude de cohorte KIHD — sauna et mortalité cardiovasculaire (PubMed)", url: "https://pubmed.ncbi.nlm.nih.gov/30486813/" }] },
  { id: 8, nom: "Restriction calorique modérée", categorie: "Alimentation", grade: "B", etudes: 17, resume: "Effets robustes sur les marqueurs de vieillissement chez l'animal ; essais humains (CALERIE) prometteurs mais courts." },
  { id: 9, nom: "Correction d'une carence en vitamine D", categorie: "Supplémentation", grade: "B", etudes: 21, resume: "Bénéfice net surtout démontré chez les personnes carencées ; peu d'effet supplémentaire au-delà du seuil normal." },
  { id: 10, nom: "Exposition régulière au froid", categorie: "Récupération", grade: "C", etudes: 9, resume: "Effets intéressants sur l'humeur et l'inflammation, mais essais petits et protocoles très hétérogènes." },
  { id: 11, nom: "Régimes très pauvres en graisses (strict low-fat)", categorie: "Alimentation", grade: "E", etudes: 15, resume: "Recommandation dominante des années 1980-90 ; les grands essais ultérieurs (Women's Health Initiative) n'ont montré aucun bénéfice cardiovasculaire net." },
];

function GradeStamp({ grade, size = "md" }) {
  const info = GRADE_INFO[grade];
  const dim = size === "sm" ? 34 : 46;
  return (
    <div
      title={info.label}
      style={{
        width: dim,
        height: dim,
        borderRadius: "50%",
        border: `2px solid ${info.color}`,
        color: info.color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'IBM Plex Mono', monospace",
        fontWeight: 600,
        fontSize: size === "sm" ? 15 : 19,
        transform: "rotate(-6deg)",
        flexShrink: 0,
        background: "#F7F4EC",
      }}
    >
      {grade}
    </div>
  );
}

function EvidenceBar({ grade }) {
  const order = ["E", "D", "C", "B", "A"];
  const level = order.indexOf(grade) + 1;
  const info = GRADE_INFO[grade];
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {order.map((g, i) => (
        <div
          key={g}
          style={{
            width: 14,
            height: 5,
            borderRadius: 2,
            background: i < level ? info.color : "#DDD5BE",
          }}
        />
      ))}
    </div>
  );
}

function Row({ item, expanded, onToggle }) {
  const info = GRADE_INFO[item.grade];
  return (
    <div
      style={{
        borderBottom: "1px solid #DDD5BE",
        cursor: "pointer",
      }}
      onClick={onToggle}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 4px" }}>
        <GradeStamp grade={item.grade} size="sm" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 600, color: "#1B1F1D" }}>
            {item.nom}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                color: "#6B6558",
                background: "#EFE7D0",
                padding: "2px 7px",
                borderRadius: 3,
              }}
            >
              {item.categorie}
            </span>
            <EvidenceBar grade={item.grade} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#6B6558", fontSize: 13, fontFamily: "'IBM Plex Mono', monospace" }}>
          <Beaker size={14} />
          {item.etudes}
        </div>
        {expanded ? <ChevronUp size={18} color="#6B6558" /> : <ChevronDown size={18} color="#6B6558" />}
      </div>
      {expanded && (
        <div style={{ padding: "0 4px 20px 66px", maxWidth: 640 }}>
          <div style={{ fontSize: 14, lineHeight: 1.6, color: "#2A2A22", fontFamily: "'Inter', sans-serif" }}>
            {item.resume}
          </div>
          <div style={{ marginTop: 10, fontSize: 12.5, fontFamily: "'Inter', sans-serif", color: info.color, fontWeight: 600 }}>
            {info.label} — {info.desc}
          </div>
          {item.articleUrl && (
            <a
              href={item.articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "inline-block", marginTop: 12, fontSize: 13, fontWeight: 600,
                color: "#fff", background: "#1F8A6E", padding: "7px 14px", borderRadius: 6,
                textDecoration: "none", fontFamily: "'Inter', sans-serif",
              }}
            >
              Lire l'article complet ↗
            </a>
          )}
          {item.sources && item.sources.length > 0 && (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
              {item.sources.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{ fontSize: 12.5, color: "#1F8A6E", textDecoration: "underline", fontFamily: "'Inter', sans-serif" }}
                >
                  {s.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ClassementTool({ initialTab = "aliments" }) {
  const [tab, setTab] = useState(initialTab);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("grade");
  const [expandedId, setExpandedId] = useState(null);

  const data = tab === "aliments" ? ALIMENTS : COMPORTEMENTS;
  const gradeOrder = { A: 0, B: 1, C: 2, D: 3, E: 4 };

  const filtered = useMemo(() => {
    let list = data.filter((item) =>
      item.nom.toLowerCase().includes(query.toLowerCase()) ||
      item.categorie.toLowerCase().includes(query.toLowerCase())
    );
    if (sortBy === "grade") {
      list = [...list].sort((a, b) => gradeOrder[a.grade] - gradeOrder[b.grade]);
    } else if (sortBy === "etudes") {
      list = [...list].sort((a, b) => b.etudes - a.etudes);
    } else if (sortBy === "alpha") {
      list = [...list].sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
    }
    return list;
  }, [data, query, sortBy]);

  return (
    <div style={{ minHeight: "100vh", background: "#F7F4EC", fontFamily: "'Inter', sans-serif" }}>
      <style>{FONT_IMPORT}</style>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 20px 80px" }}>
        <header style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: 1.5, color: "#1F8A6E", textTransform: "uppercase", marginBottom: 8 }}>
            Fondé sur les preuves
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 36, fontWeight: 700, color: "#1B1F1D", margin: 0, lineHeight: 1.15 }}>
            Classements santé &amp; longévité
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, color: "#6B6558", marginTop: 10, maxWidth: 520 }}>
            Chaque entrée reçoit une note de A à E selon la solidité des preuves scientifiques disponibles — pas selon la popularité.
          </p>
        </header>

        <div style={{ borderRadius: 12, overflow: "hidden", margin: "0 0 28px", height: 140 }}>
          <img src="/images/market-crates.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ display: "flex", gap: 7, marginBottom: 28 }}>
          {["#E8467C", "#F5B324", "#F0662D", "#7CB342", "#E63946"].map((c) => (
            <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
          {[
            { id: "aliments", label: "Aliments" },
            { id: "comportements", label: "Comportements" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setExpandedId(null); }}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 13,
                padding: "9px 18px",
                borderRadius: 20,
                border: `1.5px solid ${tab === t.id ? "#1F8A6E" : "#DDD5BE"}`,
                background: tab === t.id ? "#1F8A6E" : "transparent",
                color: tab === t.id ? "#F7F4EC" : "#6B6558",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search + sort */}
        <div style={{ display: "flex", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #DDD5BE", borderRadius: 8, padding: "8px 12px", flex: 1, minWidth: 200 }}>
            <Search size={16} color="#8C8570" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher..."
              style={{ border: "none", outline: "none", fontFamily: "'Inter', sans-serif", fontSize: 14, width: "100%", background: "transparent" }}
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12.5,
              border: "1px solid #DDD5BE",
              borderRadius: 8,
              padding: "0 12px",
              background: "#fff",
              color: "#2A2A22",
            }}
          >
            <option value="grade">Trier : niveau de preuve</option>
            <option value="etudes">Trier : nombre d'études</option>
            <option value="alpha">Trier : alphabétique</option>
          </select>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", margin: "18px 0 8px", fontSize: 11.5, fontFamily: "'IBM Plex Mono', monospace" }}>
          {Object.entries(GRADE_INFO).map(([g, info]) => (
            <div key={g} style={{ display: "flex", alignItems: "center", gap: 5, color: "#6B6558" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: info.color, display: "inline-block" }} />
              {g} — {info.label}
            </div>
          ))}
        </div>

        {/* List */}
        <div style={{ marginTop: 18, background: "#FFFFFF", border: "1px solid #DDD5BE", borderRadius: 10, padding: "4px 16px" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "30px 4px", color: "#8C8570", fontSize: 14 }}>Aucun résultat pour « {query} ».</div>
          ) : (
            filtered.map((item) => (
              <Row
                key={item.id}
                item={item}
                expanded={expandedId === item.id}
                onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
              />
            ))
          )}
        </div>

        <footer style={{ marginTop: 28, fontSize: 12, color: "#8C8570", display: "flex", alignItems: "center", gap: 6 }}>
          <Users size={13} />
          {data.length} entrées dans « {tab === "aliments" ? "Aliments" : "Comportements"} » — mis à jour manuellement à ce stade.
        </footer>
      </div>
    </div>
  );
}

const FOREST = "#2F4A34";
const FOREST_DARK = "#22362A";
const SAGE = "#7C9473";
const CREAM = "#FFFFFF";

function TreeLogo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="19" fill="#FFFFFF" stroke={FOREST} strokeWidth="1.5" />
      <path d="M20 30 L20 20" stroke={FOREST} strokeWidth="1.5" />
      <path d="M20 22 C14 22 12 17 14 13 C16 15 18 15 20 13 C22 15 24 15 26 13 C28 17 26 22 20 22 Z" fill={SAGE} stroke={FOREST} strokeWidth="1" />
      <circle cx="20" cy="14" r="2.4" fill={FOREST} />
    </svg>
  );
}

function HomeArticle({ onNavigate }) {
  const categories = [
    { icon: Microscope, label: "Science" },
    { icon: Salad, label: "Alimentation" },
    { icon: PersonStanding, label: "Sport" },
    { icon: BedDouble, label: "Sommeil" },
  ];
  const articles = [
    { img: "/images/veggies-fresh.jpg", title: "L'ail : que dit vraiment la science ?", url: "/article-ail.html" },
    { img: "/images/veggies-stack.jpg", title: "Le curcuma au-delà de la curcumine", url: "/article-curcuma.html" },
    { img: "/images/hero-fruits.jpg", title: "La pomme : que dit vraiment la science ?", url: "/article-pomme.html" },
    { img: "/images/market-crates.jpg", title: "Le classement complet des aliments", url: "aliments" },
    { img: "/images/hero-fruits.jpg", title: "Pourquoi les comportements comptent plus", url: "philosophie" },
  ];
  const trust = [
    { icon: FlaskRound, label: "Recherches scientifiques" },
    { icon: RefreshCw, label: "Mises à jour régulières" },
    { icon: ShieldCheck, label: "Sources fiables" },
    { icon: Leaf, label: "Indépendant et transparent" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: CREAM, fontFamily: "'Inter', sans-serif" }}>
      <style>{FONT_IMPORT}</style>

      <div style={{ position: "relative", height: 560, overflow: "hidden" }}>
        <img src="/images/forest-stream.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(10,20,10,0.55) 0%, rgba(10,20,10,0.25) 45%, rgba(10,20,10,0.05) 70%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", width: "100%", padding: "0 24px" }}>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 44, fontWeight: 700, color: "#fff", margin: "0 0 6px", lineHeight: 1.15 }}>
              La longévité<br />au quotidien.
            </h1>
            <p style={{ color: "#F2F0E6", fontSize: 15.5, margin: "14px 0 22px", maxWidth: 380 }}>
              Des choix éclairés aujourd'hui, pour une vie plus saine demain.
            </p>
            <button style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, letterSpacing: 0.5,
              background: FOREST, color: "#fff", border: "none", borderRadius: 24,
              padding: "12px 22px", cursor: "pointer", textTransform: "uppercase",
            }}>
              Explorer le site <Leaf size={13} style={{ verticalAlign: -2, marginLeft: 4 }} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "-40px auto 0", background: CREAM, borderRadius: 16, position: "relative", padding: "26px 24px", boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {categories.map((c, i) => (
            <div key={i} style={{ textAlign: "center", borderRight: i < categories.length - 1 ? "1px solid #E4E0D3" : "none" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", border: `1.5px solid ${FOREST}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                <c.icon size={22} color={FOREST} />
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, fontWeight: 700, color: "#1B1F1D", textTransform: "uppercase", letterSpacing: 0.3 }}>
                {c.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "36px 24px 10px" }}>
        <div style={{ textAlign: "center", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: 1, color: FOREST, marginBottom: 18 }}>
          <Leaf size={13} style={{ verticalAlign: -2, marginRight: 6 }} />RESSOURCES RÉCENTES
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14 }}>
          {articles.map((a, i) => {
            const isExternal = a.url.startsWith("/");
            const isAnchor = a.url === "philosophie";
            const CardInner = (
              <>
                <div style={{ height: 90, overflow: "hidden" }}>
                  <img src={a.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "10px 12px" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1B1F1D", lineHeight: 1.3, marginBottom: 6 }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: FOREST, fontFamily: "'IBM Plex Mono', monospace", display: "flex", alignItems: "center", gap: 3 }}>
                    Lire l'article <ArrowRight size={11} />
                  </div>
                </div>
              </>
            );
            const cardStyle = { textDecoration: "none", color: "inherit", border: "1px solid #DDD5BE", borderRadius: 10, overflow: "hidden", background: "#fff", cursor: "pointer", display: "block", width: "100%", textAlign: "left", padding: 0 };
            if (isExternal) {
              return <a key={i} href={a.url} target="_blank" rel="noreferrer" style={cardStyle}>{CardInner}</a>;
            }
            if (isAnchor) {
              return <a key={i} href="#philosophie" style={cardStyle}>{CardInner}</a>;
            }
            return <button key={i} onClick={() => onNavigate && onNavigate(a.url)} style={cardStyle}>{CardInner}</button>;
          })}
        </div>
      </div>

      <div id="philosophie" style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px 20px" }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700, color: "#1B1F1D", margin: "0 0 14px" }}>
          La santé ne se trouve pas dans une gélule
        </h2>
        <p style={{ fontSize: 15.5, color: "#2A2A22", marginBottom: 14 }}>
          À chaque nouvelle mode apparaissent des « super-aliments », des compléments alimentaires ou des molécules présentées comme la clé d'une vie longue et en bonne santé. Pourtant, lorsqu'on analyse les meilleures données scientifiques disponibles, le constat est toujours le même : aucun complément alimentaire ne rivalise avec les effets d'une bonne hygiène de vie.
        </p>
        <p style={{ fontSize: 15.5, color: "#2A2A22", marginBottom: 14 }}>
          La longévité ne dépend pas d'un produit miracle, mais de l'accumulation de centaines de petits choix répétés chaque jour.
        </p>

        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 700, color: "#1B1F1D", margin: "26px 0 12px" }}>
          Les véritables piliers d'une longue vie
        </h3>
        <p style={{ fontSize: 15.5, color: "#2A2A22", marginBottom: 14 }}>
          Les études menées sur plusieurs centaines de milliers de personnes montrent qu'une poignée d'habitudes explique une grande partie du risque de maladies cardiovasculaires, de diabète, de cancer et de déclin cognitif.
        </p>
        <p style={{ fontSize: 15.5, color: "#2A2A22", marginBottom: 8 }}>
          Les facteurs dont le niveau de preuve est le plus élevé sont :
        </p>
        <ul style={{ margin: "0 0 14px", paddingLeft: 20, fontSize: 15.5, color: "#2A2A22", lineHeight: 1.8 }}>
          <li>pratiquer une activité physique régulière, associant endurance et renforcement musculaire ;</li>
          <li>maintenir un poids de santé ;</li>
          <li>adopter une alimentation de qualité, riche en aliments peu transformés ;</li>
          <li>dormir suffisamment (environ 7 à 8 heures par nuit chez la plupart des adultes) ;</li>
          <li>ne pas fumer ;</li>
          <li>limiter la consommation d'alcool ;</li>
          <li>gérer le stress chronique ;</li>
          <li>conserver une vie sociale active.</li>
        </ul>
        <p style={{ fontSize: 15.5, color: "#2A2A22", marginBottom: 14 }}>
          Pris ensemble, ces comportements ont un impact bien supérieur à celui de n'importe quel aliment ou supplément étudié jusqu'à présent.
        </p>

        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 700, color: "#1B1F1D", margin: "26px 0 12px" }}>
          Les compléments alimentaires : utiles dans des situations précises
        </h3>
        <p style={{ fontSize: 15.5, color: "#2A2A22", marginBottom: 14 }}>
          Les compléments alimentaires ne sont pas inutiles. Certains présentent un intérêt démontré lorsqu'il existe une carence, un besoin particulier ou une indication médicale.
        </p>
        <p style={{ fontSize: 15.5, color: "#2A2A22", marginBottom: 14 }}>
          En revanche, chez une personne en bonne santé, les preuves qu'ils prolongent la durée de vie ou préviennent les maladies restent limitées pour la grande majorité d'entre eux. Les revues scientifiques récentes concluent que les bénéfices observés sont généralement modestes, spécifiques à certaines populations ou encore insuffisamment démontrés.
        </p>
        <p style={{ fontSize: 15.5, color: "#2A2A22", marginBottom: 14 }}>
          Autrement dit, ils complètent une bonne hygiène de vie, ils ne la remplacent jamais.
        </p>

        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 700, color: "#1B1F1D", margin: "26px 0 12px" }}>
          Les super-aliments n'existent pas
        </h3>
        <p style={{ fontSize: 15.5, color: "#2A2A22", marginBottom: 14 }}>
          L'ail, les baies, le curcuma, le thé vert, les noix ou l'huile d'olive possèdent des propriétés nutritionnelles intéressantes. Mais aucun aliment, pris isolément, n'a démontré qu'il pouvait prévenir à lui seul les maladies ou augmenter significativement l'espérance de vie.
        </p>
        <p style={{ fontSize: 15.5, color: "#2A2A22", marginBottom: 14 }}>
          Ce qui fait la différence est le modèle alimentaire dans son ensemble : beaucoup de végétaux, des céréales complètes, des légumineuses, des fruits à coque, des huiles de qualité, une consommation modérée de produits animaux et peu d'aliments ultra-transformés.
        </p>

        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 700, color: "#1B1F1D", margin: "26px 0 12px" }}>
          Une approche basée sur les preuves
        </h3>
        <p style={{ fontSize: 15.5, color: "#2A2A22", marginBottom: 14 }}>
          L'objectif de ce site est simple : distinguer les faits des promesses marketing.
        </p>
        <p style={{ fontSize: 15.5, color: "#2A2A22", marginBottom: 8 }}>
          Chaque article s'appuie autant que possible sur les niveaux de preuve les plus solides :
        </p>
        <ul style={{ margin: "0 0 14px", paddingLeft: 20, fontSize: 15.5, color: "#2A2A22", lineHeight: 1.8 }}>
          <li>méta-analyses ;</li>
          <li>revues systématiques ;</li>
          <li>essais cliniques randomisés ;</li>
          <li>recommandations des grandes sociétés savantes.</li>
        </ul>
        <p style={{ fontSize: 15.5, color: "#2A2A22", marginBottom: 14 }}>
          Lorsque les preuves sont insuffisantes ou contradictoires, cela sera clairement indiqué.
        </p>

        <div style={{ background: "#fff", border: "1px solid #DDD5BE", borderLeft: `4px solid ${FOREST}`, borderRadius: 8, padding: "18px 22px", margin: "22px 0" }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15, marginBottom: 8 }}>Notre conviction</div>
          <div style={{ fontSize: 14, color: "#2A2A22" }}>
            La meilleure stratégie santé n'est pas la plus spectaculaire, mais la plus durable : bien manger, bouger quotidiennement, bien dormir, entretenir ses relations sociales et éviter les comportements à risque. Ce sont ces habitudes, répétées pendant des années, qui offrent les bénéfices les plus importants pour la santé et la longévité.
          </div>
        </div>

        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 700, color: "#1B1F1D", margin: "26px 0 10px" }}>
          Références principales
        </h3>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12.5, color: "#5A5A4E", lineHeight: 1.8 }}>
          <li>Kaufman MA et al. Nutritional Supplements for Healthy Aging: A Critical Analysis Review. American Journal of Lifestyle Medicine, 2024.</li>
          <li>Evidence-Based Pathways to Healthy Aging: A Systematic Review and Meta-analysis of Lifestyle Interventions for Longevity and Well-Being, 2025.</li>
          <li>Early Biomarkers, Risk Factors, and Functional Indicators of Healthy Longevity and Their Relationship with Diet, 2025.</li>
          <li>How We Sleep, How We Move, How Long We Expect to Live, 2026.</li>
          <li>Nutrition and Longevity – Diet in Centenarians, 2026.</li>
        </ul>
      </div>

      <div style={{ background: FOREST_DARK, color: "#EDEBDD", padding: "26px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 20, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontStyle: "italic", fontFamily: "'Fraunces', serif", fontSize: 13.5, maxWidth: 320 }}>
            <Leaf size={16} color={SAGE} />
            « Prendre soin de soi aujourd'hui, c'est offrir du temps à la vie de demain. »
          </div>
          <div style={{ display: "flex", gap: 26, flexWrap: "wrap" }}>
            {trust.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11.5 }}>
                <t.icon size={15} color={SAGE} />
                {t.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EtudesScientifiques() {
  const articles = [
    { img: "/images/veggies-fresh.jpg", title: "L'ail : que dit vraiment la science ?", desc: "Tension artérielle, glycémie, cancers digestifs, rhume, antimicrobien — effet par effet, sources à l'appui.", url: "/article-ail.html" },
    { img: "/images/veggies-stack.jpg", title: "Le curcuma au-delà de la curcumine", desc: "Arthrose, glycémie, turmérones, et un point d'attention sur le foie que peu d'articles mentionnent.", url: "/article-curcuma.html" },
    { img: "/images/hero-fruits.jpg", title: "La pomme : que dit vraiment la science ?", desc: "Cardiovasculaire, diabète, cancer, poids, asthme — effet par effet, sources à l'appui.", url: "/article-pomme.html" },
  ];
  return (
    <div style={{ minHeight: "100vh", background: CREAM, fontFamily: "'Inter', sans-serif" }}>
      <style>{FONT_IMPORT}</style>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: 1.5, color: FOREST, textTransform: "uppercase", marginBottom: 10 }}>
          Études scientifiques
        </div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 700, color: "#1B1F1D", margin: "0 0 14px" }}>
          Les dossiers complets, aliment par aliment
        </h1>
        <p style={{ fontSize: 15.5, color: "#2A2A22", marginBottom: 30, maxWidth: 560 }}>
          Chaque dossier passe en revue les méta-analyses et revues systématiques disponibles, effet par effet, avec les sources vérifiées. De nouveaux dossiers s'ajoutent régulièrement.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
          {articles.map((a, i) => (
            <a key={i} href={a.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "inherit", border: "1px solid #DDD5BE", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
              <div style={{ height: 130, overflow: "hidden" }}>
                <img src={a.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "16px 18px" }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 600, color: "#1B1F1D", marginBottom: 8 }}>{a.title}</div>
                <div style={{ fontSize: 13, color: "#6B6558", marginBottom: 12, lineHeight: 1.5 }}>{a.desc}</div>
                <div style={{ fontSize: 12, color: FOREST, fontFamily: "'IBM Plex Mono', monospace", display: "flex", alignItems: "center", gap: 3 }}>
                  Lire le dossier <ArrowRight size={12} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function PageAVenir({ kicker, title, description, ideas }) {
  return (
    <div style={{ minHeight: "100vh", background: CREAM, fontFamily: "'Inter', sans-serif" }}>
      <style>{FONT_IMPORT}</style>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: 1.5, color: FOREST, textTransform: "uppercase", marginBottom: 10 }}>
          {kicker}
        </div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 30, fontWeight: 700, color: "#1B1F1D", margin: "0 0 14px" }}>
          {title}
        </h1>
        <p style={{ fontSize: 15.5, color: "#2A2A22", marginBottom: 26, maxWidth: 520 }}>
          {description}
        </p>
        <div style={{ background: "#fff", border: "1px solid #DDD5BE", borderLeft: `4px solid ${FOREST}`, borderRadius: 10, padding: "20px 24px" }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15, marginBottom: 10 }}>Au programme, bientôt :</div>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: "#2A2A22", lineHeight: 1.9 }}>
            {ideas.map((idea, i) => <li key={i}>{idea}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("accueil");
  return (
    <div>
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 24px", background: "#fff", borderBottom: "1px solid #DDD5BE",
        position: "sticky", top: 0, zIndex: 10, maxWidth: 900, margin: "0 auto",
      }}>
        <style>{FONT_IMPORT}</style>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <TreeLogo size={32} />
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 15, color: "#1B1F1D", letterSpacing: 0.3 }}>LONGÉVITÉ</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8.5, color: "#6B6558", letterSpacing: 0.5 }}>VIVRE MIEUX, PLUS LONGTEMPS</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[
            { id: "accueil", label: "Accueil" },
            { id: "aliments", label: "Aliments" },
            { id: "outils", label: "Outils" },
            { id: "etudes", label: "Études scientifiques" },
            { id: "complements", label: "Compléments alimentaires" },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPage(p.id)}
              style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, letterSpacing: 0.3,
                background: "none", border: "none", cursor: "pointer",
                color: page === p.id ? FOREST : "#6B6558",
                borderBottom: page === p.id ? `2px solid ${FOREST}` : "2px solid transparent",
                paddingBottom: 4, textTransform: "uppercase", whiteSpace: "nowrap",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </nav>
      {page === "accueil" && <HomeArticle onNavigate={setPage} />}
      {page === "aliments" && <ClassementTool initialTab="aliments" />}
      {page === "outils" && (
        <PageAVenir
          kicker="Outils"
          title="Les outils interactifs arrivent bientôt"
          description="Quiz de compléments, comparateur aliment contre aliment, calculateur d'habitudes — ces outils sont en préparation. En attendant, le classement complet reste consultable dès maintenant."
          ideas={["Quiz : quel complément pour quel objectif", "Comparateur côte-à-côte entre deux aliments", "Checklist quotidienne des comportements longévité"]}
        />
      )}
      {page === "etudes" && <EtudesScientifiques />}
      {page === "complements" && (
        <PageAVenir
          kicker="Compléments alimentaires"
          title="Une base dédiée aux compléments arrive bientôt"
          description="Contrairement aux aliments entiers, les compléments isolés (gélules, poudres, extraits) méritent leur propre classement — dosages, formes, interactions. Cette section est en cours de construction."
          ideas={["Classement des compléments par niveau de preuve", "Fiches dosage et forme (gélule, poudre, liquide)", "Alertes sur les interactions médicamenteuses connues"]}
        />
      )}
    </div>
  );
}
