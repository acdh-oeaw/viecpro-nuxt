<template>
	<Transition
		enter-active-class="transition duration-100 ease-out"
		enter-from-class="transform scale-95 -translate-y-8 opacity-0"
		enter-to-class="transform scale-100 translate-y-0 opacity-100"
		leave-active-class="transition duration-75 ease-in"
		leave-from-class="transform scale-100 opacity-100"
		leave-to-class="transform scale-95 opacity-0"
	>
		<slot />
	</Transition>
</template>
