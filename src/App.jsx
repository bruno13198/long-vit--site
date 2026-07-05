import React, { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronUp, Users, Beaker } from "lucide-react";

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

function ClassementTool() {
  const [tab, setTab] = useState("aliments");
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
        <div style={{ marginTop: 18, background: "#FBF8F0", border: "1px solid #DDD5BE", borderRadius: 10, padding: "4px 16px" }}>
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

function HomeArticle() {
  const dots = ["#E8467C", "#F5B324", "#F0662D", "#7CB342", "#E63946"];
  const DotDivider = () => (
    <div style={{ display: "flex", gap: 7, margin: "34px 0" }}>
      {dots.map((c, i) => <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />)}
    </div>
  );
  return (
    <div style={{ minHeight: "100vh", background: "#F7F4EC", fontFamily: "'Inter', sans-serif" }}>
      <style>{FONT_IMPORT}</style>

      <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
        <img src="/images/hero-fruits.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.05), #F7F4EC)" }} />
        <div style={{ position: "absolute", top: 16, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 8 }}>
          {dots.map((c, i) => <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, border: "2px solid #fff" }} />)}
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 80px" }}>

        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: 1.5, color: "#1F8A6E", textTransform: "uppercase", margin: "28px 0 10px" }}>
          Bienvenue
        </div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 34, fontWeight: 700, color: "#1B1F1D", margin: "0 0 18px", lineHeight: 1.2 }}>
          Ce n'est probablement pas une histoire de super-aliment
        </h1>
        <p style={{ fontSize: 16, color: "#2A2A22", marginBottom: 18 }}>
          La plupart des gens arrivent ici en cherchant LE complément ou LE super-aliment qui va tout changer. C'est compréhensible — c'est aussi, le plus souvent, la mauvaise question. Les données les plus solides en santé et longévité ne pointent pas vers un ingrédient miracle, mais vers un petit ensemble de comportements de base qui se renforcent mutuellement.
        </p>

        <DotDivider />

        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 21, fontWeight: 600, margin: "0 0 12px" }}>
          Les comportements s'additionnent, littéralement
        </h2>
        <p style={{ fontSize: 15.5, color: "#2A2A22", marginBottom: 14 }}>
          Bien dormir améliore la motivation à faire de l'exercice. L'exercice améliore à son tour la qualité du sommeil et régule l'appétit. Des liens sociaux solides augmentent la probabilité de tenir ses bonnes habitudes dans la durée. Ne pas fumer démultiplie les bénéfices de tout le reste, plutôt que de s'y ajouter simplement. Ce ne sont pas des facteurs isolés qu'on additionne — ce sont des leviers qui se renforcent les uns les autres.
        </p>
        <p style={{ fontSize: 15.5, color: "#2A2A22", marginBottom: 14 }}>
          C'est pour ça que l'onglet <b>Comportements</b> du classement (activité physique, sommeil, tabac, liens sociaux...) regroupe presque tous les facteurs de grade A — les preuves les plus solides qui existent en épidémiologie humaine. Aucun complément ne s'en approche.
        </p>

        <DotDivider />

        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 21, fontWeight: 600, margin: "0 0 12px" }}>
          Même côté alimentation, le battage médiatique ne suit pas les preuves
        </h2>
        <p style={{ fontSize: 15.5, color: "#2A2A22", marginBottom: 14 }}>
          Le curcuma, le thé vert ou les baies exotiques captent l'attention — mais si l'on classe les aliments selon la solidité des preuves humaines (cohortes prospectives, méta-analyses) plutôt que selon leur réputation, ce ne sont pas eux qui arrivent en tête. Les recommandations de référence en prévention (WCRF/AICR) misent sur des aliments bien plus ordinaires : céréales complètes, légumineuses, crucifères (brocoli, chou), légumes verts et huile d'olive. Ces organismes de référence déconseillent même explicitement l'usage de compléments à visée préventive.
        </p>
        <p style={{ fontSize: 15.5, color: "#2A2A22", marginBottom: 14 }}>
          Ce n'est pas que le curcuma ou le thé vert soient sans intérêt — on documente leurs effets en détail dans leurs fiches respectives. C'est juste qu'ils ne remplacent pas les fondamentaux, et que la hype médiatique n'est pas un bon indicateur de la solidité des preuves.
        </p>

        <div style={{
          borderRadius: 12, overflow: "hidden", margin: "28px 0", position: "relative", height: 160,
        }}>
          <img src="/images/veggies-stack.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>

        <div style={{ background: "#FBF8F0", border: "1px solid #DDD5BE", borderTop: "4px solid #F0662D", borderRadius: 12, padding: "22px 24px", margin: "28px 0" }}>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 600, margin: "0 0 10px" }}>En pratique</h3>
          <p style={{ fontSize: 15, color: "#2A2A22", marginBottom: 0 }}>
            Avant d'optimiser un détail (quel complément, quel super-aliment), assure-toi d'abord des fondamentaux : sommeil suffisant, activité physique régulière, alimentation majoritairement composée d'aliments peu transformés, liens sociaux entretenus, pas de tabac. Le reste — curcuma, oméga-3, ail — vient ensuite affiner, pas remplacer.
          </p>
        </div>

        <p style={{ fontSize: 15, color: "#6B6558" }}>
          Explore l'onglet <b>Classement</b> pour voir, aliment par aliment et comportement par comportement, ce que disent réellement les preuves — avec leur niveau de solidité et leurs sources.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("accueil");
  return (
    <div>
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        padding: "16px 0", background: "#F7F4EC",
        borderBottom: "3px solid transparent",
        borderImage: "linear-gradient(90deg, #E8467C, #F5B324, #F0662D, #7CB342, #E63946) 1",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <style>{FONT_IMPORT}</style>
        {[
          { id: "accueil", label: "Accueil" },
          { id: "classement", label: "Classement" },
        ].map((p) => (
          <button
            key={p.id}
            onClick={() => setPage(p.id)}
            style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 13,
              padding: "8px 18px", borderRadius: 20,
              border: `1.5px solid ${page === p.id ? "#1F8A6E" : "#DDD5BE"}`,
              background: page === p.id ? "#1F8A6E" : "transparent",
              color: page === p.id ? "#F7F4EC" : "#6B6558",
              cursor: "pointer",
            }}
          >
            {p.label}
          </button>
        ))}
      </nav>
      {page === "accueil" ? <HomeArticle /> : <ClassementTool />}
    </div>
  );
}
