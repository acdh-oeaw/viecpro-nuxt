<script lang="ts" setup>
import MainContent from "@/components/main-content.vue";
import { useI18n } from "@/composables/use-i18n";
import { computed, definePageMeta, useRouter } from "#imports";

const { locale, t } = useI18n();
const router = useRouter();

const prefixedRoute = computed(() => {
	return `/${locale.value}/`;
});

definePageMeta({
	title: t("pages.home.title"),
});
</script>

<template>
	<MainContent>
		<div class="flex flex-col">
			<div class="h-2 w-full bg-primary-800" />
			<img src="/assets/images/background-court-ship.jpeg" alt="" class="w-full" />
			<div class="h-2 w-full bg-primary-400" />
			<div
				class="mx-auto mt-40 flex w-fit flex-col justify-center border-b-4 pb-4 text-center text-5xl text-primary-100 lg:flex-row"
			>
				<p class="font-black">
					Der Wiener Hof
					<span class="hidden pr-2 lg:inline-block">.</span>
				</p>
				<p class="pt-4 font-sans text-3xl font-extralight lg:pt-0 lg:text-5xl">
					Ein prosopographisches Portal
				</p>
			</div>
		</div>
		<div class="mb-60 min-h-screen">
			<div class="mx-auto mt-20 max-w-[32rem] flex-col lg:max-w-[50rem]">
				<div class="mb-10">
					<p>
						VieCPro liefert erstmals
						<strong>tausende prosopographische Profile</strong>
						für die überwiegende
						<strong>Mehrheit des Wiener Hofpersonals</strong>
						. Gegenwärtig ermöglicht die Datenbank die Recherche des Personals beiderlei Geschlechts
						wie auch verschiedener sozialer Schichten des Wiener Haupthofstaats von
						<strong>
							neun Kaisern und der Teilhofstaate von 14 Kaiserinnen, sechs Kaiserinwitwen, 70
							Erzherzögen und Erzherzoginnen und weiterer Familienmitglieder
						</strong>
						von der Mitte des 17. Jahrhunderts bis zum Ende des 18. Jahrhunderts.
					</p>
					<p>
						Für die
						<strong>leopoldinische Zeit</strong>
						umfasst der Personenbestand darüber hinaus erstens zahlreiche Funktionsträger:innen, die
						am Wiener Hof politisch-administrative Aufgaben und eine ökonomisch-kulturelle Rolle
						erfüllt haben, zweitens Personen an ausländischen Höfen, die von der Wiener Hofkammer
						Zahlungen erhalten haben, und drittens in einem verwandtschaftlichen Verhältnis zu
						Funktionsträger*innen standen.
					</p>
					<div class="mx-auto mb-10 text-center">
						<button
							class="mt-10 rounded bg-gray-300 px-4 py-2 font-sans uppercase text-gray-600 hover:bg-gray-400 hover:text-gray-800"
							@click="router.push(prefixedRoute + 'search')"
						>
							Zur Datenbank
						</button>
					</div>
					<div>
						<p class="mb-10 mt-4 text-center text-xl font-black text-primary-100">
							Diese Datenbank befindet sich im Aufbau!
						</p>
					</div>
				</div>
				<div class="mt-10 rounded-lg bg-gray-100 p-8">
					<h1 class="text-left text-3xl font-bold text-primary-100">VieCPro</h1>
					<p class="mt-2">
						... ist ein
						<strong>Gemeinschaftsprodukt zweier Forschungsteams</strong>
						<span>, die vom</span>
						<a href="https://www.oeaw.ac.at/foerderungen/innovationsfonds">ÖAW-Innovationsfonds</a>
						(09/2020–03/2023) und dem Wissenschaftsfonds
						<a href="https://www.fwf.ac.at/de/)">FWF</a>
						(09/2020–06/2024) in
						<strong>einer ersten Pilotphase</strong>
						gefördert wurde.
					</p>
				</div>
			</div>
			<div
				class="mx-auto mt-32 flex max-w-[80rem] flex-col items-center border-t-4 border-gray-200 pt-10 xl:flex-row xl:justify-between xl:space-x-20"
			>
				<div>
					<h1 class="my-8 text-3xl font-black text-primary-100">Datenbank</h1>
					<p class="w-[35rem]">
						Die Datenbank beinhaltet die prosopographischen Datensammlungen zweier abgeschlossener
						FWF-Projekte zum Wiener Hof von Kaiser Leopold I. (1657–1705) bis Leopold II.
						(1790–1792). Diese Sammlungen werden durch eine
						<strong>Datenneuaufnahme</strong>
						für die Hofgesellschaft unter Kaiser Franz II./I. (1792–1835) erweitert. In seiner
						technischen Umsetzung setzt das Team auf die am ACDH-CH der ÖAW entwickelte virtuelle
						Forschungsumgebung
						<strong>Austrian Prosopographical Information System</strong>
						(APIS).
					</p>
					<div class="mb-20 w-full text-center xl:hidden">
						<button
							class="mt-14 rounded bg-gray-300 px-4 py-2 font-sans uppercase text-gray-600 hover:bg-gray-400 hover:text-gray-800"
							@click="router.push(prefixedRoute + 'search')"
						>
							Database
						</button>
					</div>
				</div>
				<div>
					<h1 class="my-8 text-3xl font-black text-primary-100">Materialien und Dokumentation</h1>
					<p class="w-[35rem]">
						Unsere Dokumentation und Materialien zur Benutzung der VieCPro-Datenbank reichen von
						einer Erklärung der APIS-Funktionalitäten über die Darlegung der Bearbeitungsrichtlinien
						bis hin zu diversen Verzeichnissen (Projektpublikationen, Hofstaatslisten,
						Abkürzungsverzeichnis).
						<strong>Der Inhalt befindet sich wie die Datenbank selber noch in Arbeit</strong>
						.
					</p>
					<div class="w-full text-center xl:hidden">
						<button
							class="mt-14 rounded bg-gray-300 px-4 py-2 font-sans uppercase text-gray-600 hover:bg-gray-400 hover:text-gray-800"
							@click="router.push(prefixedRoute + 'documentation')"
						>
							Zur Dokumentation
						</button>
					</div>
				</div>
			</div>
			<div
				class="mx-auto mt-10 hidden max-w-[80rem] justify-between space-x-20 border-b-4 border-gray-200 pb-24 pl-20 pr-80 xl:flex"
			>
				<button
					class="mt-10 rounded bg-gray-300 px-4 py-2 font-sans uppercase text-gray-600 hover:bg-gray-400 hover:text-gray-800"
					@click="router.push(prefixedRoute + 'search')"
				>
					Database
				</button>
				<button
					class="mt-10 rounded bg-gray-300 px-4 py-2 font-sans uppercase text-gray-600 hover:bg-gray-400 hover:text-gray-800"
					@click="router.push(prefixedRoute + 'documentation')"
				>
					Zur Dokumentation
				</button>
			</div>
			<div class="mx-auto mt-28 max-w-[50rem]">
				<div class="rounded-lg bg-gray-100 p-8">
					<h1 class="mb-8 text-3xl font-black text-primary-100">Kontaktaufnahme</h1>
					<p>
						... zum VieCPro-Team ist stets herzlich willkommen.
						<strong>Die Datenbank befindet sich im Aufbau</strong>
						. Wir freuen uns über Ihre sachdienlichen Hinweise und Ergänzungsvorschläge. Falls Sie
						eine Idee für Anschlussprojekte haben oder an einer Kooperation interessiert sind, dann
						schreiben Sie uns an:
						<a href="mailto:viecpro@oeaw.ac.at">viecpro@oeaw.ac.at</a>
						.
					</p>
				</div>
			</div>
		</div>
	</MainContent>
</template>
