import { renderPage } from './components/renderPage'
import { addAllEventListenOnPage } from './events/Handler'
// import { initGoogleClient } from './components/Google'
import { fadeIn } from './components/utils/fade'
import { GoogleButton } from './components/Google'

const main_container = document.querySelector<HTMLDivElement>('#app')!

export function addToHistory(page: string, updateHistory: boolean = true) {
    localStorage.setItem('current_page', page)
    if (updateHistory && page !== history.state?.page) {
        history.pushState({ page }, '', `/${page}`)
    }
}

addAllEventListenOnPage(main_container);

// * Au chargement initial ou refresh de la page
// * On initialise le client Google
// * On affiche la page courante ou la page d'accueil par défaut avec un leger delai
document.addEventListener('DOMContentLoaded', () => {
    
    const page =  window.location.pathname.substring(1) || 'home'
    
    // initGoogleClient();

    renderPage(page, false)
    
    setTimeout(() => {
        fadeIn(main_container)
    }, 1900);
});

// * Au changement de page lors de l'utilisation du bouton back/forward
window.addEventListener('popstate', (event) => { 
    console.log('popstate')
    const page = event.state?.page || 'home'
    renderPage(page, false)
});