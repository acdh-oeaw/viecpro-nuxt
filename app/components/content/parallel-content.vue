<template>
	<div class="flex flex-col gap-8">
		<div class="mx-auto grid justify-stretch gap-8 xl:grid-cols-2">
			<div class="flex flex-col gap-4">
				<slot name="left-content" />
				<div class="w-full text-center xl:hidden">
					<slot name="left-button" />
				</div>
			</div>
			<div class="flex flex-col gap-4">
				<slot name="right-content" />
				<div class="w-full text-center xl:hidden">
					<slot name="right-button" />
				</div>
			</div>
		</div>
		<div class="mx-auto hidden w-full grid-cols-2 gap-8 xl:grid">
			<slot name="left-button" />
			<slot name="right-button" />
		</div>
	</div>
</template>
