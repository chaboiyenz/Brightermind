"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { RoleProvider, type Role } from "@/components/ui";

// Ground rule 2 of the prototype pivot: "Auth is a static role switcher, not
// real login." No token, no backend check — just RoleProvider fed a
// locally-chosen role, persisted so it survives navigation/reload.
const STORAGE_KEY = "bm_mock_role";
export const MOCK_ROLES: Role[] = ["student", "psychologist", "admin"];

// Exposes the same role-setting mechanism the bottom-left switcher uses
// (updateRole below) to the rest of the tree — so mock-mode login/signup
// (LoginForm, SignupForm, PsychologistSignupForm) can set the role too,
// instead of building a second mock-auth mechanism. The default value is a
// safe no-op: only ever read outside a MockRoleProvider in real-auth mode,
// where callers gate on isMockMode() before touching it anyway.
interface MockRoleContextValue {
  role: Role;
  setRole: (role: Role) => void;
}

const MockRoleContext = createContext<MockRoleContextValue>({
  role: "student",
  setRole: () => {},
});

export function useMockRole(): MockRoleContextValue {
  return useContext(MockRoleContext);
}

export function MockRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("student");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && (MOCK_ROLES as string[]).includes(saved)) {
        setRole(saved as Role);
      }
    } catch {
      // localStorage unavailable (private mode etc.) — default role stands
    }
  }, []);

  function updateRole(next: Role) {
    setRole(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // best-effort only
    }
  }

  return (
    <MockRoleContext.Provider value={{ role, setRole: updateRole }}>
      <RoleProvider role={role} isLoading={false}>
        {children}
        <MockRoleSwitcher role={role} onChange={updateRole} />
      </RoleProvider>
    </MockRoleContext.Provider>
  );
}

function MockRoleSwitcher({
  role,
  onChange,
}: {
  role: Role;
  onChange: (role: Role) => void;
}) {
  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-md border border-stone-300 bg-stone-25 px-3 py-2 text-xs shadow-md">
      <span className="font-medium text-stone-700">Prototype role:</span>
      <select
        value={role}
        onChange={(e) => onChange(e.target.value as Role)}
        className="rounded-sm border border-stone-300 bg-white px-1.5 py-0.5 text-xs"
      >
        {MOCK_ROLES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
    </div>
  );
}
