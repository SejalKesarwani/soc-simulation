function ThreatIntel() {
  const feeds = [
    { name: 'AlienVault OTX', status: 'Syncing', lastSync: '12m ago' },
    { name: 'MISP Feeds', status: 'Healthy', lastSync: '24m ago' },
    { name: 'VirusTotal', status: 'Healthy', lastSync: '5m ago' },
  ];

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">Threat Intelligence</div>
      <div className="grid gap-3">
        {feeds.map((feed) => (
          <div key={feed.name} className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{feed.name}</div>
              <div className="text-xs text-gray-400">Last sync: {feed.lastSync}</div>
            </div>
            <span className="text-xs bg-white/5 border border-white/10 rounded-full px-2 py-1">{feed.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ThreatIntel;
