import { getUserInfo } from "../api/getter";
import { navbar } from "../components/ui/navbar";
import { fetchToken } from "../api/fetchToken";
import { alert } from "../components/ui/alert/alert";
import notFoundPage from "./4xx";
import { User } from "../api/interfaces/User";

//TODO : Prevoir une variable pour le deuxieme joueur qui sera fetch dans le fonction principale
function setupGame(socket: WebSocket, user: User) {
	socket.send(JSON.stringify({
		user1: user.username,
		user2: "JEanMIchMIch",
	}));
	
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


addEventListener('keypress', (event) => {})

onkeydown = (event) => {
	const divGame = document.getElementById("hiddenGame") as HTMLDivElement;
	if (divGame.classList.contains("opacity-0")) {
		const startInfos = document.getElementById("startGameInfos") as HTMLDivElement;
		startInfos.classList.remove("opacity-100");
		startInfos.classList.add("opacity-0");
		setTimeout(() => {
			startInfos.classList.add("hidden");
			divGame.classList.add("opacity-100");
		}
		, 500);
		
	}
	const game = document.getElementById("gamePong") as HTMLCanvasElement;
	const ctx = game.getContext("2d");
	if (!ctx) { return; }
	
	//Modification des coordonnees du canvas pour placer le (0, 0) au centre
	ctx.clearRect(0, 0, game.width, game.height);
	ctx.save();
	ctx.translate(game.width / 2, game.height / 2);
	console.log("game width : ", game.width);
	
	//Raquette user left
	ctx.beginPath();
	ctx.rect(-game.width / 2 + 10, positionUser1 - 20, 10, 40);
	ctx.fillStyle = "blue";
	ctx.fill();
	
	//POur mettre de la couleur sans changer tout les elements par la duite
	//Du coup je fais un save et restore et un translate
	ctx.restore();
	ctx.save();
	ctx.translate(game.width / 2, game.height / 2);

	//Raquette user right
	ctx.beginPath();
	ctx.rect(game.width / 2 - 20, positionUser2 - 20, 10, 40);
	ctx.fillStyle = "red";
	ctx.fill();
	ctx.restore();
	ctx.save();
	ctx.translate(game.width / 2, game.height / 2);

	//BALL
	ctx.beginPath();
	ctx.arc(ballX, ballY, 2, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
 }

export default async function Game() {

	const token = await fetchToken();
	if (token.status === "error") {
		return notFoundPage();
	}

	const user = await getUserInfo();
	if (user.status === "error" || !user.data) {
		return notFoundPage();
	}

	const socket = new WebSocket("http://localhost:3000/api/game/");
	socket.addEventListener('error', (event) => {
		alert("WebSocket error: " + event, "error");
	})

	socket.addEventListener('open', () => setupGame(socket, user.data));
	
	socket.addEventListener('message', (event) => {
		console.log("message: ", event);
		const data = JSON.parse(event.data);
		const game = document.getElementById("gamePong") as HTMLCanvasElement;
		const ctx = game.getContext("2d");
		ctx?.beginPath();
		ctx?.arc(data.ballX, data.ballY, 2, 0, Math.PI);
		ctx?.fill();

	});

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
					${user.data.username}
				</div>
				<div class="flex flex-col justify-center items-center">
					VS
				</div>
				<div class="flex flex-col justify-center items-center">
					<img src="/images/500Logo.png" alt="logo" class="w-40 h-40 md:w-70 md:h-70 rounded-lg border-2
					mb-4 border-primary dark:border-dprimary" />
					${"JEanMIchMIch"}
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