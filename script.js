/* =========================================================
   Elevator pitch : la vidéo s'affiche seulement si le bon code est saisi.

   ⚠ Important : ce site est "statique" (aucun serveur). La vérification se
   fait donc dans le navigateur de la personne. Elle écarte les curieux, mais
   ne constitue pas une sécurité absolue : quelqu'un qui lit le code source de
   la page pourrait retrouver le lien de la vidéo. Pour qu'elle reste discrète,
   publie-la sur YouTube en mode « Non répertoriée » (jamais « Publique »).
   ========================================================= */

/* 1) LE LIEN DE TA VIDÉO
   YouTube : "https://www.youtube.com/embed/IDENTIFIANT_DE_LA_VIDEO"
   (l'identifiant est la suite de lettres après "v=" dans l'adresse de la vidéo) */
const VIDEO_URL = "https://www.youtube.com/embed/ID_DE_LA_VIDEO";

/* 2) L'EMPREINTE (hash) DE TON CODE
   On ne stocke jamais le code en clair, seulement son empreinte SHA-256.
   Code de démonstration actuel : demo2026
   Pour choisir ton propre code, ouvre Git Bash et tape (remplace monCode) :
       printf 'monCode' | sha256sum
   puis colle ici les 64 caractères obtenus à la place de ceux ci-dessous. */
const CODE_HASH = "43c27b4e263fa191a6a7ec198cd4d5b47d17413c49d77dc533a01720707e3202";

/* ---------------------------------------------------------
   Le reste du fichier n'a pas besoin d'être modifié
   --------------------------------------------------------- */
const formulaire = document.getElementById("pitch-form");
const champCode = document.getElementById("pitch-code");
const message = document.getElementById("pitch-message");
const zoneVideo = document.getElementById("pitch-video");
const cadreVideo = document.getElementById("pitch-frame");

/* Transforme un texte en empreinte SHA-256 (64 caractères hexadécimaux) */
async function empreinte(texte) {
  const octets = new TextEncoder().encode(texte);
  const resultat = await crypto.subtle.digest("SHA-256", octets);
  return Array.from(new Uint8Array(resultat))
    .map((octet) => octet.toString(16).padStart(2, "0"))
    .join("");
}

if (formulaire) {
  formulaire.addEventListener("submit", async (evenement) => {
    evenement.preventDefault();              // empêche le rechargement de la page

    const saisie = champCode.value.trim();   // le code tapé, sans espaces autour
    const hashSaisie = await empreinte(saisie);

    if (hashSaisie !== CODE_HASH) {
      message.textContent = "Code incorrect. Vérifie-le et réessaie.";
      message.className = "pitch-message erreur";
      return;
    }

    if (VIDEO_URL.includes("ID_DE_LA_VIDEO")) {
      message.textContent = "Code correct, mais la vidéo n'a pas encore été ajoutée.";
      message.className = "pitch-message ok";
      return;
    }

    cadreVideo.src = VIDEO_URL;              // on charge la vidéo seulement maintenant
    zoneVideo.hidden = false;                // on affiche le lecteur
    message.textContent = "Code correct, bon visionnage !";
    message.className = "pitch-message ok";
  });
}