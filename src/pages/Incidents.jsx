function Incidents() {
  const incidents = [
    { id: 'INC-2044', title: 'Privilege escalation detected', status: 'In Triage', owner: 'Analyst A' },
    { id: 'INC-2038', title: 'Suspicious outbound traffic', status: 'Investigating', owner: 'Analyst B' },
    { id: 'INC-2032', title: 'Malicious attachment opened', status: 'Containment', owner: 'Analyst C' },
  ];

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">Open Incidents</div>
      <div className="grid gap-3">
        {incidents.map((incident) => (
          <div key={incident.id} className="bg-white/5 border border-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{incident.id}</div>
              <span className="text-xs bg-white/5 border border-white/10 rounded-full px-2 py-1">{incident.status}</span>
            </div>
            <div className="text-sm text-gray-300 mt-1">{incident.title}</div>
            <div className="text-xs text-gray-500 mt-2">Owner: {incident.owner}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Incidents;
