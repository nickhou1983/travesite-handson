/**
 * destinations.test.js
 * 
 * Comprehensive data integrity tests for data/destinations.js
 * Self-contained test runner — no external dependencies required.
 * 
 * Usage: node tests/destinations.test.js
 */

// ─── Minimal Test Runner ────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures = [];

function describe(suiteName, fn) {
  console.log(`\n\x1b[1m📂 ${suiteName}\x1b[0m`);
  fn();
}

function it(testName, fn) {
  try {
    fn();
    passed++;
    console.log(`  \x1b[32m✓\x1b[0m ${testName}`);
  } catch (err) {
    failed++;
    const msg = `  \x1b[31m✗\x1b[0m ${testName}\n    → ${err.message}`;
    console.log(msg);
    failures.push({ testName, message: err.message });
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || "Assertion failed");
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

// ─── Load Data (mock window for Node.js) ────────────────────────────────────

const path = require("path");

global.window = {};
require(path.resolve(__dirname, "../data/destinations.js"));

const destinations = window.__DESTINATIONS__;

// ─── Valid Enum Values ──────────────────────────────────────────────────────

const VALID_REGIONS = ["亚洲", "大洋洲", "欧洲", "美洲", "非洲"];
const VALID_BUDGETS = ["低", "中", "高"];
const VALID_SEASONS = ["春", "夏", "秋"];
const VALID_TYPES = ["海岛", "自然", "城市", "徒步", "人文"];
const VALID_SOURCES = ["Unsplash", "Pexels"];
const REQUIRED_FIELDS = [
  "id", "name", "country", "region", "budget", "season",
  "type", "days", "rating", "summary", "highlights",
  "transport", "tips", "image", "source"
];

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("Data Loading", () => {
  it("should load __DESTINATIONS__ as an array", () => {
    assert(Array.isArray(destinations), "destinations is not an array");
  });

  it("should contain exactly 9 destinations", () => {
    assertEqual(destinations.length, 9, `Expected 9 destinations, got ${destinations.length}`);
  });

  it("should not be empty", () => {
    assert(destinations.length > 0, "destinations array is empty");
  });
});

describe("Required Fields Presence", () => {
  destinations.forEach((dest) => {
    it(`"${dest.id}" should have all ${REQUIRED_FIELDS.length} required fields`, () => {
      const missing = REQUIRED_FIELDS.filter((field) => !(field in dest));
      assert(missing.length === 0, `Missing fields: ${missing.join(", ")}`);
    });
  });
});

describe("Field Types", () => {
  destinations.forEach((dest) => {
    it(`"${dest.id}" — id should be a non-empty string`, () => {
      assert(typeof dest.id === "string" && dest.id.length > 0, `id is not a valid string`);
    });

    it(`"${dest.id}" — name should be a non-empty string`, () => {
      assert(typeof dest.name === "string" && dest.name.length > 0, `name is invalid`);
    });

    it(`"${dest.id}" — country should be a non-empty string`, () => {
      assert(typeof dest.country === "string" && dest.country.length > 0, `country is invalid`);
    });

    it(`"${dest.id}" — rating should be a number`, () => {
      assert(typeof dest.rating === "number", `rating is not a number`);
    });

    it(`"${dest.id}" — highlights should be an array`, () => {
      assert(Array.isArray(dest.highlights), `highlights is not an array`);
    });

    it(`"${dest.id}" — image should be a string`, () => {
      assert(typeof dest.image === "string", `image is not a string`);
    });

    it(`"${dest.id}" — summary should be a non-empty string`, () => {
      assert(typeof dest.summary === "string" && dest.summary.length > 0, `summary is invalid`);
    });

    it(`"${dest.id}" — transport should be a non-empty string`, () => {
      assert(typeof dest.transport === "string" && dest.transport.length > 0, `transport is invalid`);
    });

    it(`"${dest.id}" — tips should be a non-empty string`, () => {
      assert(typeof dest.tips === "string" && dest.tips.length > 0, `tips is invalid`);
    });
  });
});

describe("ID Format & Uniqueness", () => {
  it("should have all lowercase English IDs (no spaces or special chars)", () => {
    destinations.forEach((dest) => {
      assert(
        /^[a-z][a-z0-9]*$/.test(dest.id),
        `"${dest.id}" does not match lowercase alphanumeric format`
      );
    });
  });

  it("should have no duplicate IDs", () => {
    const ids = destinations.map((d) => d.id);
    const unique = new Set(ids);
    assertEqual(unique.size, ids.length, `Duplicate IDs found: ${ids.filter((id, i) => ids.indexOf(id) !== i).join(", ")}`);
  });
});

describe("Enum Value Validation", () => {
  destinations.forEach((dest) => {
    it(`"${dest.id}" — region "${dest.region}" should be valid`, () => {
      assert(VALID_REGIONS.includes(dest.region), `Invalid region: "${dest.region}"`);
    });

    it(`"${dest.id}" — budget "${dest.budget}" should be valid`, () => {
      assert(VALID_BUDGETS.includes(dest.budget), `Invalid budget: "${dest.budget}"`);
    });

    it(`"${dest.id}" — season "${dest.season}" should be valid`, () => {
      assert(VALID_SEASONS.includes(dest.season), `Invalid season: "${dest.season}"`);
    });

    it(`"${dest.id}" — type "${dest.type}" should be valid`, () => {
      assert(VALID_TYPES.includes(dest.type), `Invalid type: "${dest.type}"`);
    });

    it(`"${dest.id}" — source "${dest.source}" should be valid`, () => {
      assert(VALID_SOURCES.includes(dest.source), `Invalid source: "${dest.source}"`);
    });
  });
});

describe("Rating Range (1–5)", () => {
  destinations.forEach((dest) => {
    it(`"${dest.id}" — rating ${dest.rating} should be between 1 and 5`, () => {
      assert(dest.rating >= 1 && dest.rating <= 5, `Rating ${dest.rating} is out of range`);
    });

    it(`"${dest.id}" — rating should have at most one decimal place`, () => {
      const str = String(dest.rating);
      const decimals = str.includes(".") ? str.split(".")[1].length : 0;
      assert(decimals <= 1, `Rating ${dest.rating} has more than 1 decimal place`);
    });
  });
});

describe("Days Format", () => {
  destinations.forEach((dest) => {
    it(`"${dest.id}" — days "${dest.days}" should match "N-N 天" format`, () => {
      assert(
        /^\d+-\d+ 天$/.test(dest.days),
        `days "${dest.days}" does not match expected format "N-N 天"`
      );
    });

    it(`"${dest.id}" — days range min should be less than max`, () => {
      const match = dest.days.match(/^(\d+)-(\d+) 天$/);
      if (match) {
        const min = parseInt(match[1], 10);
        const max = parseInt(match[2], 10);
        assert(min < max, `Days range invalid: min(${min}) >= max(${max})`);
        assert(min >= 1, `Days min should be at least 1`);
      }
    });
  });
});

describe("Highlights Array Structure", () => {
  destinations.forEach((dest) => {
    it(`"${dest.id}" — highlights should have exactly 3 items`, () => {
      assertEqual(dest.highlights.length, 3, `Expected 3 highlights, got ${dest.highlights.length}`);
    });

    it(`"${dest.id}" — all highlights should be non-empty strings`, () => {
      dest.highlights.forEach((h, i) => {
        assert(
          typeof h === "string" && h.trim().length > 0,
          `highlights[${i}] is empty or not a string`
        );
      });
    });

    it(`"${dest.id}" — highlights should have no duplicates`, () => {
      const unique = new Set(dest.highlights);
      assertEqual(unique.size, dest.highlights.length, "Duplicate highlights found");
    });
  });
});

describe("Image URL Validation", () => {
  destinations.forEach((dest) => {
    it(`"${dest.id}" — image URL should start with https://`, () => {
      assert(dest.image.startsWith("https://"), `Image URL does not use HTTPS: ${dest.image}`);
    });

    it(`"${dest.id}" — image URL should be from Unsplash or Pexels`, () => {
      const isValid =
        dest.image.includes("images.unsplash.com") ||
        dest.image.includes("images.pexels.com");
      assert(isValid, `Image URL is not from an approved source: ${dest.image}`);
    });

    it(`"${dest.id}" — image source field should match URL domain`, () => {
      if (dest.source === "Unsplash") {
        assert(dest.image.includes("unsplash.com"), `Source is Unsplash but URL is: ${dest.image}`);
      } else if (dest.source === "Pexels") {
        assert(dest.image.includes("pexels.com"), `Source is Pexels but URL is: ${dest.image}`);
      }
    });
  });
});

describe("Data Completeness (no null/undefined/empty values)", () => {
  destinations.forEach((dest) => {
    it(`"${dest.id}" — should have no null or undefined field values`, () => {
      REQUIRED_FIELDS.forEach((field) => {
        assert(
          dest[field] !== null && dest[field] !== undefined,
          `Field "${field}" is null or undefined`
        );
      });
    });

    it(`"${dest.id}" — string fields should not be empty or whitespace-only`, () => {
      const stringFields = ["id", "name", "country", "region", "budget", "season",
        "type", "days", "summary", "transport", "tips", "image", "source"];
      stringFields.forEach((field) => {
        assert(
          typeof dest[field] === "string" && dest[field].trim().length > 0,
          `Field "${field}" is empty or whitespace-only`
        );
      });
    });
  });
});

describe("Cross-field Consistency", () => {
  it("should have at least one destination per region", () => {
    const coveredRegions = new Set(destinations.map((d) => d.region));
    const missing = VALID_REGIONS.filter((r) => !coveredRegions.has(r));
    assert(missing.length === 0, `Missing regions in data: ${missing.join(", ")}`);
  });

  it("should have at least one destination per budget level", () => {
    const coveredBudgets = new Set(destinations.map((d) => d.budget));
    const missing = VALID_BUDGETS.filter((b) => !coveredBudgets.has(b));
    assert(missing.length === 0, `Missing budgets in data: ${missing.join(", ")}`);
  });

  it("should have at least one destination per season", () => {
    const coveredSeasons = new Set(destinations.map((d) => d.season));
    const missing = VALID_SEASONS.filter((s) => !coveredSeasons.has(s));
    assert(missing.length === 0, `Missing seasons in data: ${missing.join(", ")}`);
  });

  it("should have at least one destination per type", () => {
    const coveredTypes = new Set(destinations.map((d) => d.type));
    const missing = VALID_TYPES.filter((t) => !coveredTypes.has(t));
    assert(missing.length === 0, `Missing types in data: ${missing.join(", ")}`);
  });
});

// ─── Summary ────────────────────────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
const total = passed + failed;
if (failed === 0) {
  console.log(`\x1b[32m\x1b[1m✅ All ${total} tests passed!\x1b[0m`);
} else {
  console.log(`\x1b[31m\x1b[1m❌ ${failed} of ${total} tests failed:\x1b[0m`);
  failures.forEach((f, i) => {
    console.log(`   ${i + 1}. ${f.testName}`);
    console.log(`      ${f.message}`);
  });
}
console.log("═".repeat(60));

process.exit(failed > 0 ? 1 : 0);
