import { fetchApi } from "../../api/fetch";
import { fetchToken } from "../../api/fetchToken";
import { getUserInfo } from "../../api/getterUser(s)";
import { API_USER } from "../../api/routes";
// import { API_PEOPLE } from "../api/routes";
import { alertTemporary } from "../../components/ui/alert/alertTemporary";
import { allUsersList } from "../../pages/Profile/allUsersList";
import { friendsList } from "../../pages/Profile/friendsList";
import { blockList } from "../../pages/Profile/blockList";
import { renderErrorPage } from "../../controllers/renderPage";


