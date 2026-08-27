/**
 * Estufa Editorial: composição assimétrica, cores de viveiro e conversão calma.
 * O Verde Folhagem (#1F5C3E) conduz ações; Cormorant Garamond + DM Sans criam o tom de catálogo botânico.
 */
import { ArrowDownRight, ArrowUpRight, Leaf, MapPin, Menu, Minus, Plus, Search, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatPrice, getProductImages, type CartLine, type StoreProduct, whatsappOrderUrl } from "@/lib/catalog";
import { buildCategoryFilters, filterCatalogProducts } from "@/lib/catalog-filters";
import { storeAsset } from "@/lib/assets";
import { defaultStoreSettings, makeWhatsAppUrl, type StoreSettings } from "@/lib/store-settings";
import { getPublicProducts, getStoreSettings, isSupabaseConfigured } from "@/lib/supabase";

const maps = "https://www.google.com/maps/search/?api=1&query=Recanto+das+Plantas%2C+Macei%C3%B3%2C+AL";
const defaultContactMessage = "Olá, gostaria de saber sobre as plantas, flores, vasos e itens de jardim disponíveis.";

function CatalogCard({ item, onAdd }: { item: StoreProduct; onAdd: () => void }) {
  const images = getProductImages(item);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeImage = images[activeImageIndex] ?? images[0];

  return <article className="catalog-card">
    <div className="catalog-gallery">
      <div className="catalog-image-wrap">{activeImage ? <img src={activeImage.url} alt={`${item.name} — foto ${activeImageIndex + 1}`} loading="lazy" style={{ objectPosition: `center ${activeImage.focusY}%` }} /> : <div className="catalog-image-empty"><Leaf size={28} /><span>Foto em breve</span></div>}</div>
      {images.length > 1 && <div className="catalog-gallery-thumbs" role="list" aria-label={`Fotos de ${item.name}`}>
        {images.map((image, index) => <button className={`catalog-gallery-thumb ${index === activeImageIndex ? "selected" : ""}`} key={`${image.url}-${index}`} type="button" role="listitem" onClick={() => setActiveImageIndex(index)} aria-label={`Ver foto ${index + 1} de ${item.name}`} aria-pressed={index === activeImageIndex}><img src={image.url} alt="" style={{ objectPosition: `center ${image.focusY}%` }} /></button>)}
      </div>}
    </div>
    <div className="catalog-content">
      <div className="catalog-meta"><span>{item.category}</span><strong className="catalog-price">{formatPrice(item.priceCents)}</strong></div>
      <h3>{item.name}</h3><p>{item.description}</p>
      <button className="catalog-action" type="button" onClick={onAdd}><Plus size={17} /> Adicionar ao pedido</button>
    </div>
  </article>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catalog, setCatalog] = useState<StoreProduct[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(defaultStoreSettings);
  const [mapVisible, setMapVisible] = useState(false);
  const [catalogQuery, setCatalogQuery] = useState("");
  const [catalogCategory, setCatalogCategory] = useState("Todos");
  const closeMenu = () => setMenuOpen(false);
  const cartQuantity = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
  const cartHasPendingPrice = useMemo(() => cart.some((item) => item.priceCents === null), [cart]);
  const cartTotalCents = useMemo(() => cart.reduce((total, item) => total + (item.priceCents ?? 0) * item.quantity, 0), [cart]);
  const whatsapp = useMemo(() => makeWhatsAppUrl(storeSettings.whatsappNumber, defaultContactMessage), [storeSettings.whatsappNumber]);
  const categoryFilters = useMemo(() => buildCategoryFilters(catalog), [catalog]);
  const visibleCatalog = useMemo(() => filterCatalogProducts(catalog, catalogQuery, catalogCategory), [catalog, catalogQuery, catalogCategory]);
  const yearsInBusiness = Math.max(0, new Date().getFullYear() - storeSettings.aboutSinceYear);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    getPublicProducts().then(setCatalog).catch(() => setCatalog([]));
    getStoreSettings().then(setStoreSettings).catch(() => undefined);
  }, []);

  useEffect(() => {
    const mapContainer = document.querySelector<HTMLElement>("#localizacao .map-wrap");
    if (!mapContainer || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setMapVisible(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(mapContainer);
    return () => observer.disconnect();
  }, []);

  function addToOrder(product: StoreProduct) {
    if (!product.isAvailable) return;
    setCart((current) => {
      const found = current.find((line) => line.id === product.id);
      return found ? current.map((line) => line.id === product.id ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function decreaseQuantity(productId: string) {
    setCart((current) => current.flatMap((line) => line.id !== productId ? [line] : line.quantity > 1 ? [{ ...line, quantity: line.quantity - 1 }] : []));
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand-mark" href="#inicio" aria-label="Recanto das Plantas — início" onClick={closeMenu}>
          <img src={storeAsset("recanto-logo_e43dd42a.png")} alt="Símbolo botânico Recanto das Plantas" className="brand-logo" />
          <span className="brand-lockup"><strong>Recanto</strong><span>das Plantas</span></span>
        </a>
        <nav className="desktop-nav" aria-label="Navegação principal">
          <a href="#catalogo">Coleções</a><a href="#sobre">A loja</a><a href="#localizacao">Localização</a>
        </nav>
        <a className="header-cta" href={whatsapp} target="_blank" rel="noopener noreferrer">Pedir pelo WhatsApp <ArrowUpRight size={15} strokeWidth={2.2} /></a>
        <button className="menu-trigger" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
        {menuOpen && <nav className="mobile-nav" aria-label="Navegação móvel">
          <a href="#catalogo" onClick={closeMenu}>Coleções</a><a href="#sobre" onClick={closeMenu}>A loja</a><a href="#localizacao" onClick={closeMenu}>Localização</a>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>Pedir pelo WhatsApp <ArrowUpRight size={16} /></a>
        </nav>}
      </header>

      <main>
        <section id="inicio" className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Viveiro & floricultura · Maceió, AL</p>
            <h1>Mais verde,<br /><em>mais vida.</em></h1>
            <p className="hero-intro">Plantas, flores, vasos e itens para jardim para deixar sua casa mais viva e o seu espaço mais seu.</p>
            <div className="hero-actions">
              <a className="primary-button" href={whatsapp} target="_blank" rel="noopener noreferrer">Consultar disponibilidade <ArrowUpRight size={18} /></a>
              <a className="text-link" href="#catalogo">Explorar coleções <ArrowDownRight size={17} /></a>
            </div>
          </div>
          <figure className="hero-visual">
            <img src={storeAsset("recanto-espaco-aereo_e3d028fc.png")} alt="Vista aérea da Recanto das Plantas na Avenida Menino Marcelo, em Maceió" />
            <figcaption><span /> Conheça o espaço do Recanto</figcaption>
          </figure>
        </section>

        <section id="catalogo" className="catalog-section section-pad">
          <div className="section-heading">
            <div><p className="eyebrow"><span /> Produtos e possibilidades</p><h2>Para cultivar<br /><em>o seu canto.</em></h2></div>
            <p className="heading-copy">Fale com a equipe para consultar as opções disponíveis para sua casa, presente ou jardim.</p>
          </div>
          <div className="catalog-toolbar">
            <label className="catalog-search" htmlFor="catalog-search">
              <Search size={18} aria-hidden="true" />
              <span className="sr-only">Pesquisar no catálogo</span>
              <input id="catalog-search" type="search" value={catalogQuery} onChange={(event) => setCatalogQuery(event.target.value)} placeholder="Buscar planta, vaso ou item..." />
            </label>
            <div className="catalog-filters" aria-label="Filtrar por categoria" role="group">
              {categoryFilters.map((category) => <button key={category} type="button" className="catalog-filter" aria-pressed={catalogCategory === category} onClick={() => setCatalogCategory(category)}>{category}</button>)}
            </div>
          </div>
          <p className="catalog-result-note" aria-live="polite">{visibleCatalog.length} {visibleCatalog.length === 1 ? "opção encontrada" : "opções encontradas"}</p>
          {visibleCatalog.length > 0 ? <div className="catalog-grid">
            {visibleCatalog.map((item) => <CatalogCard key={item.id} item={item} onAdd={() => addToOrder(item)} />)}
          </div> : <div className="catalog-empty" role="status"><Search size={22} /><strong>Nenhuma opção encontrada.</strong><span>Tente outro nome ou escolha a categoria Todos.</span><button type="button" onClick={() => { setCatalogQuery(""); setCatalogCategory("Todos"); }}>Limpar busca</button></div>}
          {cartQuantity > 0 && <div className="order-summary" aria-live="polite"><span><ShoppingBag size={19} /> {cartQuantity} item{cartQuantity === 1 ? "" : "ns"} no pedido</span><button type="button" onClick={() => setCartOpen(true)}>Ver pedido <ArrowUpRight size={17} /></button></div>}
        </section>

        <section id="sobre" className="about-section about-section-simple">
          <div className="about-copy">
            <p className="eyebrow"><span /> Sobre o Recanto</p>
            <h2>Não é só sobre<br />plantas. É sobre<br /><em>casa.</em></h2>
            <p className="about-years"><strong>Desde {storeSettings.aboutSinceYear}</strong><span>{yearsInBusiness} {yearsInBusiness === 1 ? "ano" : "anos"} de mercado</span></p>
            <p>{storeSettings.aboutIntro}</p>
            <p>{storeSettings.aboutDetail}</p>
            <a className="about-link" href="#localizacao">Ver localização <ArrowDownRight size={17} /></a>
          </div>
        </section>

        <section id="localizacao" className="location-section" aria-label="Localização da Recanto das Plantas">
          <div className="location-copy">
            <p className="eyebrow"><span /> Como chegar</p>
            <h2>O Recanto<br />fica <em>perto.</em></h2>
            <p>Av. Menino Marcelo, Serraria — Maceió, AL. Abra a rota para visitar a loja ou fale com a equipe pelo WhatsApp para confirmar a disponibilidade.</p>
            <a className="primary-button" href={maps} target="_blank" rel="noopener noreferrer">Abrir rota no Maps <ArrowUpRight size={18} /></a>
          </div>
          <div className="map-wrap">
            <iframe
              className="location-map"
              title="Localização da Recanto das Plantas no Google Maps"
              src="https://maps.google.com/maps?hl=pt-BR&q=Recanto%20das%20Plantas%2C%20Av.%20Menino%20Marcelo%20-%20Serraria%2C%20Macei%C3%B3%20-%20AL%2C%2057046-000&z=15&output=embed"
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <aside className="route-card" aria-label="Ficha de visita da Recanto das Plantas"><img src={storeAsset("recanto-logo_e43dd42a.png")} alt="" /><p>Ficha de visita</p><strong>Av. Menino Marcelo</strong><span>Serraria · Maceió, AL</span><small>Retirada na loja. Confirme a disponibilidade pelo WhatsApp.</small></aside>
          </div>
        </section>
      </main>

      <button className={`bag-trigger${cartQuantity > 0 ? " has-items" : ""}`} type="button" onClick={() => setCartOpen(true)} aria-label={`Abrir sacola${cartQuantity > 0 ? ` com ${cartQuantity} item${cartQuantity === 1 ? "" : "ns"}` : " vazia"}`}><ShoppingBag size={18} /><span>Sacola</span><strong>{cartQuantity}</strong></button>

      {cartOpen && <div className="order-dialog" role="dialog" aria-modal="true" aria-labelledby="order-title">
        <button className="order-dialog-backdrop" type="button" aria-label="Fechar pedido" onClick={() => setCartOpen(false)} />
        <aside className="order-drawer">
          <header className="order-drawer-header"><div><p className="eyebrow"><span /> Seu pedido</p><h2 id="order-title">Seu <em>recanto.</em></h2></div><button type="button" className="order-close" aria-label="Fechar pedido" onClick={() => setCartOpen(false)}><X size={21} /></button></header>
          <div className="order-lines">
            {cart.length === 0 ? <div className="order-empty"><ShoppingBag size={25} /><strong>Sua sacola está vazia.</strong><span>Adicione uma planta para montar seu pedido.</span><button type="button" onClick={() => { setCartOpen(false); document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" }); }}>Ver produtos</button></div> : cart.map((item) => <article className="order-line" key={item.id}>
              {item.imageUrl ? <img src={item.imageUrl} alt="" style={{ objectPosition: `center ${item.imageFocusY}%` }} /> : <div className="order-line-image"><Leaf size={18} /></div>}
              <div className="order-line-copy"><strong>{item.name}</strong><small>{item.priceCents === null ? "Valor será confirmado" : formatPrice(item.priceCents)}</small><div className="quantity-control"><button type="button" aria-label={`Diminuir ${item.name}`} onClick={() => decreaseQuantity(item.id)}><Minus size={14} /></button><span>{item.quantity}</span><button type="button" aria-label={`Adicionar mais ${item.name}`} onClick={() => addToOrder(item)}><Plus size={14} /></button></div></div>
              <button type="button" className="remove-line" aria-label={`Remover ${item.name} do pedido`} onClick={() => setCart((current) => current.filter((line) => line.id !== item.id))}><Trash2 size={16} /></button>
            </article>)}
          </div>
          <footer className="order-drawer-footer"><div><span>{cartHasPendingPrice ? "Total a confirmar" : "Total do pedido"}</span><strong>{cartHasPendingPrice ? "Consulte a equipe" : formatPrice(cartTotalCents)}</strong></div><a href={whatsappOrderUrl(cart, storeSettings.whatsappNumber)} target="_blank" rel="noopener noreferrer">Enviar pedido para o WhatsApp <ArrowUpRight size={17} /></a><p>O pedido abre no WhatsApp para a equipe confirmar disponibilidade e valor.</p></footer>
        </aside>
      </div>}

      <footer className="site-footer">
        <a className="brand-mark footer-brand" href="#inicio" aria-label="Voltar ao início"><img src={storeAsset("recanto-logo_e43dd42a.png")} alt="" className="brand-logo" /><span className="brand-lockup"><strong>Recanto</strong><span>das Plantas</span></span></a>
        <p>Plantas, flores, vasos e itens para jardim em Maceió.</p>
        <span className="footer-links"><a href={storeSettings.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram <ArrowUpRight size={15} /></a><a href={`${import.meta.env.BASE_URL}admin.html`}>Área da loja <ArrowUpRight size={15} /></a></span>
      </footer>
      <div className={`mobile-action${mapVisible ? " map-visible" : ""}`} aria-label="Ações rápidas" aria-hidden={mapVisible}>
        <button type="button" onClick={() => setCartOpen(true)}><ShoppingBag size={17} />Sacola · {cartQuantity}</button>
        <a href={maps} target="_blank" rel="noopener noreferrer"><MapPin size={17} />Como chegar</a>
      </div>
    </div>
  );
}
