import { getUserInfo } from "../api/getter";
import { navbar } from "../components/ui/navbar";
import { fetchToken } from "../api/fetchToken";
import { alert } from "../components/ui/alert/alert";
import notFoundPage from "./4xx";
import { API_GAME } from "../api/routes";
import { User } from "../api/interfaces/User";

//TODO : Prevoir une variable pour le deuxieme joueur qui sera fetch dans le fonction principale
function setupGame(socket: WebSocket, user: User, gameData: any) {
	socket.send(JSON.stringify({
		type: "init",
		user1: user.username,
		user2: gameData.player2,
		gameType: gameData.gameType,
	}));

	
}

function drawGame(posUser1: number, posUSer2: number, ballX: number, ballY: number) {
	
	const game = document.getElementById("gamePong") as HTMLCanvasElement;
	const ctx = game.getContext("2d");
	
	if (!ctx) { return; }
	ctx.clearRect(0, 0, game.width, game.height);
	ctx.save();
	ctx.translate(game.width / 2, game.height / 2);

	//Raquette user left
	ctx.beginPath();
	ctx.rect(-game.width / 2 + 10, posUser1 - 20, 10, 40);
	ctx.fillStyle = "blue";
	ctx.fill();

	//Raquette user right
	ctx.restore();
	ctx.save();
	ctx.translate(game.width / 2, game.height / 2);
	ctx.beginPath();
	ctx.rect(game.width / 2 - 20, posUSer2 - 20, 10, 40);
	ctx.fillStyle = "red";
	ctx.fill();

	//BALL
	ctx.restore();
	ctx.save();
	ctx.translate(game.width / 2, game.height / 2);
	ctx.beginPath();
	ctx.arc(ballX, ballY, 2, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}

class Paddle {
	x: number;
	y: number;
	width: number;
	height: number;
	color: string;

	constructor(x: number, y: number, width: number, height: number, color: string) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
	}
}

let positionUser1 = 0;
let positionUser2 = 0;
let ballX = 0;
let ballY = 0;
let socket: WebSocket;


export default async function Game(gameData: any) {

	addEventListener('keypress', (event) => {})
	
	onkeydown = (event) => {
		
		const divGame = document.getElementById("hiddenGame") as HTMLDivElement;
		if (divGame.classList.contains("opacity-0")) {
			
			const startInfos = document.getElementById("startGameInfos") as HTMLDivElement;
			
			startInfos.classList.remove("opacity-100");
			startInfos.classList.add("opacity-0");
			
			setTimeout(() => {
				startInfos.classList.add("hidden");
				divGame.classList.remove("opacity-0");
				divGame.classList.add("opacity-100");
			}
			, 500);
			drawGame(positionUser1, positionUser2, ballX, ballY);
			return;
		}
		actionGame(event);
		sendActionGame(event);
		// if (event.key === "ArrowUp") {
		// 	positionUser1 -= 10;
		// } else if (event.key === "ArrowDown") {
		// 	positionUser1 += 10;
		// }
		drawGame(positionUser1, positionUser2, ballX, ballY);
	 }

	/**
	 * Verification que le joueur est bien connecté
	 */
	const token = await fetchToken();
	if (token.status === "error") {
		return notFoundPage();
	}

	const user = await getUserInfo();
	if (user.status === "error" || !user.data) {
		return notFoundPage();
	}

	/**
	 * Creation du websocket
	 * TODO : Mettre l'url dans un fichier de config
	 */
	const socket = new WebSocket(API_GAME);
	socket.addEventListener('error', (event) => {
		alert("WebSocket error: " + event, "error");
	})

	socket.addEventListener('open', () => setupGame(socket, user.data, gameData));
	
	socket.addEventListener('message', (event) => {
		const data = JSON.parse(event.data);
		updateGame(data);

	});

	// const gameServerInfo = await fetchAllDataGameInfo(user.data);
	// if (gameServerInfo.status === "error") {
	// 	alert("Error while fetching game info", "error");
	// 	return;
	// }
	

	/**
	 * Contenu HTML de la page
	 */
	return `
	${navbar(user.data)}
	<div class="flex flex-col justify-center items-center text-tertiary dark:text-dtertiary">
		
		<div id="startGameInfos" class="flex flex-col justify-center items-center pt-10
		animate-transition opacity-100 duration-500 ease-in-out">
			<div class="flex flex-row h-full w-full title-responsive-size justify-center  items-center
	 		space-x-4 pt-40">
				<div class="flex flex-col justify-center items-center">
					<img src="/images/pp.jpg" alt="logo" class="w-40 h-40 md:w-70 md:h-70 rounded-lg border-2
					mb-4
					border-primary dark:border-dprimary" />
					${gameData.player1}
				</div>
				<div class="flex flex-col justify-center items-center">
					VS
				</div>
				<div class="flex flex-col justify-center items-center">
					<img src="/images/500Logo.png" alt="logo" class="w-40 h-40 md:w-70 md:h-70 rounded-lg border-2
					mb-4 border-primary dark:border-dprimary" />
					${gameData.player2}
				</div>
			</div>

			<div class="flex flex-col text-responsive-size justify-center items-center pt-10">
				Press any key to start
			</div>
		</div>

		<div id="hiddenGame" class="flex flex-col justify-center items-center
		animate-transition opacity-0 duration-500 ease-out">
			<canvas id="gamePong" width="800" height="600" class="flex w-[800px] h-[600px] border-2 border-primary bg-zinc-400"></canvas>
			<div class="flex flex-col text-2xl p-4 justify-between items-center">
			Score
			</div>
			<div class="flex flex-row h-full w-full title-responsive-size justify-center items-center">
			<div id="user1Score" class="mx-2">
			0
			</div>
			-
			<div id="user2Score" class="mx-2">
			0
			</div>
			</div>
		</div>
	</div>`
}