function Settings() {
  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">Settings</div>
      <div className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-3">
        <div className="text-sm text-gray-300">Notification Rules</div>
        <label className="flex items-center gap-2 text-sm text-gray-200">
          <input type="checkbox" className="accent-signal" defaultChecked /> Email on high severity alerts
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-200">
          <input type="checkbox" className="accent-signal" defaultChecked /> Slack webhook for critical incidents
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-200">
          <input type="checkbox" className="accent-signal" /> Pager rotation on containment actions
        </label>
      </div>
    </div>
  );
}

export default Settings;
