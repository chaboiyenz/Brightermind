"use client";

// Temporary page to visually confirm the merged Tailwind tokens and the
// moved UI library components render correctly. Safe to delete once verified
// in the browser — not linked from anywhere else in the app.

import { useState } from "react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Modal } from "@/components/ui";

export default function UiTestPage() {
  const [open, setOpen] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-start gap-6 bg-stone-50 p-10 font-sans">
      <h1 className="text-lg font-medium text-stone-900">UI library smoke test</h1>

      <div className="flex items-center gap-3">
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Badge tone="brand">Brand badge</Badge>
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sample card</CardTitle>
        </CardHeader>
        <CardContent>Confirms the brand/stone tokens and card radius render.</CardContent>
      </Card>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Sample modal"
        description="Confirms Radix Dialog + tokens render correctly."
      >
        <p className="text-sm text-stone-700">If this looks styled, the integration works.</p>
      </Modal>
    </main>
  );
}
