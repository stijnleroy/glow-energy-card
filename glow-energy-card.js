/*
 * Glow Energy Card
 * Een Home Assistant dashboardkaart voor zonnepanelen, thuisbatterij en net:
 * een advies dat je van ver ziet ("verbruik maar" / "met mate" / "liever later"),
 * een stroomschema met lopende stroom en swipebare tegels.
 *
 * https://github.com/stijnleroy/glow-energy-card
 * Licentie: MIT
 */

const GEC_VERSION = '1.0.0';

const GEC_COL = {
  sun: '255, 224, 138',
  grid: '142, 197, 255',
  batt: '143, 227, 184',
  house: '255, 184, 153',
  exp: '185, 168, 255',
  go: '143, 227, 184',
  ok: '255, 210, 122',
  wait: '255, 159, 191',
};

const GEC_PALETTE = ['#8FE3B8', '#FFE08A', '#FFB899', '#B9A8FF', '#8EC5FF', '#FF9FBF'];

/* ------------------------------------------------------------------ */
/*  Vertalingen                                                        */
/* ------------------------------------------------------------------ */

const GEC_LANG_NAMES = { nl: 'Nederlands', en: 'English', fr: 'Français', de: 'Deutsch', es: 'Español', it: 'Italiano' };

const GEC_I18N = {
  nl: {
    go_tag: 'GROEN LICHT', go_title: 'Verbruik maar!',
    ok_tag: 'MET MATE', ok_title: 'Kleine toestellen oké',
    wait_tag: 'EVEN WACHTEN', wait_title: 'Liever later',
    battery: 'Batterij', full: 'Vol', good: 'Goed geladen', half: 'Half geladen', low: 'Bijna leeg',
    charging: 'laadt', discharging: 'levert', idle: 'rust',
    solar: 'Zon', grid: 'Net', house: 'Huis', import: 'afname', export: 'injectie',
    self: 'Zelfvoorzienend', self_sub: 'van je verbruik nu',
    unavailable: 'niet beschikbaar', next: 'Volgende tegel', prev: 'Vorige tegel', tile: 'Tegel {n}',
    err_solar: 'Vul minstens "solar" of "grid" in.',
    l_solar: 'Zonnepanelen – vermogen', l_grid: 'Net – vermogen (positief = afname)', l_battery: 'Batterij – laad/ontlaadvermogen (positief = laden)',
    l_battery_soc: 'Batterij – percentage', l_house: 'Thuisverbruik (leeg = berekenen)', l_invert_grid: 'Teken net omkeren', l_invert_battery: 'Teken batterij omkeren',
    l_units: 'Eenheden', u_w: 'Altijd W en Wh', u_auto: 'Automatisch kW en kWh',
    l_surplus: 'Groen licht vanaf overschot (W)', l_soc_ok: 'Met mate vanaf batterij (%)', l_soc_full: 'Batterij vol vanaf (%)', l_advice_delay: 'Advies pas wijzigen na (seconden)',
    l_auto_rotate: 'Tegels automatisch wisselen (seconden, 0 = uit)', l_glow: 'Sterkte van de gloed', l_height: 'Hoogte van de kaart (px)', l_language: 'Taal', lang_auto: 'Automatisch (taal van Home Assistant)',
    l_type: 'Soort tegel', t_entity: 'Sensor', t_self: 'Zelfvoorzienend (berekend)',
    l_entity: 'Sensor', l_name: 'Naam', l_icon: 'Icoon (optioneel)', l_secondary: 'Tweede sensor (optioneel)', l_secondary_name: 'Tekst voor tweede sensor', l_sub: 'Vaste uitleg (optioneel)',
    ed_entities: 'Sensoren', ed_advice: 'Advies', ed_display: 'Weergave', ed_tiles: 'Tegels', ed_tile: 'Tegel {n}', ed_add: '+ Tegel toevoegen', ed_delete: 'Verwijderen', ed_up: 'Omhoog', ed_down: 'Omlaag', ed_color: 'Eigen kleur',
    description: 'Zon, batterij en net met een advies dat je van ver ziet: verbruik maar, met mate of liever later.',
  },
  en: {
    go_tag: 'GREEN LIGHT', go_title: 'Go ahead!',
    ok_tag: 'IN MODERATION', ok_title: 'Small appliances OK',
    wait_tag: 'HOLD ON', wait_title: 'Better wait',
    battery: 'Battery', full: 'Full', good: 'Well charged', half: 'Half charged', low: 'Almost empty',
    charging: 'charging', discharging: 'supplying', idle: 'idle',
    solar: 'Solar', grid: 'Grid', house: 'Home', import: 'import', export: 'export',
    self: 'Self-sufficient', self_sub: 'of your usage now',
    unavailable: 'unavailable', next: 'Next tile', prev: 'Previous tile', tile: 'Tile {n}',
    err_solar: 'Fill in at least "solar" or "grid".',
    l_solar: 'Solar panels – power', l_grid: 'Grid – power (positive = import)', l_battery: 'Battery – charge/discharge power (positive = charging)',
    l_battery_soc: 'Battery – state of charge', l_house: 'Home usage (empty = calculate)', l_invert_grid: 'Invert grid sign', l_invert_battery: 'Invert battery sign',
    l_units: 'Units', u_w: 'Always W and Wh', u_auto: 'Automatic kW and kWh',
    l_surplus: 'Green light from surplus (W)', l_soc_ok: 'Moderation from battery (%)', l_soc_full: 'Battery full from (%)', l_advice_delay: 'Change advice only after (seconds)',
    l_auto_rotate: 'Rotate tiles automatically (seconds, 0 = off)', l_glow: 'Glow strength', l_height: 'Card height (px)', l_language: 'Language', lang_auto: 'Automatic (Home Assistant language)',
    l_type: 'Tile type', t_entity: 'Sensor', t_self: 'Self-sufficiency (calculated)',
    l_entity: 'Sensor', l_name: 'Name', l_icon: 'Icon (optional)', l_secondary: 'Second sensor (optional)', l_secondary_name: 'Text for second sensor', l_sub: 'Fixed caption (optional)',
    ed_entities: 'Sensors', ed_advice: 'Advice', ed_display: 'Display', ed_tiles: 'Tiles', ed_tile: 'Tile {n}', ed_add: '+ Add tile', ed_delete: 'Remove', ed_up: 'Move up', ed_down: 'Move down', ed_color: 'Custom color',
    description: 'Solar, battery and grid with advice you can see from across the room: go ahead, in moderation or better wait.',
  },
  fr: {
    go_tag: 'FEU VERT', go_title: 'Allez-y !',
    ok_tag: 'AVEC MODÉRATION', ok_title: 'Petits appareils OK',
    wait_tag: 'PATIENCE', wait_title: 'Plutôt plus tard',
    battery: 'Batterie', full: 'Pleine', good: 'Bien chargée', half: 'À moitié chargée', low: 'Presque vide',
    charging: 'charge', discharging: 'fournit', idle: 'au repos',
    solar: 'Soleil', grid: 'Réseau', house: 'Maison', import: 'prélèvement', export: 'injection',
    self: 'Autonomie', self_sub: 'de votre consommation',
    unavailable: 'indisponible', next: 'Tuile suivante', prev: 'Tuile précédente', tile: 'Tuile {n}',
    err_solar: 'Renseignez au moins "solar" ou "grid".',
    l_solar: 'Panneaux solaires – puissance', l_grid: 'Réseau – puissance (positive = prélèvement)', l_battery: 'Batterie – puissance charge/décharge (positive = charge)',
    l_battery_soc: 'Batterie – pourcentage', l_house: 'Consommation maison (vide = calculer)', l_invert_grid: 'Inverser le signe du réseau', l_invert_battery: 'Inverser le signe de la batterie',
    l_units: 'Unités', u_w: 'Toujours W et Wh', u_auto: 'kW et kWh automatiques',
    l_surplus: 'Feu vert à partir d\'un surplus de (W)', l_soc_ok: 'Modération à partir de (%) de batterie', l_soc_full: 'Batterie pleine à partir de (%)', l_advice_delay: 'Changer le conseil après (secondes)',
    l_auto_rotate: 'Faire défiler les tuiles (secondes, 0 = non)', l_glow: 'Intensité de la lueur', l_height: 'Hauteur de la carte (px)', l_language: 'Langue', lang_auto: 'Automatique (langue de Home Assistant)',
    l_type: 'Type de tuile', t_entity: 'Capteur', t_self: 'Autonomie (calculée)',
    l_entity: 'Capteur', l_name: 'Nom', l_icon: 'Icône (facultatif)', l_secondary: 'Second capteur (facultatif)', l_secondary_name: 'Texte du second capteur', l_sub: 'Légende fixe (facultatif)',
    ed_entities: 'Capteurs', ed_advice: 'Conseil', ed_display: 'Affichage', ed_tiles: 'Tuiles', ed_tile: 'Tuile {n}', ed_add: '+ Ajouter une tuile', ed_delete: 'Supprimer', ed_up: 'Monter', ed_down: 'Descendre', ed_color: 'Couleur personnalisée',
    description: 'Soleil, batterie et réseau avec un conseil visible de loin : allez-y, avec modération ou plutôt plus tard.',
  },
  de: {
    go_tag: 'GRÜNES LICHT', go_title: 'Nur zu!',
    ok_tag: 'IN MASSEN', ok_title: 'Kleine Geräte OK',
    wait_tag: 'KURZ WARTEN', wait_title: 'Lieber später',
    battery: 'Batterie', full: 'Voll', good: 'Gut geladen', half: 'Halb geladen', low: 'Fast leer',
    charging: 'lädt', discharging: 'liefert', idle: 'Ruhe',
    solar: 'Sonne', grid: 'Netz', house: 'Haus', import: 'Bezug', export: 'Einspeisung',
    self: 'Autarkie', self_sub: 'deines Verbrauchs jetzt',
    unavailable: 'nicht verfügbar', next: 'Nächste Kachel', prev: 'Vorherige Kachel', tile: 'Kachel {n}',
    err_solar: 'Gib mindestens "solar" oder "grid" an.',
    l_solar: 'Solaranlage – Leistung', l_grid: 'Netz – Leistung (positiv = Bezug)', l_battery: 'Batterie – Lade-/Entladeleistung (positiv = Laden)',
    l_battery_soc: 'Batterie – Ladestand', l_house: 'Hausverbrauch (leer = berechnen)', l_invert_grid: 'Vorzeichen Netz umkehren', l_invert_battery: 'Vorzeichen Batterie umkehren',
    l_units: 'Einheiten', u_w: 'Immer W und Wh', u_auto: 'Automatisch kW und kWh',
    l_surplus: 'Grünes Licht ab Überschuss (W)', l_soc_ok: 'In Maßen ab Batterie (%)', l_soc_full: 'Batterie voll ab (%)', l_advice_delay: 'Empfehlung erst ändern nach (Sekunden)',
    l_auto_rotate: 'Kacheln automatisch wechseln (Sekunden, 0 = aus)', l_glow: 'Leuchtstärke', l_height: 'Kartenhöhe (px)', l_language: 'Sprache', lang_auto: 'Automatisch (Sprache von Home Assistant)',
    l_type: 'Kacheltyp', t_entity: 'Sensor', t_self: 'Autarkie (berechnet)',
    l_entity: 'Sensor', l_name: 'Name', l_icon: 'Symbol (optional)', l_secondary: 'Zweiter Sensor (optional)', l_secondary_name: 'Text für zweiten Sensor', l_sub: 'Fester Untertitel (optional)',
    ed_entities: 'Sensoren', ed_advice: 'Empfehlung', ed_display: 'Anzeige', ed_tiles: 'Kacheln', ed_tile: 'Kachel {n}', ed_add: '+ Kachel hinzufügen', ed_delete: 'Entfernen', ed_up: 'Nach oben', ed_down: 'Nach unten', ed_color: 'Eigene Farbe',
    description: 'Sonne, Batterie und Netz mit einer Empfehlung, die man von weitem sieht: nur zu, in Maßen oder lieber später.',
  },
  es: {
    go_tag: 'LUZ VERDE', go_title: '¡Adelante!',
    ok_tag: 'CON MODERACIÓN', ok_title: 'Aparatos pequeños OK',
    wait_tag: 'ESPERA', wait_title: 'Mejor más tarde',
    battery: 'Batería', full: 'Llena', good: 'Bien cargada', half: 'Media carga', low: 'Casi vacía',
    charging: 'cargando', discharging: 'aportando', idle: 'en reposo',
    solar: 'Sol', grid: 'Red', house: 'Casa', import: 'consumo', export: 'vertido',
    self: 'Autosuficiencia', self_sub: 'de tu consumo ahora',
    unavailable: 'no disponible', next: 'Siguiente', prev: 'Anterior', tile: 'Ficha {n}',
    err_solar: 'Indica al menos "solar" o "grid".',
    l_solar: 'Paneles solares – potencia', l_grid: 'Red – potencia (positiva = consumo)', l_battery: 'Batería – potencia de carga/descarga (positiva = carga)',
    l_battery_soc: 'Batería – porcentaje', l_house: 'Consumo de la casa (vacío = calcular)', l_invert_grid: 'Invertir signo de la red', l_invert_battery: 'Invertir signo de la batería',
    l_units: 'Unidades', u_w: 'Siempre W y Wh', u_auto: 'kW y kWh automáticos',
    l_surplus: 'Luz verde con excedente desde (W)', l_soc_ok: 'Moderación desde batería (%)', l_soc_full: 'Batería llena desde (%)', l_advice_delay: 'Cambiar el consejo tras (segundos)',
    l_auto_rotate: 'Rotar fichas automáticamente (segundos, 0 = no)', l_glow: 'Intensidad del brillo', l_height: 'Altura de la tarjeta (px)', l_language: 'Idioma', lang_auto: 'Automático (idioma de Home Assistant)',
    l_type: 'Tipo de ficha', t_entity: 'Sensor', t_self: 'Autosuficiencia (calculada)',
    l_entity: 'Sensor', l_name: 'Nombre', l_icon: 'Icono (opcional)', l_secondary: 'Segundo sensor (opcional)', l_secondary_name: 'Texto del segundo sensor', l_sub: 'Texto fijo (opcional)',
    ed_entities: 'Sensores', ed_advice: 'Consejo', ed_display: 'Visualización', ed_tiles: 'Fichas', ed_tile: 'Ficha {n}', ed_add: '+ Añadir ficha', ed_delete: 'Eliminar', ed_up: 'Subir', ed_down: 'Bajar', ed_color: 'Color personalizado',
    description: 'Sol, batería y red con un consejo que se ve de lejos: adelante, con moderación o mejor más tarde.',
  },
  it: {
    go_tag: 'VIA LIBERA', go_title: 'Vai pure!',
    ok_tag: 'CON MODERAZIONE', ok_title: 'Piccoli elettrodomestici OK',
    wait_tag: 'ASPETTA', wait_title: 'Meglio dopo',
    battery: 'Batteria', full: 'Piena', good: 'Ben carica', half: 'Carica a metà', low: 'Quasi scarica',
    charging: 'in carica', discharging: 'fornisce', idle: 'a riposo',
    solar: 'Sole', grid: 'Rete', house: 'Casa', import: 'prelievo', export: 'immissione',
    self: 'Autosufficienza', self_sub: 'del tuo consumo ora',
    unavailable: 'non disponibile', next: 'Successiva', prev: 'Precedente', tile: 'Riquadro {n}',
    err_solar: 'Indica almeno "solar" o "grid".',
    l_solar: 'Pannelli solari – potenza', l_grid: 'Rete – potenza (positiva = prelievo)', l_battery: 'Batteria – potenza carica/scarica (positiva = carica)',
    l_battery_soc: 'Batteria – percentuale', l_house: 'Consumo casa (vuoto = calcola)', l_invert_grid: 'Inverti segno rete', l_invert_battery: 'Inverti segno batteria',
    l_units: 'Unità', u_w: 'Sempre W e Wh', u_auto: 'kW e kWh automatici',
    l_surplus: 'Via libera da un surplus di (W)', l_soc_ok: 'Moderazione da batteria (%)', l_soc_full: 'Batteria piena da (%)', l_advice_delay: 'Cambia consiglio dopo (secondi)',
    l_auto_rotate: 'Scorri i riquadri automaticamente (secondi, 0 = no)', l_glow: 'Intensità del bagliore', l_height: 'Altezza della scheda (px)', l_language: 'Lingua', lang_auto: 'Automatico (lingua di Home Assistant)',
    l_type: 'Tipo di riquadro', t_entity: 'Sensore', t_self: 'Autosufficienza (calcolata)',
    l_entity: 'Sensore', l_name: 'Nome', l_icon: 'Icona (opzionale)', l_secondary: 'Secondo sensore (opzionale)', l_secondary_name: 'Testo per il secondo sensore', l_sub: 'Didascalia fissa (opzionale)',
    ed_entities: 'Sensori', ed_advice: 'Consiglio', ed_display: 'Visualizzazione', ed_tiles: 'Riquadri', ed_tile: 'Riquadro {n}', ed_add: '+ Aggiungi riquadro', ed_delete: 'Rimuovi', ed_up: 'Su', ed_down: 'Giù', ed_color: 'Colore personalizzato',
    description: 'Sole, batteria e rete con un consiglio visibile da lontano: vai pure, con moderazione o meglio dopo.',
  },
};

function gecLang(hass, wanted) {
  let l = wanted && wanted !== 'auto'
    ? wanted
    : ((hass && ((hass.locale && hass.locale.language) || hass.language)) || (typeof navigator !== 'undefined' && navigator.language) || 'en');
  l = String(l).toLowerCase().split(/[-_]/)[0];
  return GEC_I18N[l] ? l : 'en';
}

function gecT(lang, key, vars) {
  let s = (GEC_I18N[lang] && GEC_I18N[lang][key]) || GEC_I18N.en[key] || key;
  if (vars) Object.keys(vars).forEach((k) => { s = s.split('{' + k + '}').join(vars[k]); });
  return s;
}

function gecRgb(hex) {
  let h = String(hex || '').replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((x) => x + x).join('');
  const v = parseInt(h.slice(0, 6), 16);
  if (isNaN(v)) return '185, 168, 255';
  return ((v >> 16) & 255) + ', ' + ((v >> 8) & 255) + ', ' + (v & 255);
}

function gecEsc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ------------------------------------------------------------------ */
/*  Iconen                                                             */
/* ------------------------------------------------------------------ */

const GEC_SVG = (inner, w = 2) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
const GEC_ICONS = {
  sun: GEC_SVG('<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.9 4.9l1.4 1.4"/><path d="M17.7 17.7l1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.9 19.1l1.4-1.4"/><path d="M17.7 6.3l1.4-1.4"/>'),
  grid: GEC_SVG('<path d="M8 2l-3 20"/><path d="M16 2l3 20"/><path d="M6.5 9h11"/><path d="M5.5 15h13"/><path d="M8 2h8"/>'),
  battery: GEC_SVG('<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M22 11v2"/><path d="M7 11v2"/><path d="M11 11v2"/>'),
  home: GEC_SVG('<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>'),
  bolt: GEC_SVG('<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>', 2.2),
  gauge: GEC_SVG('<path d="M3.5 17a9 9 0 1 1 17 0"/><path d="M12 15V9"/><circle cx="12" cy="16" r="1.5"/><path d="M5.6 9.6l1.2.8"/><path d="M18.4 9.6l-1.2.8"/>', 2.2),
  hourglass: GEC_SVG('<path d="M6 2h12"/><path d="M6 22h12"/><path d="M7 2v4a5 5 0 0 0 10 0V2"/><path d="M7 22v-4a5 5 0 0 1 10 0v4"/>', 2.2),
  leaf: GEC_SVG('<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z"/><path d="M2 21c0-3 1.9-5.4 5.1-6"/>', 2.4),
  peak: GEC_SVG('<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>', 2.4),
  arrow: GEC_SVG('<path d="M7 17L17 7"/><path d="M7 7h10v10"/>', 2.4),
};

function gecIconHtml(icon) {
  if (icon && String(icon).includes(':')) return `<ha-icon icon="${gecEsc(icon)}"></ha-icon>`;
  return GEC_ICONS[icon] || GEC_ICONS.bolt;
}

/* ------------------------------------------------------------------ */
/*  Stijl                                                              */
/* ------------------------------------------------------------------ */

const GEC_STYLE = `
  :host { display: block; }
  ha-card {
    display: block; position: relative; overflow: hidden; box-sizing: border-box;
    border-radius: 28px; padding: 16px; color: #F3F1FA; background: #15121F;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  .blob { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
  .blob.a { left: -110px; top: -130px; width: 320px; height: 320px; background: #FFE08A; opacity: 0.14; }
  .blob.b { right: -120px; bottom: -150px; width: 340px; height: 340px; background: #B9A8FF; opacity: 0.18; }
  .wrap { position: relative; display: flex; gap: 14px; height: var(--gec-h, 218px); }

  /* advies */
  .adv {
    position: relative; overflow: hidden; flex: 0 0 30%; min-width: 190px; max-width: 260px; box-sizing: border-box;
    border-radius: 22px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between;
    background: rgba(var(--a), 0.14); border: 1.5px solid rgba(var(--a), 0.55);
    box-shadow: 0 0 var(--glow) rgba(var(--a), 0.35);
    transition: background 0.6s, border-color 0.6s, box-shadow 0.6s;
  }
  .halo { position: absolute; right: -60px; top: -60px; width: 180px; height: 180px; border-radius: 50%; background: rgb(var(--a)); opacity: 0.35; filter: blur(50px); animation: gec-breathe 3s ease-in-out infinite; pointer-events: none; }
  .adv-head { position: relative; display: flex; align-items: center; gap: 10px; }
  .adv-icon { width: 52px; height: 52px; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #1C1730; background: rgb(var(--a)); box-shadow: 0 0 var(--glow) rgba(var(--a), 0.8); flex-shrink: 0; }
  .adv-icon svg { width: 30px; height: 30px; }
  .adv-tag { font-size: 12px; font-weight: 800; letter-spacing: 0.08em; color: rgb(var(--a)); }
  .adv-title { position: relative; font-size: 28px; font-weight: 800; line-height: 1.05; letter-spacing: -0.01em; }
  .soc { position: relative; display: flex; flex-direction: column; gap: 6px; cursor: pointer; }
  .soc-row { display: flex; justify-content: space-between; align-items: baseline; font-size: 13px; font-weight: 700; }
  .soc-row b { font-size: 20px; font-weight: 800; }
  .soc-track { height: 14px; border-radius: 7px; background: rgba(255, 255, 255, 0.1); overflow: hidden; }
  .soc-bar { height: 14px; border-radius: 7px; width: 0; background: rgb(var(--s)); box-shadow: 0 0 calc(var(--glow) * 0.7) rgba(var(--s), 0.8); transition: width 0.8s; }
  .soc-label { font-size: 12px; font-weight: 600; opacity: 0.75; }

  /* schema */
  .flow { position: relative; flex: 0 0 290px; width: 290px; height: 218px; align-self: center; }
  .flow svg.lines { position: absolute; left: 0; top: 0; }
  .dot { position: absolute; left: 0; top: 0; width: 8px; height: 8px; margin: -4px 0 0 -4px; border-radius: 50%; offset-rotate: 0deg; animation: gec-flow 2s linear infinite; pointer-events: none; }
  .node {
    position: absolute; width: 72px; height: 72px; box-sizing: border-box; border-radius: 50%;
    display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
    background: #1A1729; border: 2px solid rgba(var(--n), 0.3); cursor: pointer; transition: box-shadow 0.4s, border-color 0.4s;
  }
  .node.on { border-color: rgba(var(--n), 0.9); box-shadow: 0 0 var(--glow) rgba(var(--n), 0.45); }
  .node svg { width: 20px; height: 20px; color: rgb(var(--n)); }
  .node .v { font-size: 14px; font-weight: 800; line-height: 1.15; white-space: nowrap; }
  .node .l { font-size: 10.5px; font-weight: 700; opacity: 0.8; }
  .node.hidden { display: none; }

  /* tegels */
  .tiles { flex: 1; min-width: 150px; display: flex; flex-direction: column; gap: 6px; }
  .viewport { flex: 1; min-height: 0; position: relative; overflow: hidden; border-radius: 22px; touch-action: pan-y; user-select: none; -webkit-user-select: none; cursor: grab; }
  .track { display: flex; height: 100%; will-change: transform; }
  .track.anim { transition: transform 0.35s cubic-bezier(.4, 0, .2, 1); }
  .tile {
    flex: 0 0 100%; width: 100%; height: 100%; box-sizing: border-box; border-radius: 22px; padding: 16px;
    display: flex; flex-direction: column; justify-content: space-between; background: rgba(var(--t), 0.09); min-width: 0;
  }
  .t-icon { width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: #1C1730; background: rgb(var(--t)); box-shadow: 0 0 calc(var(--glow) * 0.7) rgba(var(--t), 0.6); }
  .t-icon svg { width: 22px; height: 22px; }
  .t-icon ha-icon { --mdc-icon-size: 22px; }
  .t-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .t-label { font-size: 14px; font-weight: 800; color: rgb(var(--t)); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .t-value { font-size: 30px; font-weight: 800; line-height: 1.05; letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .t-sub { font-size: 13px; font-weight: 600; opacity: 0.65; line-height: 1.3; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .dots { display: flex; justify-content: center; gap: 2px; }
  .dots button { width: 26px; height: 22px; padding: 0; border: 0; background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .dots span { display: block; height: 8px; width: 8px; border-radius: 4px; background: rgba(255, 255, 255, 0.25); transition: width 0.2s, background 0.2s; }
  .dots button.on span { width: 20px; background: #F3F1FA; }

  /* smal (1 kolom): onder elkaar */
  .wrap.narrow { flex-direction: column; height: auto; }
  .wrap.narrow .adv { flex: none; max-width: none; min-height: 150px; }
  .wrap.narrow .flow { flex: none; align-self: center; }
  .wrap.narrow .tiles { min-height: 170px; }

  @keyframes gec-flow { from { offset-distance: 0%; } to { offset-distance: 100%; } }
  @keyframes gec-breathe { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
  @media (prefers-reduced-motion: reduce) { .dot, .halo { animation: none; } }
`;

/* stroomschema: posities in een vak van 290 x 218 */
const GEC_NODES = { sun: [145, 36], grid: [40, 109], batt: [250, 109], house: [145, 182] };
const GEC_PATHS = {
  sToH: 'M145 72 L145 146',
  sToB: 'M175 52 Q 226 60 236 76',
  sToG: 'M115 52 Q 64 60 54 76',
  gToH: 'M54 142 Q 64 168 110 176',
  bToH: 'M236 142 Q 226 168 180 176',
  gToB: 'M76 109 L214 109',
};

/* ------------------------------------------------------------------ */
/*  De kaart                                                           */
/* ------------------------------------------------------------------ */

class GlowEnergyCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._page = 0;
    this._built = false;
    this._level = null;
    this._pending = null;
  }

  static getConfigElement() {
    return document.createElement('glow-energy-card-editor');
  }

  static getStubConfig(hass) {
    const st = (hass && hass.states) || {};
    const ids = Object.keys(st).filter((e) => e.startsWith('sensor.'));
    const unit = (e) => (st[e].attributes.unit_of_measurement || '');
    const power = ids.filter((e) => ['W', 'kW'].includes(unit(e)));
    const find = (list, words) => list.find((e) => words.some((w) => e.includes(w)));
    const cfg = {
      solar: find(power, ['input_power', 'pv_power', 'solar', 'zon']),
      grid: find(power, ['p1', 'grid', 'net_power']),
      battery: find(power, ['battery_charge_discharge', 'battery_power']),
      battery_soc: ids.find((e) => unit(e) === '%' && /battery_(state_of_capacity|soc|level)/.test(e) && !/iphone|phone|tab|ipad/.test(e)),
      tiles: [{ type: 'self_sufficiency' }],
    };
    Object.keys(cfg).forEach((k) => { if (cfg[k] === undefined) delete cfg[k]; });
    return cfg;
  }

  setConfig(config) {
    const lang = gecLang(this._hass, config && config.language);
    if (!config || (!config.solar && !config.grid)) throw new Error(gecT(lang, 'err_solar'));
    const tiles = (config.tiles || []).map((t, i) => {
      const o = typeof t === 'string' ? { entity: t } : { ...t };
      if (!o.color) o.color = GEC_PALETTE[i % GEC_PALETTE.length];
      return o;
    });
    this._config = {
      units: 'w',
      surplus: 1500,
      soc_ok: 40,
      soc_full: 90,
      advice_delay: 60,
      auto_rotate: 0,
      glow: 22,
      height: 218,
      ...config,
      tiles,
    };
    this._built = false;
    this._level = null;
    this._pending = null;
    this._page = 0;
    if (this._hass) { this._build(); this._update(); }
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;
    if (this._built && this._builtLang !== this._lang()) this._built = false;
    if (!this._built) this._build();
    this._update();
  }

  get hass() { return this._hass; }

  connectedCallback() {
    this._startRotate();
    if (this._ro && this._wrap) this._ro.observe(this);
  }

  disconnectedCallback() {
    clearInterval(this._rotTimer);
    this._rotTimer = null;
    if (this._ro) this._ro.disconnect();
  }

  getCardSize() { return 5; }

  getGridOptions() { return { columns: 12, min_columns: 6, rows: 'auto' }; }

  _lang() { return gecLang(this._hass, this._config && this._config.language); }

  _t(k, v) { return gecT(this._lang(), k, v); }

  /* ---------- waarden lezen ---------- */

  _num(entity) {
    const st = entity && this._hass && this._hass.states[entity];
    if (!st) return null;
    const v = parseFloat(st.state);
    return isNaN(v) ? null : v;
  }

  // vermogen in W, ongeacht of de sensor W of kW geeft
  _watt(entity, invert) {
    const v = this._num(entity);
    if (v === null) return null;
    const u = (this._hass.states[entity].attributes.unit_of_measurement || 'W').toLowerCase();
    let w = u === 'kw' ? v * 1000 : u === 'mw' ? v * 1e6 : v;
    if (invert) w = -w;
    return w;
  }

  _values() {
    const c = this._config;
    const pv = Math.max(0, this._watt(c.solar) ?? 0);
    const grid = this._watt(c.grid, c.invert_grid) ?? 0;
    const batt = c.battery ? (this._watt(c.battery, c.invert_battery) ?? 0) : 0;
    const soc = c.battery_soc ? this._num(c.battery_soc) : null;
    let house = c.house ? this._watt(c.house) : null;
    if (house === null) house = Math.max(0, pv + grid - batt);
    return { pv, grid, batt, soc, house };
  }

  /* ---------- opmaak ---------- */

  _fmtNum(v, digits) {
    try {
      return Number(v).toLocaleString(this._lang() === 'en' ? 'en-GB' : this._lang() + '-BE', { maximumFractionDigits: digits, minimumFractionDigits: 0 });
    } catch (e) {
      return String(Math.round(v));
    }
  }

  _fmtPower(w) {
    const a = Math.abs(w);
    if (this._config.units === 'auto' && a >= 1000) return this._fmtNum(a / 1000, 1) + ' kW';
    return this._fmtNum(Math.round(a), 0) + ' W';
  }

  _fmtEnergy(wh, sign) {
    const a = Math.abs(wh);
    let s = this._config.units === 'auto' && a >= 1000 ? this._fmtNum(a / 1000, 2) + ' kWh' : this._fmtNum(Math.round(a), 0) + ' Wh';
    if (sign && Math.round(a) > 0) s = (wh < 0 ? '−' : '+') + s;
    return s;
  }

  // een sensorwaarde netjes tonen; vermogen en energie in de gekozen eenheid
  _fmtEntity(entity, sign) {
    const st = entity && this._hass.states[entity];
    if (!st) return '–';
    if (st.state === 'unavailable' || st.state === 'unknown') return '–';
    const v = parseFloat(st.state);
    const unit = st.attributes.unit_of_measurement || '';
    if (isNaN(v)) return st.state;
    const u = unit.toLowerCase();
    if (u === 'w' || u === 'kw') return (sign && v < 0 ? '−' : '') + this._fmtPower(u === 'kw' ? v * 1000 : v);
    if (u === 'wh' || u === 'kwh' || u === 'mwh') return this._fmtEnergy(u === 'kwh' ? v * 1000 : u === 'mwh' ? v * 1e6 : v, sign);
    return this._fmtNum(v, Math.abs(v) < 10 ? 1 : 0) + (unit ? (unit === '%' ? '%' : ' ' + unit) : '');
  }

  /* ---------- opbouw ---------- */

  _build() {
    const c = this._config;
    const t = (k, v) => this._t(k, v);
    this._builtLang = this._lang();
    const tiles = c.tiles;
    const n = tiles.length;

    const lines = Object.keys(GEC_PATHS).filter((k) => k !== 'gToB' && (c.battery || (k !== 'sToB' && k !== 'bToH')))
      .map((k) => `<path d="${GEC_PATHS[k]}" fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="3" stroke-linecap="round"/>`).join('');

    const node = (key, icon, cls) => {
      const [x, y] = GEC_NODES[key];
      return `<div class="node ${cls}" data-node="${key}" style="left:${x - 36}px;top:${y - 36}px">${GEC_ICONS[icon]}<span class="v">–</span><span class="l"></span></div>`;
    };

    const tileHtml = (tile, i) => `
      <div class="tile" data-i="${i}" style="--t:${gecRgb(tile.color)}">
        <div class="t-icon">${gecIconHtml(tile.icon || (tile.type === 'self_sufficiency' ? 'leaf' : 'bolt'))}</div>
        <div class="t-body">
          <span class="t-label"></span>
          <span class="t-value">–</span>
          <span class="t-sub"></span>
        </div>
      </div>`;
    // kopie van de laatste tegel vooraan en van de eerste achteraan: eindeloos rond
    const order = n > 1 ? [n - 1].concat(tiles.map((_, i) => i), [0]) : tiles.map((_, i) => i);

    this.shadowRoot.innerHTML = `
      <style>${GEC_STYLE}</style>
      <ha-card style="--glow:${parseInt(c.glow, 10) || 0}px">
        <div class="blob a"></div><div class="blob b"></div>
        <div class="wrap" style="--gec-h:${parseInt(c.height, 10) || 218}px">
          <section class="adv" style="--a:${GEC_COL.ok};--s:${GEC_COL.ok}">
            <div class="halo"></div>
            <div class="adv-head"><div class="adv-icon"></div><span class="adv-tag"></span></div>
            <span class="adv-title"></span>
            ${c.battery_soc ? `
            <div class="soc" data-entity="${gecEsc(c.battery_soc)}">
              <div class="soc-row"><span>${t('battery')}</span><b>–</b></div>
              <div class="soc-track"><div class="soc-bar"></div></div>
              <span class="soc-label"></span>
            </div>` : ''}
          </section>
          <section class="flow">
            <svg class="lines" width="290" height="218" viewBox="0 0 290 218" aria-hidden="true">${lines}</svg>
            <div class="dotlayer"></div>
            ${node('sun', 'sun', c.solar ? '' : 'hidden')}
            ${node('grid', 'grid', c.grid ? '' : 'hidden')}
            ${node('batt', 'battery', c.battery ? '' : 'hidden')}
            ${node('house', 'home', '')}
          </section>
          ${n ? `
          <section class="tiles">
            <div class="viewport"><div class="track anim">${order.map((i) => tileHtml(tiles[i], i)).join('')}</div></div>
            ${n > 1 ? `<div class="dots">${tiles.map((_, i) => `<button type="button" data-p="${i}" aria-label="${gecEsc(t('tile', { n: i + 1 }))}"><span></span></button>`).join('')}</div>` : ''}
          </section>` : ''}
        </div>
      </ha-card>`;

    const root = this.shadowRoot;
    this._wrap = root.querySelector('.wrap');
    root.querySelector('.node[data-node="sun"] .l').textContent = t('solar');
    root.querySelector('.node[data-node="house"] .l').textContent = t('house');

    // meer info bij tikken
    const more = (entity) => {
      if (!entity) return;
      this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: entity }, bubbles: true, composed: true }));
    };
    const nodeEnt = { sun: c.solar, grid: c.grid, batt: c.battery_soc || c.battery, house: c.house };
    root.querySelectorAll('.node').forEach((el) => el.addEventListener('click', () => more(nodeEnt[el.dataset.node])));
    const soc = root.querySelector('.soc');
    if (soc) soc.addEventListener('click', () => more(c.battery_soc));

    // tegels: swipen, bolletjes, tikken
    this._track = root.querySelector('.track');
    const vp = root.querySelector('.viewport');
    if (vp && this._track) this._bindSwipe(vp, more);
    root.querySelectorAll('.dots button').forEach((b) => b.addEventListener('click', () => {
      this._touched = Date.now();
      this._goTo(parseInt(b.dataset.p, 10));
    }));

    // breedte volgen: smal = onder elkaar
    if (!this._ro && typeof ResizeObserver !== 'undefined') {
      this._ro = new ResizeObserver(() => this._checkWidth());
    }
    if (this._ro) { this._ro.disconnect(); this._ro.observe(this); }

    this._built = true;
    this._dotKey = null;
    this._setTrack(false);
    this._startRotate();
    this._checkWidth();
  }

  _checkWidth() {
    if (!this._wrap) return;
    const w = this.getBoundingClientRect().width;
    if (w > 0) this._wrap.classList.toggle('narrow', w < 600);
  }

  _bindSwipe(vp, more) {
    let startX = null;
    let startY = null;
    let moved = false;
    vp.addEventListener('pointerdown', (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      startX = e.clientX; startY = e.clientY; moved = false;
      try { vp.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      this._track.classList.remove('anim');
    });
    vp.addEventListener('pointermove', (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(e.clientY - startY)) moved = true;
      if (moved) this._setTrack(false, dx);
    });
    const end = (e, cancel) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      startX = null;
      this._track.classList.add('anim');
      this._touched = Date.now();
      if (!cancel && moved && Math.abs(dx) > 40) {
        this._goTo(this._page + (dx < 0 ? 1 : -1));
      } else {
        this._setTrack(true);
        if (!cancel && !moved) {
          const tile = this._config.tiles[((this._page % this._config.tiles.length) + this._config.tiles.length) % this._config.tiles.length];
          if (tile && tile.entity) more(tile.entity);
        }
      }
    };
    vp.addEventListener('pointerup', (e) => end(e, false));
    vp.addEventListener('pointercancel', (e) => end(e, true));
  }

  _setTrack(anim, dx = 0) {
    if (!this._track) return;
    const n = this._config.tiles.length;
    const offset = n > 1 ? this._page + 1 : 0;
    this._track.classList.toggle('anim', !!anim);
    this._track.style.transform = `translateX(calc(${-offset * 100}% + ${dx}px))`;
    const active = ((this._page % n) + n) % n;
    this.shadowRoot.querySelectorAll('.dots button').forEach((b, i) => b.classList.toggle('on', i === active));
  }

  _goTo(p) {
    const n = this._config.tiles.length;
    if (n < 2) return;
    clearTimeout(this._wrapTimer);
    this._page = p;
    this._setTrack(true);
    if (p >= n || p < 0) {
      // na de animatie ongemerkt naar de echte tegel springen
      this._wrapTimer = setTimeout(() => {
        this._page = p >= n ? 0 : n - 1;
        this._setTrack(false);
      }, 370);
    }
  }

  _startRotate() {
    clearInterval(this._rotTimer);
    this._rotTimer = null;
    const s = this._config ? parseInt(this._config.auto_rotate, 10) || 0 : 0;
    if (s <= 0 || !this._config || this._config.tiles.length < 2) return;
    this._rotTimer = setInterval(() => {
      if (this._touched && Date.now() - this._touched < s * 1000) return;
      this._goTo(this._page + 1);
    }, s * 1000);
  }

  /* ---------- bijwerken ---------- */

  _advice(v) {
    const c = this._config;
    const surplus = Math.max(0, -v.grid) + Math.max(0, v.batt);
    const soc = v.soc ?? 0;
    let level;
    if (surplus >= c.surplus || (v.soc !== null && soc >= c.soc_full && v.pv >= v.house)) level = 'go';
    else if (v.pv >= v.house * 0.8 || (v.soc !== null && soc >= c.soc_ok)) level = 'ok';
    else level = 'wait';

    // niet bij elke schommeling van advies wisselen
    const delay = (parseInt(c.advice_delay, 10) || 0) * 1000;
    const now = Date.now();
    if (this._level === null || delay === 0) {
      this._level = level;
      this._pending = null;
    } else if (level !== this._level) {
      if (!this._pending || this._pending.level !== level) this._pending = { level, since: now };
      else if (now - this._pending.since >= delay) { this._level = level; this._pending = null; }
    } else {
      this._pending = null;
    }
    return this._level;
  }

  _update() {
    if (!this._hass || !this._built) return;
    const c = this._config;
    const root = this.shadowRoot;
    const v = this._values();
    const t = (k, x) => this._t(k, x);

    // advies
    const level = this._advice(v);
    const adv = root.querySelector('.adv');
    adv.style.setProperty('--a', GEC_COL[level]);
    const icon = { go: 'bolt', ok: 'gauge', wait: 'hourglass' }[level];
    if (this._advIcon !== icon) {
      root.querySelector('.adv-icon').innerHTML = GEC_ICONS[icon];
      this._advIcon = icon;
    }
    root.querySelector('.adv-tag').textContent = t(level + '_tag');
    root.querySelector('.adv-title').textContent = t(level + '_title');

    // batterij-balk
    if (c.battery_soc) {
      const soc = v.soc;
      const sc = soc === null ? GEC_COL.ok : soc >= 80 ? GEC_COL.batt : soc >= 30 ? GEC_COL.ok : GEC_COL.wait;
      adv.style.setProperty('--s', sc);
      root.querySelector('.soc-row b').textContent = soc === null ? '–' : Math.round(soc) + '%';
      root.querySelector('.soc-bar').style.width = (soc === null ? 0 : Math.max(0, Math.min(100, soc))) + '%';
      let lab = soc === null ? t('unavailable') : soc >= 95 ? t('full') : soc >= 80 ? t('good') : soc >= 30 ? t('half') : t('low');
      if (v.batt > 10) lab += ' · ' + t('charging') + ' ' + this._fmtPower(v.batt);
      else if (v.batt < -10) lab += ' · ' + t('discharging') + ' ' + this._fmtPower(v.batt);
      root.querySelector('.soc-label').textContent = lab;
    }

    // knopen
    const setNode = (key, value, label, col, on) => {
      const el = root.querySelector(`.node[data-node="${key}"]`);
      if (!el) return;
      el.style.setProperty('--n', col);
      el.classList.toggle('on', !!on);
      el.querySelector('.v').textContent = value;
      if (label !== null) el.querySelector('.l').textContent = label;
    };
    setNode('sun', this._fmtPower(v.pv), null, GEC_COL.sun, v.pv > 10);
    setNode('grid', this._fmtPower(v.grid), v.grid > 10 ? t('import') : v.grid < -10 ? t('export') : t('grid'), v.grid < -10 ? GEC_COL.exp : GEC_COL.grid, Math.abs(v.grid) > 10);
    setNode('batt', this._fmtPower(v.batt), v.batt > 10 ? t('charging') : v.batt < -10 ? t('discharging') : t('idle'), GEC_COL.batt, Math.abs(v.batt) > 10);
    setNode('house', this._fmtPower(v.house), null, GEC_COL.house, true);

    // stromen
    const sToH = Math.min(v.pv, v.house);
    const sToB = Math.max(0, Math.min(v.pv - sToH, Math.max(0, v.batt)));
    const sToG = Math.max(0, v.pv - sToH - sToB);
    const bToH = v.batt < 0 ? -v.batt : 0;
    const gToH = v.grid > 0 ? Math.min(v.grid, Math.max(0, v.house - sToH - bToH)) : 0;
    const gToB = v.grid > 0 && v.batt > 0 ? Math.max(0, v.batt - sToB) : 0;
    const flows = [
      [sToH, 'sToH', GEC_COL.sun], [sToB, 'sToB', GEC_COL.sun], [sToG, 'sToG', GEC_COL.exp],
      [gToH, 'gToH', GEC_COL.grid], [bToH, 'bToH', GEC_COL.batt], [gToB, 'gToB', GEC_COL.grid],
    ].filter((f) => f[0] >= 10);
    // stap per 250 W, zodat de animaties niet bij elke kleine verandering herstarten
    const key = flows.map((f) => f[1] + Math.round(f[0] / 250)).join('|');
    if (key !== this._dotKey) {
      this._dotKey = key;
      let html = '';
      flows.forEach(([w, p, col]) => {
        const dur = Math.max(0.9, 3.2 - Math.min(2.3, w / 1000));
        for (let k = 0; k < 3; k++) {
          html += `<span class="dot" style="offset-path:path('${GEC_PATHS[p]}');background:rgb(${col});box-shadow:0 0 calc(var(--glow) * 0.6) 2px rgba(${col},0.85);animation-duration:${dur.toFixed(2)}s;animation-delay:-${(dur * k / 3).toFixed(2)}s"></span>`;
        }
      });
      root.querySelector('.dotlayer').innerHTML = html;
    }

    // tegels
    const selfPct = v.house > 0 ? Math.round(100 * Math.max(0, v.house - Math.max(0, v.grid)) / v.house) : 100;
    c.tiles.forEach((tile, i) => {
      let label; let value; let sub;
      if (tile.type === 'self_sufficiency') {
        label = tile.name || t('self');
        value = Math.max(0, Math.min(100, selfPct)) + '%';
        sub = tile.sub ?? t('self_sub');
      } else {
        const st = tile.entity && this._hass.states[tile.entity];
        label = tile.name || (st && st.attributes.friendly_name) || tile.entity || '';
        value = this._fmtEntity(tile.entity, tile.sign);
        if (tile.secondary) {
          sub = (tile.secondary_name ? tile.secondary_name + ' ' : '') + this._fmtEntity(tile.secondary);
        } else {
          sub = tile.sub || '';
        }
      }
      root.querySelectorAll(`.tile[data-i="${i}"]`).forEach((el) => {
        el.querySelector('.t-label').textContent = label;
        el.querySelector('.t-value').textContent = value;
        el.querySelector('.t-sub').textContent = sub;
      });
    });
  }
}

/* ------------------------------------------------------------------ */
/*  Visuele editor                                                     */
/* ------------------------------------------------------------------ */

function gecMainSchema(lang) {
  const t = (k) => gecT(lang, k);
  const ent = (domain) => ({ entity: { domain } });
  return [
    { name: 'solar', selector: ent('sensor') },
    { name: 'grid', selector: ent('sensor') },
    { name: 'battery', selector: ent('sensor') },
    { name: 'battery_soc', selector: ent('sensor') },
    { name: 'house', selector: ent('sensor') },
    { type: 'grid', name: '', schema: [
      { name: 'invert_grid', selector: { boolean: {} } },
      { name: 'invert_battery', selector: { boolean: {} } },
    ] },
  ];
}

function gecAdviceSchema() {
  return [
    { type: 'grid', name: '', schema: [
      { name: 'surplus', selector: { number: { min: 0, max: 20000, step: 100, mode: 'box', unit_of_measurement: 'W' } } },
      { name: 'advice_delay', selector: { number: { min: 0, max: 900, step: 10, mode: 'box', unit_of_measurement: 's' } } },
      { name: 'soc_ok', selector: { number: { min: 0, max: 100, mode: 'box', unit_of_measurement: '%' } } },
      { name: 'soc_full', selector: { number: { min: 0, max: 100, mode: 'box', unit_of_measurement: '%' } } },
    ] },
  ];
}

function gecDisplaySchema(lang) {
  const t = (k) => gecT(lang, k);
  return [
    { name: 'units', selector: { select: { mode: 'dropdown', options: [{ value: 'w', label: t('u_w') }, { value: 'auto', label: t('u_auto') }] } } },
    { name: 'auto_rotate', selector: { number: { min: 0, max: 120, step: 1, mode: 'box', unit_of_measurement: 's' } } },
    { name: 'glow', selector: { number: { min: 0, max: 60, step: 2, mode: 'slider', unit_of_measurement: 'px' } } },
    { name: 'height', selector: { number: { min: 160, max: 400, step: 10, mode: 'box', unit_of_measurement: 'px' } } },
    { name: 'language', selector: { select: { mode: 'dropdown', options: [{ value: 'auto', label: t('lang_auto') }].concat(Object.keys(GEC_LANG_NAMES).map((k) => ({ value: k, label: GEC_LANG_NAMES[k] }))) } } },
  ];
}

function gecTileSchema(lang, type) {
  const t = (k) => gecT(lang, k);
  const s = [{ name: 'type', selector: { select: { mode: 'dropdown', options: [{ value: 'entity', label: t('t_entity') }, { value: 'self_sufficiency', label: t('t_self') }] } } }];
  if (type === 'self_sufficiency') {
    return s.concat([{ name: 'name', selector: { text: {} } }, { name: 'icon', selector: { icon: {} } }]);
  }
  return s.concat([
    { name: 'entity', selector: { entity: {} } },
    { name: 'name', selector: { text: {} } },
    { name: 'icon', selector: { icon: {} } },
    { type: 'grid', name: '', schema: [
      { name: 'secondary', selector: { entity: {} } },
      { name: 'secondary_name', selector: { text: {} } },
    ] },
    { name: 'sub', selector: { text: {} } },
  ]);
}

const GEC_EDITOR_STYLE = `
  h3 { margin: 22px 0 8px; font-size: 16px; font-weight: 600; }
  h3:first-child { margin-top: 4px; }
  .tile { border: 1px solid var(--divider-color, rgba(127,127,127,0.3)); border-left: 6px solid var(--c); border-radius: 12px; padding: 12px; margin-bottom: 12px; }
  .row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; flex-wrap: wrap; }
  .row .label { font-weight: 600; flex: 1; }
  .row input[type=color] { width: 44px; height: 32px; border: none; padding: 0; background: none; cursor: pointer; }
  .row button, .add { font: inherit; cursor: pointer; border-radius: 8px; padding: 6px 10px; border: 1px solid var(--divider-color, rgba(127,127,127,0.4)); background: var(--secondary-background-color, transparent); color: var(--primary-text-color); }
  .swatches { display: flex; gap: 6px; }
  .sw { width: 22px; height: 22px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; padding: 0; }
  .sw.on { border-color: var(--primary-text-color); }
  .add { width: 100%; padding: 10px; font-weight: 600; }
`;

class GlowEnergyCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._sig = null;
  }

  setConfig(config) {
    this._config = { ...config, tiles: (config.tiles || []).map((x) => (typeof x === 'string' ? { entity: x } : { ...x })) };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (this._config && gecLang(hass, this._config.language) !== this._lang) {
      this._sig = null;
      this._render();
      return;
    }
    this.shadowRoot.querySelectorAll('ha-form').forEach((f) => { f.hass = hass; });
  }

  _emit(config) {
    this._config = config;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config }, bubbles: true, composed: true }));
  }

  _clean(v) {
    Object.keys(v).forEach((k) => { if (v[k] === '' || v[k] === null || v[k] === undefined) delete v[k]; });
    if (v.language === 'auto') delete v.language;
    if (v.type === 'entity') delete v.type;
    if (v.invert_grid === false) delete v.invert_grid;
    if (v.invert_battery === false) delete v.invert_battery;
    return v;
  }

  _form(schema, data, onChange) {
    const f = document.createElement('ha-form');
    f.hass = this._hass;
    f.schema = schema;
    f.data = data;
    f.computeLabel = (s) => gecT(this._lang, 'l_' + s.name);
    f.addEventListener('value-changed', (e) => onChange({ ...e.detail.value }));
    return f;
  }

  _render() {
    if (!this._config) return;
    const c = this._config;
    const lang = gecLang(this._hass, c.language);
    this._lang = lang;
    const t = (k, v) => gecT(lang, k, v);
    const sig = lang + '|' + c.tiles.length + '|' + c.tiles.map((x) => (x.color || '') + (x.type || '')).join(',');

    if (sig === this._sig) {
      if (this._forms) {
        this._forms.main.data = this._mainData();
        this._forms.advice.data = this._mainData();
        this._forms.display.data = this._mainData();
        this._forms.tiles.forEach((f, i) => { f.data = { type: 'entity', ...c.tiles[i] }; });
      }
      return;
    }
    this._sig = sig;
    const root = this.shadowRoot;
    root.innerHTML = `<style>${GEC_EDITOR_STYLE}</style>`;
    const h = (txt) => { const el = document.createElement('h3'); el.textContent = txt; root.appendChild(el); };
    const mainChange = (v) => this._emit(this._clean({ ...this._config, ...v, tiles: this._config.tiles }));

    this._forms = { tiles: [] };
    h(t('ed_entities'));
    this._forms.main = this._form(gecMainSchema(lang), this._mainData(), mainChange);
    root.appendChild(this._forms.main);
    h(t('ed_advice'));
    this._forms.advice = this._form(gecAdviceSchema(), this._mainData(), mainChange);
    root.appendChild(this._forms.advice);
    h(t('ed_display'));
    this._forms.display = this._form(gecDisplaySchema(lang), this._mainData(), mainChange);
    root.appendChild(this._forms.display);
    h(t('ed_tiles'));

    c.tiles.forEach((tile, i) => {
      const color = tile.color || GEC_PALETTE[i % GEC_PALETTE.length];
      const box = document.createElement('div');
      box.className = 'tile';
      box.style.setProperty('--c', color);
      const row = document.createElement('div');
      row.className = 'row';
      row.innerHTML = `<span class="label">${gecEsc(t('ed_tile', { n: i + 1 }))}</span>
        <span class="swatches">${GEC_PALETTE.map((p) => `<button type="button" class="sw${p.toLowerCase() === color.toLowerCase() ? ' on' : ''}" style="background:${p}" data-col="${p}"></button>`).join('')}</span>
        <input type="color" value="${/^#[0-9a-f]{6}$/i.test(color) ? color : '#b9a8ff'}" title="${gecEsc(t('ed_color'))}">
        <button type="button" class="up" ${i === 0 ? 'disabled' : ''} title="${gecEsc(t('ed_up'))}">↑</button>
        <button type="button" class="down" ${i === c.tiles.length - 1 ? 'disabled' : ''} title="${gecEsc(t('ed_down'))}">↓</button>
        <button type="button" class="del">${gecEsc(t('ed_delete'))}</button>`;
      box.appendChild(row);
      row.querySelectorAll('.sw').forEach((sw) => sw.addEventListener('click', () => this._patch(i, { color: sw.dataset.col })));
      row.querySelector('input[type=color]').addEventListener('change', (e) => this._patch(i, { color: e.target.value.toUpperCase() }));
      row.querySelector('.up').addEventListener('click', () => this._move(i, -1));
      row.querySelector('.down').addEventListener('click', () => this._move(i, 1));
      row.querySelector('.del').addEventListener('click', () => {
        this._emit({ ...this._config, tiles: this._config.tiles.filter((_, k) => k !== i) });
        this._render();
      });
      const f = this._form(gecTileSchema(lang, tile.type), { type: 'entity', ...tile }, (v) => {
        const tiles = this._config.tiles.slice();
        const typeChanged = (v.type || 'entity') !== (tiles[i].type || 'entity');
        tiles[i] = this._clean({ ...v, color: tiles[i].color });
        this._emit({ ...this._config, tiles });
        if (typeChanged) this._render();
      });
      this._forms.tiles.push(f);
      box.appendChild(f);
      root.appendChild(box);
    });

    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'add';
    add.textContent = t('ed_add');
    add.addEventListener('click', () => {
      const n = this._config.tiles.length;
      this._emit({ ...this._config, tiles: this._config.tiles.concat([{ entity: '', color: GEC_PALETTE[n % GEC_PALETTE.length] }]) });
      this._render();
    });
    root.appendChild(add);
  }

  _mainData() {
    const c = this._config;
    return {
      solar: c.solar, grid: c.grid, battery: c.battery, battery_soc: c.battery_soc, house: c.house,
      invert_grid: !!c.invert_grid, invert_battery: !!c.invert_battery,
      surplus: c.surplus ?? 1500, advice_delay: c.advice_delay ?? 60, soc_ok: c.soc_ok ?? 40, soc_full: c.soc_full ?? 90,
      units: c.units ?? 'w', auto_rotate: c.auto_rotate ?? 0, glow: c.glow ?? 22, height: c.height ?? 218,
      language: c.language ?? 'auto',
    };
  }

  _patch(i, p) {
    const tiles = this._config.tiles.slice();
    tiles[i] = { ...tiles[i], ...p };
    this._emit({ ...this._config, tiles });
    this._render();
  }

  _move(i, d) {
    const j = i + d;
    const tiles = this._config.tiles.slice();
    if (j < 0 || j >= tiles.length) return;
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    this._emit({ ...this._config, tiles });
    this._sig = null;
    this._render();
  }
}

if (!customElements.get('glow-energy-card')) customElements.define('glow-energy-card', GlowEnergyCard);
if (!customElements.get('glow-energy-card-editor')) customElements.define('glow-energy-card-editor', GlowEnergyCardEditor);

window.customCards = window.customCards || [];
if (!window.customCards.some((x) => x.type === 'glow-energy-card')) {
  window.customCards.push({
    type: 'glow-energy-card',
    name: 'Glow Energy Card',
    description: gecT(gecLang(null), 'description'),
    preview: true,
    documentationURL: 'https://github.com/stijnleroy/glow-energy-card',
  });
}

console.info(
  '%c GLOW-ENERGY-CARD %c v' + GEC_VERSION + ' ',
  'color:#1C1730;background:#8FE3B8;font-weight:700;border-radius:4px 0 0 4px;padding:2px 4px',
  'color:#8FE3B8;background:#1C1730;font-weight:700;border-radius:0 4px 4px 0;padding:2px 4px'
);
