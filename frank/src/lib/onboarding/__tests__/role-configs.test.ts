import { describe, it, expect } from "vitest";
import { ROLE_CONFIGS, getRoleConfig, getAvailableRoles } from "../role-configs";
import type { OnboardingRole } from "../types";

describe("Role Configurations", () => {
  const allRoles: OnboardingRole[] = ["SOLO_PM", "TEAM_LEAD", "FOUNDER"];

  describe("ROLE_CONFIGS", () => {
    it("should define all required roles", () => {
      allRoles.forEach((role) => {
        expect(ROLE_CONFIGS[role]).toBeDefined();
      });
    });

    it("should have valid role configurations", () => {
      allRoles.forEach((role) => {
        const config = ROLE_CONFIGS[role];
        expect(config.role).toBe(role);
        expect(config.title).toBeTruthy();
        expect(config.description).toBeTruthy();
        expect(Array.isArray(config.sampleImprovements)).toBe(true);
        expect(config.sampleImprovements.length).toBeGreaterThan(0);
      });
    });

    it("should have valid sample improvements", () => {
      allRoles.forEach((role) => {
        const config = ROLE_CONFIGS[role];

        config.sampleImprovements.forEach((improvement) => {
          expect(improvement.title).toBeTruthy();
          expect(improvement.description).toBeTruthy();
          expect(typeof improvement.estimatedEffort).toBe("number");
          expect(improvement.estimatedEffort).toBeGreaterThan(0);
          expect(improvement.expectedImpact).toBeTruthy();
          expect(Array.isArray(improvement.evidence)).toBe(true);
          expect(improvement.evidence.length).toBeGreaterThan(0);
        });
      });
    });

    it("should have at least 3 sample improvements per role", () => {
      allRoles.forEach((role) => {
        const config = ROLE_CONFIGS[role];
        expect(config.sampleImprovements.length).toBeGreaterThanOrEqual(3);
      });
    });

    it("should have unique sample improvements per role", () => {
      const soloPM = ROLE_CONFIGS.SOLO_PM.sampleImprovements;
      const teamLead = ROLE_CONFIGS.TEAM_LEAD.sampleImprovements;
      const founder = ROLE_CONFIGS.FOUNDER.sampleImprovements;

      const soloPMTitles = soloPM.map((i) => i.title);
      const teamLeadTitles = teamLead.map((i) => i.title);
      const founderTitles = founder.map((i) => i.title);

      // Check that each role has unique content
      expect(soloPMTitles).not.toEqual(teamLeadTitles);
      expect(soloPMTitles).not.toEqual(founderTitles);
      expect(teamLeadTitles).not.toEqual(founderTitles);
    });

    it("should have realistic effort estimates", () => {
      allRoles.forEach((role) => {
        const config = ROLE_CONFIGS[role];

        config.sampleImprovements.forEach((improvement) => {
          // Effort should be between 1 and 20 (story points or days)
          expect(improvement.estimatedEffort).toBeGreaterThanOrEqual(1);
          expect(improvement.estimatedEffort).toBeLessThanOrEqual(20);
        });
      });
    });

    it("should have evidence items with meaningful content", () => {
      allRoles.forEach((role) => {
        const config = ROLE_CONFIGS[role];

        config.sampleImprovements.forEach((improvement) => {
          improvement.evidence.forEach((evidence) => {
            // Evidence should be meaningful strings, not empty or just whitespace
            expect(evidence.trim().length).toBeGreaterThan(10);
          });
        });
      });
    });
  });

  describe("getRoleConfig", () => {
    it("should return correct config for each role", () => {
      allRoles.forEach((role) => {
        const config = getRoleConfig(role);
        expect(config.role).toBe(role);
        expect(config).toBe(ROLE_CONFIGS[role]);
      });
    });

    it("should return config with sample improvements", () => {
      const config = getRoleConfig("SOLO_PM");
      expect(config.sampleImprovements.length).toBeGreaterThan(0);
    });
  });

  describe("getAvailableRoles", () => {
    it("should return all available roles", () => {
      const roles = getAvailableRoles();
      expect(roles.length).toBe(3);
    });

    it("should return valid role configurations", () => {
      const roles = getAvailableRoles();

      roles.forEach((config) => {
        expect(allRoles).toContain(config.role);
        expect(config.title).toBeTruthy();
        expect(config.description).toBeTruthy();
        expect(config.sampleImprovements.length).toBeGreaterThan(0);
      });
    });

    it("should include SOLO_PM, TEAM_LEAD, and FOUNDER", () => {
      const roles = getAvailableRoles();
      const roleTypes = roles.map((r) => r.role);

      expect(roleTypes).toContain("SOLO_PM");
      expect(roleTypes).toContain("TEAM_LEAD");
      expect(roleTypes).toContain("FOUNDER");
    });
  });
});
