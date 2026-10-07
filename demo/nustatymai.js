/* Svetainės nustatymai — bendri visiems puslapiams, taip pat gyvai scenai.

   pastas — el. pašto adresas susisiekimui, pvz. "vardas@pastas.lt".
   Kol tuščias, kontaktų forma, pašto eilutė ir mygtukai, kurie kviečia
   parašyti žinutę, nerodomi. Įrašius adresą čia, viskas atsiranda ir
   veikia visuose puslapiuose — daugiau nieko keisti nereikia.

   kainuApi — rinkos kainų Worker adresas, pvz.
   "https://aidas-kainos.vardas.workers.dev". Kol tuščias, kainos niekur
   nesiunčiamos ir forma „Nupirkai ar pardavei?“ nerodoma. */
window.AIDAS_NUSTATYMAI = {
  pastas: "",
  kainuApi: "https://aidas-kainos.marijustamulynas.workers.dev"
};
