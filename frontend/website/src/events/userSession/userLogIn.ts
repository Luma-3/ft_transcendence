import { renderPage } from '../../components/renderPage'
import { fetchApi } from '../../components/api/api';
import { User } from './userRegister';
import { API_ROUTES } from '../../components/api/routes';

export async function loginUser() {
    
    console.log('loginUser');
    const form = document.forms.namedItem("LoginForm") as HTMLFormElement | null;
    if (!form) {
        return;
    }

    const formData = new FormData(form);
    const userdata = Object.fromEntries(formData) as Record<string, string>;
    //requete verif username existe ou pas
    if (userdata.username === "")        { renderPage('login') } // TODO : redirection page d'erreur et/ou page de redirection (tenter de modifier le code style "you have been hacked")
    if (userdata.password === "")        { renderPage('login') }

    console.log('userdata', userdata);
    //requete vers backend
    const response = await fetchApi<User>(API_ROUTES.USERS.LOGIN,
            {method: "POST", credentials: "include", body: JSON.stringify(userdata)})
    
    console.log('response', response);
   
    // if not connected : refresh log page
    // if connected : go to home
    // if (data === null) {
    //     renderPage('login')
    // }
    // console.log('fin du post', data);
    // renderPage('home');
    // window.alert("username or password incorrect")
}