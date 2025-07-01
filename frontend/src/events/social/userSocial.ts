import { fetchApi } from "../../api/fetch";
import { fetchToken } from "../../api/fetchToken";
import { getUserInfo } from "../../api/getterUser(s)";
import { API_USER } from "../../api/routes";
// import { API_PEOPLE } from "../api/routes";
import { alertTemporary } from "../../components/ui/alert/alertTemporary";
import { allUsersList } from "../../pages/Friends/Lists/allUsersList";
import { friendsList } from "../../pages/Friends/Lists/friendsList";
import { blockList } from "../../pages/Friends/Lists/blockList";
import { renderErrorPage } from "../../controllers/renderPage";


