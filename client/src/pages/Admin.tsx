/**
 * Estufa Editorial: painel administrativo reduzido a produtos e dados essenciais de contato.
 */
import { ArrowLeft, ImagePlus, Leaf, Loader2, LogOut, PencilLine, Plus, ShieldCheck, X } from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import type { StoreProduct } from "@/lib/catalog";
import { buildStoreSettingsDraft, emptyProductForm, mergeProductWithForm, productFormToData, productToForm, validateProductForm, type ProductFormState } from "@/lib/admin-logic";
import { storeAsset } from "@/lib/assets";
import { defaultStoreSettings, normalizeWhatsAppNumber, type StoreSettings } from "@/lib/store-settings";
import { createProduct, currentUserIsStoreAdmin, getAdminProducts, getAdminSession, getStoreSettings, isSupabaseConfigured, saveStoreSettings, setProductAvailability, signInAdminWithGoogle, supabase, updateProduct, uploadProductImage } from "@/lib/supabase";

export default function Admin() {
  const [session, setSession] = useState<Awaited<ReturnType<typeof getAdminSession>>>(null);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [notice, setNotice] = useState("");
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [form, setForm] = useState<ProductFormState>(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [settings, setSettings] = useState<StoreSettings>(defaultStoreSettings);

  async function loadProducts() {
    const items = await getAdminProducts();
    setProducts(items);
  }

  async function loadSettings() {
    const nextSettings = await getStoreSettings();
    setSettings(nextSettings);
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
        if (isAdmin) await Promise.all([loadProducts(), loadSettings()]);
      }
      if (active) setLoading(false);
    }).catch(() => active && setLoading(false));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  async function handleLogin() {
    setNotice("");
    try { await signInAdminWithGoogle(); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Não foi possível iniciar o acesso."); }
  }

  async function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !session) return;
    setNotice(""); setSaving(true);
    try {
      const imageUrl = await uploadProductImage(session.user.id, file);
      setForm((current) => ({ ...current, imageUrl }));
    } catch (error) { setNotice(error instanceof Error ? error.message : "Não foi possível enviar a imagem."); }
    finally { setSaving(false); }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const validationMessage = validateProductForm(form);
    if (validationMessage) { setNotice(validationMessage); return; }
    setSaving(true); setNotice("");
    try {
      const productData = productFormToData(form);
      if (editingProductId) {
        const existing = products.find((product) => product.id === editingProductId);
        if (!existing) throw new Error("Produto não encontrado. Atualize a página e tente de novo.");
        await updateProduct(mergeProductWithForm(existing, form));
        setNotice("Produto atualizado no catálogo.");
      } else {
        await createProduct(productData);
        setNotice("Produto adicionado ao catálogo.");
      }
      setForm(emptyProductForm); setEditingProductId(null); await loadProducts();
    } catch (error) { setNotice(error instanceof Error ? error.message : "Não foi possível salvar o produto."); }
    finally { setSaving(false); }
  }

  async function handleAvailability(product: StoreProduct) {
    setSaving(true); setNotice("");
    try {
      await setProductAvailability(product.id, !product.isAvailable);
      await loadProducts();
      setNotice(product.isAvailable ? "Produto ocultado do catálogo público." : "Produto liberado no catálogo público.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Não foi possível atualizar a disponibilidade."); }
    finally { setSaving(false); }
  }

  function startEdit(product: StoreProduct) {
    setEditingProductId(product.id);
    setForm(productToForm(product));
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingProductId(null);
    setForm(emptyProductForm);
    setNotice("");
  }

  async function handleSaveSettings(event: FormEvent) {
    event.preventDefault();
    const whatsappNumber = normalizeWhatsAppNumber(settings.whatsappNumber);
    const instagramUrl = settings.instagramUrl.trim();
    if (whatsappNumber.length < 12 || whatsappNumber.length > 15) { setNotice("Informe um número de WhatsApp válido, com DDD."); return; }
    try {
      const parsedInstagram = new URL(instagramUrl);
      if (parsedInstagram.protocol !== "https:" || !parsedInstagram.hostname.endsWith("instagram.com")) throw new Error();
    } catch { setNotice("Informe um link completo do Instagram, por exemplo: https://www.instagram.com/sualoja/"); return; }
    setSavingSettings(true); setNotice("");
    try {
      const nextSettings = buildStoreSettingsDraft(whatsappNumber, instagramUrl);
      await saveStoreSettings(nextSettings);
      setSettings(nextSettings);
      setNotice("WhatsApp e Instagram atualizados no site.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Não foi possível atualizar as informações da loja."); }
    finally { setSavingSettings(false); }
  }

  if (!isSupabaseConfigured) return <AdminShell title="Conexão pendente"><p>O painel está pronto. Para usar na demonstração, falta conectar o projeto Supabase e liberar temporariamente a sua conta Google como administradora.</p><a className="admin-back" href="./">Voltar para o site <ArrowLeft size={16} /></a></AdminShell>;
  if (loading) return <AdminShell title="Verificando acesso"><Loader2 className="admin-loader" size={25} /><p>Um instante.</p></AdminShell>;
  if (!session) return <AdminShell title="Área da loja"><p>Entre com a sua conta Google temporária. Depois da aprovação, o proprietário entra com a conta dele e assume o acesso administrativo.</p><button className="admin-primary" onClick={handleLogin}><ShieldCheck size={18} /> Entrar com Google</button>{notice && <p className="admin-notice">{notice}</p>}</AdminShell>;
  if (!authorized) return <AdminShell title="Acesso aguardando liberação"><p>Você entrou como <strong>{session.user.email}</strong>. O administrador temporário será liberado no Supabase e, na transferência, essa permissão será passada para a conta Google do proprietário.</p><code className="admin-user-id">{session.user.id}</code><button className="admin-secondary" onClick={() => supabase?.auth.signOut()}>Sair</button></AdminShell>;

  return <main className="admin-page">
    <header className="admin-header"><a href="./" className="admin-logo-link" aria-label="Recanto das Plantas — voltar ao site"><img className="admin-brand-logo" src={storeAsset("recanto-logo_e43dd42a.png")} alt="" /><span className="admin-brand-lockup"><strong>Recanto</strong><span>das Plantas</span></span></a><button className="admin-signout" onClick={() => supabase?.auth.signOut()}><LogOut size={16} /> Sair</button></header>
    <section className="admin-hero"><p className="eyebrow"><span /> Área da loja</p><h1>Produtos<br /><em>do dia.</em></h1><p>Somente duas partes: produtos e contatos da loja. Foto, nome, preço, descrição, disponibilidade, WhatsApp e Instagram.</p></section>
    <section className="admin-content">
      <form className="product-form" onSubmit={handleSubmit}>
        <div className="admin-section-title"><div><p className="eyebrow"><span /> {editingProductId ? "Editar produto" : "Novo produto"}</p><h2>{editingProductId ? "Ajustar no catálogo" : "Adicionar ao catálogo"}</h2></div><small>Somente o essencial.</small></div>
        <label>Nome do produto<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ex.: Jiboia em vaso" /></label>
        <div className="admin-two-columns"><label>Categoria<input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="Ex.: Plantas" /></label><label>Preço (R$)<input inputMode="decimal" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="Ex.: 49,90" /></label></div>
        <label>Descrição curta<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Uma frase simples sobre o produto." rows={3} /></label>
        <label className="admin-file"><ImagePlus size={18} /><span>{form.imageUrl ? "Trocar foto do produto" : "Enviar foto do produto"}</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImage} /></label>
        {form.imageUrl && <div className="admin-image-editor"><div className="admin-preview-wrap"><img className="admin-preview" src={form.imageUrl} alt="Prévia da foto no catálogo" style={{ objectPosition: `center ${form.imageFocusY}%` }} /><span>Prévia no celular</span></div><label className="admin-focus">Ajustar enquadramento vertical<input type="range" min="0" max="100" value={form.imageFocusY} onChange={(event) => setForm({ ...form, imageFocusY: Number(event.target.value) })} /><small>Mova para mostrar melhor a planta no celular. A foto original não é cortada.</small></label></div>}
        <label className="admin-switch"><input type="checkbox" checked={form.isAvailable} onChange={(event) => setForm({ ...form, isAvailable: event.target.checked })} /> Disponível para pedido</label>
        <div className="admin-form-actions"><button className="admin-primary" type="submit" disabled={saving}>{saving ? <Loader2 className="admin-loader" size={18} /> : editingProductId ? <PencilLine size={18} /> : <Plus size={18} />}{editingProductId ? " Salvar alterações" : " Salvar produto"}</button>{editingProductId && <button className="admin-cancel" type="button" onClick={cancelEdit}><X size={16} /> Cancelar edição</button>}</div>
        {notice && <p className="admin-notice">{notice}</p>}
      </form>
      <aside className="admin-products"><p className="eyebrow"><span /> Catálogo atual</p><h2>{products.length} produto{products.length === 1 ? "" : "s"}</h2>{products.length === 0 ? <p>Nenhum produto real cadastrado ainda. Os cards de Cactos decorativos e Rosa-do-deserto são exemplos da vitrine; ao salvar o primeiro produto disponível com preço, ele passa a aparecer no catálogo público.</p> : <div className="admin-product-list">{products.map((product) => <div className="admin-product" key={product.id}>{product.imageUrl ? <img src={product.imageUrl} alt="" style={{ objectPosition: `center ${product.imageFocusY}%` }} /> : <div className="admin-product-empty"><Leaf size={18} /></div>}<span><strong>{product.name}</strong><small>{product.category} · {product.isAvailable ? "Disponível" : "Indisponível"}</small></span><div className="admin-product-actions"><i className={product.isAvailable ? "available" : "unavailable"}>{product.isAvailable ? "Visível" : "Oculto"}</i><button type="button" disabled={saving} onClick={() => startEdit(product)}>Editar</button><button type="button" disabled={saving} onClick={() => handleAvailability(product)}>{product.isAvailable ? "Ocultar" : "Liberar"}</button></div></div>)}</div>}</aside>
    </section>
    <section className="store-settings-section"><div><p className="eyebrow"><span /> Informações da loja</p><h2>WhatsApp e Instagram.</h2><p>Altere somente estes dois dados quando precisar. Os botões do site acompanham a mudança.</p></div><form className="store-settings-form" onSubmit={handleSaveSettings}><label>Número do WhatsApp<input inputMode="tel" value={settings.whatsappNumber} onChange={(event) => setSettings({ ...settings, whatsappNumber: event.target.value })} placeholder="Ex.: (82) 99999-9999" /></label><label>Link do Instagram<input inputMode="url" value={settings.instagramUrl} onChange={(event) => setSettings({ ...settings, instagramUrl: event.target.value })} placeholder="https://www.instagram.com/sualoja/" /></label><button className="admin-primary" type="submit" disabled={savingSettings}>{savingSettings ? <Loader2 className="admin-loader" size={18} /> : <PencilLine size={18} />} Salvar informações</button>{notice && <p className="admin-notice">{notice}</p>}</form></section>
  </main>;
}

function AdminShell({ title, children }: { title: string; children: React.ReactNode }) {
  return <main className="admin-gate"><div><p className="eyebrow"><span /> Recanto das Plantas</p><h1>{title}</h1>{children}</div></main>;
}
