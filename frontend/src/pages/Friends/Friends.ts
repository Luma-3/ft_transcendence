import { backButton } from "../../components/ui/buttons/backButton";
import { navbar } from "../../components/ui/navbar";
import { IUserInfo } from "../../interfaces/IUser";
import { allUsersList } from "./allUsersList";
import { blockList } from "./blockList";
import { friendsList } from "./friendsList";
import { notificationList } from "./notificationsList";

async function renderFriendsPage(user: IUserInfo) {
return `
${navbar(user)}
${backButton()}


<div class="flex flex-col justify-center items-center p-6 min-h-screen font-title">

	<div class="grid grid-cols-2 lg:grid-cols-2 gap-8 w-full max-w-[1000px] mb-8">


	<!-- Section Pending Operations -->
	<div class="w-full max-w-[1000px] ">
		<div class="bg-white/20 rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
			<div class="bg-gradient-to-r from-yellow-500 to-orange-400 p-6 text-white">
				<div class="flex items-center justify-center space-x-3">
					<div class="bg-white/20 rounded-full p-2">
						<img src="/images/duckWaiting.png" alt="Duck Notifications" class="w-20 h-20 invert" />
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold" translate="pending-operations">Opérations en Attente</div>
						<div class="text-yellow-100 text-sm" translate="manage-your-invitations">Gérez vos invitations</div>
					</div>
				</div>
			</div>
			<div id="notifications-div" class="p-6">
				${await notificationList(user)}
			</div>
		</div>
	</div>
		
		<!-- Section Friends -->
		<div class="bg-white/20 rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
			<div class="bg-gradient-to-r from-dprimary to-gray-400 p-6 text-white">
				<div class="flex items-center space-x-3">
					<div class="bg-white/20 rounded-full p-2">

						<img src="/images/duckSocial.png" alt="Duck Friends" class="w-20 h-20 invert" />

					</div>
					<div>
						<div class="text-2xl font-bold" translate="my-friends">My Friends</div>
						<div class="text-green-100 text-sm" translate="see-all-my-friends">Look at your friends</div>
					</div>
				</div>
			</div>
			<div id="friends-div" class="p-6">
				${await friendsList()}
			</div>
		</div>

		<!-- Section All Users -->
		<div class="bg-white/20 rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
			<div class="bg-gradient-to-r from-dsecondary to-gray-400 p-6 text-white">
				<div class="flex items-center space-x-3">
					<div class="bg-white/20 rounded-full p-2">
						<img src="/images/duckCrowd.png" alt="Duck Friends" class="w-20 h-20 invert" />
					</div>
					<div>
						<div class="text-2xl font-bold" translate="all-users">All Users</div>
						<div class="text-blue-100 text-sm" translate="discover-new-friends">Discover New Friends</div>
					</div>
				</div>
			</div>
			<div id="all-users-div" class="p-6">
				${await allUsersList()}
			</div>
		</div>



	<!-- Section Block List (pleine largeur) -->
		<div class="bg-white/20 rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
			<div class="bg-gradient-to-r from-dprimary to-dsecondary p-6 text-white">
				<div class="flex items-center justify-center space-x-3">
					<div class="bg-white/20 rounded-full p-2">
						<img src="/images/duckPolice.png" alt="Duck Friends" class="w-20 h-20 invert" />
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold" translate="blocked-users">Utilisateurs Bloqués</div>
						<div class="text-red-100 text-sm" translate="manage-your-block-list">Gérez votre liste de blocage</div>
					</div>
				</div>
			</div>
			<div id="block-div" class="p-6">
				${await blockList()}
			</div>
		</div>

	<!-- Spacer -->
	<div class="h-20"></div>

</div>`
	}

export default function friends(user: IUserInfo) {
	const container = renderFriendsPage(user);
	return container;
}

	// <div class="flex flex-col w-full max-w-[1000px] items-center justify-center pt-5">

	// 	<img src="/images/duckBell.png" alt="Duck Bell" class="w-20 h-20" />
	// 	${await notifications()}

	// </div>
