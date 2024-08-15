import {
  validateColor,
  validateField,
} from "../middlewares/carsRouterMiddlewares";

describe("Car Router Middlewares", () => {
  describe("validateField", () => {
    let errors: Array<{ field: string; error: string }>;

    beforeEach(() => {
      errors = [];
    });

    test("should not add error when value is of expected type string", () => {
      validateField("Honda", "brand", "string", errors);
      expect(errors).toHaveLength(0);
    });

    test("should add error when value is not of expected type string", () => {
      validateField(123, "brand", "string", errors);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: "brand",
        error: "brand must be a string.",
      });
    });

    test("should not add error when value is of expected type number", () => {
      validateField(2001, "year", "number", errors);
      expect(errors).toHaveLength(0);
    });

    test("should add error when value is string for expected type number", () => {
      validateField("2001", "year", "number", errors);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: "year",
        error: "year must be a number.",
      });
    });

    test("should add error when value is NaN for expected type number", () => {
      validateField(NaN, "year", "number", errors);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: "year",
        error: "year must be a number.",
      });
    });

    test("should not add error when value is undefined and field is not required", () => {
      validateField(undefined, "brand", "string", errors, false);
      expect(errors).toHaveLength(0);
    });

    test("should add error when value is undefined and field is required", () => {
      validateField(undefined, "brand", "string", errors, true);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: "brand",
        error: "brand must be a string.",
      });
    });
  });

  describe("validateColor", () => {
    let errors: Array<{ field: string; error: string }>;

    beforeEach(() => {
      errors = [];
    });

    test("should not add error when color is a valid object with r, g, b as numbers", () => {
      const color = { r: 255, g: 255, b: 255 };
      validateColor(color, errors);
      expect(errors).toHaveLength(0);
    });

    test("should add error when color is not an object", () => {
      validateColor(null as any, errors); // Passing null to simulate a non-object scenario
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: "color",
        error:
          "Color is required and must be an object with r, g, and b properties.",
      });
    });

    test("should add error when color.r is not a number", () => {
      const color = { r: "255" as any, g: 255, b: 255 };
      validateColor(color, errors);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: "color.r",
        error: "color.r must be a number.",
      });
    });

    test("should add error when color.g is not a number", () => {
      const color = { r: 255, g: "255" as any, b: 255 };
      validateColor(color, errors);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: "color.g",
        error: "color.g must be a number.",
      });
    });

    test("should add error when color.b is not a number", () => {
      const color = { r: 255, g: 255, b: "255" as any };
      validateColor(color, errors);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: "color.b",
        error: "color.b must be a number.",
      });
    });

    test("should add errors for multiple invalid color properties", () => {
      const color = { r: "255" as any, g: "255" as any, b: "255" as any };
      validateColor(color, errors);
      expect(errors).toHaveLength(3);
      expect(errors).toEqual([
        {
          field: "color.r",
          error: "color.r must be a number.",
        },
        {
          field: "color.g",
          error: "color.g must be a number.",
        },
        {
          field: "color.b",
          error: "color.b must be a number.",
        },
      ]);
    });
  });
});
