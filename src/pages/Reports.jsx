function Reports() {
  const reports = [
    { name: 'Daily Alert Summary', type: 'PDF', size: '1.2 MB' },
    { name: 'Incident Postmortems', type: 'Docx', size: '820 KB' },
    { name: 'Patch Compliance', type: 'PDF', size: '640 KB' },
  ];

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">Reports</div>
      <div className="grid gap-3">
        {reports.map((report) => (
          <div key={report.name} className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{report.name}</div>
              <div className="text-xs text-gray-400">{report.type} • {report.size}</div>
            </div>
            <button className="text-sm bg-signal/20 border border-signal/40 text-white px-3 py-1 rounded-lg hover:bg-signal/30">
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reports;
