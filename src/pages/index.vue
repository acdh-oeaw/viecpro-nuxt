<script lang="ts" setup>
import MainContent from "@/components/main-content.vue";
import { useI18n } from "@/composables/use-i18n";
import { type NuxtLinkProps } from "#app";
import { NuxtLink } from "#components";
import { computed, definePageMeta, useLocalePath } from "#imports";

const { t } = useI18n();
const localePath = useLocalePath();

type NavLink = {
	href: NuxtLinkProps["href"];
	label: string;
};

const links = computed(() => {
	return {
		home: { href: { path: localePath("/") }, label: t("pages.home.label") },
		search: { href: { path: localePath("/search") }, label: t("pages.search.label") },
		documentation: {
			href: { path: localePath("/documentation/project") },
			label: t("pages.documentation.label"),
		},
	} satisfies Record<string, NavLink>;
});

definePageMeta({
	title: "pages.home.title",
});
</script>

<template>
	<MainContent class="mb-4 flex flex-col gap-8 md:mb-8">
		<div class="flex flex-col gap-16 md:gap-32">
			<div>
				<div class="h-2 w-full bg-primary-800" />
				<NuxtImg
					placeholder
					src="/assets/images/background-court-ship.jpeg"
					alt=""
					class="min-h-[20rem] w-full object-cover"
				/>
				<div class="h-2 w-full bg-primary-400" />
			</div>
			<div
				class="mx-auto flex w-fit flex-col justify-center border-b-4 pb-4 text-center text-5xl text-primary-100 lg:flex-row"
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
		<div class="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-4 md:gap-16">
			<div class="mx-auto flex flex-col gap-8">
				<div class="flex flex-col gap-8">
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
					<div class="mx-auto text-center">
						<NuxtLink
							:href="links.search.href"
							class="inline-block rounded border bg-gray-300 px-4 py-2 font-sans uppercase text-gray-600 transition hover:bg-gray-400 hover:text-gray-800 active:bg-gray-500"
						>
							{{ links.search.label }}
						</NuxtLink>
					</div>
					<div>
						<p class="text-center text-xl font-black text-primary-100">
							Diese Datenbank befindet sich im Aufbau!
						</p>
					</div>
				</div>
				<div class="rounded-lg bg-gray-100 p-8">
					<h1 class="mb-2 text-left text-3xl font-bold text-primary-100">VieCPro</h1>
					<p>
						...ist ein
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
			<div class="flex flex-col gap-8">
				<div
					class="mx-auto grid justify-stretch gap-8 border-t-4 border-gray-200 pt-8 xl:grid-cols-2"
				>
					<div class="flex flex-col gap-4">
						<h1 class="inline-block align-baseline text-3xl font-black text-primary-100">
							Datenbank
						</h1>
						<p>
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
						<div class="w-full text-center xl:hidden">
							<NuxtLink
								:href="links.search.href"
								class="inline-block rounded border bg-gray-300 px-4 py-2 font-sans uppercase text-gray-600 transition hover:bg-gray-400 hover:text-gray-800 active:bg-gray-500"
							>
								{{ links.search.label }}
							</NuxtLink>
						</div>
					</div>
					<div class="flex flex-col gap-4">
						<h1 class="text-3xl font-black text-primary-100">Materialien und Dokumentation</h1>
						<p>
							Unsere Dokumentation und Materialien zur Benutzung der VieCPro-Datenbank reichen von
							einer Erklärung der APIS-Funktionalitäten über die Darlegung der
							Bearbeitungsrichtlinien bis hin zu diversen Verzeichnissen (Projektpublikationen,
							Hofstaatslisten, Abkürzungsverzeichnis).
							<strong>Der Inhalt befindet sich wie die Datenbank selber noch in Arbeit.</strong>
						</p>
						<div class="w-full text-center xl:hidden">
							<NuxtLink
								:href="links.documentation.href"
								class="inline-block rounded border bg-gray-300 px-4 py-2 font-sans uppercase text-gray-600 transition hover:bg-gray-400 hover:text-gray-800 active:bg-gray-500"
							>
								{{ links.documentation.label }}
							</NuxtLink>
						</div>
					</div>
				</div>
				<div
					class="mx-auto hidden w-full grid-cols-2 gap-8 border-b-4 border-gray-200 pb-4 xl:grid"
				>
					<NuxtLink
						:href="links.search.href"
						class="mx-auto block w-fit rounded bg-gray-300 px-4 py-2 font-sans uppercase text-gray-600 transition hover:bg-gray-400 hover:text-gray-800 active:bg-gray-500"
					>
						{{ links.search.label }}
					</NuxtLink>
					<NuxtLink
						:href="links.documentation.href"
						class="mx-auto block w-fit rounded bg-gray-300 px-4 py-2 font-sans uppercase text-gray-600 transition hover:bg-gray-400 hover:text-gray-800 active:bg-gray-500"
					>
						{{ links.documentation.label }}
					</NuxtLink>
				</div>
			</div>
			<div class="mx-auto">
				<div class="rounded-lg bg-gray-100 p-8">
					<h1 class="mb-2 text-3xl font-black text-primary-100">Kontaktaufnahme</h1>
					<p>
						...zum VieCPro-Team ist stets herzlich willkommen.
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
