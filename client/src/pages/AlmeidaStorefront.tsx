import { useEffect, useMemo, useState } from "react";
import "../almeida.css";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Filter,
  Heart,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  PackageCheck,
  Plus,
  Search,
  Send,
  ShoppingBag,
  SlidersHorizontal,
  Sofa,
  Sparkles,
  X,
} from "lucide-react";

type Category = "Todos" | "Sofás" | "Poltronas" | "Armários";

type Product = {
  id: string;
  name: string;
  category: Exclude<Category, "Todos">;
  condition: "Seminovo" | "Novo";
  price: string;
  image: string;
  alt: string;
  summary: string;
  description: string;
  specs: Array<[string, string]>;
  accent: string;
};

const WHATSAPP_NUMBER = "5582988066137";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
const ASSET_BASE_URL = `${import.meta.env.BASE_URL}almeida`;
const STORE_FRONT_IMAGE = `${ASSET_BASE_URL}/fachada-vitrine.webp`;
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Almeida%20M%C3%B3veis%20Usados%2C%20Rua%20Capit%C3%A3o%20Marinho%20Falc%C3%A3o%2C%20958%2C%20Macei%C3%B3%20-%20AL";

const products: Product[] = [
  {
    id: "sofa-marrom",
    name: "Sofá 2 lugares em tecido",
    category: "Sofás",
    condition: "Seminovo",
    price: "R$ 1.290",
    image: `${ASSET_BASE_URL}/sofa-marrom-vitrine.webp`,
    alt: "Sofá marrom de dois lugares em tecido",
    summary: "Conforto para a sala, com acabamento em tecido marrom.",
    description:
      "Peça de dois lugares com braços amplos e visual acolhedor para compor a sala. Consulte o vendedor para confirmar medidas, estado atual e condições.",
    specs: [
      ["Categoria", "Sofá"],
      ["Condição", "Seminovo"],
      ["Cor", "Marrom"],
    ],
    accent: "Café",
  },
  {
    id: "poltrona-clara",
    name: "Poltrona em tecido claro",
    category: "Poltronas",
    condition: "Seminovo",
    price: "R$ 690",
    image: `${ASSET_BASE_URL}/poltrona-clara-vitrine.webp`,
    alt: "Poltrona clara estofada",
    summary: "Uma peça confortável e versátil para leitura ou descanso.",
    description:
      "Poltrona estofada de tom claro, pensada para cantos de descanso, quarto ou sala. Confirme a disponibilidade e detalhes diretamente com a equipe.",
    specs: [
      ["Categoria", "Poltrona"],
      ["Condição", "Seminovo"],
      ["Acabamento", "Tecido claro"],
    ],
    accent: "Areia",
  },
  {
    id: "armario-multiuso",
    name: "Armário multiuso madeira e branco",
    category: "Armários",
    condition: "Novo",
    price: "R$ 1.190",
    image: `${ASSET_BASE_URL}/armario-madeira-vitrine.webp`,
    alt: "Armário multiuso branco e madeira",
    summary: "Organização com portas, gavetas e nicho central.",
    description:
      "Armário vertical com composição em madeira e branco, nicho aberto, portas e gavetas. Uma solução prática para cozinha, área de serviço ou organização.",
    specs: [
      ["Categoria", "Armário"],
      ["Condição", "Novo"],
      ["Acabamento", "Madeira e branco"],
    ],
    accent: "Madeira clara",
  },
];

const categories: Category[] = ["Todos", "Sofás", "Poltronas", "Armários"];

function formatItems(items: Product[]) {
  return items.map((item) => `• ${item.name} — ${item.price}`).join("\n");
}

export default function AlmeidaStorefront() {
  const [activeCategory, setActiveCategory] = useState<Category>("Todos");
  const [search, setSearch] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isSellerSheetOpen, setIsSellerSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [savedProducts, setSavedProducts] = useState<string[]>([]);
  const [queryProducts, setQueryProducts] = useState<Product[]>([]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Almeida Móveis Usados | Prévia comercial";

    return () => {
      document.title = previousTitle;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");

    return products.filter((product) => {
      const matchesCategory = activeCategory === "Todos" || product.category === activeCategory;
      const matchesSearch =
        !normalizedSearch ||
        `${product.name} ${product.category} ${product.description}`
          .toLocaleLowerCase("pt-BR")
          .includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const addToQuery = (product: Product) => {
    setQueryProducts((currentProducts) =>
      currentProducts.some((current) => current.id === product.id)
        ? currentProducts
        : [...currentProducts, product],
    );
    setSelectedProduct(null);
    setIsQuoteOpen(true);
  };

  const removeFromQuery = (productId: string) => {
    setQueryProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId));
  };

  const toggleSaved = (productId: string) => {
    setSavedProducts((currentProducts) =>
      currentProducts.includes(productId)
        ? currentProducts.filter((currentId) => currentId !== productId)
        : [...currentProducts, productId],
    );
  };

  const openWhatsApp = () => {
    const introduction =
      "Olá! Vi a prévia do catálogo da Almeida Móveis Usados e gostaria de confirmar disponibilidade e condições destas peças:";
    const message = `${introduction}\n\n${formatItems(queryProducts)}\n\nPode me ajudar?`;
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  const scrollToCatalog = () => {
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsMenuOpen(false);
  };

  return (
    <div className="almeida-site">
      <div className="preview-strip">
        <span>Prévia comercial</span>
        <span className="preview-dot" aria-hidden="true" />
        <span>Estoque e valores confirmados pela equipe antes da venda</span>
      </div>

      <header className="almeida-header">
        <a className="almeida-brand" href="#inicio" aria-label="Almeida Móveis Usados, início">
          <span className="brand-mark" aria-hidden="true">
            <Sofa size={22} strokeWidth={1.8} />
          </span>
          <span>
            <strong>Almeida</strong>
            <small>Móveis Usados</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Navegação principal">
          <a href="#inicio">Início</a>
          <a href="#catalogo">Catálogo</a>
          <a href="#como-funciona">Como comprar</a>
          <a href="#localizacao">Localização</a>
        </nav>

        <div className="header-actions">
          <button
            className="quote-icon-button"
            type="button"
            onClick={() => setIsQuoteOpen(true)}
            aria-label={`Itens selecionados: ${queryProducts.length}`}
          >
            <ShoppingBag size={20} />
            {queryProducts.length > 0 && <span>{queryProducts.length}</span>}
          </button>
          <button
            className="menu-button"
            type="button"
            onClick={() => setIsMenuOpen((currentState) => !currentState)}
            aria-expanded={isMenuOpen}
            aria-label="Abrir menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="mobile-nav" role="dialog" aria-label="Menu">
            <a href="#inicio" onClick={() => setIsMenuOpen(false)}>Início</a>
            <a href="#catalogo" onClick={() => setIsMenuOpen(false)}>Catálogo</a>
            <a href="#como-funciona" onClick={() => setIsMenuOpen(false)}>Como comprar</a>
            <a href="#localizacao" onClick={() => setIsMenuOpen(false)}>Localização</a>
            <button type="button" onClick={() => { setIsMenuOpen(false); setIsQuoteOpen(true); }}>
              Ver itens selecionados <ShoppingBag size={18} />
            </button>
          </div>
        )}
      </header>

      <main>
        <section className="hero-section" id="inicio">
          <img
            className="hero-image"
            src={STORE_FRONT_IMAGE}
            alt="Fachada da Almeida Móveis Usados em Maceió"
          />
          <div className="hero-scrim" />
          <div className="hero-content">
            <p className="eyebrow light-eyebrow"><span /> Maceió, Alagoas</p>
            <h1>Móveis que <em>contam</em> novas histórias.</h1>
            <p className="hero-copy">
              Encontre peças novas e seminovas para a sua casa. Veja os detalhes com calma e fale com a equipe quando encontrar o que procura.
            </p>
            <div className="hero-cta-row">
              <button className="button primary-button" type="button" onClick={scrollToCatalog}>
                Ver catálogo <ArrowRight size={18} />
              </button>
              <a className="button ghost-button" href={MAPS_URL} target="_blank" rel="noreferrer">
                <MapPin size={18} /> Visitar a loja
              </a>
            </div>
          </div>
          <div className="hero-facts" aria-label="Informações da loja">
            <div><strong>Desde 1994</strong><span>Tradição em Maceió</span></div>
            <div><strong>Novos & seminovos</strong><span>Peças para cada ambiente</span></div>
            <div><strong>Atendimento direto</strong><span>Fale pelo WhatsApp</span></div>
          </div>
        </section>

        <section className="catalog-section" id="catalogo">
          <div className="section-head">
            <div>
              <p className="eyebrow"><span /> Catálogo selecionado</p>
              <h2>Encontre a peça certa<br /><em>para o seu espaço.</em></h2>
            </div>
            <p className="section-intro">
              Este formato facilita para o cliente ver o produto e para o vendedor receber uma consulta já com as peças selecionadas.
            </p>
          </div>

          <div className="catalog-controls">
            <label className="search-field">
              <Search size={19} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Busque sofá, poltrona, armário..."
                aria-label="Buscar produto"
              />
              {search && (
                <button type="button" onClick={() => setSearch("")} aria-label="Limpar busca"><X size={16} /></button>
              )}
            </label>
            <div className="category-pills" aria-label="Categorias">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={activeCategory === category ? "active" : ""}
                  onClick={() => setActiveCategory(category)}
                >
                  {category === "Todos" ? <SlidersHorizontal size={15} /> : null}
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="catalog-meta">
            <span>{filteredProducts.length} {filteredProducts.length === 1 ? "peça encontrada" : "peças encontradas"}</span>
            <span><Filter size={14} /> Organize sua consulta em um único lugar</span>
          </div>

          <div className="product-grid">
            {filteredProducts.map((product, index) => {
              const isSelected = queryProducts.some((selected) => selected.id === product.id);
              const isSaved = savedProducts.includes(product.id);

              return (
                <article className="product-card" key={product.id} style={{ "--delay": `${index * 70}ms` } as React.CSSProperties}>
                  <div className="product-image-wrap">
                    <img src={product.image} alt={product.alt} />
                    <div className="card-topline">
                      <span className={`condition-tag ${product.condition === "Novo" ? "new" : ""}`}>{product.condition}</span>
                      <button
                        type="button"
                        className={isSaved ? "save-button saved" : "save-button"}
                        onClick={() => toggleSaved(product.id)}
                        aria-label={isSaved ? `Remover ${product.name} dos favoritos` : `Salvar ${product.name}`}
                      >
                        <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <button className="image-view-button" type="button" onClick={() => setSelectedProduct(product)}>
                      Ver detalhes <ArrowRight size={16} />
                    </button>
                  </div>
                  <div className="product-info">
                    <p className="product-category">{product.category} <span>•</span> {product.accent}</p>
                    <h3>{product.name}</h3>
                    <p className="product-summary">{product.summary}</p>
                    <div className="product-bottom">
                      <div>
                        <small>Valor na prévia</small>
                        <strong>{product.price}</strong>
                      </div>
                      <button
                        className={isSelected ? "select-button selected" : "select-button"}
                        type="button"
                        onClick={() => (isSelected ? removeFromQuery(product.id) : addToQuery(product))}
                      >
                        {isSelected ? <><Check size={17} /> Selecionado</> : <><Plus size={17} /> Selecionar</>}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="empty-results">
              <Search size={28} />
              <h3>Nenhuma peça encontrada.</h3>
              <p>Tente buscar por outro termo ou veja todas as categorias.</p>
              <button type="button" onClick={() => { setSearch(""); setActiveCategory("Todos"); }}>Ver catálogo completo</button>
            </div>
          )}
        </section>

        <section className="seller-section" id="como-funciona">
          <div className="seller-panel">
            <div className="seller-copy">
              <p className="eyebrow light-eyebrow"><span /> Pensado para a equipe</p>
              <h2>Menos conversa solta.<br /><em>Mais pedidos claros.</em></h2>
              <p>
                O cliente escolhe as peças antes de abrir o WhatsApp. A equipe recebe uma mensagem organizada e confirma somente o que importa: disponibilidade, condições e entrega ou retirada.
              </p>
              <button className="button light-button" type="button" onClick={() => setIsSellerSheetOpen(true)}>
                Ver fluxo do vendedor <ChevronRight size={18} />
              </button>
            </div>
            <div className="seller-workflow" aria-label="Fluxo de atendimento">
              <div className="workflow-label"><span className="workflow-pulse" /> Fluxo de atendimento</div>
              <div className="workflow-step active-step"><b>01</b><span><strong>Cliente seleciona</strong><small>Produtos e valores ficam visíveis no catálogo</small></span><Check size={18} /></div>
              <div className="workflow-line" />
              <div className="workflow-step"><b>02</b><span><strong>Mensagem chega completa</strong><small>Produto, valor e interesse reunidos em um único contato</small></span><MessageCircle size={18} /></div>
              <div className="workflow-line" />
              <div className="workflow-step"><b>03</b><span><strong>Equipe confirma</strong><small>Estoque, estado da peça e condições de venda</small></span><PackageCheck size={18} /></div>
            </div>
          </div>
        </section>

        <section className="visit-section" id="localizacao">
          <div className="visit-photo">
            <img src={STORE_FRONT_IMAGE} alt="Fachada e entrada da Almeida Móveis Usados" />
            <span className="photo-label"><MapPin size={15} /> Maceió — AL</span>
          </div>
          <div className="visit-copy">
            <p className="eyebrow"><span /> Visite a loja</p>
            <h2>Veja de perto,<br />escolha com calma.</h2>
            <p>Rua Capitão Marinho Falcão, 958<br />Poço / Santo Eduardo, Maceió — AL</p>
            <div className="visit-actions">
              <a className="text-link" href={MAPS_URL} target="_blank" rel="noreferrer">Abrir rota no Maps <ArrowRight size={16} /></a>
              <a className="text-link" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Falar com a equipe <MessageCircle size={16} /></a>
            </div>
          </div>
          <aside className="visit-card">
            <Clock3 size={22} />
            <span>Atendimento</span>
            <strong>Consulte horários<br />pelo WhatsApp</strong>
            <p>Confirme disponibilidade antes de visitar.</p>
          </aside>
        </section>
      </main>

      <footer className="almeida-footer">
        <div className="footer-brand"><span className="brand-mark"><Sofa size={20} /></span><strong>Almeida <small>Móveis Usados</small></strong></div>
        <p>Peças novas e seminovas para renovar o seu espaço.</p>
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">Atendimento pelo WhatsApp <ArrowRight size={16} /></a>
      </footer>

      <div className="mobile-quote-bar">
        <button type="button" onClick={() => setIsQuoteOpen(true)}>
          <ShoppingBag size={20} />
          <span>{queryProducts.length > 0 ? `${queryProducts.length} item${queryProducts.length > 1 ? "s" : ""} selecionado${queryProducts.length > 1 ? "s" : ""}` : "Selecionar produtos"}</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {selectedProduct && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelectedProduct(null)}>
          <section className="product-modal" role="dialog" aria-modal="true" aria-label={`Detalhes: ${selectedProduct.name}`} onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setSelectedProduct(null)} aria-label="Fechar detalhes"><X size={21} /></button>
            <div className="modal-image"><img src={selectedProduct.image} alt={selectedProduct.alt} /></div>
            <div className="modal-content">
              <p className="product-category">{selectedProduct.category} <span>•</span> {selectedProduct.condition}</p>
              <h2>{selectedProduct.name}</h2>
              <p>{selectedProduct.description}</p>
              <div className="spec-list">
                {selectedProduct.specs.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
              </div>
              <div className="modal-price"><span>Valor na prévia</span><strong>{selectedProduct.price}</strong></div>
              <button className="button primary-button wide-button" type="button" onClick={() => addToQuery(selectedProduct)}>
                <Plus size={18} /> Selecionar para consulta
              </button>
            </div>
          </section>
        </div>
      )}

      {isQuoteOpen && (
        <div className="drawer-backdrop" role="presentation" onMouseDown={() => setIsQuoteOpen(false)}>
          <aside className="quote-drawer" role="dialog" aria-modal="true" aria-label="Itens selecionados" onMouseDown={(event) => event.stopPropagation()}>
            <div className="drawer-head"><div><p className="eyebrow"><span /> Sua consulta</p><h2>Itens selecionados</h2></div><button type="button" onClick={() => setIsQuoteOpen(false)} aria-label="Fechar"><X size={22} /></button></div>
            {queryProducts.length > 0 ? (
              <>
                <div className="selected-list">
                  {queryProducts.map((product) => (
                    <div className="selected-item" key={product.id}>
                      <img src={product.image} alt="" />
                      <div><span>{product.category}</span><strong>{product.name}</strong><small>{product.price}</small></div>
                      <button type="button" onClick={() => removeFromQuery(product.id)} aria-label={`Remover ${product.name}`}><Minus size={17} /></button>
                    </div>
                  ))}
                </div>
                <div className="quote-notice"><CircleHelp size={17} /><p>A mensagem já leva as peças escolhidas. A equipe confirma disponibilidade e condições antes da venda.</p></div>
                <button className="button primary-button whatsapp-button" type="button" onClick={openWhatsApp}>
                  <MessageCircle size={20} /> Enviar consulta pelo WhatsApp
                </button>
              </>
            ) : (
              <div className="empty-quote"><ShoppingBag size={34} /><h3>Nenhuma peça selecionada.</h3><p>Escolha os itens que você quer consultar e envie uma só mensagem para a equipe.</p><button type="button" onClick={() => { setIsQuoteOpen(false); scrollToCatalog(); }}>Ver catálogo <ArrowRight size={16} /></button></div>
            )}
          </aside>
        </div>
      )}

      {isSellerSheetOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setIsSellerSheetOpen(false)}>
          <section className="seller-modal" role="dialog" aria-modal="true" aria-label="Como o catálogo ajuda a equipe" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setIsSellerSheetOpen(false)} aria-label="Fechar"><X size={21} /></button>
            <Sparkles size={23} /><p className="eyebrow"><span /> Para a equipe</p><h2>Catálogo fácil de atualizar.</h2>
            <p>Na versão oficial, o vendedor poderá incluir foto, nome, preço, descrição, medidas, condição e disponibilidade. O cliente vê apenas o estoque liberado.</p>
            <div className="seller-benefits"><div><Check size={17} /><span>Uma mensagem com os produtos já escolhidos</span></div><div><Check size={17} /><span>Menos envio manual de foto por foto</span></div><div><Check size={17} /><span>Estoque atualizado sem depender do Instagram</span></div></div>
          </section>
        </div>
      )}
    </div>
  );
}
