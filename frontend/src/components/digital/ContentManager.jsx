import React, { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { toast } from "sonner";
import { ChevronLeft, Plus, Trash2, Pencil, Sparkles, AlertCircle, Check } from "lucide-react";
import ImageDropzone from "../cms/ImageDropzone";
import StorageMeter from "../cms/StorageMeter";
import { SAMPLE_CONTENT, getKindFor } from "../../mocks/contentSeeds";

const Dot = ({ state }) => {
  const cls = state === "complete" ? "bg-emerald-500" : state === "partial" ? "bg-amber-400" : "bg-slate-300";
  return <span className={`inline-block w-2 h-2 rounded-full ${cls}`} />;
};

const uid = (p) => `${p}-${Math.random().toString(36).slice(2, 8)}`;

// Section schemas per kind
const SECTIONS = {
  ecommerce:  ["banners","categories","products","storeInfo"],
  restaurant: ["banners","categories","menuItems","storeInfo"],
  health:     ["banners","doctors","services","storeInfo"],
  education:  ["banners","instructors","courses","storeInfo"],
  realestate: ["banners","areas","agents","properties","storeInfo"],
  travel:     ["banners","destinations","packages","storeInfo"],
  ngo:        ["banners","team","campaigns","storeInfo"],
  saas:       ["banners","pricing","testimonials","storeInfo"],
  matrimony:  ["profiles","stories","plans","storeInfo"],
};

const SECTION_LABELS = {
  banners: "Banners", categories: "Categories", products: "Products", storeInfo: "Service Info",
  menuItems: "Menu Items", doctors: "Doctors", services: "Services",
  instructors: "Instructors", courses: "Courses", areas: "Areas", agents: "Agents",
  properties: "Properties", destinations: "Destinations", packages: "Tour Packages",
  team: "Team", campaigns: "Campaigns", pricing: "Pricing Plans", testimonials: "Testimonials",
  profiles: "Member Profiles", stories: "Success Stories", plans: "Subscription Plans",
};

const MIN_REQUIRED = {
  ecommerce:  { banners: 1, categories: 1, products: 3 },
  restaurant: { categories: 1, menuItems: 3 },
  health:     { doctors: 1 },
  education:  { courses: 1 },
  realestate: { properties: 1 },
  travel:     { packages: 1 },
  ngo:        { campaigns: 1 },
  saas:       { pricing: 1 },
  matrimony:  { profiles: 3, plans: 1 },
};

const sectionState = (content, section) => {
  const v = content[section];
  if (section === "storeInfo") {
    if (!v || !v.name) return "empty";
    if (!v.phone || !v.address) return "partial";
    return "complete";
  }
  if (!Array.isArray(v) || v.length === 0) return "empty";
  if (v.length < 2) return "partial";
  return "complete";
};

// ============ SECTION EDITORS ============

const TextField = ({ label, value, onChange, required, optional, type = "text", placeholder, testid, prefix, maxLength }) => (
  <div>
    <Label className="text-xs">{label}{required && <span className="text-rose-500"> *</span>}{optional && <span className="text-slate-400 text-[10px] ml-1">(Optional)</span>}</Label>
    <div className={`mt-1 flex items-stretch ${prefix ? "" : ""}`}>
      {prefix && <span className="px-2 inline-flex items-center bg-slate-100 border border-slate-200 border-r-0 rounded-l text-xs text-slate-600">{prefix}</span>}
      <Input data-testid={testid} type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} className={prefix ? "rounded-l-none" : ""} />
    </div>
  </div>
);

const BannerEditor = ({ items = [], onChange }) => {
  const add = () => onChange([...items, { id: uid("ban"), title: "", subtitle: "", cta: "Learn More", link: "Homepage", image: "", color: "#e11d48" }]);
  const upd = (id, patch) => onChange(items.map((b) => b.id === id ? { ...b, ...patch } : b));
  const del = (id) => onChange(items.filter((b) => b.id !== id));
  return (
    <div className="space-y-3" data-testid="banner-editor">
      {items.map((b, i) => (
        <div key={b.id} className="border border-slate-200 rounded-lg p-3 bg-white space-y-2">
          <div className="flex items-center justify-between"><div className="text-xs font-bold uppercase tracking-wider text-slate-500">Banner {i + 1}</div>
            <button onClick={() => del(b.id)} data-testid={`banner-del-${i}`} className="text-rose-500 hover:bg-rose-50 p-1 rounded"><Trash2 size={14} /></button>
          </div>
          <ImageDropzone testid={`banner-image-${i}`} value={b.image} onChange={(v) => upd(b.id, { image: v })} height="h-32" label="Drop banner image (400×160px)" />
          <TextField label="Banner Title" required value={b.title} onChange={(v) => upd(b.id, { title: v })} testid={`banner-title-${i}`} placeholder="e.g. Eid Sale 60% OFF" />
          <TextField label="Subtitle" optional value={b.subtitle} onChange={(v) => upd(b.id, { subtitle: v })} testid={`banner-subtitle-${i}`} />
          <div className="grid grid-cols-2 gap-2">
            <TextField label="CTA Button Text" required value={b.cta} onChange={(v) => upd(b.id, { cta: v })} testid={`banner-cta-${i}`} />
            <div>
              <Label className="text-xs">CTA Link</Label>
              <select value={b.link} onChange={(e) => upd(b.id, { link: e.target.value })} className="mt-1 w-full border border-slate-200 rounded h-9 text-sm px-2">
                <option>Homepage</option><option>Catalog</option><option>Contact</option><option>Custom URL</option>
              </select>
            </div>
          </div>
        </div>
      ))}
      {items.length < 5 && <Button onClick={add} variant="outline" data-testid="banner-add" className="w-full gap-1"><Plus size={14} /> Add Another Banner</Button>}
    </div>
  );
};

const ListItemEditor = ({ items = [], onChange, fields, testidPrefix, addLabel }) => {
  const add = () => onChange([...items, { id: uid(testidPrefix), ...fields.reduce((a, f) => ({ ...a, [f.key]: f.default ?? "" }), {}) }]);
  const upd = (id, patch) => onChange(items.map((x) => x.id === id ? { ...x, ...patch } : x));
  const del = (id) => onChange(items.filter((x) => x.id !== id));
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={it.id} className="border border-slate-200 rounded-lg p-3 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{addLabel} {i + 1}</div>
            <button onClick={() => del(it.id)} data-testid={`${testidPrefix}-del-${i}`} className="text-rose-500 hover:bg-rose-50 p-1 rounded"><Trash2 size={14} /></button>
          </div>
          {fields.map((f) => {
            if (f.type === "image") return <ImageDropzone key={f.key} testid={`${testidPrefix}-${f.key}-${i}`} value={it[f.key]} onChange={(v) => upd(it.id, { [f.key]: v })} height={f.height || "h-28"} label={f.label} />;
            if (f.type === "select") return (
              <div key={f.key}>
                <Label className="text-xs">{f.label}{f.required && <span className="text-rose-500"> *</span>}</Label>
                <select data-testid={`${testidPrefix}-${f.key}-${i}`} value={it[f.key] || ""} onChange={(e) => upd(it.id, { [f.key]: e.target.value })} className="mt-1 w-full border border-slate-200 rounded h-9 text-sm px-2">
                  <option value="">Select...</option>
                  {(f.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            );
            if (f.type === "textarea") return (
              <div key={f.key}>
                <Label className="text-xs">{f.label}{f.optional && <span className="text-slate-400 text-[10px] ml-1">(Optional)</span>}</Label>
                <Textarea data-testid={`${testidPrefix}-${f.key}-${i}`} value={it[f.key] || ""} onChange={(e) => upd(it.id, { [f.key]: e.target.value })} maxLength={f.max} className="mt-1 text-sm" rows={2} />
              </div>
            );
            if (f.type === "row") return (
              <div key={f.key} className="grid grid-cols-2 gap-2">
                {f.fields.map((sub) => (
                  <TextField key={sub.key} testid={`${testidPrefix}-${sub.key}-${i}`} label={sub.label} value={it[sub.key]} onChange={(v) => upd(it.id, { [sub.key]: v })} type={sub.inputType} prefix={sub.prefix} optional={sub.optional} required={sub.required} />
                ))}
              </div>
            );
            return <TextField key={f.key} testid={`${testidPrefix}-${f.key}-${i}`} label={f.label} value={it[f.key]} onChange={(v) => upd(it.id, { [f.key]: v })} type={f.inputType} prefix={f.prefix} optional={f.optional} required={f.required} placeholder={f.placeholder} />;
          })}
        </div>
      ))}
      <Button onClick={add} variant="outline" data-testid={`${testidPrefix}-add`} className="w-full gap-1"><Plus size={14} /> {addLabel ? `Add ${addLabel}` : "Add"}</Button>
    </div>
  );
};

const StoreInfoEditor = ({ info = {}, onChange, kind }) => {
  const upd = (patch) => onChange({ ...info, ...patch });
  const isHealth = kind === "health"; const isFood = kind === "restaurant"; const isMatri = kind === "matrimony";
  return (
    <div className="space-y-3 bg-white border border-slate-200 rounded-lg p-3">
      <TextField label={isHealth ? "Clinic Name" : isFood ? "Restaurant Name" : isMatri ? "Matrimony Service Name" : "Business Name"} required value={info.name} onChange={(v) => upd({ name: v })} testid="info-name" />
      <div className="grid grid-cols-2 gap-2">
        <TextField label={isMatri ? "Support Phone" : "Phone"} required value={info.phone} onChange={(v) => upd({ phone: v })} testid="info-phone" />
        <TextField label="Email" value={info.email} onChange={(v) => upd({ email: v })} testid="info-email" />
      </div>
      <TextField label={isMatri ? "Office Address" : "Address"} required value={info.address} onChange={(v) => upd({ address: v })} testid="info-address" />
      {(isFood || isHealth || isMatri) && <TextField label={isMatri ? "Support Hours" : "Hours"} optional value={info.hours} onChange={(v) => upd({ hours: v })} testid="info-hours" />}
      <TextField label="Currency" value={info.currency || "BDT"} onChange={(v) => upd({ currency: v })} testid="info-currency" />
    </div>
  );
};

// ============ MAIN ============

const ContentManager = ({ template, onBack, onContinue, initial }) => {
  const kind = getKindFor(template.id);
  const sections = SECTIONS[kind] || SECTIONS.ecommerce;
  const [activeSection, setActiveSection] = useState(sections[0]);
  const [content, setContent] = useState(() => initial || { storeInfo: {}, banners: [], categories: [], products: [], menuItems: [], doctors: [], services: [], instructors: [], courses: [], areas: [], agents: [], properties: [], destinations: [], packages: [], team: [], campaigns: [], pricing: [], testimonials: [], profiles: [], stories: [], plans: [] });
  const [warnOpen, setWarnOpen] = useState(false);

  const setSection = (key, items) => setContent((p) => ({ ...p, [key]: items }));

  const completion = useMemo(() => {
    const states = sections.map((s) => sectionState(content, s));
    const done = states.filter((s) => s === "complete").length;
    return { done, total: sections.length, states };
  }, [content, sections]);

  const validate = () => {
    const min = MIN_REQUIRED[kind] || {};
    const missing = [];
    Object.entries(min).forEach(([key, n]) => {
      const c = content[key];
      const have = Array.isArray(c) ? c.length : (c && c.name ? 1 : 0);
      if (have < n) missing.push({ key, need: n, have });
    });
    if (!content.storeInfo || !content.storeInfo.name) missing.push({ key: "storeInfo", need: 1, have: 0 });
    return missing;
  };

  const fillSample = () => {
    const seed = SAMPLE_CONTENT[template.id];
    if (!seed) {
      toast.error("No sample data available for this template");
      return;
    }
    setContent({ ...content, ...seed() });
    toast.success("✓ Sample data loaded — edit any field before launching");
  };

  const next = () => {
    const missing = validate();
    if (missing.length > 0) { setWarnOpen(true); return; }
    onContinue(content);
  };

  const proceedAnyway = () => { setWarnOpen(false); onContinue(content); };

  const renderEditor = () => {
    if (activeSection === "banners") return <BannerEditor items={content.banners} onChange={(v) => setSection("banners", v)} />;
    if (activeSection === "categories") return <ListItemEditor items={content.categories} onChange={(v) => setSection("categories", v)} testidPrefix="cat" addLabel="Category"
      fields={[{ key: "icon", label: "Icon Emoji (Optional)", optional: true, placeholder: "e.g. 📱" }, { key: "name", label: "Category Name", required: true }]} />;
    if (activeSection === "products") return <ListItemEditor items={content.products} onChange={(v) => setSection("products", v)} testidPrefix="prod" addLabel="Product"
      fields={[
        { key: "image", type: "image", label: "Drop product image (primary)" },
        { key: "name", label: "Product Name", required: true },
        { key: "category", type: "select", label: "Category", required: true, options: (content.categories || []).map((c) => c.name) },
        { key: "desc", type: "textarea", label: "Short Description", optional: true, max: 150 },
        { key: "_row1", type: "row", fields: [
          { key: "price", label: "Price (BDT)", required: true, inputType: "number", prefix: "৳" },
          { key: "salePrice", label: "Sale Price (BDT)", optional: true, inputType: "number", prefix: "৳" },
        ]},
        { key: "stock", label: "Stock Quantity", required: true, inputType: "number" },
        { key: "status", type: "select", label: "Status", options: ["Active","Draft"] },
      ]} />;
    if (activeSection === "menuItems") return <ListItemEditor items={content.menuItems} onChange={(v) => setSection("menuItems", v)} testidPrefix="menu" addLabel="Menu Item"
      fields={[
        { key: "image", type: "image", label: "Drop item image" },
        { key: "name", label: "Item Name", required: true },
        { key: "category", type: "select", label: "Category", required: true, options: (content.categories || []).map((c) => c.name) },
        { key: "price", label: "Price (BDT)", required: true, inputType: "number", prefix: "৳" },
        { key: "desc", type: "textarea", label: "Description", optional: true, max: 100 },
        { key: "spice", type: "select", label: "Spice Level", options: ["Mild","Medium","Hot","Extra Hot"] },
      ]} />;
    if (activeSection === "doctors") return <ListItemEditor items={content.doctors} onChange={(v) => setSection("doctors", v)} testidPrefix="doc" addLabel="Doctor"
      fields={[
        { key: "image", type: "image", label: "Drop profile photo" },
        { key: "name", label: "Full Name", required: true },
        { key: "specialty", type: "select", label: "Specialty", required: true, options: ["Cardiology","Pediatrics","Dermatology","Neurology","Orthopedics","Gynecology","ENT","Psychiatry","General Medicine"] },
        { key: "qualification", label: "Qualification (e.g. MBBS, FCPS)", required: true },
        { key: "_row", type: "row", fields: [
          { key: "experience", label: "Years of Experience", inputType: "number", required: true },
          { key: "fee", label: "Consultation Fee (BDT)", inputType: "number", required: true, prefix: "৳" },
        ]},
        { key: "bio", type: "textarea", label: "Bio", optional: true, max: 200 },
      ]} />;
    if (activeSection === "services") return <ListItemEditor items={content.services} onChange={(v) => setSection("services", v)} testidPrefix="svc" addLabel="Service"
      fields={[{ key: "name", label: "Service Name", required: true }, { key: "price", label: "Price (BDT)", inputType: "number", prefix: "৳", required: true }]} />;
    if (activeSection === "instructors") return <ListItemEditor items={content.instructors} onChange={(v) => setSection("instructors", v)} testidPrefix="ins" addLabel="Instructor"
      fields={[{ key: "image", type: "image", label: "Drop instructor photo" }, { key: "name", label: "Name", required: true }, { key: "title", label: "Title / Subject" }]} />;
    if (activeSection === "courses") return <ListItemEditor items={content.courses} onChange={(v) => setSection("courses", v)} testidPrefix="crs" addLabel="Course"
      fields={[
        { key: "thumb", type: "image", label: "Drop thumbnail (16:9)", height: "h-32" },
        { key: "title", label: "Course Title", required: true },
        { key: "instructor", type: "select", label: "Instructor", required: true, options: (content.instructors || []).map((i) => i.name) },
        { key: "desc", type: "textarea", label: "Short Description", required: true, max: 150 },
        { key: "_row", type: "row", fields: [
          { key: "price", label: "Price (BDT)", inputType: "number", required: true, prefix: "৳" },
          { key: "duration", label: "Duration (e.g. 24 hrs)", required: true },
        ]},
        { key: "level", type: "select", label: "Level", options: ["Beginner","Intermediate","Advanced","All Levels"] },
        { key: "status", type: "select", label: "Status", options: ["Active","Draft","Coming Soon"] },
      ]} />;
    if (activeSection === "areas") return <ListItemEditor items={content.areas} onChange={(v) => setSection("areas", v)} testidPrefix="area" addLabel="Area"
      fields={[{ key: "name", label: "Area Name", required: true }]} />;
    if (activeSection === "agents") return <ListItemEditor items={content.agents} onChange={(v) => setSection("agents", v)} testidPrefix="ag" addLabel="Agent"
      fields={[{ key: "image", type: "image", label: "Drop agent photo" }, { key: "name", label: "Name", required: true }, { key: "phone", label: "Phone" }]} />;
    if (activeSection === "properties") return <ListItemEditor items={content.properties} onChange={(v) => setSection("properties", v)} testidPrefix="prop" addLabel="Property"
      fields={[
        { key: "image", type: "image", label: "Drop primary property photo", height: "h-32" },
        { key: "title", label: "Title", required: true },
        { key: "_row1", type: "row", fields: [
          { key: "type", label: "Type", required: true },
          { key: "listingType", label: "Listing Type", required: true },
        ]},
        { key: "_row2", type: "row", fields: [
          { key: "price", label: "Price (BDT)", inputType: "number", prefix: "৳", required: true },
          { key: "area", label: "Area (sqft)", inputType: "number", required: true },
        ]},
        { key: "_row3", type: "row", fields: [
          { key: "bedrooms", label: "Bedrooms", inputType: "number" },
          { key: "bathrooms", label: "Bathrooms", inputType: "number" },
        ]},
        { key: "location", type: "select", label: "Location", required: true, options: (content.areas || []).map((a) => a.name) },
        { key: "address", label: "Address", required: true },
        { key: "desc", type: "textarea", label: "Description", required: true, max: 200 },
        { key: "agent", type: "select", label: "Agent", options: (content.agents || []).map((a) => a.name) },
        { key: "status", type: "select", label: "Status", options: ["Active","Sold","Rented","Draft"] },
      ]} />;
    if (activeSection === "destinations") return <ListItemEditor items={content.destinations} onChange={(v) => setSection("destinations", v)} testidPrefix="dest" addLabel="Destination"
      fields={[{ key: "name", label: "Destination Name", required: true }]} />;
    if (activeSection === "packages") return <ListItemEditor items={content.packages} onChange={(v) => setSection("packages", v)} testidPrefix="pkg" addLabel="Package"
      fields={[
        { key: "image", type: "image", label: "Drop cover image", height: "h-32" },
        { key: "name", label: "Package Name", required: true },
        { key: "destination", type: "select", label: "Destination", required: true, options: (content.destinations || []).map((d) => d.name) },
        { key: "_row", type: "row", fields: [
          { key: "days", label: "Days", inputType: "number", required: true },
          { key: "nights", label: "Nights", inputType: "number", required: true },
        ]},
        { key: "price", label: "Price Per Person (BDT)", inputType: "number", prefix: "৳", required: true },
        { key: "category", type: "select", label: "Category", options: ["Beach","Hill","Heritage","City","Adventure","Religious"] },
        { key: "status", type: "select", label: "Status", options: ["Active","Draft","Sold Out"] },
      ]} />;
    if (activeSection === "team") return <ListItemEditor items={content.team} onChange={(v) => setSection("team", v)} testidPrefix="team" addLabel="Team Member"
      fields={[{ key: "image", type: "image", label: "Drop photo" }, { key: "name", label: "Name", required: true }, { key: "role", label: "Role" }]} />;
    if (activeSection === "campaigns") return <ListItemEditor items={content.campaigns} onChange={(v) => setSection("campaigns", v)} testidPrefix="cmp" addLabel="Campaign"
      fields={[
        { key: "image", type: "image", label: "Drop campaign image", height: "h-32" },
        { key: "title", label: "Campaign Title", required: true },
        { key: "desc", type: "textarea", label: "Description", required: true, max: 200 },
        { key: "_row", type: "row", fields: [
          { key: "goal", label: "Goal Amount (BDT)", inputType: "number", prefix: "৳", required: true },
          { key: "raised", label: "Raised Amount (BDT)", inputType: "number", prefix: "৳" },
        ]},
        { key: "status", type: "select", label: "Status", options: ["Active","Completed","Paused"] },
      ]} />;
    if (activeSection === "pricing") return <ListItemEditor items={content.pricing} onChange={(v) => setSection("pricing", v)} testidPrefix="pr" addLabel="Plan"
      fields={[
        { key: "name", label: "Plan Name", required: true },
        { key: "price", label: "Price (BDT)", inputType: "number", prefix: "৳", required: true },
        { key: "period", type: "select", label: "Billing Period", options: ["month","year","one-time"] },
      ]} />;
    if (activeSection === "testimonials") return <ListItemEditor items={content.testimonials} onChange={(v) => setSection("testimonials", v)} testidPrefix="tm" addLabel="Testimonial"
      fields={[
        { key: "image", type: "image", label: "Photo (optional)" },
        { key: "name", label: "Name", required: true },
        { key: "company", label: "Company / Role" },
        { key: "quote", type: "textarea", label: "Quote", max: 200 },
      ]} />;
    if (activeSection === "profiles") return <ListItemEditor items={content.profiles} onChange={(v) => setSection("profiles", v)} testidPrefix="pf" addLabel="Profile"
      fields={[
        { key: "image", type: "image", label: "Drop profile photo (square)" },
        { key: "name", label: "Full Name", required: true },
        { key: "_row1", type: "row", fields: [
          { key: "age", label: "Age", inputType: "number", required: true },
          { key: "gender", label: "Gender", required: true },
        ]},
        { key: "_row2", type: "row", fields: [
          { key: "district", label: "District", required: true },
          { key: "religion", label: "Religion" },
        ]},
        { key: "education", label: "Education", required: true, placeholder: "e.g. BSc, BUET" },
        { key: "profession", label: "Profession", required: true, placeholder: "e.g. Software Engineer" },
        { key: "_row3", type: "row", fields: [
          { key: "height", label: "Height", placeholder: "e.g. 5'8\"" },
          { key: "maritalStatus", label: "Marital Status", placeholder: "Never Married" },
        ]},
        { key: "about", type: "textarea", label: "About Me", max: 250, optional: true },
        { key: "status", type: "select", label: "Status", options: ["Active","Hidden","Featured"] },
      ]} />;
    if (activeSection === "stories") return <ListItemEditor items={content.stories} onChange={(v) => setSection("stories", v)} testidPrefix="st" addLabel="Story"
      fields={[
        { key: "image", type: "image", label: "Drop couple photo (4:3)", height: "h-28" },
        { key: "couple", label: "Couple Names", required: true, placeholder: "e.g. Imran & Tahmina" },
        { key: "_row", type: "row", fields: [
          { key: "year", label: "Year", placeholder: "2025" },
          { key: "district", label: "District", placeholder: "Dhaka" },
        ]},
        { key: "quote", type: "textarea", label: "Their Story", max: 280, required: true },
      ]} />;
    if (activeSection === "plans") return <ListItemEditor items={content.plans} onChange={(v) => setSection("plans", v)} testidPrefix="pl" addLabel="Plan"
      fields={[
        { key: "name", label: "Plan Name", required: true, placeholder: "e.g. Premium Monthly" },
        { key: "_row", type: "row", fields: [
          { key: "price", label: "Price (BDT)", inputType: "number", prefix: "৳", required: true },
          { key: "period", label: "Billing Period", placeholder: "month / 7 days / lifetime" },
        ]},
        { key: "badge", label: "Badge (Optional)", placeholder: "Popular / Best Value", optional: true },
        { key: "status", type: "select", label: "Status", options: ["Active","Draft","Archived"] },
      ]} />;
    if (activeSection === "storeInfo") return <StoreInfoEditor info={content.storeInfo} onChange={(v) => setSection("storeInfo", v)} kind={kind} />;
    return null;
  };

  return (
    <div className="space-y-4">
      <StorageMeter usedBytes={0} />

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="text-lg font-bold">Step 4: Add Your Content</div>
            <div className="text-xs text-slate-500">Fill in your real data — your app launches with it</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-slate-600"><b>{completion.done}</b> of {completion.total} sections complete</div>
            <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${(completion.done / completion.total) * 100}%` }} /></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Sidebar */}
          <aside className="lg:col-span-3 border-r border-slate-200 p-3 space-y-1 bg-slate-50">
            {sections.map((s, idx) => (
              <button
                key={s}
                data-testid={`content-section-${s}`}
                onClick={() => setActiveSection(s)}
                className={`w-full flex items-center justify-between gap-2 text-left text-sm px-3 py-2 rounded-md ${activeSection === s ? "bg-white border border-slate-200 shadow-sm font-semibold" : "hover:bg-white text-slate-700"}`}
              >
                <span className="flex items-center gap-2">{SECTION_LABELS[s] || s}</span>
                <Dot state={completion.states[idx]} />
              </button>
            ))}
            <div className="pt-3">
              <Button onClick={fillSample} data-testid="skip-sample-data" variant="outline" className="w-full gap-1 text-xs"><Sparkles size={12} /> Skip — Use Sample Data</Button>
            </div>
          </aside>

          {/* Form */}
          <main className="lg:col-span-6 p-4">
            <div className="text-sm font-bold mb-3 flex items-center gap-2">
              {SECTION_LABELS[activeSection]}
              <Dot state={completion.states[sections.indexOf(activeSection)]} />
            </div>
            {renderEditor()}
          </main>

          {/* Mini Preview */}
          <aside className="lg:col-span-3 border-l border-slate-200 p-3 bg-slate-50">
            <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">Live Mini Preview</div>
            <MiniPreview content={content} template={template} section={activeSection} />
          </aside>
        </div>

        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between gap-2 bg-white sticky bottom-0">
          <Button variant="outline" onClick={onBack} data-testid="content-back" className="gap-1"><ChevronLeft size={14} /> Back</Button>
          <Button variant="outline" onClick={fillSample} data-testid="content-skip" className="gap-1 text-xs">Skip — Use Sample Data</Button>
          <Button onClick={next} data-testid="content-next" className="bg-[#e11d48] hover:bg-[#be123c] gap-1">Next: Preview →</Button>
        </div>
      </div>

      <Dialog open={warnOpen} onOpenChange={setWarnOpen}>
        <DialogContent data-testid="content-warn-modal" className="max-w-md">
          <DialogTitle className="flex items-center gap-2"><AlertCircle className="text-amber-500" size={20} /> Your app needs a little more content</DialogTitle>
          <DialogDescription>To launch a quality app, please add at least:</DialogDescription>
          <ul className="space-y-2 text-sm">
            {validate().map((m) => (
              <li key={m.key} className="flex items-center gap-2 text-slate-700">
                <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 text-[10px] flex items-center justify-center font-bold">!</span>
                <span>Add at least <b>{m.need}</b> {SECTION_LABELS[m.key]?.toLowerCase() || m.key} (you have {m.have})</span>
              </li>
            ))}
          </ul>
          <div className="flex gap-2 mt-3">
            <Button variant="outline" data-testid="warn-go-back" onClick={() => setWarnOpen(false)} className="flex-1">Go Back & Add Content</Button>
            <Button data-testid="warn-continue" onClick={proceedAnyway} className="flex-1 bg-slate-700">Continue Anyway</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const MiniPreview = ({ content, template, section }) => {
  const primary = template.palette?.primary || "#e11d48";
  if (section === "banners" && content.banners?.length > 0) {
    const b = content.banners[0];
    return (
      <div className="rounded-lg overflow-hidden border border-slate-200 bg-white">
        <div className="h-24 relative" style={{ background: b.image ? `url(${b.image}) center/cover` : `linear-gradient(135deg, ${primary}, ${b.color || primary})` }}>
          <div className="absolute inset-0 bg-black/30 p-2 flex flex-col justify-end text-white">
            <div className="text-[10px] font-bold leading-tight">{b.title || "Banner Title"}</div>
            <div className="text-[9px] opacity-80">{b.subtitle}</div>
          </div>
        </div>
        <div className="p-2 text-center"><span className="inline-block text-[9px] font-bold text-white px-2 py-0.5 rounded" style={{ background: primary }}>{b.cta}</span></div>
      </div>
    );
  }
  if ((section === "products" || section === "menuItems") && (content.products?.length > 0 || content.menuItems?.length > 0)) {
    const items = (content.products || content.menuItems || []).slice(0, 4);
    return (
      <div className="grid grid-cols-2 gap-1.5">
        {items.map((p) => (
          <div key={p.id} className="bg-white border border-slate-200 rounded overflow-hidden">
            <div className="h-12" style={{ background: p.image ? `url(${p.image}) center/cover` : `linear-gradient(135deg, ${primary}, #f59e0b)` }} />
            <div className="p-1 text-[9px]">
              <div className="font-bold truncate">{p.name}</div>
              <div style={{ color: primary }}>৳{p.salePrice || p.price}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (section === "doctors" && content.doctors?.length > 0) {
    return (
      <div className="space-y-1.5">
        {content.doctors.slice(0, 3).map((d) => (
          <div key={d.id} className="bg-white border border-slate-200 rounded p-1.5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0" style={{ background: d.image ? `url(${d.image}) center/cover` : `linear-gradient(135deg, ${primary}, #f59e0b)` }}>
              {!d.image && <div className="w-full h-full flex items-center justify-center text-white text-[10px] font-bold">{d.name?.[0]}</div>}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-bold truncate">{d.name || "Doctor Name"}</div>
              <div className="text-[9px] text-slate-500 truncate">{d.specialty}</div>
              <div className="text-[9px]" style={{ color: primary }}>৳{d.fee || "—"}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (section === "courses" && content.courses?.length > 0) {
    return (
      <div className="space-y-1.5">
        {content.courses.slice(0, 2).map((c) => (
          <div key={c.id} className="bg-white border border-slate-200 rounded overflow-hidden">
            <div className="h-14" style={{ background: c.thumb ? `url(${c.thumb}) center/cover` : `linear-gradient(135deg, ${primary}, #f59e0b)` }} />
            <div className="p-1.5">
              <div className="text-[10px] font-bold truncate">{c.title || "Course"}</div>
              <div className="text-[9px]" style={{ color: primary }}>৳{c.price || 0}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (section === "campaigns" && content.campaigns?.length > 0) {
    return (
      <div className="space-y-1.5">
        {content.campaigns.slice(0, 2).map((c) => {
          const pct = c.goal ? Math.min(100, (c.raised || 0) / c.goal * 100) : 0;
          return (
            <div key={c.id} className="bg-white border border-slate-200 rounded p-2">
              <div className="text-[10px] font-bold truncate">{c.title || "Campaign"}</div>
              <div className="h-1 bg-slate-200 rounded-full mt-1 overflow-hidden"><div className="h-full" style={{ width: `${pct}%`, background: primary }} /></div>
              <div className="text-[9px] mt-1 flex justify-between"><span style={{ color: primary }}>৳{c.raised || 0}</span><span className="text-slate-500">/ ৳{c.goal || 0}</span></div>
            </div>
          );
        })}
      </div>
    );
  }
  if (section === "profiles" && content.profiles?.length > 0) {
    return (
      <div className="space-y-1.5">
        {content.profiles.slice(0, 3).map((p) => (
          <div key={p.id} className="bg-white border border-slate-200 rounded p-1.5 flex items-center gap-2">
            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0" style={{ background: p.image ? `url(${p.image}) center/cover` : `linear-gradient(135deg, ${primary}, #f43f5e)` }}>
              {!p.image && <div className="w-full h-full flex items-center justify-center text-white text-[10px] font-bold">{p.name?.[0]}</div>}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-bold truncate">{p.name}, {p.age}</div>
              <div className="text-[9px] text-slate-500 truncate">{p.profession} · {p.district}</div>
              <div className="text-[9px]" style={{ color: primary }}>🔒 Contact locked</div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (section === "stories" && content.stories?.length > 0) {
    return (
      <div className="space-y-1.5">
        {content.stories.slice(0, 2).map((s) => (
          <div key={s.id} className="bg-white border border-slate-200 rounded overflow-hidden">
            <div className="h-14 relative" style={{ background: s.image ? `url(${s.image}) center/cover` : `linear-gradient(135deg, ${primary}, #fb7185)` }}>
              <div className="absolute bottom-1 left-1.5 text-white text-[10px] font-bold drop-shadow">{s.couple}</div>
            </div>
            <div className="p-1.5 text-[9px] text-slate-600 line-clamp-2">"{s.quote}"</div>
          </div>
        ))}
      </div>
    );
  }
  if (section === "plans" && content.plans?.length > 0) {
    return (
      <div className="space-y-1.5">
        {content.plans.slice(0, 3).map((p) => (
          <div key={p.id} className="bg-white border border-slate-200 rounded p-1.5 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-[10px] font-bold truncate">{p.name}</div>
              <div className="text-[9px] text-slate-500">{p.period}</div>
            </div>
            <div className="text-[10px] font-bold" style={{ color: primary }}>৳{p.price}</div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 text-center text-xs text-slate-400">
      <div className="text-2xl mb-1">{template.icon}</div>
      Add content to see your<br />app come alive
    </div>
  );
};

export default ContentManager;
