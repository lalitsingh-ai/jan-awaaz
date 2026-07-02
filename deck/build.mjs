// Generates a designed Jan Awaaz pitch deck (.pptx).
// Run: node deck/build.mjs   ->   deck/Jan-Awaaz.pptx
import pptxgen from 'pptxgenjs';

const C = {
  indigo: '4F46E5', violet: '7C3AED', dark: '0F172A', slate: '475569',
  mute: '94A3B8', light: 'F5F7FB', white: 'FFFFFF', border: 'E2E8F0',
  green: '16A34A', sky: '0EA5E9', amber: 'F59E0B', red: 'EF4444', card: 'FFFFFF',
};
const FONT = 'Segoe UI';
const W = 13.333, H = 7.5;

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'Jan Awaaz';
pptx.title = 'Jan Awaaz — People\'s Priorities';

// ---------- helpers ----------
const slideBase = (bg = C.light) => {
  const s = pptx.addSlide();
  s.background = { color: bg };
  return s;
};

function logo(s, x, y, scale = 1) {
  const sz = 0.62 * scale;
  s.addShape(pptx.ShapeType.roundRect, { x, y, w: sz, h: sz, rectRadius: 0.12 * scale, fill: { color: C.indigo }, line: { type: 'none' } });
  s.addText('जन', { x, y, w: sz, h: sz, align: 'center', valign: 'middle', color: C.white, bold: true, fontSize: 18 * scale, fontFace: FONT });
}

function footer(s, n) {
  s.addShape(pptx.ShapeType.rect, { x: 0, y: H - 0.5, w: W, h: 0.02, fill: { color: C.border }, line: { type: 'none' } });
  s.addText('Jan Awaaz · People\'s Priorities (Track 1)', { x: 0.55, y: H - 0.48, w: 7, h: 0.3, fontSize: 9, color: C.mute, fontFace: FONT });
  s.addText(`${n}`, { x: W - 1.05, y: H - 0.48, w: 0.5, h: 0.3, fontSize: 9, color: C.mute, align: 'right', fontFace: FONT });
}

function header(s, kicker, title) {
  s.addText(kicker.toUpperCase(), { x: 0.55, y: 0.5, w: 11, h: 0.3, fontSize: 12, bold: true, color: C.indigo, charSpacing: 2, fontFace: FONT });
  s.addText(title, { x: 0.55, y: 0.82, w: 12.2, h: 0.9, fontSize: 30, bold: true, color: C.dark, fontFace: FONT });
}

function card(s, x, y, w, h, fill = C.white) {
  s.addShape(pptx.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color: C.border, width: 1 },
    shadow: { type: 'outer', color: 'B9C2D0', blur: 8, offset: 2, angle: 90, opacity: 0.35 } });
}

function bullets(s, items, x, y, w, h, fontSize = 16, color = C.slate) {
  s.addText(items.map((t) => ({ text: t, options: { bullet: { code: '2022', indent: 16 }, paraSpaceAfter: 10, color, fontSize, fontFace: FONT } })),
    { x, y, w, h, valign: 'top' });
}

// flow/architecture box
function box(s, x, y, w, h, title, sub, accent) {
  s.addShape(pptx.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.08, fill: { color: C.white }, line: { color: accent, width: 1.5 } });
  s.addShape(pptx.ShapeType.rect, { x, y, w: 0.09, h, fill: { color: accent }, line: { type: 'none' } });
  s.addText(title, { x: x + 0.18, y: y + 0.12, w: w - 0.3, h: 0.4, fontSize: 15, bold: true, color: C.dark, fontFace: FONT });
  s.addText(sub, { x: x + 0.18, y: y + 0.56, w: w - 0.3, h: h - 0.6, fontSize: 11, color: C.slate, fontFace: FONT, valign: 'top' });
}

function arrow(s, x, y, w) {
  s.addShape(pptx.ShapeType.rightArrow, { x, y, w, h: 0.32, fill: { color: C.indigo }, line: { type: 'none' } });
}

// mini product mock: ranked priority bars
function priorityMock(s, x, y, w) {
  const h = 2.7;
  card(s, x, y, w, h);
  s.addText('Ranked priorities', { x: x + 0.2, y: y + 0.14, w: w - 0.4, h: 0.3, fontSize: 12, bold: true, color: C.dark, fontFace: FONT });
  const rows = [
    ['💧 Water', 1.0, C.sky], ['🏥 Health', 0.82, C.red], ['🛣️ Roads', 0.6, C.slate], ['💡 Electricity', 0.45, C.amber],
  ];
  let ry = y + 0.62;
  for (const [label, pct, col] of rows) {
    s.addText(label, { x: x + 0.2, y: ry, w: 1.7, h: 0.3, fontSize: 11, color: C.dark, fontFace: FONT });
    s.addShape(pptx.ShapeType.roundRect, { x: x + 1.95, y: ry + 0.05, w: (w - 2.3), h: 0.2, rectRadius: 0.1, fill: { color: 'EEF2F7' }, line: { type: 'none' } });
    s.addShape(pptx.ShapeType.roundRect, { x: x + 1.95, y: ry + 0.05, w: (w - 2.3) * pct, h: 0.2, rectRadius: 0.1, fill: { color: col }, line: { type: 'none' } });
    ry += 0.5;
  }
}

// ---------- Slide 1: Title ----------
{
  const s = slideBase(C.white);
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: 2.5, fill: { color: C.indigo }, line: { type: 'none' } });
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 2.5, w: W, h: 0.12, fill: { color: C.violet }, line: { type: 'none' } });
  logo(s, 0.6, 0.7, 1.6);
  s.addText('Jan Awaaz', { x: 1.9, y: 0.72, w: 8, h: 0.7, fontSize: 40, bold: true, color: C.white, fontFace: FONT });
  s.addText('“People\'s Voice” — turning scattered citizen input into the MP\'s ranked action list.',
    { x: 1.9, y: 1.5, w: 10.5, h: 0.6, fontSize: 16, color: 'DDE3FF', fontFace: FONT });
  priorityMock(s, 7.7, 3.1, 5.1);
  s.addText('AI for Constituency Development Planning', { x: 0.6, y: 3.2, w: 6.6, h: 0.5, fontSize: 18, bold: true, color: C.dark, fontFace: FONT });
  bullets(s, [
    'Multilingual: voice, text & photo intake',
    'Gemini ranks needs by demand × urgency × people reached',
    'Decision-ready dashboard for the MP\'s office',
  ], 0.6, 3.8, 6.6, 1.8, 15);
  s.addText('Track 1 · People\'s Priorities    |    Working URL: <your-vercel-url>    |    Team: <names>',
    { x: 0.6, y: 6.5, w: 12, h: 0.4, fontSize: 12, color: C.slate, fontFace: FONT });
  footer(s, 1);
}

// ---------- Slide 2: Problem ----------
{
  const s = slideBase();
  header(s, 'The problem', 'MPs are flooded with needs — and no way to rank them');
  bullets(s, [
    'Requests arrive via public meetings, letters, social media, grievance portals — all unstructured.',
    'Local development plans hold dozens of competing projects.',
    'No objective way to consolidate feedback, spot recurring needs, or weigh demand against real data.',
    'Result: budgets follow whoever shouts loudest, not where need is greatest.',
  ], 0.55, 2.0, 7.4, 3.6, 17);
  card(s, 8.3, 2.1, 4.5, 3.2, 'EEF2FF');
  s.addText('“', { x: 8.4, y: 2.0, w: 1, h: 1, fontSize: 60, bold: true, color: C.indigo, fontFace: FONT });
  s.addText('…dozens of competing proposed projects, with no objective way to weigh them against real demand.',
    { x: 8.6, y: 2.9, w: 4.0, h: 1.8, fontSize: 15, italic: true, color: C.dark, fontFace: FONT, valign: 'top' });
  s.addText('— Track 1 problem statement', { x: 8.6, y: 4.7, w: 4.0, h: 0.4, fontSize: 11, color: C.slate, fontFace: FONT });
  footer(s, 2);
}

// ---------- Slide 3: Two people ----------
{
  const s = slideBase();
  header(s, 'Who feels it', 'Two people, one broken loop');
  card(s, 0.7, 2.2, 5.7, 3.4);
  s.addText('🧑‍🌾  The Citizen', { x: 1.0, y: 2.5, w: 5, h: 0.5, fontSize: 20, bold: true, color: C.dark, fontFace: FONT });
  bullets(s, [
    'Speaks the need — often in a local language.',
    'No app, low-end phone, patchy network.',
    'Never knows if anyone heard it.',
  ], 1.0, 3.2, 5.1, 2.2, 15);
  card(s, 6.9, 2.2, 5.7, 3.4);
  s.addText('🏛️  The MP\'s office', { x: 7.2, y: 2.5, w: 5, h: 0.5, fontSize: 20, bold: true, color: C.dark, fontFace: FONT });
  bullets(s, [
    'Drowning in unstructured input.',
    'Acts on the loudest, not the largest need.',
    'No evidence trail to defend choices.',
  ], 7.2, 3.2, 5.1, 2.2, 15);
  footer(s, 3);
}

// ---------- Slide 4: Solution ----------
{
  const s = slideBase();
  header(s, 'Our solution', 'One platform: citizens speak, the MP gets a ranked plan');
  card(s, 0.7, 2.2, 6.0, 3.3, 'F0FDF4');
  s.addText('For citizens', { x: 1.0, y: 2.45, w: 5, h: 0.4, fontSize: 16, bold: true, color: C.green, fontFace: FONT });
  bullets(s, [
    'Submit by voice, text or photo',
    '6 Indian languages, works on any phone',
    'Instant feedback: “your need is #1, 6 neighbours agree”',
  ], 1.0, 3.0, 5.4, 2.3, 15);
  priorityMock(s, 7.0, 2.2, 5.6);
  s.addText('For the MP: a 30-second brief + ranked, evidence-weighted actions.',
    { x: 7.0, y: 5.1, w: 5.6, h: 0.5, fontSize: 13, italic: true, color: C.slate, fontFace: FONT });
  footer(s, 4);
}

// ---------- Slide 5: How it works (flow diagram) ----------
{
  const s = slideBase();
  header(s, 'How it works', 'AI is the engine — not decoration');
  const y = 2.7, h = 1.7, w = 3.5;
  box(s, 0.7, y, w, h, 'Citizen input', 'Voice · text · photo\n6 Indian languages\nNo app, low bandwidth', C.green);
  box(s, 4.9, y, w, h, 'Gemini AI', 'Classify grievance\nCluster recurring themes\nRank by demand × urgency × reach', C.indigo);
  box(s, 9.1, y, w, h, 'MP Dashboard', '30-sec brief · ranked actions\nHotspot map · 4-week trends\nOne-click export', C.violet);
  arrow(s, 4.25, y + 0.7, 0.55);
  arrow(s, 8.45, y + 0.7, 0.55);
  card(s, 0.7, 4.9, 11.9, 1.2, 'EEF2FF');
  s.addText('Demographic-weighted ranking', { x: 1.0, y: 5.05, w: 6, h: 0.4, fontSize: 14, bold: true, color: C.indigo, fontFace: FONT });
  s.addText('Citizen demand is blended with village population, school enrolment & distance to PHC — so a large under-served village outranks noise.',
    { x: 1.0, y: 5.45, w: 11.3, h: 0.6, fontSize: 13, color: C.slate, fontFace: FONT });
  footer(s, 5);
}

// ---------- Slide 6: Live demo ----------
{
  const s = slideBase(C.dark);
  s.addText('LIVE DEMO', { x: 0.55, y: 0.5, w: 11, h: 0.3, fontSize: 12, bold: true, color: '8B96FF', charSpacing: 2, fontFace: FONT });
  s.addText('60 seconds, on the real app', { x: 0.55, y: 0.82, w: 12, h: 0.9, fontSize: 30, bold: true, color: C.white, fontFace: FONT });
  const steps = [
    ['1', 'Speak a grievance in Hindi', 'It auto-classifies instantly — no typing, no translation step.'],
    ['2', 'Citizen sees social proof', '“Your issue is the #1 priority — 6 neighbours agree.”'],
    ['3', 'Flip to the MP dashboard', 'Re-ranked priorities, hotspot map, “Water ↑ rising 3 weeks.”'],
  ];
  let y = 2.3;
  for (const [n, t, d] of steps) {
    s.addShape(pptx.ShapeType.ellipse, { x: 0.7, y, w: 0.7, h: 0.7, fill: { color: C.indigo }, line: { type: 'none' } });
    s.addText(n, { x: 0.7, y, w: 0.7, h: 0.7, align: 'center', valign: 'middle', color: C.white, bold: true, fontSize: 20, fontFace: FONT });
    s.addText(t, { x: 1.7, y: y + 0.02, w: 10.8, h: 0.4, fontSize: 18, bold: true, color: C.white, fontFace: FONT });
    s.addText(d, { x: 1.7, y: y + 0.42, w: 10.8, h: 0.4, fontSize: 13, color: 'AEB6C6', fontFace: FONT });
    y += 1.15;
  }
  s.addText('Tip: keep a screen recording as backup.', { x: 0.7, y: 6.4, w: 10, h: 0.4, fontSize: 12, italic: true, color: '8B96FF', fontFace: FONT });
  footer(s, 6);
}

// ---------- Slide 7: AI real work ----------
{
  const s = slideBase();
  header(s, 'AI / technical execution', 'The AI is doing real work');
  const items = [
    ['🌐', 'Multilingual understanding', 'Reads Hindi, Telugu, Tamil, Bengali, Marathi & English directly.'],
    ['⚖️', 'Demographic-weighted ranking', 'Demand × urgency × population, school enrolment, PHC distance.'],
    ['📷', 'Multimodal', 'A photo of a broken road or dry borewell is classified too.'],
    ['🛟', 'Graceful fallback', 'Deterministic logic if AI is unreachable — never fails on stage.'],
  ];
  let i = 0;
  for (const [ic, t, d] of items) {
    const x = 0.7 + (i % 2) * 6.1, y = 2.1 + Math.floor(i / 2) * 1.85;
    card(s, x, y, 5.8, 1.6);
    s.addText(ic, { x: x + 0.2, y: y + 0.3, w: 0.9, h: 0.9, fontSize: 30, align: 'center', fontFace: FONT });
    s.addText(t, { x: x + 1.2, y: y + 0.22, w: 4.4, h: 0.4, fontSize: 16, bold: true, color: C.dark, fontFace: FONT });
    s.addText(d, { x: x + 1.2, y: y + 0.62, w: 4.4, h: 0.8, fontSize: 12, color: C.slate, fontFace: FONT, valign: 'top' });
    i++;
  }
  footer(s, 7);
}

// ---------- Slide 8: Inclusivity ----------
{
  const s = slideBase();
  header(s, 'Inclusivity & accessibility', 'Built for every citizen — not just smartphone users');
  bullets(s, [
    'Voice-first design for low-literacy users.',
    '6 Indian languages out of the box, easily extended.',
    'Works on low-end phones with no app install.',
    'One-tap photo reporting for those who can\'t type.',
    'Low-bandwidth friendly; degrades gracefully offline.',
  ], 0.55, 2.0, 7.2, 3.6, 17);
  card(s, 8.1, 2.1, 4.7, 3.4, 'EEF2FF');
  s.addText('6', { x: 8.1, y: 2.4, w: 4.7, h: 1.1, fontSize: 60, bold: true, color: C.indigo, align: 'center', fontFace: FONT });
  s.addText('languages today', { x: 8.1, y: 3.5, w: 4.7, h: 0.4, fontSize: 16, color: C.slate, align: 'center', fontFace: FONT });
  s.addText('हिन्दी · English · తెలుగు · தமிழ் · বাংলা · मराठी', { x: 8.3, y: 4.1, w: 4.3, h: 0.9, fontSize: 14, color: C.dark, align: 'center', fontFace: FONT });
  footer(s, 8);
}

// ---------- Slide 9: Deployability + architecture ----------
{
  const s = slideBase();
  header(s, 'Deployability & security', 'Live today — and ready to scale safely');
  const y = 2.5, h = 1.3, w = 3.1;
  box(s, 0.7, y, w, h, 'Browser', 'React app\n(no API key)', C.sky);
  box(s, 4.6, y, w, h, '/api/gemini', 'Server proxy\n🔒 holds the key', C.indigo);
  box(s, 8.5, y, w, h, 'Gemini API', 'Google AI', C.violet);
  arrow(s, 3.85, y + 0.5, 0.6);
  arrow(s, 7.75, y + 0.5, 0.6);
  s.addText('The API key never reaches the browser — calls run server-side.', { x: 0.7, y: y + 1.45, w: 11, h: 0.4, fontSize: 13, italic: true, color: C.green, bold: true, fontFace: FONT });
  card(s, 0.7, 4.7, 11.9, 1.5, 'F8FAFF');
  s.addText('Scale path', { x: 1.0, y: 4.85, w: 4, h: 0.4, fontSize: 14, bold: true, color: C.indigo, fontFace: FONT });
  bullets(s, [
    'Free now on Vercel (static + serverless) — deployable to a constituency in weeks.',
    'Same code drops onto Google Cloud Run + Gemini; add BigQuery (census) & Speech-to-Text to scale.',
  ], 1.0, 5.25, 11.3, 0.9, 13);
  footer(s, 9);
}

// ---------- Slide 10: Impact ----------
{
  const s = slideBase();
  header(s, 'Impact potential', 'From one constituency to many');
  const stats = [
    ['~1.8M', 'citizens per constituency whose needs become visible'],
    ['6 → 22', 'languages: cover every major Indian state'],
    ['Weeks', 'to pilot with a sponsoring MP\'s office'],
  ];
  let i = 0;
  for (const [n, d] of stats) {
    const x = 0.7 + i * 4.1;
    card(s, x, 2.3, 3.8, 2.2);
    s.addText(n, { x, y: 2.55, w: 3.8, h: 0.9, fontSize: 36, bold: true, color: C.indigo, align: 'center', fontFace: FONT });
    s.addText(d, { x: x + 0.2, y: 3.5, w: 3.4, h: 0.9, fontSize: 13, color: C.slate, align: 'center', fontFace: FONT, valign: 'top' });
    i++;
  }
  s.addText('Closing the loop — citizens see they were heard → more participation → better data → better decisions.',
    { x: 0.7, y: 4.9, w: 11.9, h: 0.6, fontSize: 15, italic: true, color: C.dark, fontFace: FONT });
  footer(s, 10);
}

// ---------- Slide 11: Why we win ----------
{
  const s = slideBase();
  header(s, 'Why Jan Awaaz', 'Covers the scoring head-on');
  const rows = [
    ['Real AI, not keywords', 'Multilingual + multimodal + demographic weighting'],
    ['Addictive for citizens', 'Social-proof feedback loop drives participation'],
    ['Decision-ready for MPs', 'Brief, ranked actions, hotspots, trends, export'],
    ['Secure & deployable', 'Server-side key, free hosting, clear cloud path'],
  ];
  let y = 2.1;
  for (const [t, d] of rows) {
    card(s, 0.7, y, 11.9, 1.0);
    s.addShape(pptx.ShapeType.ellipse, { x: 1.0, y: y + 0.3, w: 0.4, h: 0.4, fill: { color: C.green }, line: { type: 'none' } });
    s.addText('✓', { x: 1.0, y: y + 0.3, w: 0.4, h: 0.4, align: 'center', valign: 'middle', color: C.white, bold: true, fontSize: 14, fontFace: FONT });
    s.addText(t, { x: 1.7, y: y + 0.15, w: 4.6, h: 0.7, fontSize: 16, bold: true, color: C.dark, valign: 'middle', fontFace: FONT });
    s.addText(d, { x: 6.4, y: y + 0.15, w: 6.0, h: 0.7, fontSize: 13, color: C.slate, valign: 'middle', fontFace: FONT });
    y += 1.13;
  }
  footer(s, 11);
}

// ---------- Slide 12: Ask / thank you ----------
{
  const s = slideBase(C.indigo);
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: 0.18, fill: { color: C.violet }, line: { type: 'none' } });
  logo(s, 0.6, 0.7, 1.6);
  s.addText('Let\'s pilot Jan Awaaz', { x: 0.6, y: 2.2, w: 12, h: 1, fontSize: 44, bold: true, color: C.white, fontFace: FONT });
  s.addText('Give one constituency\'s citizens a voice their MP can act on.', { x: 0.6, y: 3.3, w: 11.5, h: 0.6, fontSize: 18, color: 'DDE3FF', fontFace: FONT });
  bullets(s, [
    'Working URL: <your-vercel-url>',
    'GitHub: github.com/lalitsingh-ai/jan-awaaz',
    'Team: <names> · <contact email>',
  ], 0.6, 4.3, 9, 1.8, 16, 'EAEEFF');
  s.addText('Thank you', { x: 0.6, y: 6.3, w: 6, h: 0.5, fontSize: 16, italic: true, color: 'C7D0FF', fontFace: FONT });
  footer(s, 12);
}

await pptx.writeFile({ fileName: 'deck/Jan-Awaaz.pptx' });
console.log('OK wrote deck/Jan-Awaaz.pptx');
