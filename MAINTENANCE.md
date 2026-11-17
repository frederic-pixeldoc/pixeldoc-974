# Maintenance de la vitrine PixelDoc (pré-ouverture)

## Où est la vérité
- **Production** : projet Netlify `pixeldoc-974`, publié **à la main** (CLI) ; builds GitHub suspendus par `[build] ignore = "exit 0"` dans `netlify.toml` : **ne pas retirer ce bloc sans décision de F.**
- **Dépôt** : ce dépôt contient les fichiers publiés (`index.html`, `site.js`, `donnees-site.js`, `robots.txt`, `sitemap.xml`, `netlify.toml`). `index.html` et `donnees-site.js` sont **générés** à partir de `config-site.json` / `tarifs.json` de la candidate (Bureau de F., `PIXELDOC-CANDIDATE`) : ne pas les éditer à la main.
- **Copie GitHub Pages** (`frederic-pixeldoc.github.io/pixeldoc-974`) : sert le même contenu ; la balise canonique de `index.html` pointe vers Netlify. `contact.html` redirige vers la section Contact de l'accueil ; `mentions-legales.html` affiche les mentions légales (même texte que la fenêtre « Mentions légales » de l'accueil : à garder synchronisé).

## Publier (GO de F. requis)
1. Régénérer et tester dans la candidate (`node vitrine/appliquer-tarifs.js`, `node test_vitrine.js`).
2. Publier depuis `production-paquet` (script `DEPLOYER-PRODUCTION.sh`, jamais depuis `apercu-paquet` qui est en `noindex`).
3. Reporter les mêmes fichiers dans ce dépôt (pull request, relue par F.).
4. Vérifier : « Ouverture prochainement » affiché, pas de « Atelier ouvert », pas de `noindex`, formulaire `devis` détecté (15 champs), onglet Spam du formulaire.

## Retour arrière
Netlify → `pixeldoc-974` → Deploys → choisir le déploiement précédent (avant la candidate : `6ac71d70a38ee50007f2586b` ; candidate publiée le 17/11 : `6afbda9594cee4487226923b`) → « Publish deploy ». Aucun DNS.

## Contrôle quotidien
Le workflow `Vérifier les sites PixelDoc` contrôle chaque jour les cinq adresses PixelDoc, les fichiers de la vitrine, l'absence de `noindex` et d'« Atelier ouvert ».
