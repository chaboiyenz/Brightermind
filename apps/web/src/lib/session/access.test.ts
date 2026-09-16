import { describe, expect, it } from "vitest";
import {
  getAccessDecision,
  homeFor,
  loginHref,
  postLoginDestination,
  requiresSignIn,
  resolveShell,
  safeNextPath,
} from "./access";
import type { PrototypeSession } from "./sessionStorage";

const guest: PrototypeSession = { role: "student", isSignedIn: false };
const patient: PrototypeSession = { role: "student", isSignedIn: true };
const psych: PrototypeSession = { role: "psychologist", isSignedIn: true };
const admin: PrototypeSession = { role: "admin", isSignedIn: true };

describe("resolveShell", () => {
  it("uses the auth chrome on login and signup regardless of session", () => {
    expect(resolveShell("/login", guest)).toBe("auth");
    expect(resolveShell("/signup/psychologist", psych)).toBe("auth");
  });

  it("gives guests the public site", () => {
    expect(resolveShell("/", guest)).toBe("public");
    expect(resolveShell("/coping/defusion", guest)).toBe("public");
  });

  it("gives signed-in students the patient shell everywhere", () => {
    expect(resolveShell("/home", patient)).toBe("patient");
    expect(resolveShell("/messages/1", patient)).toBe("patient");
  });

  it("gives psychologists and admins the workspace shell, even on shared routes", () => {
    expect(resolveShell("/psych", psych)).toBe("psych");
    expect(resolveShell("/call/201", psych)).toBe("psych");
    expect(resolveShell("/community", admin)).toBe("psych");
  });
});

describe("requiresSignIn", () => {
  it("leaves the trial surfaces open", () => {
    expect(requiresSignIn("/")).toBe(false);
    expect(requiresSignIn("/coping")).toBe(false);
    expect(requiresSignIn("/coping/body-scan")).toBe(false);
    expect(requiresSignIn("/community")).toBe(false);
    expect(requiresSignIn("/resources/hotlines")).toBe(false);
  });

  it("protects the personal and clinical features", () => {
    for (const path of [
      "/screening/gad7",
      "/mood",
      "/journal",
      "/tools/todo",
      "/profile",
      "/psychologists",
      "/messages/1",
      "/call/1",
      "/care",
      "/home",
      "/psych/patients",
    ]) {
      expect(requiresSignIn(path), path).toBe(true);
    }
  });

  it("matches whole segments only", () => {
    expect(requiresSignIn("/moody-blues")).toBe(false);
  });
});

describe("getAccessDecision", () => {
  it("sends guests to login with a return path", () => {
    expect(getAccessDecision("/mood", guest)).toEqual({
      kind: "redirect",
      to: "/login?next=%2Fmood",
    });
  });

  it("lets guests play games and read the community", () => {
    expect(getAccessDecision("/coping/defusion", guest)).toEqual({ kind: "allow" });
    expect(getAccessDecision("/community", guest)).toEqual({ kind: "allow" });
  });

  it("blocks students from the psychologist workspace without redirecting", () => {
    expect(getAccessDecision("/psych/patients", patient)).toEqual({
      kind: "forbidden",
      allow: ["psychologist", "admin"],
    });
  });

  it("allows psychologists into the workspace and shared routes", () => {
    expect(getAccessDecision("/psych/inbox", psych)).toEqual({ kind: "allow" });
    expect(getAccessDecision("/messages/201", psych)).toEqual({ kind: "allow" });
    expect(getAccessDecision("/coping/defusion", psych)).toEqual({ kind: "allow" });
  });

  it("keeps psychologists off the patient's personal pages", () => {
    for (const path of ["/mood", "/journal", "/tools/todo", "/profile", "/screening/gad7", "/psychologists", "/care", "/home"]) {
      expect(getAccessDecision(path, psych), path).toEqual({ kind: "forbidden", allow: ["student"] });
    }
    expect(getAccessDecision("/mood", patient)).toEqual({ kind: "allow" });
  });

  it("sends signed-in users from the landing page to their own home", () => {
    expect(getAccessDecision("/", psych)).toEqual({ kind: "redirect", to: "/psych" });
    expect(getAccessDecision("/", patient)).toEqual({ kind: "redirect", to: "/home" });
    expect(getAccessDecision("/", guest)).toEqual({ kind: "allow" });
    expect(getAccessDecision("/home", patient)).toEqual({ kind: "allow" });
  });

  it("redirects the retired dashboard and admin URLs", () => {
    expect(getAccessDecision("/dashboard", psych)).toEqual({ kind: "redirect", to: "/psych/inbox" });
    expect(getAccessDecision("/admin/patients", guest)).toEqual({
      kind: "redirect",
      to: "/psych/patients",
    });
  });
});

describe("homeFor and loginHref", () => {
  it("routes each role to its home", () => {
    expect(homeFor("student")).toBe("/home");
    expect(homeFor("psychologist")).toBe("/psych");
    expect(homeFor("admin")).toBe("/psych");
  });

  it("omits a redundant next parameter", () => {
    expect(loginHref(undefined)).toBe("/login");
    expect(loginHref("/")).toBe("/login");
    expect(loginHref("/login")).toBe("/login");
    expect(loginHref("/care")).toBe("/login?next=%2Fcare");
  });
});

describe("safeNextPath", () => {
  it("only accepts same-origin, non-auth paths", () => {
    expect(safeNextPath("/care", "/")).toBe("/care");
    expect(safeNextPath("https://evil.example", "/")).toBe("/");
    expect(safeNextPath("//evil.example", "/")).toBe("/");
    expect(safeNextPath("/login", "/psych")).toBe("/psych");
    expect(safeNextPath(null, "/psych")).toBe("/psych");
  });
});

describe("postLoginDestination", () => {
  it("honours a next path the role may open", () => {
    expect(postLoginDestination("/care", "student")).toBe("/care");
    expect(postLoginDestination("/psych/inbox", "psychologist")).toBe("/psych/inbox");
    expect(postLoginDestination("/coping/defusion", "psychologist")).toBe("/coping/defusion");
  });

  it("falls back to the role's home when next is not for that role", () => {
    expect(postLoginDestination("/psych/inbox", "student")).toBe("/home");
    expect(postLoginDestination("/mood", "psychologist")).toBe("/psych");
    expect(postLoginDestination("/", "psychologist")).toBe("/psych");
    expect(postLoginDestination("/", "student")).toBe("/home");
  });

  it("ignores unsafe or missing next values", () => {
    expect(postLoginDestination("https://evil.example", "student")).toBe("/home");
    expect(postLoginDestination(null, "psychologist")).toBe("/psych");
  });
});
