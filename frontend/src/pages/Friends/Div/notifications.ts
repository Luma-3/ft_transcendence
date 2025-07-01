export function notifications() {
return `
<div class="w-full max-w-[1000px] ">
	<div class="bg-white/20 rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl">
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
				${searchBar("search-notifications", "Search for a specific notification")}
				<div id="notifications-div" class="p-6">
					${await notificationList(user)}
				</div>
			</div>
		</div>`
}