# BuroFlinc AI Blogagent — Deploy instructies
## Resultaat: https://blogagent.buroflinc.nl

---

## Stap 1 — Zet de code op GitHub

1. Ga naar github.com → klik **New repository**
2. Naam: `buroflinc-blogagent` → klik **Create repository**
3. Upload de inhoud van deze map naar de repo
   (aanbevolen: gebruik GitHub Desktop — gratis te downloaden)

---

## Stap 2 — Deploy naar Vercel

1. Ga naar vercel.com → log in met je GitHub-account
2. Klik **Add New Project** → selecteer `buroflinc-blogagent`
3. Klik **Deploy** — Vercel herkent Next.js automatisch

---

## Stap 3 — Environment variables instellen

Ga in Vercel naar **Settings → Environment Variables** en voeg toe:

| Name                | Value                                   |
|---------------------|-----------------------------------------|
| ANTHROPIC_API_KEY   | sk-ant-... (jouw Anthropic sleutel)     |
| ACCESS_PASSWORD     | kies een wachtwoord (bv. buroflinc2025) |
| ACCESS_TOKEN        | willekeurige string (bv. bf_tok_x8k2m)  |

Klik **Save** → ga naar **Deployments → Redeploy**

---

## Stap 4 — Eigen domein koppelen

### In Vercel:
1. Ga naar je project → **Settings → Domains**
2. Voer in: `blogagent.buroflinc.nl`
3. Vercel toont een CNAME-record:
   - Name: `blogagent`
   - Value: `cname.vercel-dns.com`

### Bij je DNS-provider (TransIP / Yourhosting / etc.):
1. Log in → ga naar DNS-beheer van buroflinc.nl
2. Voeg toe: Type `CNAME` · Naam `blogagent` · Waarde `cname.vercel-dns.com`
3. Sla op — actief binnen 10–30 minuten

Vercel verifieert automatisch en maakt een SSL-certificaat aan.

---

## Stap 5 — Klaar

**URL:** https://blogagent.buroflinc.nl
**Wachtwoord:** wat je ingesteld hebt bij ACCESS_PASSWORD

Stuur de URL + wachtwoord naar Tom en teamleden.
Cookie blijft 30 dagen actief per browser.

---

## Kosten
- Vercel: gratis
- Anthropic API: ~€0,03 per interview
- Domein: al in bezit

## Wachtwoord wijzigen
Vercel → Settings → Environment Variables → wijzig ACCESS_PASSWORD → Redeploy.

## Wat je nodig hebt
- GitHub-account (gratis): github.com
- Vercel-account (gratis): vercel.com
- Anthropic API-sleutel: console.anthropic.com

---

## Stap 1 — Zet de code op GitHub

1. Ga naar github.com → klik **New repository**
2. Naam: `buroflinc-blogagent` → klik **Create repository**
3. Upload alle bestanden uit deze map:
   - Sleep de map naar het GitHub-uploadscherm, of
   - Gebruik GitHub Desktop (aanbevolen, gratis te downloaden)

---

## Stap 2 — Deploy naar Vercel

1. Ga naar vercel.com → log in met je GitHub-account
2. Klik **Add New Project**
3. Selecteer je `buroflinc-blogagent` repository
4. Klik **Deploy** (Vercel detecteert Next.js automatisch)

---

## Stap 3 — API-sleutel instellen

1. Na de deploy: ga naar je project in Vercel
2. Klik **Settings → Environment Variables**
3. Voeg toe:
   - Name: `ANTHROPIC_API_KEY`
   - Value: jouw sleutel (begint met `sk-ant-...`)
4. Klik **Save**
5. Ga naar **Deployments → Redeploy** (nodig om de variabele actief te maken)

---

## Stap 4 — Klaar

Vercel geeft je een URL zoals:
`https://buroflinc-blogagent.vercel.app`

Die link stuur je naar Tom, collega's of klanten. Geen installatie, geen account.

---

## Kosten

- Vercel: gratis voor dit gebruik
- Anthropic API: ~€0.02–0.05 per volledig interview (Sonnet 4)
- Bij 20 blogs per maand: < €1

---

## Eigen domein (optioneel)

In Vercel → Settings → Domains kun je een eigen domein koppelen,
bv. `blogagent.buroflinc.nl`

---

## Problemen?

- **Build faalt**: controleer of alle bestanden correct geüpload zijn
- **"Internal Server Error"**: controleer de ANTHROPIC_API_KEY in Vercel
- **Lege chat**: herlaad de pagina
