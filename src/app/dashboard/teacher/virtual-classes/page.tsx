import VirtualClassList from "@/components/virtual-classes/VirtualClassList";

export default function TeacherVirtualClassesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <VirtualClassList role="teacher" />
    </div>
  );
}
