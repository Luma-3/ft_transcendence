import { User } from '../api/interfaces/User';

export default function welcomeYouPage(user: User) {
    const name = user?.username ? `, ${user.username}` : '';
    return `
    <div id="welcome-transition"
        class="flex flex-col h-screen w-screen font-title items-center justify-center text-white text-6xl transition-opacity duration-1000 opacity-0">
        <img src="/images/WelcomeLogo.png" alt="Bienvenue" class="w-40 mb-8 drop-shadow-lg" />
        <div translate="welcome">Welcome!</div>
        <div> ${name} </div>
    </div>
    `;
}

export function reWelcomeYouPage(user: User) {
    const name = ' ' + user?.username;
    return `
    <div id="welcome-transition"
        class="flex flex-col h-screen w-screen font-title items-center justify-center text-white text-2xl transition-opacity duration-1000 opacity-0">
        <img src="/images/welcome.gif" alt="Bienvenue" class="flex w-40 h-40 rounded-md" />
        <div class="flex flex-col justify-center items-center p-4">Content de te revoir</div>
        <div> ${name} </div>
    </div>
    `;
}

export function handleWelcomeYouPage() {

    const welcome = document.getElementById('welcome-transition');
    if (welcome) {
        setTimeout(() => { welcome.style.opacity = '1'; }, 100);
        setTimeout(() => { welcome.style.opacity = '0'; }, 2200);
    }
}
