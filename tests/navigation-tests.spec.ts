import { expect, test } from "@playwright/test";

test("Switch locale", async ({ page }) => {
	await page.goto("http://localhost:3000/de");
	await page.getByTestId("localeButton").click();
	await page.getByRole("option", { name: "EN" }).click();

	await expect(page).toHaveTitle("Home - VieCPro");
	await expect(page).toHaveURL("http://localhost:3000/en");

	await page.getByTestId("localeButton").click();
	await page.getByRole("option", { name: "DE" }).click();

	await expect(page).toHaveTitle("Startseite - VieCPro");
	await expect(page).toHaveURL("http://localhost:3000/de");
});

test("Searchinterface navigation", async ({ page }) => {
	await page.goto("http://localhost:3000/de/search/persons");
	await page.getByTestId("nextPage").first().click();

	await expect(page).toHaveURL(/.*page=2/);

	await page.getByTestId("prevPage").first().click();
	await expect(page).toHaveURL(/.*page=1/);

	await page.getByTestId("facetInput").first().click();
	await expect(page).toHaveURL(/.*&facets=.*/);

	await page.getByLabel("Suche...", { exact: true }).fill("test");
	await expect(page).toHaveURL(/.*&q=test/);

	await page.getByRole("button", { name: "Delete Input" }).click();
	await expect(page.getByLabel("Suche...", { exact: true })).toContainText("");

	await page.getByRole("link", { name: "Referenzen" }).click();
	await expect(page).toHaveURL("http://localhost:3000/de/search/references");

	await page.getByRole("button", { name: "Filter verstecken..." }).click();
	await expect(page).toHaveURL("http://localhost:3000/de/search/references");
});

test("Documentation", async ({ page }) => {
	await page.goto("http://localhost:3000/de");
	await page.getByLabel("Haupt").getByRole("link", { name: "Dokumentation" }).click();

	await expect(page).toHaveURL(/.*documentation\/project/);
	await expect(page.getByTestId("docNav").first()).toBeVisible();
	await expect(page.getByRole("heading", { name: "Über das Projekt" }).first()).toBeVisible();

	await page.getByRole("link", { name: "Daten", exact: true }).click();
	await expect(page.getByRole("heading", { name: "Daten" }).first()).toBeVisible();

	await page.goto("http://localhost:3000/en/documentation/data");
	await expect(page.getByRole("heading", { name: "Data" }).first()).toBeVisible();

	await page.getByRole("link", { name: "Project" }).click();
	await expect(page.getByRole("heading", { name: "Project" }).first()).toBeVisible();
});

test("Imprint", async ({ page }) => {
	await page.goto("http://localhost:3000/de");
	await page.getByRole("link", { name: "Impressum" }).click();

	await expect(
		page.getByRole("heading", { name: "Offenlegung gemäß §§ 24, 25" }).first(),
	).toBeVisible();

	await page.getByTestId("localeButton").click();
	await page.getByRole("option", { name: "EN" }).click();

	await expect(
		page.getByRole("heading", { name: "Legal disclosure according to" }).first(),
	).toBeVisible();
});
