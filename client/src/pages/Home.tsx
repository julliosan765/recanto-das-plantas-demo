/**
 * Estufa Editorial: composição assimétrica, cores de viveiro e conversão calma.
 * O Verde Folhagem (#1F5C3E) conduz ações; Cormorant Garamond + DM Sans criam o tom de catálogo botânico.
 */
import { ArrowDownRight, ArrowUpRight, Instagram, Leaf, MapPin, Menu, MessageCircle, Phone, Plus, ShoppingBag, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { demoProducts, formatPrice, type CartLine, type StoreProduct, whatsappOrderUrl } from "@/lib/catalog";
import { storeAsset } from "@/lib/assets";
import { getPublicProducts } from "@/lib/supabase";

const whatsapp = "https://wa.me/558233287315?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20sobre%20as%20plantas%2C%20flores%2C%20vasos%20e%20itens%20de%20jardim%20dispon%C3%ADveis.";
const maps = "https://www.google.com/maps/search/?api=1&query=Recanto+das+Plantas%2C+Macei%C3%B3%2C+AL";
const instagram = "https://www.instagram.com/recantodasplantasal/";
const wa = (message: string) => `https://wa.me/558233287315?text=${encodeURIComponent(message)}`;

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catalog, setCatalog] = useState<StoreProduct[]>(demoProducts);
  const [cart, setCart] = useState<CartLine[]>([]);
  const closeMenu = () => setMenuOpen(false);
  const cartQuantity = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);

  useEffect(() => {
    getPublicProducts().then((products) => { if (products.length) setCatalog(products); }).catch(() => undefined);
  }, []);

  function addToOrder(product: StoreProduct) {
    setCart((current) => {
      const found = current.find((line) => line.id === product.id);
      return found ? current.map((line) => line.id === product.id ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { ...product, quantity: 1 }];
    });
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand-mark" href="#inicio" aria-label="Recanto das Plantas — início" onClick={closeMenu}>
          <img src={storeAsset("recanto-logo_e43dd42a.png")} alt="Símbolo botânico Recanto das Plantas" className="brand-logo" />
          <span className="brand-lockup"><strong>Recanto</strong><span>das Plantas</span></span>
        </a>
        <nav className="desktop-nav" aria-label="Navegação principal">
          <a href="#catalogo">Coleções</a><a href="#cuidado">Como escolher</a><a href="#sobre">A loja</a>
        </nav>
        <a className="header-cta" href={whatsapp} target="_blank" rel="noopener noreferrer">Pedir pelo WhatsApp <ArrowUpRight size={15} strokeWidth={2.2} /></a>
        <button className="menu-trigger" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
        {menuOpen && <nav className="mobile-nav" aria-label="Navegação móvel">
          <a href="#catalogo" onClick={closeMenu}>Coleções</a><a href="#cuidado" onClick={closeMenu}>Como escolher</a><a href="#sobre" onClick={closeMenu}>A loja</a>
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
            <p className="hero-note"><Leaf size={18} strokeWidth={1.8} />Fale com a equipe e encontre opções para o seu espaço e a sua rotina.</p>
            <div className="hero-details" aria-label="Atalhos para atendimento"><span><Leaf size={15} />Escolha com calma</span><span><MessageCircle size={15} />Fale pelo WhatsApp</span></div>
          </div>
          <figure className="hero-visual">
            <img src={storeAsset("recanto-espaco-aereo_e3d028fc.png")} alt="Vista aérea da Recanto das Plantas na Avenida Menino Marcelo, em Maceió" />
            <figcaption><span /> Conheça o espaço do Recanto</figcaption>
            <div className="floating-seal" aria-hidden="true"><span>cultivo</span><Leaf size={20} /><span>com cuidado</span></div>
          </figure>
          <p className="side-note">a casa também floresce</p>
        </section>

        <section className="selection-strip" aria-label="Como navegar pelo Recanto das Plantas">
          <p>Do seu espaço<br />para <em>o seu recanto.</em></p>
          <div className="selection-links">
            <a href="#catalogo"><span>01</span><strong>Explore</strong><small>Conheça as coleções</small><ArrowDownRight size={18} /></a>
            <a href="#cuidado"><span>02</span><strong>Converse</strong><small>Peça uma indicação</small><ArrowDownRight size={18} /></a>
            <a href="#visite"><span>03</span><strong>Visite</strong><small>Encontre a loja</small><ArrowDownRight size={18} /></a>
          </div>
        </section>

        <section id="catalogo" className="catalog-section section-pad">
          <div className="section-heading">
            <div><p className="eyebrow"><span /> Produtos e possibilidades</p><h2>Para cultivar<br /><em>o seu canto.</em></h2></div>
            <p className="heading-copy">Fale com a equipe para consultar as opções disponíveis para sua casa, presente ou jardim.</p>
          </div>
          <div className="catalog-grid">
            {catalog.map((item, index) => <article className={`catalog-card ${index % 3 === 1 ? "short" : "tall"}`} key={item.id}>
              <div className="catalog-image-wrap"><img src={item.imageUrl} alt={item.name} loading="lazy" /><span>{String(index + 1).padStart(2, "0")}</span></div>
              <div className="catalog-content">
                <div className="catalog-meta"><span>{item.category}</span><i>{formatPrice(item.priceCents)}</i></div>
                <h3>{item.name}</h3><p>{item.description}</p>
                <button className="catalog-action" type="button" onClick={() => addToOrder(item)}><Plus size={17} /> Adicionar ao pedido</button>
              </div>
            </article>)}
          </div>
          {cartQuantity > 0 && <div className="order-summary" aria-live="polite"><span><ShoppingBag size={19} /> {cartQuantity} item{cartQuantity === 1 ? "" : "ns"} no pedido</span><a href={whatsappOrderUrl(cart)} target="_blank" rel="noopener noreferrer">Enviar para o WhatsApp <ArrowUpRight size={17} /></a></div>}
        </section>

        <section id="cuidado" className="care-section">
          <div className="care-image"><img src={storeAsset("recanto-detail-folha_8cebcdbf.jpg")} alt="Detalhe de folhas verdes com textura natural" loading="lazy" /></div>
          <div className="care-copy">
            <p className="eyebrow light"><span /> Escolhas que acompanham</p>
            <h2>Uma planta boa<br />começa com <em>escuta.</em></h2>
            <p>Luz, tempo, rotina e espaço fazem diferença. Conte como é o seu ambiente e a equipe ajuda você a escolher com mais segurança.</p>
            <div className="care-points"><div><Sparkles size={19} />Orientação para escolher</div><div><Leaf size={19} />Dicas para os primeiros cuidados</div></div>
            <p className="care-stamp"><Leaf size={14} /> cultivo com cuidado, desde a escolha</p>
            <a className="outline-button" href={wa("Olá, preciso de ajuda para escolher uma planta para o meu ambiente.")} target="_blank" rel="noopener noreferrer">Quero uma indicação <ArrowUpRight size={17} /></a>
          </div>
        </section>

        <section id="sobre" className="about-section">
          <div className="about-symbol" aria-hidden="true"><img src={storeAsset("recanto-logo_e43dd42a.png")} alt="" /><span>RECANTO<br />DAS PLANTAS</span></div>
          <div className="about-copy">
            <p className="eyebrow"><span /> Sobre o Recanto</p>
            <h2>Não é só sobre<br />plantas. É sobre<br /><em>casa.</em></h2>
            <p>Em Maceió, o Recanto reúne plantas, flores, vasos e itens para jardim para quem quer cultivar, renovar ou presentear.</p>
            <p>Fale com a equipe, consulte a disponibilidade e escolha com mais calma o que combina com o seu espaço.</p>
            <a className="about-link" href="#visite">Venha nos visitar <ArrowDownRight size={17} /></a>
          </div>
          <p className="about-aside">verde para<br /><em>viver melhor.</em></p>
        </section>

        <section id="visite" className="visit-section section-pad">
          <div className="visit-label"><p className="eyebrow"><span /> Perto de você</p><p>Passe para sentir de perto</p></div>
          <div className="visit-main">
            <h2>Venha conhecer<br />o <em>Recanto.</em></h2>
            <p>Visite a loja na Serraria, retire seu pedido no local ou fale com a equipe para consultar opções de entrega.</p>
            <div className="contact-list">
              <a href={maps} target="_blank" rel="noopener noreferrer"><MapPin size={21} /><span><strong>Av. Menino Marcelo · Serraria</strong><small>Maceió · AL · 57046-000</small></span><ArrowUpRight size={17} /></a>
              <a href="tel:+558233287315"><Phone size={20} /><span><strong>(82) 3328-7315</strong><small>Fale com a nossa equipe</small></span><ArrowUpRight size={17} /></a>
            </div>
            <div className="service-note"><span>Retirada na loja</span><span>Entrega</span></div>
            <a className="instagram-link" href={instagram} target="_blank" rel="noopener noreferrer"><Instagram size={18} /> Acompanhe as novidades no Instagram <ArrowUpRight size={16} /></a>
          </div>
          <div className="visit-image"><img src={storeAsset("recanto-joaninhas_d2016244.png")} alt="Enfeites de joaninha disponíveis na Recanto das Plantas" loading="lazy" /><small>DETALHES QUE ENCANTAM</small><span>Escolha a planta.<br />A gente ajuda no resto.</span></div>
        </section>

        <section id="localizacao" className="location-section" aria-label="Localização da Recanto das Plantas">
          <div className="location-copy">
            <p className="eyebrow"><span /> Como chegar</p>
            <h2>O Recanto<br />fica <em>perto.</em></h2>
            <p>Encontre a Recanto das Plantas na Av. Menino Marcelo, na Serraria. Abra a rota e venha visitar a loja.</p>
            <a className="primary-button" href={maps} target="_blank" rel="noopener noreferrer">Abrir rota no Maps <ArrowUpRight size={18} /></a>
          </div>
          <div className="map-wrap">
            <iframe
              className="location-map"
              title="Localização da Recanto das Plantas no Google Maps"
              src="https://www.google.com/maps?q=Recanto+das+Plantas,+Av.+Menino+Marcelo+-+Serraria,+Macei%C3%B3+-+AL,+57046-000&output=embed"
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand-mark footer-brand" href="#inicio" aria-label="Voltar ao início"><img src={storeAsset("recanto-logo_e43dd42a.png")} alt="" className="brand-logo" /><span className="brand-lockup"><strong>Recanto</strong><span>das Plantas</span></span></a>
        <p>Plantas, flores, vasos e itens para jardim em Maceió.</p>
        <a href={instagram} target="_blank" rel="noopener noreferrer">Instagram <ArrowUpRight size={15} /></a>
      </footer>
      <div className="mobile-action" aria-label="Ações rápidas">
        <a href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} />Falar no WhatsApp</a>
        <a href={maps} target="_blank" rel="noopener noreferrer"><MapPin size={17} />Como chegar</a>
      </div>
    </div>
  );
}
