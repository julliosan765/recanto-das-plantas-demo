/**
 * Estufa Editorial: painel administrativo contido, com uma única tarefa central — manter produtos visíveis, claros e atualizados.
 */
import { ArrowLeft, Check, ImagePlus, Leaf, Loader2, LogOut, Plus, ShieldCheck } from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import type { StoreProduct } from "@/lib/catalog";
import { createProduct, currentUserIsStoreAdmin, getAdminProducts, getAdminSession, isSupabaseConfigured, signInAdminWithGoogle, supabase, uploadProductImage } from "@/lib/supabase";

const emptyForm = { name: "", category: "Plantas", description: "", price: "", imageUrl: "", isAvailable: true };

export default function Admin() {
  const [session, setSession] = useState<Awaited<ReturnType<typeof getAdminSession>>>(null);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [form, setForm] = useState(emptyForm);

  async function loadProducts() {
    const items = await getAdminProducts();
    setProducts(items);
  }

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    let active = true;
    getAdminSession().then(async (nextSession) => {
      if (!active) return;
      setSession(nextSession);
      if (nextSession) {
        const isAdmin = await currentUserIsStoreAdmin(nextSession.user.id);
        if (!active) return;
        setAuthorized(isAdmin);
        if (isAdmin) await loadProducts();
      }
      if (active) setLoading(false);
    }).catch(() => active && setLoading(false));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  async function handleLogin() {
    setNotice("");
    try { await signInAdminWithGoogle(); } catch (error) { setNotice(error instanceof Error ? error.message : "Não foi possível iniciar o acesso."); }
  }

  async function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !session) return;
    setNotice(""); setSaving(true);
    try {
      const imageUrl = await uploadProductImage(session.user.id, file);
      setForm((current) => ({ ...current, imageUrl }));
    }
    catch (error) { setNotice(error instanceof Error ? error.message : "Não foi possível enviar a imagem."); }
    finally { setSaving(false); }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form.name.trim() || !form.category.trim()) { setNotice("Informe pelo menos o nome e a categoria."); return; }
    setSaving(true); setNotice("");
    try {
      const value = form.price.trim() ? Math.round(Number(form.price.replace(",", ".")) * 100) : null;
      if (form.price.trim() && (!Number.isFinite(value) || value! < 0)) throw new Error("Informe um preço válido.");
      await createProduct({ name: form.name.trim(), category: form.category.trim(), description: form.description.trim(), imageUrl: form.imageUrl, priceCents: value, isAvailable: form.isAvailable, isFeatured: false, sortOrder: 0 });
      setForm(emptyForm); await loadProducts(); setNotice("Produto adicionado ao catálogo.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Não foi possível salvar o produto."); }
    finally { setSaving(false); }
  }

  if (!isSupabaseConfigured) return <AdminShell title="Conexão pendente"><p>O painel está pronto, mas falta inserir a URL e a chave pública do Supabase nas variáveis do projeto.</p><a className="admin-back" href="./">Voltar para o site <ArrowLeft size={16} /></a></AdminShell>;
  if (loading) return <AdminShell title="Verificando acesso"><Loader2 className="admin-loader" size={25} /><p>Um instante.</p></AdminShell>;
  if (!session) return <AdminShell title="Área da loja"><p>Entre com a conta Google autorizada da Recanto para cadastrar fotos, produtos, preços e disponibilidade.</p><button className="admin-primary" onClick={handleLogin}><ShieldCheck size={18} /> Entrar com Google</button>{notice && <p className="admin-notice">{notice}</p>}</AdminShell>;
  if (!authorized) return <AdminShell title="Acesso aguardando liberação"><p>Você entrou como <strong>{session.user.email}</strong>. Para liberar esta conta, copie o ID deste usuário no Supabase e adicione-o à tabela de administradores conforme o guia do projeto.</p><code className="admin-user-id">{session.user.id}</code><button className="admin-secondary" onClick={() => supabase?.auth.signOut()}>Sair</button></AdminShell>;

  return <main className="admin-page">
    <header className="admin-header"><a href="./" className="admin-brand"><Leaf size={24} />Recanto <span>das Plantas</span></a><button className="admin-signout" onClick={() => supabase?.auth.signOut()}><LogOut size={16} /> Sair</button></header>
    <section className="admin-hero"><p className="eyebrow"><span /> Área da loja</p><h1>Produtos<br /><em>do dia.</em></h1><p>Adicione somente o que está disponível. O site atualiza o catálogo e os clientes montam o pedido pelo WhatsApp.</p></section>
    <section className="admin-content">
      <form className="product-form" onSubmit={handleSubmit}>
        <div className="admin-section-title"><div><p className="eyebrow"><span /> Novo produto</p><h2>Adicionar ao catálogo</h2></div><small>Campos simples, sem complicação.</small></div>
        <label>Nome do produto<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ex.: Jiboia em vaso" /></label>
        <div className="admin-two-columns"><label>Categoria<input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="Ex.: Plantas" /></label><label>Preço (R$)<input inputMode="decimal" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="Ex.: 49,90" /></label></div>
        <label>Descrição curta<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Uma frase simples sobre o produto." rows={3} /></label>
        <label className="admin-file"><ImagePlus size={18} /><span>{form.imageUrl ? "Imagem pronta para publicar" : "Enviar foto do produto"}</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImage} /></label>
        {form.imageUrl && <img className="admin-preview" src={form.imageUrl} alt="Prévia do produto" />}
        <label className="admin-switch"><input type="checkbox" checked={form.isAvailable} onChange={(event) => setForm({ ...form, isAvailable: event.target.checked })} /> Disponível para pedido</label>
        <button className="admin-primary" type="submit" disabled={saving}>{saving ? <Loader2 className="admin-loader" size={18} /> : <Plus size={18} />} Salvar produto</button>
        {notice && <p className="admin-notice">{notice}</p>}
      </form>
      <aside className="admin-products"><p className="eyebrow"><span /> Catálogo atual</p><h2>{products.length} produto{products.length === 1 ? "" : "s"}</h2>{products.length === 0 ? <p>Nenhum produto cadastrado ainda.</p> : <div className="admin-product-list">{products.map((product) => <div className="admin-product" key={product.id}>{product.imageUrl ? <img src={product.imageUrl} alt="" /> : <div className="admin-product-empty"><Leaf size={18} /></div>}<span><strong>{product.name}</strong><small>{product.category} · {product.isAvailable ? "Disponível" : "Indisponível"}</small></span><Check size={17} /></div>)}</div>}</aside>
    </section>
  </main>;
}

function AdminShell({ title, children }: { title: string; children: React.ReactNode }) {
  return <main className="admin-gate"><div><p className="eyebrow"><span /> Recanto das Plantas</p><h1>{title}</h1>{children}</div></main>;
}
