import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createAlpaca, fixture, loaded } from "./harness.js";

describe.each(["web", "bootstrap", "bootstrap5"])("views (%s)", (flavor) => {
    let alpaca, $, render;

    beforeEach(() => {
        alpaca = createAlpaca({ flavor });
        ({ $, render } = alpaca);
    });
    afterEach(() => alpaca.close());

    it("defaults to an edit view when data is provided", async () => {
        const field = await render({ data: "x" });
        expect(field.view.id).toBe(`${flavor}-edit`);
    });

    it("defaults to a create view when no data is provided", async () => {
        const field = await render({ schema: { type: "string" } });
        expect(field.view.id).toBe(`${flavor}-create`);
    });

    it("display views render read-only output", async () => {
        const field = await render({ data: "Read me", view: `${flavor}-display` });
        expect(field.view.type).toBe("display");
        expect($("#form input")).toHaveLength(0);
        expect($("#form").text()).toContain("Read me");
    });

    it("horizontal views flag the view as horizontal", async () => {
        const field = await render({ data: "x", view: `${flavor}-edit-horizontal` });
        expect(field.view.horizontal).toBe(true);
    });

    it("custom views inherit from their parent", async () => {
        alpaca.Alpaca.registerView({ id: "my-view", parent: `${flavor}-edit`, messages: { stringTooLong: "Way too long!" } });
        const field = await render({ data: "x", view: "my-view" });
        expect(field.view.id).toBe("my-view");
        expect(field.view.type).toBe("edit");
        expect(field.view.getMessage("stringTooLong")).toBe("Way too long!");
    });

    it("renders form buttons", async () => {
        await render({
            data: { name: "Joe" },
            schema: { type: "object", properties: { name: { type: "string" } } },
            options: { form: { buttons: { submit: { title: "Send It" } } } }
        });
        expect($("#form form")).toHaveLength(1);
        expect($("#form button").text()).toContain("Send It");
    });

    it("renders a large, deeply nested form", async () => {
        const field = await loaded(await render({
            schema: fixture("big-form/schema.json"),
            options: fixture("big-form/options.json"),
            data: fixture("big-form/data.json")
        }));
        expect(field.children.length).toBeGreaterThan(5);
        expect($("#form .alpaca-field").length).toBeGreaterThan(50);
    });
});

describe("bootstrap view styling", () => {
    it("applies Bootstrap classes", async () => {
        const alpaca = createAlpaca({ flavor: "bootstrap" });
        await alpaca.render({ data: "x", options: { label: "Name" } });
        const $ = alpaca.$;
        expect($("#form .form-group")).toHaveLength(1);
        expect($("#form input").hasClass("form-control")).toBe(true);
        expect($("#form label").hasClass("control-label")).toBe(true);
        alpaca.close();
    });
});

describe("bootstrap5 view styling", () => {
    it("applies Bootstrap 5 classes to fields, labels, inputs, selects, and checkboxes", async () => {
        const alpaca = createAlpaca({ flavor: "bootstrap5" });
        const { $, render } = alpaca;

        const field = await render({
            schema: {
                type: "object",
                properties: {
                    name: { type: "string", title: "Name" },
                    gender: { type: "string", enum: ["m", "f"], title: "Gender" },
                    subscribe: { type: "boolean", title: "Subscribe", rightLabel: "Yes, subscribe" }
                },
                required: ["name"]
            },
            options: {
                fields: {
                    name: { label: "Full Name", helper: "Enter your full name" },
                    gender: { type: "select", label: "Gender" },
                    subscribe: { rightLabel: "Yes, subscribe" }
                }
            }
        });

        // Verifies <div class="mb-3"> exists
        expect($("#form .mb-3").length).toBeGreaterThan(0);

        // Verifies text inputs receive .form-control
        expect($("#form input[name='name']").hasClass("form-control")).toBe(true);

        // Verifies select dropdowns receive .form-select
        expect($("#form select[name='gender']").hasClass("form-select")).toBe(true);
        expect($("#form select[name='gender']").hasClass("form-control")).toBe(false);

        // Verifies checkboxes receive .form-check and .form-check-input
        expect($("#form .form-check").length).toBeGreaterThan(0);
        expect($("#form input[type='checkbox']").hasClass("form-check-input")).toBe(true);

        // Verifies labels receive .form-label
        expect($("#form label.alpaca-control-label").hasClass("form-label")).toBe(true);

        alpaca.close();
    });

    it("verifies invalid fields receive .is-invalid", async () => {
        const alpaca = createAlpaca({ flavor: "bootstrap5" });
        const { $, render } = alpaca;

        const field = await render({
            schema: {
                type: "string",
                minLength: 5
            },
            data: "abc"
        });

        field.refreshValidationState(true);

        // Control element receives .is-invalid
        expect($("#form input").hasClass("is-invalid")).toBe(true);

        // Feedback message displays with .invalid-feedback
        expect($("#form .invalid-feedback").length).toBeGreaterThan(0);

        alpaca.close();
    });
});
