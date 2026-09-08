"use client";

import {useRef, useState} from "react";
import {useSearchParams} from "next/navigation";
import type {Locale, SiteCopy} from "@/lib/site";
import type {RfqItem, RfqPayload} from "@/lib/rfq";
import {MinusIcon, PlusIcon} from "./Icons";

const emptyItem = (): RfqItem => ({description: "", partNumber: "", specification: "", quantity: "", unit: "", notes: ""});
type SubmitState = {type: "idle" | "loading" | "success" | "fallback" | "error"; message?: string; reference?: string; mailto?: string};

export function RFQForm({locale, copy}: {locale: Locale; copy: SiteCopy}) {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<RfqItem[]>(() => [{...emptyItem(), description: searchParams.get("category") ?? ""}]);
  const [state, setState] = useState<SubmitState>({type: "idle"});
  const [errors, setErrors] = useState<string[]>([]);
  const summaryRef = useRef<HTMLDivElement>(null);

  const updateItem = (index: number, field: keyof RfqItem, value: string) => {
    setItems((current) => current.map((item, itemIndex) => itemIndex === index ? {...item, [field]: value} : item));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({type: "idle"});
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload: RfqPayload = {
      locale,
      name: String(form.get("name") ?? ""),
      company: String(form.get("company") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      country: String(form.get("country") ?? ""),
      province: String(form.get("province") ?? ""),
      city: String(form.get("city") ?? ""),
      deliveryLocation: String(form.get("deliveryLocation") ?? ""),
      requiredDate: String(form.get("requiredDate") ?? ""),
      additionalNotes: String(form.get("additionalNotes") ?? ""),
      consent: form.get("consent") === "on",
      website: String(form.get("website") ?? ""),
      items,
    };

    const localErrors: string[] = [];
    if (!payload.name.trim() || !payload.phone.trim() || !payload.country.trim()) localErrors.push(copy.rfq.errors.required);
    if (!payload.company.trim()) localErrors.push(copy.rfq.errors.company);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) localErrors.push(copy.rfq.errors.email);
    if (items.some((item) => !item.description.trim() || !Number.isFinite(Number(item.quantity)) || Number(item.quantity) <= 0)) localErrors.push(copy.rfq.errors.item);
    if (!payload.consent) localErrors.push(copy.rfq.errors.consent);
    const attachments = form.getAll("attachments").filter((value): value is File => value instanceof File && value.size > 0);
    if (attachments.some((file) => file.size > 8 * 1024 * 1024) || attachments.reduce((sum, file) => sum + file.size, 0) > 15 * 1024 * 1024) localErrors.push(copy.rfq.errors.file);
    if (localErrors.length) {
      setErrors([...new Set(localErrors)]);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setErrors([]);
    setState({type: "loading"});
    const request = new FormData();
    request.append("payload", JSON.stringify(payload));
    attachments.forEach((file) => request.append("attachments", file));

    try {
      const response = await fetch("/api/rfq", {method: "POST", body: request});
      const result = await response.json() as {status: string; code?: string; reference?: string; mailto?: string};
      if (result.status === "success" && result.reference) {
        setState({type: "success", message: copy.rfq.success, reference: result.reference});
        formElement.reset();
        setItems([emptyItem()]);
        return;
      }
      if (result.status === "fallback") {
        setState({type: "fallback", message: copy.rfq.fallback, mailto: result.mailto});
        return;
      }
      const localized = result.code === "file" ? copy.rfq.errors.file : result.code === "email" ? copy.rfq.errors.email : result.code === "item" ? copy.rfq.errors.item : copy.rfq.errors.server;
      setState({type: "error", message: localized, mailto: result.mailto});
    } catch {
      setState({type: "error", message: copy.rfq.errors.server});
    }
  }

  const field = (id: string, label: string, required = false, type = "text", autoComplete?: string) => <label className="field" htmlFor={id}>
    <span>{label}{!required && <small>{copy.rfq.optional}</small>}</span>
    <input id={id} name={id} type={type} required={required} autoComplete={autoComplete} />
  </label>;

  return <form className="rfq-form" onSubmit={handleSubmit} noValidate>
    {errors.length > 0 && <div className="error-summary" role="alert" tabIndex={-1} ref={summaryRef}><strong>{copy.rfq.errors.required}</strong><ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul></div>}
    <fieldset>
      <legend>{copy.rfq.contactSection}</legend>
      <div className="form-grid">
        {field("name", copy.rfq.fields.name, true, "text", "name")}
        {field("company", copy.rfq.fields.company, true, "text", "organization")}
        {field("email", copy.rfq.fields.email, true, "email", "email")}
        {field("phone", copy.rfq.fields.phone, true, "tel", "tel")}
        <label className="field" htmlFor="country"><span>{copy.rfq.fields.country}</span><select id="country" name="country" required defaultValue=""><option value="" disabled>—</option>{copy.rfq.countries.map((country) => <option key={country} value={country}>{country}</option>)}</select></label>
        {field("province", copy.rfq.fields.province)}
        {field("city", copy.rfq.fields.city)}
        {field("deliveryLocation", copy.rfq.fields.deliveryLocation)}
      </div>
      <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
    </fieldset>

    <fieldset>
      <legend>{copy.rfq.itemsSection}</legend>
      <div className="rfq-items">
        {items.map((item, index) => <div className="rfq-item" key={index}>
          <div className="item-header"><h3>{copy.rfq.item} {String(index + 1).padStart(2, "0")}</h3>{items.length > 1 && <button type="button" className="remove-item" onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))}><MinusIcon />{copy.rfq.removeItem}</button>}</div>
          <div className="form-grid">
            <label className="field wide" htmlFor={`description-${index}`}><span>{copy.rfq.fields.description}</span><input id={`description-${index}`} value={item.description} onChange={(event) => updateItem(index, "description", event.target.value)} required /></label>
            <label className="field" htmlFor={`part-${index}`}><span>{copy.rfq.fields.partNumber}<small>{copy.rfq.optional}</small></span><input id={`part-${index}`} value={item.partNumber} onChange={(event) => updateItem(index, "partNumber", event.target.value)} /></label>
            <label className="field" htmlFor={`spec-${index}`}><span>{copy.rfq.fields.specification}<small>{copy.rfq.optional}</small></span><input id={`spec-${index}`} value={item.specification} onChange={(event) => updateItem(index, "specification", event.target.value)} /></label>
            <label className="field" htmlFor={`qty-${index}`}><span>{copy.rfq.fields.quantity}</span><input id={`qty-${index}`} type="number" min="0.01" step="any" value={item.quantity} onChange={(event) => updateItem(index, "quantity", event.target.value)} required /></label>
            <label className="field" htmlFor={`unit-${index}`}><span>{copy.rfq.fields.unit}<small>{copy.rfq.optional}</small></span><input id={`unit-${index}`} value={item.unit} onChange={(event) => updateItem(index, "unit", event.target.value)} /></label>
            <label className="field wide" htmlFor={`notes-${index}`}><span>{copy.rfq.fields.notes}<small>{copy.rfq.optional}</small></span><textarea id={`notes-${index}`} rows={2} value={item.notes} onChange={(event) => updateItem(index, "notes", event.target.value)} /></label>
          </div>
        </div>)}
      </div>
      <button type="button" className="add-item" onClick={() => setItems((current) => [...current, emptyItem()])}><PlusIcon />{copy.rfq.addItem}</button>
    </fieldset>

    <fieldset>
      <legend>{copy.rfq.generalSection}</legend>
      <div className="form-grid">
        {field("requiredDate", copy.rfq.fields.date, false, "date")}
        <label className="field wide" htmlFor="additionalNotes"><span>{copy.rfq.fields.additional}<small>{copy.rfq.optional}</small></span><textarea id="additionalNotes" name="additionalNotes" rows={5} /></label>
        <label className="field wide file-field" htmlFor="attachments"><span>{copy.rfq.fields.attachment}<small>{copy.rfq.optional}</small></span><input id="attachments" name="attachments" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" /><small>{copy.rfq.fileHelp}</small><em>{copy.rfq.privacy}</em></label>
      </div>
      <label className="consent-field"><input type="checkbox" name="consent" /><span>{copy.rfq.fields.consent}</span></label>
    </fieldset>

    {state.type !== "idle" && state.type !== "loading" && <div className={`submit-message ${state.type}`} role="status"><p>{state.message}</p>{state.reference && <strong>{copy.rfq.reference}: {state.reference}</strong>}{state.mailto && <a href={state.mailto}>{copy.rfq.openEmail} ↗</a>}</div>}
    <button className="submit-rfq" type="submit" disabled={state.type === "loading"}>{state.type === "loading" ? copy.rfq.submitting : copy.rfq.submit}<span aria-hidden="true">→</span></button>
  </form>;
}
