
import Layout from "@/components/Layout";
import ImportExport from "@/components/ImportExport";

export default function ImportExportPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-6">Import & Export</h1>
        <ImportExport />
      </div>
    </Layout>
  );
}
