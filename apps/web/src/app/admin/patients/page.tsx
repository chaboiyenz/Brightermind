import { RestrictedPageNotice } from "@/components/RestrictedPageNotice";
import {
  EmptyState,
  RoleGate,
  Table,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui";
import { getMockPatients } from "@/lib/mock/adminPatients";
import { PatientRow } from "./PatientRow";

// AdminPatientListPage (docs/frontend-migration-plan.md module 15). Server
// component behind RoleGate for "admin"; rows from the mock fixture. Under
// mock mode the gate is driven by the role switcher — demonstration only, the
// real page must also be enforced by the API (RoleGate docblock).
export default function AdminPatientListPage() {
  const patients = getMockPatients();

  return (
    <main className="mx-auto max-w-5xl p-6">
      <RoleGate allow={["admin"]} fallback={<RestrictedPageNotice allow={["admin"]} />}>
        <header className="mb-6">
          <h1 className="text-lg font-medium text-stone-900">Patients</h1>
          <p className="mt-1 text-sm text-stone-600">
            Every registered student, their most recent screening result, and
            progress across the coping modules.
          </p>
        </header>

        {patients.length === 0 ? (
          <EmptyState title="No patients yet" description="Students will appear here once they sign up." />
        ) : (
          <Table aria-label="Patients">
            <TableHead>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Latest screening</TableHeaderCell>
                <TableHeaderCell>Module scores</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => (
                <PatientRow key={patient.userId} patient={patient} />
              ))}
            </TableBody>
          </Table>
        )}
      </RoleGate>
    </main>
  );
}
