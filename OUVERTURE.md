# Checklist d'ouverture de PixelDoc

Tant que PixelDoc n'est pas ouvert, le site est en mode « ouverture prochaine » : bandeau, formulaire désactivé, textes au futur/conditionnel, site non indexable. Chaque élément à annuler est marqué dans le code par le commentaire **« À RETIRER À L'OUVERTURE »** (`grep -rn "RETIRER À L'OUVERTURE" .`).

## 1. Retirer le mode « ouverture prochaine »
- [ ] **Bandeau** : supprimer le bloc `<div class="soon-banner">` (juste après le lien d'évitement) dans `index.html`, `contact.html`, `mentions-legales.html`, `404.html`, et les règles `.soon-*` en fin de `style.css`.
- [ ] **Bouton d'en-tête** « Ouverture prochaine » (`.nav-cta`, toutes les pages) → remettre « Devis gratuit » vers `contact.html#devis` (`#contact` sur l'accueil).
- [ ] **Textes au futur / conditionnel** à remettre au présent (accueil) : héros (badges, intro, étiquette « Ouverture prochaine », statistiques, mention « exemple illustratif »), services (« Services prévus », « Prévu à partir de »), tarifs (« Tarifs prévisionnels », « Prévu offert… »), catalogue (« Futur catalogue », « Prix indicatif prévu », « Bientôt »), bloc tests/garantie, vidéos (« Vidéos prévues »), FAQ (questions et réponses), pied de page (« Projet d'atelier… »). Reprendre aussi les mêmes textes dans le JSON-LD de `index.html` (descriptions, FAQPage, nom du catalogue). **Vérifier chaque prix, délai et garantie avant de les affirmer.**
- [ ] **Avertissement « Projet de document »** ajouté aux fenêtres CGV / Garantie / RGPD (fonction `openLegalModal` dans `index.html`) et sur `mentions-legales.html` (`.lm-warn`, « Activités prévues ») : à retirer une fois les documents finalisés.
- [ ] **Boutons « Bientôt »** du catalogue → remettre un lien « Me renseigner » vers le formulaire (ou retirer les machines non disponibles).

## 2. Remettre les éléments de conversion
- [ ] **Formulaire de devis** : le formulaire Netlify a été retiré (pas de collecte). Le restaurer depuis l'historique git (branche `amelioration-vitrine`, fichiers `index.html` et `contact.html` : bloc `<form name="devis" data-netlify="true" netlify-honeypot="bot-field">` + fonction JS `submitForm`), puis retirer les blocs `.soon-box`. **Ne le réactiver qu'après avoir complété mentions légales et RGPD.** Attention : Netlify Forms ne fonctionne pas sur GitHub Pages (voir « Hébergement »).
- [ ] **Appels à l'action** retirés : bandeau mobile Appeler / WhatsApp / Devis (`.cta-bar`), bouton WhatsApp flottant (`.wa-float`), boutons Appeler / WhatsApp du héros, cartes téléphone / WhatsApp / e-mail / atelier de la page Contact. Les restaurer depuis la branche `amelioration-vitrine`.
- [ ] Ajouter le champ **horaires** (voir §4) : `openingHoursSpecification` du JSON-LD a été retiré de `index.html`, ainsi que `telephone` et `email` du JSON-LD.

## 3. Autoriser l'indexation
- [ ] `<meta name="robots" content="noindex, nofollow">` : le retirer de `index.html`, `contact.html`, `mentions-legales.html` (**conserver `noindex` sur `404.html`**).
- [ ] `netlify.toml` : supprimer l'en-tête `X-Robots-Tag = "noindex, nofollow"` (ignoré si le site est servi par GitHub Pages ; le meta robots reste alors la seule protection).
- [ ] `robots.txt` : remplacer `Disallow: /` par `Allow: /` et rétablir `Sitemap: https://pixeldoc-974.netlify.app/sitemap.xml`.
- [ ] `sitemap.xml` : retirer le commentaire d'en-tête, mettre à jour les `lastmod`.
- [ ] Soumettre le sitemap dans Google Search Console ; créer / vérifier la fiche Google Business Profile.
- Note : avec `Disallow: /`, les robots ne lisent pas la balise `noindex`. Aucun risque tant que le site est fermé, mais à l'ouverture, ne retirer que **tous** ces blocages ensemble.

## 4. Compléter les informations légales (obligatoire avant ouverture)
- [ ] **SIRET** (immatriculation en cours) : mentions légales (`mentions-legales.html`), pied de page de toutes les pages.
- [ ] **Adresse postale complète** du professionnel (mentions légales, RGPD, CGV).
- [ ] **N° Répertoire des métiers / RCS** si l'activité est artisanale / commerciale.
- [ ] **Horaires d'ouverture** réels : contact, FAQ, JSON-LD.
- [ ] **Assurance responsabilité civile professionnelle** : nom et coordonnées de l'assureur, couverture géographique (à afficher dans les mentions légales et les CGV).
- [ ] **Médiateur de la consommation** : nom, adresse, site web (obligatoire pour la vente aux consommateurs).
- [ ] **Hébergeur** : confirmer Netlify ou GitHub Pages et adapter les mentions légales, les URL canoniques, le sitemap et les balises Open Graph.
- [ ] **CGV, garantie, RGPD** : relire et valider chaque engagement (acompte, délais, garanties de 3 / 6 mois, pénalités, durées de conservation) avant publication.
- [ ] Vérifier la conformité du formulaire (information RGPD, base légale, durée de conservation) avant de le réactiver.
- [ ] Vérifier le contrôle quotidien `.github/workflows/verifier-sites.yml` (titres « PixelDoc — Réparation PC… ») : inchangé.
