export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];

export const pageKeys = [
  "home", "about", "products", "lifting", "fasteners", "hardware",
  "procurement", "industries", "rfq", "contact",
] as const;
export type PageKey = (typeof pageKeys)[number];

export const routes: Record<PageKey, Record<Locale, string>> = {
  home: {en: "/en", fr: "/fr"},
  about: {en: "/en/about", fr: "/fr/a-propos"},
  products: {en: "/en/products", fr: "/fr/produits"},
  lifting: {en: "/en/products/lifting-equipment", fr: "/fr/produits/equipements-de-levage"},
  fasteners: {en: "/en/products/fasteners", fr: "/fr/produits/fixations-boulonnerie"},
  hardware: {en: "/en/products/industrial-hardware", fr: "/fr/produits/fournitures-industrielles"},
  procurement: {en: "/en/procurement", fr: "/fr/approvisionnement"},
  industries: {en: "/en/industries", fr: "/fr/secteurs"},
  rfq: {en: "/en/rfq", fr: "/fr/devis"},
  contact: {en: "/en/contact", fr: "/fr/contact"},
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function routeFor(key: PageKey, locale: Locale) {
  return routes[key][locale];
}

export function pageFromPath(pathname: string): PageKey | undefined {
  return pageKeys.find((key) => Object.values(routes[key]).includes(pathname));
}

export function switchLocalePath(pathname: string, locale: Locale) {
  const key = pageFromPath(pathname);
  return key ? routes[key][locale] : routes.home[locale];
}

export function resolvePage(locale: Locale, slug?: string[]): PageKey | undefined {
  const pathname = `/${locale}${slug?.length ? `/${slug.join("/")}` : ""}`;
  return pageKeys.find((key) => routes[key][locale] === pathname);
}

export const company = {
  name: "AKGLOBAL TRADING PTY",
  registration: "202074701907",
  owner: "Kasongo",
  phoneDisplay: "082 955 6071",
  phoneHref: "tel:+27829556071",
  emails: ["aakasongo.77@gmail.com", "AkilimaliglobalT@gmail.com"],
  address: ["1 Broadacres Drive", "Fourways", "Sandton", "2055", "South Africa"],
} as const;

export const categoryImages = {
  lifting: "/assets/akglobal/categories/lifting-equipment.jpg",
  fasteners: "/assets/akglobal/categories/fasteners-bolting.jpg",
  hardware: "/assets/akglobal/categories/industrial-hardware.jpg",
  procurement: "/assets/akglobal/categories/procurement-sourcing.jpg",
} as const;

type CategoryContent = {
  key: "lifting" | "fasteners" | "hardware" | "procurement";
  title: string;
  short: string;
  description: string;
  items: string[];
  route: PageKey;
};

export const content = {
  en: {
    localeName: "English",
    languageCode: "EN",
    nav: {company: "Company", products: "Products", procurement: "Procurement", industries: "Industries", contact: "Contact", quote: "Request a quote", menu: "Open menu", close: "Close menu"},
    common: {
      eyebrow: "South Africa · DRC",
      based: "Based in South Africa. Serving businesses in South Africa and the Democratic Republic of the Congo.",
      quote: "Request a quote",
      explore: "Explore products",
      addRfq: "Add to RFQ",
      learnMore: "Learn more",
      specification: "Specifications, availability and commercial terms are confirmed at quotation stage.",
      home: "Home",
      backProducts: "Back to products",
      next: "Next",
    },
    meta: {
      home: ["Industrial Supply from South Africa to the DRC", "Industrial equipment, lifting solutions, fasteners and professional procurement from South Africa for businesses locally and in the DRC."],
      about: ["About AKGLOBAL Trading", "Meet AKGLOBAL TRADING PTY, a South African industrial trading and procurement company serving South Africa and the DRC."],
      products: ["Industrial Products & Equipment", "Explore lifting equipment, fasteners, bolting and industrial hardware supplied through AKGLOBAL Trading."],
      lifting: ["Lifting Equipment Supplier", "Request chain blocks, lever hoists and lifting-related equipment from AKGLOBAL Trading in South Africa."],
      fasteners: ["Fasteners & Bolting Supplier", "Source hex bolts, set screws, threaded rods, nuts and graded fasteners through AKGLOBAL Trading."],
      hardware: ["Industrial Hardware & Consumables", "Industrial components, engineering consumables and maintenance hardware sourced for business requirements."],
      procurement: ["Industrial Procurement & Sourcing", "Send your RFQ, technical sheet or purchase list for professional sourcing assessment from South Africa."],
      industries: ["Industries We Can Support", "Industrial supply and procurement support for engineering, construction, mining support, maintenance and manufacturing."],
      rfq: ["Request an Industrial Supply Quote", "Send AKGLOBAL Trading a detailed bilingual RFQ for industrial equipment, fasteners, hardware or sourcing."],
      contact: ["Contact AKGLOBAL Trading", "Contact AKGLOBAL TRADING PTY in Fourways, Sandton for industrial supply enquiries in South Africa and the DRC."],
    },
    home: {
      heroEyebrow: "AKGLOBAL Trading Pty · South Africa ↔ DRC",
      heroTitle: ["Industrial", "supply.", "Without", "compromise."],
      heroBody: "AKGLOBAL TRADING PTY supplies industrial equipment, lifting solutions, fasteners and professional sourcing services from South Africa to businesses locally and in the Democratic Republic of the Congo.",
      imageCaption: "Engineered for demanding requirements",
      supplyKicker: "01 / What we supply",
      supplyTitle: "Industrial requirements, sourced with precision.",
      supplyBody: "From defined product specifications to broader purchase lists, we assess each requirement and prepare a clear commercial quotation.",
      geographyKicker: "02 / South Africa ↔ DRC",
      geographyTitle: "A South African sourcing base. Regional business reach.",
      geographyBody: "AKGLOBAL operates from Fourways, Sandton. We source and supply for businesses in South Africa and serve customers in the Democratic Republic of the Congo without implying a branch or warehouse there.",
      routeFrom: "Sourcing base",
      routeTo: "Customer market",
      processKicker: "03 / From requirement to supply",
      processTitle: "A clear procurement path.",
      steps: ["Send your RFQ", "We assess sourcing", "You receive a quotation", "Supply is arranged"],
      categoriesKicker: "04 / Product categories",
      categoriesTitle: "Focused industrial supply.",
      whyKicker: "05 / Why AKGLOBAL",
      whyTitle: "Business procurement, handled professionally.",
      reasons: ["Responsive sourcing", "Clear quotations", "Industrial product focus", "Professional communication", "Cross-border client service", "Business-focused procurement"],
      industriesKicker: "06 / Industries",
      industriesTitle: "Requirements across industry and operations.",
      statement: ["Quality equipment.", "Reliable supply.", "A stronger tomorrow."],
      ctaKicker: "08 / Start an enquiry",
      ctaTitle: "Send us your industrial requirement.",
      ctaBody: "Share product descriptions, quantities, specifications or an existing purchase list. We will assess sourcing and availability.",
    },
    categories: [
      {key: "lifting", title: "Lifting equipment", short: "Chain blocks · Lever hoists · Lifting solutions", description: "Lifting-related equipment selected against your operational requirement and requested specification.", items: ["Chain blocks", "Lever hoists", "Lifting-related equipment"], route: "lifting"},
      {key: "fasteners", title: "Fasteners & bolting", short: "Bolts · Set screws · Rods · Nuts", description: "Industrial fasteners and bolting supplied to specified grades, finishes and quantities.", items: ["Hex bolts", "Hex set screws", "Screwed and threaded rods", "Hex nuts", "Grade 8 and 8.8", "Electro-galvanised", "Hot-dip galvanised"], route: "fasteners"},
      {key: "hardware", title: "Industrial hardware", short: "Components · Consumables · Maintenance", description: "Practical industrial components, engineering consumables and maintenance hardware for business operations.", items: ["Industrial components", "Engineering consumables", "Maintenance hardware"], route: "hardware"},
      {key: "procurement", title: "Procurement & sourcing", short: "RFQ · Quantity sourcing · Special requirements", description: "Requirement-led sourcing for purchase lists, specified products and special industrial needs.", items: ["RFQ sourcing", "Industrial procurement", "Quantity sourcing", "Special requirements", "Business supply"], route: "procurement"},
    ] satisfies CategoryContent[],
    about: {
      kicker: "Company / AKGLOBAL Trading",
      title: "Industrial trading shaped around the requirement.",
      lead: "AKGLOBAL TRADING PTY is a South African industrial trading and procurement company focused on sourcing and supplying equipment, fasteners and industrial requirements for businesses in South Africa and the Democratic Republic of the Congo.",
      sections: [
        ["Our role", "We work from the customer’s specification. Whether the need is a defined fastener grade, lifting equipment or a broader purchase list, we assess the requirement and prepare a commercial quotation based on sourcing and availability."],
        ["Our base", "The company is registered and operates from Fourways, Sandton, South Africa. AKGLOBAL serves clients locally and in the Democratic Republic of the Congo. The company does not represent that it has a Congolese office or warehouse."],
        ["Our standard", "Clear communication, accurate requirement capture and disciplined quotation form the basis of every enquiry. Product specifications and commercial terms are confirmed before supply is arranged."],
      ],
      detailsTitle: "Company details",
    },
    products: {
      kicker: "Products / Industrial supply",
      title: "Equipment and hardware for real operating requirements.",
      lead: "Browse our core supply categories, then send the products, quantities and specifications you require. AKGLOBAL is a quotation-driven B2B supplier, not a retail catalogue.",
      noteTitle: "Need something outside these categories?",
      noteBody: "Send your requirement, part number, technical sheet, photo or purchase list. We will assess sourcing and availability.",
    },
    productPage: {
      kicker: "Products / Category",
      introLabel: "Supply scope",
      listLabel: "Typical requirements",
      requestTitle: "Request this category",
      requestBody: "Add the category to your RFQ, then include specifications, quantities, grades or part numbers where available.",
    },
    procurement: {
      kicker: "Procurement / Sourcing",
      title: "From a detailed requirement to a clear quotation.",
      lead: "Send us your requirement and we will assess sourcing and availability. AKGLOBAL supports business buyers with requirement-led industrial procurement from a South African operating base.",
      acceptsTitle: "What you can send",
      accepts: ["Product descriptions", "Part numbers", "Specifications and grades", "Quantities and units", "Technical sheets", "Product photos", "Existing RFQs", "Purchase lists"],
      processTitle: "How the enquiry is handled",
      process: [
        ["01", "Requirement review", "We review the information provided and identify any specification points that need clarification."],
        ["02", "Sourcing assessment", "We assess sourcing options and availability against the requested quantity and commercial requirement."],
        ["03", "Quotation", "You receive a quotation that confirms the applicable specification, availability and commercial terms."],
        ["04", "Supply arrangement", "Once commercial terms are agreed, supply is arranged according to the confirmed quotation."],
      ],
      boundary: "Not every item can be guaranteed. Availability, lead times and delivery arrangements depend on the specific RFQ and are confirmed in the quotation.",
    },
    industries: {
      kicker: "Industries / Business supply",
      title: "Industrial requirements across operations and projects.",
      lead: "AKGLOBAL can assess equipment, fastener, hardware and procurement requirements for businesses operating across these sectors.",
      items: ["Engineering", "Construction", "Mining & mining support", "Industrial maintenance", "Manufacturing", "Facilities management", "Contractors", "Infrastructure", "Operations & projects"],
      disclaimer: "Sector support is requirement-based. It does not imply specialist certification, an existing client relationship or guaranteed product availability.",
    },
    rfq: {
      kicker: "RFQ / Business enquiry",
      title: "Tell us exactly what your operation needs.",
      lead: "Complete the form with as much technical detail as possible. You can add several line items and attach supporting documents.",
      contactSection: "01 / Contact information",
      itemsSection: "02 / Request items",
      generalSection: "03 / Delivery and supporting information",
      fields: {name: "Contact name", company: "Company", email: "Email", phone: "Telephone", country: "Country", province: "Province / Region", city: "City", deliveryLocation: "Delivery location", description: "Description", partNumber: "Part number", specification: "Specification / Grade", quantity: "Quantity", unit: "Unit", notes: "Item notes", date: "Required delivery date", additional: "Additional notes", attachment: "Supporting documents", consent: "I confirm that the information submitted may be used to assess and respond to this quotation request."},
      optional: "Optional",
      item: "Item",
      addItem: "Add another item",
      removeItem: "Remove item",
      submit: "Send RFQ",
      submitting: "Sending RFQ…",
      countries: ["South Africa", "Democratic Republic of the Congo", "Other"],
      fileHelp: "PDF, DOC, DOCX, XLS, XLSX, JPG or PNG. Maximum 8 MB per file, 15 MB total.",
      privacy: "Do not upload banking details, supplier quotations or other unnecessary confidential records.",
      errors: {required: "Please complete all required fields.", email: "Please enter a valid email address.", company: "Please enter your company name.", item: "Add a description and valid quantity for each item.", consent: "Please confirm consent before submitting.", file: "Check that attachments use an accepted file type and remain within the size limits.", server: "We could not deliver your RFQ through the website. No enquiry reference was created. Please use the prepared email option below."},
      success: "Your RFQ was delivered successfully.",
      reference: "Enquiry reference",
      fallback: "Email delivery is not configured on this website yet. Your request has not been sent. Use the prepared email link to contact AKGLOBAL directly.",
      openEmail: "Open prepared email",
    },
    contact: {
      kicker: "Contact / South Africa",
      title: "Discuss your next industrial requirement.",
      lead: "Contact AKGLOBAL TRADING PTY for industrial supply and procurement enquiries in South Africa and the Democratic Republic of the Congo.",
      office: "Registered and operating base",
      phone: "Phone",
      email: "Email",
      owner: "Owner",
      registration: "Registration number",
      service: "Serving clients in South Africa and the Democratic Republic of the Congo.",
      call: "Call AKGLOBAL",
      write: "Email AKGLOBAL",
      map: "View South African location",
    },
    footer: {statement: "Industrial supply · Procurement · Solutions", navigation: "Navigation", contact: "Business contact", legal: "AKGLOBAL TRADING PTY. All rights reserved.", location: "Fourways · Sandton · South Africa"},
    notFound: {title: "Page not found.", body: "The page may have moved or the address may be incorrect.", products: "View products"},
  },
  fr: {
    localeName: "Français",
    languageCode: "FR",
    nav: {company: "Entreprise", products: "Produits", procurement: "Approvisionnement", industries: "Secteurs", contact: "Contact", quote: "Demander un devis", menu: "Ouvrir le menu", close: "Fermer le menu"},
    common: {
      eyebrow: "Afrique du Sud · RDC",
      based: "Basée en Afrique du Sud. Au service des entreprises en Afrique du Sud et en République démocratique du Congo.",
      quote: "Demander un devis",
      explore: "Découvrir nos produits",
      addRfq: "Ajouter au devis",
      learnMore: "En savoir plus",
      specification: "Les spécifications, la disponibilité et les conditions commerciales sont confirmées au moment du devis.",
      home: "Accueil",
      backProducts: "Retour aux produits",
      next: "Suivant",
    },
    meta: {
      home: ["Fourniture industrielle de l’Afrique du Sud vers la RDC", "Équipements industriels, solutions de levage, boulonnerie et approvisionnement professionnel depuis l’Afrique du Sud pour les entreprises locales et en RDC."],
      about: ["À propos d’AKGLOBAL Trading", "Découvrez AKGLOBAL TRADING PTY, société sud-africaine de négoce et d’approvisionnement industriel au service de l’Afrique du Sud et de la RDC."],
      products: ["Produits et équipements industriels", "Découvrez nos équipements de levage, notre boulonnerie et nos fournitures industrielles disponibles sur devis."],
      lifting: ["Fournisseur d’équipements de levage", "Demandez un devis pour des palans à chaîne, palans à levier et équipements de levage auprès d’AKGLOBAL Trading."],
      fasteners: ["Fournisseur de fixations et boulonnerie", "Approvisionnement en boulons, vis, tiges filetées, écrous et fixations industrielles de grades spécifiés."],
      hardware: ["Fournitures et consommables industriels", "Composants, consommables d’ingénierie et fournitures de maintenance selon vos besoins professionnels."],
      procurement: ["Approvisionnement et sourcing industriel", "Envoyez votre demande de prix, fiche technique ou liste d’achats pour une évaluation d’approvisionnement depuis l’Afrique du Sud."],
      industries: ["Secteurs que nous pouvons accompagner", "Approvisionnement industriel pour l’ingénierie, la construction, les activités minières, la maintenance et la fabrication."],
      rfq: ["Demander un devis de fourniture industrielle", "Transmettez à AKGLOBAL Trading une demande de prix détaillée pour vos équipements, fixations et besoins d’approvisionnement."],
      contact: ["Contacter AKGLOBAL Trading", "Contactez AKGLOBAL TRADING PTY à Fourways, Sandton, pour vos besoins industriels en Afrique du Sud et en RDC."],
    },
    home: {
      heroEyebrow: "AKGLOBAL Trading Pty · Afrique du Sud ↔ RDC",
      heroTitle: ["Fourniture", "industrielle.", "Sans", "compromis."],
      heroBody: "AKGLOBAL TRADING PTY fournit des équipements industriels, des solutions de levage, de la boulonnerie et des services d’approvisionnement professionnel depuis l’Afrique du Sud aux entreprises locales et en République démocratique du Congo.",
      imageCaption: "Conçu pour des exigences rigoureuses",
      supplyKicker: "01 / Notre offre",
      supplyTitle: "Vos besoins industriels, sourcés avec précision.",
      supplyBody: "Des spécifications techniques précises aux listes d’achats complètes, nous évaluons chaque besoin et préparons une offre commerciale claire.",
      geographyKicker: "02 / Afrique du Sud ↔ RDC",
      geographyTitle: "Une base d’approvisionnement sud-africaine. Une portée commerciale régionale.",
      geographyBody: "AKGLOBAL opère depuis Fourways, Sandton. Nous approvisionnons les entreprises en Afrique du Sud et servons des clients en République démocratique du Congo, sans prétendre disposer d’une succursale ou d’un entrepôt sur place.",
      routeFrom: "Base d’approvisionnement",
      routeTo: "Marché client",
      processKicker: "03 / Du besoin à la fourniture",
      processTitle: "Un processus d’achat clair.",
      steps: ["Envoyez votre demande", "Nous évaluons le sourcing", "Recevez votre devis", "La fourniture est organisée"],
      categoriesKicker: "04 / Catégories de produits",
      categoriesTitle: "Une offre industrielle ciblée.",
      whyKicker: "05 / Pourquoi AKGLOBAL",
      whyTitle: "Vos achats professionnels, gérés avec rigueur.",
      reasons: ["Sourcing réactif", "Devis clairs", "Expertise produits industriels", "Communication professionnelle", "Service aux clients transfrontaliers", "Approvisionnement axé sur l’entreprise"],
      industriesKicker: "06 / Secteurs",
      industriesTitle: "Des besoins liés à l’industrie et aux opérations.",
      statement: ["Équipements de qualité.", "Approvisionnement fiable.", "Un avenir plus solide."],
      ctaKicker: "08 / Démarrer une demande",
      ctaTitle: "Envoyez-nous votre besoin industriel.",
      ctaBody: "Partagez vos descriptions de produits, quantités, spécifications ou votre liste d’achats. Nous évaluerons les possibilités d’approvisionnement et la disponibilité.",
    },
    categories: [
      {key: "lifting", title: "Équipements de levage", short: "Palans à chaîne · Palans à levier · Solutions de levage", description: "Équipements de levage sélectionnés selon vos contraintes opérationnelles et les spécifications demandées.", items: ["Palans à chaîne", "Palans à levier", "Équipements liés au levage"], route: "lifting"},
      {key: "fasteners", title: "Fixations et boulonnerie", short: "Boulons · Vis · Tiges · Écrous", description: "Fixations et boulonnerie industrielles fournies selon les grades, finitions et quantités spécifiés.", items: ["Boulons à tête hexagonale", "Vis hexagonales entièrement filetées", "Tiges filetées", "Écrous hexagonaux", "Grades 8 et 8.8", "Électrozingué", "Galvanisé à chaud"], route: "fasteners"},
      {key: "hardware", title: "Fournitures industrielles", short: "Composants · Consommables · Maintenance", description: "Composants industriels, consommables d’ingénierie et fournitures de maintenance pour vos opérations.", items: ["Composants industriels", "Consommables d’ingénierie", "Fournitures de maintenance"], route: "hardware"},
      {key: "procurement", title: "Approvisionnement et sourcing", short: "Demandes de prix · Quantités · Besoins spéciaux", description: "Sourcing guidé par vos besoins pour les listes d’achats, produits spécifiés et demandes industrielles particulières.", items: ["Sourcing sur demande de prix", "Approvisionnement industriel", "Achats en quantité", "Besoins particuliers", "Fourniture aux entreprises"], route: "procurement"},
    ] satisfies CategoryContent[],
    about: {
      kicker: "Entreprise / AKGLOBAL Trading",
      title: "Le négoce industriel organisé autour de votre besoin.",
      lead: "AKGLOBAL TRADING PTY est une société sud-africaine de négoce et d’approvisionnement industriel, spécialisée dans la fourniture d’équipements, de fixations et de produits industriels aux entreprises en Afrique du Sud et en République démocratique du Congo.",
      sections: [
        ["Notre rôle", "Nous partons des spécifications du client. Qu’il s’agisse d’un grade de fixation précis, d’un équipement de levage ou d’une liste d’achats complète, nous évaluons le besoin et préparons une offre commerciale en fonction du sourcing et de la disponibilité."],
        ["Notre base", "La société est enregistrée et opère depuis Fourways, Sandton, en Afrique du Sud. AKGLOBAL sert ses clients localement et en République démocratique du Congo. La société ne prétend pas disposer d’un bureau ou d’un entrepôt en RDC."],
        ["Notre exigence", "Une communication claire, la compréhension précise du besoin et un devis rigoureux guident chaque demande. Les spécifications et conditions commerciales sont confirmées avant l’organisation de la fourniture."],
      ],
      detailsTitle: "Informations sur la société",
    },
    products: {
      kicker: "Produits / Fourniture industrielle",
      title: "Équipements et fournitures adaptés aux réalités opérationnelles.",
      lead: "Découvrez nos principales catégories, puis transmettez-nous les produits, quantités et spécifications recherchés. AKGLOBAL travaille sur devis pour une clientèle professionnelle, sans catalogue de vente au détail.",
      noteTitle: "Votre besoin sort de ces catégories ?",
      noteBody: "Envoyez une description, une référence, une fiche technique, une photo ou une liste d’achats. Nous évaluerons les possibilités d’approvisionnement et la disponibilité.",
    },
    productPage: {
      kicker: "Produits / Catégorie",
      introLabel: "Périmètre de fourniture",
      listLabel: "Besoins courants",
      requestTitle: "Demander cette catégorie",
      requestBody: "Ajoutez la catégorie à votre demande, puis précisez les spécifications, quantités, grades ou références disponibles.",
    },
    procurement: {
      kicker: "Approvisionnement / Sourcing",
      title: "D’un besoin détaillé à une offre claire.",
      lead: "Envoyez-nous votre besoin et nous évaluerons les possibilités d’approvisionnement et la disponibilité. Depuis sa base sud-africaine, AKGLOBAL accompagne les acheteurs professionnels dans leurs achats industriels.",
      acceptsTitle: "Documents et informations utiles",
      accepts: ["Descriptions de produits", "Références et numéros de pièces", "Spécifications et grades", "Quantités et unités", "Fiches techniques", "Photos des produits", "Demandes de prix existantes", "Listes d’achats"],
      processTitle: "Traitement de votre demande",
      process: [
        ["01", "Analyse du besoin", "Nous examinons les informations transmises et identifions les points techniques à clarifier."],
        ["02", "Évaluation du sourcing", "Nous évaluons les possibilités d’approvisionnement et la disponibilité selon la quantité et les conditions demandées."],
        ["03", "Établissement du devis", "Vous recevez un devis précisant les spécifications applicables, la disponibilité et les conditions commerciales."],
        ["04", "Organisation de la fourniture", "Après accord sur les conditions commerciales, la fourniture est organisée conformément au devis confirmé."],
      ],
      boundary: "La disponibilité de chaque article ne peut être garantie. Les délais et modalités de livraison dépendent de la demande et sont confirmés dans le devis.",
    },
    industries: {
      kicker: "Secteurs / Fourniture aux entreprises",
      title: "Des besoins industriels pour les opérations et les projets.",
      lead: "AKGLOBAL peut évaluer les besoins en équipements, boulonnerie, fournitures et approvisionnement des entreprises actives dans ces secteurs.",
      items: ["Ingénierie", "Construction", "Mines et services miniers", "Maintenance industrielle", "Fabrication", "Gestion des installations", "Entrepreneurs", "Infrastructure", "Opérations et projets"],
      disclaimer: "L’accompagnement dépend du besoin exprimé. Il ne suppose ni certification spécialisée, ni relation client existante, ni disponibilité garantie des produits.",
    },
    rfq: {
      kicker: "Devis / Demande professionnelle",
      title: "Décrivez précisément les besoins de votre opération.",
      lead: "Renseignez un maximum de détails techniques. Vous pouvez ajouter plusieurs lignes d’articles et joindre des documents utiles.",
      contactSection: "01 / Coordonnées",
      itemsSection: "02 / Articles demandés",
      generalSection: "03 / Livraison et informations complémentaires",
      fields: {name: "Nom du contact", company: "Entreprise", email: "E-mail", phone: "Téléphone", country: "Pays", province: "Province / Région", city: "Ville", deliveryLocation: "Lieu de livraison", description: "Description", partNumber: "Référence / Numéro de pièce", specification: "Spécification / Grade", quantity: "Quantité", unit: "Unité", notes: "Notes sur l’article", date: "Date de livraison souhaitée", additional: "Informations complémentaires", attachment: "Documents justificatifs", consent: "Je confirme que les informations transmises peuvent être utilisées pour évaluer cette demande de devis et y répondre."},
      optional: "Facultatif",
      item: "Article",
      addItem: "Ajouter un article",
      removeItem: "Supprimer l’article",
      submit: "Envoyer la demande",
      submitting: "Envoi de la demande…",
      countries: ["Afrique du Sud", "République démocratique du Congo", "Autre"],
      fileHelp: "PDF, DOC, DOCX, XLS, XLSX, JPG ou PNG. 8 Mo maximum par fichier, 15 Mo au total.",
      privacy: "Ne joignez pas de coordonnées bancaires, de devis fournisseurs ou d’autres documents confidentiels non nécessaires.",
      errors: {required: "Veuillez remplir tous les champs obligatoires.", email: "Veuillez saisir une adresse e-mail valide.", company: "Veuillez indiquer le nom de votre entreprise.", item: "Ajoutez une description et une quantité valide pour chaque article.", consent: "Veuillez confirmer votre consentement avant l’envoi.", file: "Vérifiez le type et la taille des pièces jointes.", server: "Nous n’avons pas pu transmettre votre demande par le site. Aucune référence n’a été créée. Utilisez l’option d’e-mail préparé ci-dessous."},
      success: "Votre demande a été transmise avec succès.",
      reference: "Référence de la demande",
      fallback: "L’envoi d’e-mails n’est pas encore configuré sur ce site. Votre demande n’a pas été envoyée. Utilisez le lien préparé pour contacter directement AKGLOBAL.",
      openEmail: "Ouvrir l’e-mail préparé",
    },
    contact: {
      kicker: "Contact / Afrique du Sud",
      title: "Échangeons sur votre prochain besoin industriel.",
      lead: "Contactez AKGLOBAL TRADING PTY pour vos demandes de fourniture et d’approvisionnement industriel en Afrique du Sud et en République démocratique du Congo.",
      office: "Siège enregistré et base opérationnelle",
      phone: "Téléphone",
      email: "E-mail",
      owner: "Propriétaire",
      registration: "Numéro d’enregistrement",
      service: "Au service des clients en Afrique du Sud et en République démocratique du Congo.",
      call: "Appeler AKGLOBAL",
      write: "Écrire à AKGLOBAL",
      map: "Voir l’adresse en Afrique du Sud",
    },
    footer: {statement: "Fourniture industrielle · Approvisionnement · Solutions", navigation: "Navigation", contact: "Contact professionnel", legal: "AKGLOBAL TRADING PTY. Tous droits réservés.", location: "Fourways · Sandton · Afrique du Sud"},
    notFound: {title: "Page introuvable.", body: "La page a peut-être été déplacée ou l’adresse est incorrecte.", products: "Voir les produits"},
  },
} as const;

export type SiteCopy = (typeof content)[Locale];

export function getContent(locale: Locale) {
  return content[locale];
}
