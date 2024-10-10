import { expect, test } from "@playwright/test";

test("Searchinterface navigation", async ({ page }) => {
	await page.goto("/search/persons");
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

	await page.getByRole("link", { name: "Orte" }).click();
	await expect(page).toHaveURL("/search/places");

	await page.getByRole("button", { name: "Facets" }).click();
	await expect(page).toHaveURL("/search/places");
});

test("Documentation", async ({ page }) => {
	await page.goto("/");
	await page.getByRole("navigation").getByRole("link", { name: "Dokumentation" }).click();

	await expect(page).toHaveURL("/documentation/project");
	await expect(page.getByTestId("docNav").first()).toBeVisible();
	await expect(page.getByRole("heading", { name: "Über das Projekt" }).first()).toBeVisible();

	await page.getByRole("link", { name: "Daten", exact: true }).click();
	await expect(page.getByRole("heading", { name: "Daten" }).first()).toBeVisible();
});
