/**
 * Estufa Editorial: painel administrativo reduzido a produtos e dados essenciais de contato.
 */
import { ArrowLeft, ImagePlus, Leaf, Loader2, LogOut, PencilLine, Plus, ShieldCheck, Trash2, X } from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { demoProducts, formatPrice, getProductImages, type StoreProduct } from "@/lib/catalog";
import { buildStoreSettingsDraft, emptyProductForm, getDeleteProductConfirmation, getPublicStoreUrl, mergeProductWithForm, productFormToData, productToForm, updateImageFocusY, validateProductForm, type ProductFormState } from "@/lib/admin-logic";
import { storeAsset } from "@/lib/assets";
import { defaultStoreSettings, normalizeWhatsAppNumber, type StoreSettings } from "@/lib/store-settings";
import { createProduct, currentUserIsStoreAdmin, deleteProduct, getAdminProducts, getAdminSession, getStoreSettings, isSupabaseConfigured, saveStoreSettings, setProductAvailability, signInAdminWithGoogle, supabase, updateProduct, uploadProductImage } from "@/lib/supabase";

export default function Admin() {
  const publicStoreUrl = getPublicStoreUrl(window.location.origin, import.meta.env.BASE_URL);
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  async function handleSignOut() {
    setNotice("");
    try {
      if (supabase) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
      window.location.assign(publicStoreUrl);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível encerrar o acesso. Tente novamente.");
    }
  }

  async function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length || !session) return;
    setNotice(""); setSaving(true);
    try {
      const imageUrls = await Promise.all(files.map((file) => uploadProductImage(session.user.id, file)));
      setForm((current) => {
        const urls = [...current.imageUrls, ...imageUrls];
        const focusYs = [...current.imageFocusYs, ...imageUrls.map(() => 50)];
        return { ...current, imageUrl: urls[0] ?? "", imageFocusY: focusYs[0] ?? 50, imageUrls: urls, imageFocusYs: focusYs };
      });
      setSelectedImageIndex(0);
      setNotice(`${imageUrls.length} foto${imageUrls.length === 1 ? "" : "s"} adicionada${imageUrls.length === 1 ? "" : "s"}.`);
    } catch (error) { setNotice(error instanceof Error ? error.message : "Não foi possível enviar as imagens."); }
    finally { setSaving(false); event.target.value = ""; }
  }

  function handleFocusChange(index: number, value: number) {
    setForm((current) => {
      const imageFocusYs = current.imageUrls.map((_, currentIndex) => current.imageFocusYs[currentIndex] ?? 50);
      const nextFocusYs = updateImageFocusY(imageFocusYs, index, value);
      return { ...current, imageFocusY: nextFocusYs[0] ?? 50, imageFocusYs: nextFocusYs };
    });
  }

  function makeCover(index: number) {
    setForm((current) => {
      const imageUrls = [...current.imageUrls];
      const imageFocusYs = [...current.imageFocusYs];
      const [url] = imageUrls.splice(index, 1);
      const [focusY] = imageFocusYs.splice(index, 1);
      imageUrls.unshift(url);
      imageFocusYs.unshift(focusY ?? 50);
      return { ...current, imageUrl: imageUrls[0] ?? "", imageFocusY: imageFocusYs[0] ?? 50, imageUrls, imageFocusYs };
    });
    setSelectedImageIndex(0);
  }

  function removeImage(index: number) {
    setForm((current) => {
      const imageUrls = current.imageUrls.filter((_, currentIndex) => currentIndex !== index);
      const imageFocusYs = current.imageFocusYs.filter((_, currentIndex) => currentIndex !== index);
      return { ...current, imageUrl: imageUrls[0] ?? "", imageFocusY: imageFocusYs[0] ?? 50, imageUrls, imageFocusYs };
    });
    setSelectedImageIndex((current) => Math.max(0, Math.min(current, form.imageUrls.length - 2)));
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

  async function handleDelete(product: StoreProduct) {
    const confirmed = window.confirm(getDeleteProductConfirmation(product.name));
    if (!confirmed) return;
    setSaving(true); setNotice("");
    try {
      const result = await deleteProduct(product);
      if (editingProductId === product.id) {
        setEditingProductId(null);
        setForm(emptyProductForm);
        setSelectedImageIndex(0);
      }
      await loadProducts();
      setNotice(result.imageCleanupFailed ? "Produto apagado; algumas imagens não puderam ser limpas." : "Produto apagado do catálogo.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Não foi possível apagar o produto."); }
    finally { setSaving(false); }
  }

  function startEdit(product: StoreProduct) {
    setEditingProductId(product.id);
    setForm(productToForm(product));
    setSelectedImageIndex(0);
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingProductId(null);
    setForm(emptyProductForm);
    setSelectedImageIndex(0);
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

  if (!isSupabaseConfigured) return <AdminShell title="Conexão pendente"><p>O painel está pronto. Para usar na demonstração, falta conectar o projeto Supabase e liberar temporariamente a sua conta Google como administradora.</p><a className="admin-back" href={publicStoreUrl}>Voltar para o site <ArrowLeft size={16} /></a></AdminShell>;
  if (loading) return <AdminShell title="Verificando acesso"><Loader2 className="admin-loader" size={25} /><p>Um instante.</p></AdminShell>;
  if (!session) return <AdminShell><div className="admin-login-actions"><button className="admin-google-login" onClick={handleLogin}><ShieldCheck size={18} /> Entrar com Google</button><a className="admin-store-link" href={publicStoreUrl}><ArrowLeft size={16} /> Ver a loja</a></div>{notice && <p className="admin-notice">{notice}</p>}</AdminShell>;
  if (!authorized) return <AdminShell title="Acesso aguardando liberação"><p>Você entrou como <strong>{session.user.email}</strong>. O administrador temporário será liberado no Supabase e, na transferência, essa permissão será passada para a conta Google do proprietário.</p><code className="admin-user-id">{session.user.id}</code><button className="admin-secondary" onClick={handleSignOut}>Sair</button></AdminShell>;

  return <main className="admin-page">
    <header className="admin-header"><a href={publicStoreUrl} className="admin-logo-link" aria-label="Recanto das Plantas — voltar ao site"><img className="admin-brand-logo" src={storeAsset("recanto-logo_e43dd42a.png")} alt="" /><span className="admin-brand-lockup"><strong>Recanto</strong><span>das Plantas</span></span></a><div className="admin-header-actions"><a className="admin-store-link" href={publicStoreUrl}><ArrowLeft size={16} /> Ver a loja</a><button className="admin-signout" onClick={handleSignOut}><LogOut size={16} /> Sair</button></div></header>
    <section className="admin-hero"><p className="eyebrow"><span /> Área da loja</p><h1>Produtos<br /><em>do dia.</em></h1><p>Somente duas partes: produtos e contatos da loja. Foto, nome, preço, descrição, disponibilidade, WhatsApp e Instagram.</p></section>
    <section className="admin-content">
      <form className="product-form" onSubmit={handleSubmit}>
        <div className="admin-section-title"><div><p className="eyebrow"><span /> {editingProductId ? "Editar produto" : "Novo produto"}</p><h2>{editingProductId ? "Ajustar no catálogo" : "Adicionar ao catálogo"}</h2></div><small>Somente o essencial.</small></div>
        <label>Nome do produto<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ex.: Jiboia em vaso" /></label>
        <div className="admin-two-columns"><label>Categoria<input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="Ex.: Plantas" /></label><label>Preço (R$)<input inputMode="decimal" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="Ex.: 49,90" /></label></div>
        <label>Descrição curta<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Uma frase simples sobre o produto." rows={3} /></label>
        <label className="admin-file"><ImagePlus size={18} /><span>{form.imageUrls.length ? "Adicionar mais fotos" : "Adicionar fotos do produto"}</span><input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={handleImage} /></label>
        {form.imageUrls.length > 0 && <div className="admin-gallery-editor">
          <div className="admin-gallery-thumbs" role="list" aria-label="Fotos do produto">
            {form.imageUrls.map((url, index) => <div className={`admin-gallery-thumb-item ${selectedImageIndex === index ? "selected" : ""}`} key={`${url}-${index}`} role="listitem">
              <button className="admin-gallery-thumb" type="button" onClick={() => setSelectedImageIndex(index)} aria-label={`Editar foto ${index + 1}`} aria-pressed={selectedImageIndex === index}><img src={url} alt="" style={{ objectPosition: `center ${form.imageFocusYs[index] ?? 50}%` }} /></button>
              {index === 0 ? <span className="admin-gallery-cover-label">Principal</span> : <button className="admin-gallery-cover" type="button" onClick={() => makeCover(index)}>Usar principal</button>}
              <button className="admin-gallery-remove" type="button" onClick={() => removeImage(index)} aria-label={`Remover foto ${index + 1}`}><Trash2 size={14} /></button>
            </div>)}
          </div>
          <div className="admin-image-editor"><div className="admin-preview-wrap"><img className="admin-preview" src={form.imageUrls[selectedImageIndex]} alt={`Prévia da foto ${selectedImageIndex + 1} no catálogo`} style={{ objectPosition: `center ${form.imageFocusYs[selectedImageIndex] ?? 50}%` }} /><span>Prévia no celular</span></div><label className="admin-focus">Ajustar enquadramento vertical<input type="range" min="0" max="100" value={form.imageFocusYs[selectedImageIndex] ?? 50} onChange={(event) => handleFocusChange(selectedImageIndex, Number(event.target.value))} /><small>Selecione uma miniatura e mova o controle para posicionar essa foto. A imagem original não é cortada.</small></label></div>
        </div>}
        <label className="admin-switch"><input type="checkbox" checked={form.isAvailable} onChange={(event) => setForm({ ...form, isAvailable: event.target.checked })} /> Disponível para pedido</label>
        <div className="admin-form-actions"><button className="admin-primary" type="submit" disabled={saving}>{saving ? <Loader2 className="admin-loader" size={18} /> : editingProductId ? <PencilLine size={18} /> : <Plus size={18} />}{editingProductId ? " Salvar alterações" : " Salvar produto"}</button>{editingProductId && <button className="admin-cancel" type="button" onClick={cancelEdit}><X size={16} /> Cancelar edição</button>}</div>
        {notice && <p className="admin-notice">{notice}</p>}
      </form>
      <aside className="admin-products"><p className="eyebrow"><span /> Catálogo atual</p><h2>{products.length} produto{products.length === 1 ? "" : "s"}</h2>{products.length === 0 ? <div className="admin-empty-state"><p>Nenhum produto real cadastrado ainda.</p><small>Cadastre um produto acima para ele aparecer aqui e, quando estiver disponível com preço, na vitrine pública.</small></div> : <div className="admin-product-list">{products.map((product) => <div className="admin-product" key={product.id}>{getProductImages(product)[0] ? <img src={getProductImages(product)[0].url} alt="" style={{ objectPosition: `center ${getProductImages(product)[0].focusY}%` }} /> : <div className="admin-product-empty"><Leaf size={18} /></div>}<span><strong>{product.name}</strong><small>{product.category} · {product.isAvailable ? "Disponível" : "Indisponível"}</small></span><div className="admin-product-actions"><i className={product.isAvailable ? "available" : "unavailable"}>{product.isAvailable ? "Visível" : "Oculto"}</i><button type="button" disabled={saving} onClick={() => startEdit(product)}>Editar</button><button type="button" disabled={saving} onClick={() => handleAvailability(product)}>{product.isAvailable ? "Ocultar" : "Liberar"}</button><button className="admin-delete" type="button" disabled={saving} onClick={() => handleDelete(product)} aria-label={`Apagar produto ${product.name}`}>Apagar produto</button></div></div>)}</div>}<section className="admin-demo-section"><p className="eyebrow"><span /> Prévia da vitrine</p><h3>Itens de demonstração</h3><p>Estes exemplos aparecem na loja quando ainda não há produtos públicos cadastrados. Eles não são registros do Supabase.</p><div className="admin-demo-list">{demoProducts.map((product) => { const image = getProductImages(product)[0]; return <div className="admin-demo-product" key={product.id}>{image ? <img src={image.url} alt="" style={{ objectPosition: `center ${image.focusY}%` }} /> : <div className="admin-product-empty"><Leaf size={18} /></div>}<div><strong>{product.name}</strong><small>{product.category} · {formatPrice(product.priceCents)}</small></div><i>Demonstração</i></div>; })}</div></section></aside>
    </section>
    <section className="store-settings-section"><div><p className="eyebrow"><span /> Informações da loja</p><h2>WhatsApp e Instagram.</h2><p>Altere somente estes dois dados quando precisar. Os botões do site acompanham a mudança.</p></div><form className="store-settings-form" onSubmit={handleSaveSettings}><label>Número do WhatsApp<input inputMode="tel" value={settings.whatsappNumber} onChange={(event) => setSettings({ ...settings, whatsappNumber: event.target.value })} placeholder="Ex.: (82) 99999-9999" /></label><label>Link do Instagram<input inputMode="url" value={settings.instagramUrl} onChange={(event) => setSettings({ ...settings, instagramUrl: event.target.value })} placeholder="https://www.instagram.com/sualoja/" /></label><button className="admin-primary" type="submit" disabled={savingSettings}>{savingSettings ? <Loader2 className="admin-loader" size={18} /> : <PencilLine size={18} />} Salvar informações</button>{notice && <p className="admin-notice">{notice}</p>}</form></section>
  </main>;
}

function AdminShell({ title, children }: { title?: string; children: React.ReactNode }) {
  return <main className="admin-gate"><div><p className="eyebrow"><span /> Recanto das Plantas</p>{title && <h1>{title}</h1>}{children}</div></main>;
}
