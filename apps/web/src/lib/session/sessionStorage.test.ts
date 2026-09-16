import { describe, expect, it } from "vitest";
import {
  GUEST_SESSION,
  ROLE_STORAGE_KEY,
  SIGNED_IN_STORAGE_KEY,
  clearStoredSession,
  readStoredSession,
  writeStoredSession,
  type StorageLike,
} from "./sessionStorage";

function memoryStorage(initial: Record<string, string> = {}): StorageLike & { dump(): Record<string, string> } {
  let data = { ...initial };
  return {
    getItem: (key) => data[key] ?? null,
    setItem: (key, value) => {
      data = { ...data, [key]: value };
    },
    removeItem: (key) => {
      data = Object.fromEntries(Object.entries(data).filter(([k]) => k !== key));
    },
    dump: () => data,
  };
}

function throwingStorage(): StorageLike {
  return {
    getItem: () => {
      throw new Error("blocked");
    },
    setItem: () => {
      throw new Error("blocked");
    },
    removeItem: () => {
      throw new Error("blocked");
    },
  };
}

describe("readStoredSession", () => {
  it("is a guest when nothing is stored", () => {
    expect(readStoredSession(memoryStorage())).toEqual(GUEST_SESSION);
    expect(readStoredSession(null)).toEqual(GUEST_SESSION);
  });

  it("restores a signed-in role", () => {
    const storage = memoryStorage({
      [ROLE_STORAGE_KEY]: "psychologist",
      [SIGNED_IN_STORAGE_KEY]: "true",
    });
    expect(readStoredSession(storage)).toEqual({ role: "psychologist", isSignedIn: true });
  });

  it("treats a stored role without the flag as signed out", () => {
    const storage = memoryStorage({ [ROLE_STORAGE_KEY]: "student" });
    expect(readStoredSession(storage)).toEqual({ role: "student", isSignedIn: false });
  });

  it("ignores unknown roles and storage failures", () => {
    expect(readStoredSession(memoryStorage({ [ROLE_STORAGE_KEY]: "wizard" }))).toEqual(GUEST_SESSION);
    expect(readStoredSession(throwingStorage())).toEqual(GUEST_SESSION);
  });
});

describe("writeStoredSession and clearStoredSession", () => {
  it("round-trips a session", () => {
    const storage = memoryStorage();
    writeStoredSession(storage, { role: "student", isSignedIn: true });
    expect(readStoredSession(storage)).toEqual({ role: "student", isSignedIn: true });
    expect(storage.dump()).toEqual({
      [ROLE_STORAGE_KEY]: "student",
      [SIGNED_IN_STORAGE_KEY]: "true",
    });
  });

  it("clears back to a guest", () => {
    const storage = memoryStorage({
      [ROLE_STORAGE_KEY]: "admin",
      [SIGNED_IN_STORAGE_KEY]: "true",
    });
    clearStoredSession(storage);
    expect(readStoredSession(storage)).toEqual(GUEST_SESSION);
  });

  it("swallows storage failures", () => {
    expect(() => writeStoredSession(throwingStorage(), GUEST_SESSION)).not.toThrow();
    expect(() => clearStoredSession(throwingStorage())).not.toThrow();
    expect(() => writeStoredSession(null, GUEST_SESSION)).not.toThrow();
  });
});
